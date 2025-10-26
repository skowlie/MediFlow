// src/context/CaseContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext"; // Your existing UserContext
import * as api from "../api"; // Import our new API helper

const CaseContext = createContext();

export const useCases = () => useContext(CaseContext);

export const CaseProvider = ({ children }) => {
  const { user } = useUser(); // Get the logged-in user
  const [cases, setCases] = useState([]); // This is our new "live" data store
  const [isLoading, setIsLoading] = useState(true);

  // This effect manages the WebSocket connection and initial data load
  useEffect(() => {
    if (!user) {
      setCases([]); // Clear cases on logout
      setIsLoading(false);
      return;
    }

    let ws;

    const connect = () => {
      let channelId;
      if (user.role === "doctor") {
        // Doctors connect to a personal channel based on their email
        channelId = `provider-${user.email}`;
      } else if (user.role === "insurer") {
        // Insurers connect to the single work queue
        channelId = "insurer-queue";
      } else {
        return; // Don't connect if user has no role
      }

      const wsUrl = `ws://127.0.0.1:8000/ws/${channelId}`;
      console.log(`Connecting to WebSocket: ${wsUrl}`);
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`Connected to WebSocket channel: ${channelId}`);
        // On connect, load all existing data
        loadInitialCases();
      };

      ws.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        const newOrUpdatedCase = JSON.parse(event.data);

        // This is the "agentic" part!
        // We update our state with the new data from the server.
        setCases((prevCases) => {
          const exists = prevCases.find(
            (c) => c.case_id === newOrUpdatedCase.case_id
          );
          if (exists) {
            // It's an update: replace the old version
            return prevCases.map((c) =>
              c.case_id === newOrUpdatedCase.case_id ? newOrUpdatedCase : c
            );
          } else {
            // It's a new case: add it to the list
            return [newOrUpdatedCase, ...prevCases];
          }
        });
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected. Retrying in 3s...");
        setTimeout(connect, 3000); // Auto-reconnect
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close(); // This will trigger onclose and retry
      };
    };

    const loadInitialCases = async () => {
      // Load the data the user needs when they first log in
      setIsLoading(true);
      try {
        if (user.role === "doctor") {
          // A doctor's dashboard will load cases on a per-patient basis
          // in the PatientDetail page. We can pre-load all of them here
          // if we have a list of their patients, but for now we'll
          // just set an empty list.
          setCases([]); // Cases will be loaded on-demand by PatientDetail
        } else if (user.role === "insurer") {
          // Insurer loads their queue ('APPROVED_READY')
          const queueCases = await api.getCasesByStatus("APPROVED_READY");
          // Also load cases they've already decided on
          const approvedCases = await api.getCasesByStatus("APPROVED");
          const deniedCases = await api.getCasesByStatus("DENIED");

          setCases([...queueCases, ...approvedCases, ...deniedCases]);
        }
      } catch (err) {
        console.error("Failed to load initial cases:", err);
      }
      setIsLoading(false);
    };

    connect(); // Start the connection

    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.onclose = null; // Prevent reconnect on logout
        ws.close();
      }
    };
  }, [user]); // Re-run this whole effect if the user logs in/out

  // Provide the case list and the API functions to the app
  const value = {
    cases,
    isLoading,
    // Pass API functions through for components to use
    createCase: api.createCase,
    submitDecision: api.submitDecision,
    getCasesByPatient: api.getCasesByPatient,
  };

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
};

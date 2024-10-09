"use client";

import Chatbot from "@/components/ChatBot";
import Contacts from "@/components/Contacts";
import DocumentationLinks from "@/components/DocumentationLinks";
import Notes from "@/components/Notes";
import QuickLinks from "@/components/QuickLinks";
import React, { useState, useEffect } from "react";
import { useAuthFetch } from "@/hooks/privateFetch";

const App: React.FC = () => {
  const authFetch = useAuthFetch();
  const [currentToolkit, setCurrentToolkit] = useState("Default Toolkit");
  const [toolkits, setToolkits] = useState<string[]>([]);
  const [newToolkitName, setNewToolkitName] = useState("");
  const [showToolkitForm, setShowToolkitForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null); // For showing status messages

  // Fetch toolkits from the endpoint
  useEffect(() => {
    const fetchToolkits = async () => {
      try {
        const response = await authFetch(`/toolkit`, { method: "GET" });
        const data = await response.json();
        if (response.ok) {
          setToolkits(data.toolkits || []);
        } else {
          setStatusMessage("Failed to fetch toolkits.");
        }
      } catch (error) {
        setStatusMessage("Error fetching toolkits.");
      }
    };

    fetchToolkits();
  }, [authFetch]);

  const addNewToolkit = async () => {
    if (newToolkitName && !toolkits.includes(newToolkitName)) {
      try {
        const response = await authFetch(`/toolkit`, {
          method: "POST",
          body: JSON.stringify({ name: newToolkitName }),
        });

        if (response.ok) {
          setToolkits([...toolkits, newToolkitName]);
          setStatusMessage("Toolkit added successfully!");
        } else {
          setStatusMessage("Failed to add toolkit.");
        }
      } catch (error) {
        setStatusMessage("Error adding toolkit.");
      }

      setNewToolkitName(""); // Clear the input field after submission
      setShowToolkitForm(false); // Hide the form after adding the toolkit

      // Clear status message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-techBg text-white font-mono">
      <header className="flex items-center justify-between p-4 bg-gray-900 shadow-md">
        <h1 className="text-2xl tracking-wide font-semibold">Tech Toolkit</h1>
        <div className="flex items-center space-x-4">
          <select
            value={currentToolkit}
            onChange={(e) => setCurrentToolkit(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded border-2 border-techAccent focus:border-techButton"
          >
            {toolkits.map((toolkit) => (
              <option key={toolkit} value={toolkit}>
                {toolkit}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowToolkitForm(!showToolkitForm)}
            className="bg-techButton text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-shadow shadow-tech-glow"
          >
            New Toolkit
          </button>
        </div>
      </header>

      {/* Status Message */}
      {statusMessage && (
        <div className="p-2 bg-gray-900 text-center text-white font-semibold mt-2 rounded shadow-md">
          {statusMessage}
        </div>
      )}

      {/* New Toolkit Form */}
      {showToolkitForm && (
        <div className="flex flex-col items-start p-4 bg-gray-800 rounded shadow-md transition-all mt-2">
          <input
            type="text"
            value={newToolkitName}
            onChange={(e) => setNewToolkitName(e.target.value)}
            placeholder="Enter toolkit name"
            className="bg-gray-700 p-2 rounded w-full border border-techAccent focus:border-techButton focus:outline-none mb-2"
          />
          <button
            onClick={addNewToolkit}
            className="bg-techButton text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-shadow"
          >
            Add Toolkit
          </button>
        </div>
      )}

      <main className="flex flex-grow">
        {/* Sidebar with consistent dark color */}
        <div className="w-1/4 bg-gray-900 p-4">
          <QuickLinks currentToolkit={currentToolkit} />
          <DocumentationLinks currentToolkit={currentToolkit} />
        </div>

        {/* Main content with consistent dark theme */}
        <div className="flex flex-col w-3/4 p-4 space-y-4 bg-techBg">
          <Chatbot />
          <Notes />
          <Contacts />
        </div>
      </main>
    </div>
  );
};

export default App;

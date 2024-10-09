"use client";

import Chatbot from "@/components/ChatBot";
import Contacts from "@/components/Contacts";
import DocumentationLinks from "@/components/DocumentationLinks";
import Notes from "@/components/Notes";
import QuickLinks from "@/components/QuickLinks";
import React, { useState, useEffect, useCallback } from "react";

interface Toolkit {
  _id: string;
  name: string;
  quickLinks?: string[];
  docLinks?: string[];
  notes?: string;
  contacts?: string[];
}

const App: React.FC = () => {
  const [currentToolkit, setCurrentToolkit] = useState<Toolkit | null>(null);
  const [toolkits, setToolkits] = useState<Toolkit[]>([]);
  const [newToolkitName, setNewToolkitName] = useState("");
  const [showToolkitForm, setShowToolkitForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch toolkits only once when the component mounts
  useEffect(() => {
    const fetchToolkits = async () => {
      try {
        const response = await fetch(`/api/toolkit`, { method: "GET" });
        const data = await response.json();

        if (data.toolkits && data.toolkits.length > 0) {
          setToolkits(data.toolkits);

          // Only set the current toolkit if it has not been set already
          if (!currentToolkit) {
            setCurrentToolkit(data.toolkits[0]);
          }
        } else {
          setStatusMessage("No toolkits found.");
        }
      } catch (error) {
        setStatusMessage("Error fetching toolkits.");
        console.error("Fetch toolkits error:", error);
      }
    };

    // Fetch toolkits if none are loaded
    if (toolkits.length === 0) {
      fetchToolkits();
    }
    setLastToolKit();
  }, [toolkits.length, currentToolkit]); // Dependency array to prevent re-runs

  const setLastToolKit = async () => {
    await fetch(`/api/lastOn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: currentToolkit?._id }),
    });
  };

  // Handle toolkit selection from the dropdown
  const handleToolkitSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedToolkit = toolkits.find(
      (toolkit) => toolkit._id === event.target.value
    );
    if (selectedToolkit && selectedToolkit !== currentToolkit) {
      setCurrentToolkit(selectedToolkit); // Only set if the toolkit is different
    }
    setLastToolKit();
  };

  const addNewToolkit = useCallback(async () => {
    if (
      newToolkitName &&
      !toolkits.some((toolkit) => toolkit.name === newToolkitName)
    ) {
      try {
        const response = await fetch(`/api/toolkit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newToolkitName }),
        });

        const data = await response.json();

        // Ensure toolkit is valid before adding
        if (data.toolkit && data.toolkit._id) {
          setToolkits((prevToolkits) => [...prevToolkits, data.toolkit]);
          setCurrentToolkit(data.toolkit); // Automatically select the new toolkit
          setStatusMessage("Toolkit added successfully!");
        } else {
          throw new Error("Invalid toolkit data");
        }
      } catch (error) {
        setStatusMessage("Failed to add toolkit.");
        console.error("Error adding toolkit:", error);
      }

      setNewToolkitName("");
      setShowToolkitForm(false);

      // Clear status message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    }
  }, [newToolkitName, toolkits]);

  return (
    <div className="flex flex-col h-screen bg-techBg text-white font-mono">
      <header className="flex items-center justify-between p-4 bg-gray-900 shadow-md">
        <h1 className="text-2xl tracking-wide font-semibold">Tech Toolkit</h1>
        <div className="flex items-center space-x-4">
          <select
            value={currentToolkit?._id || ""}
            onChange={handleToolkitSelection}
            className="bg-gray-700 text-white p-2 rounded border-2 border-techAccent focus:border-techButton"
          >
            <option value="" disabled>
              Select a toolkit
            </option>
            {toolkits.length > 0 &&
              toolkits.map(
                (toolkit) =>
                  toolkit && toolkit._id ? (
                    <option key={toolkit._id} value={toolkit._id}>
                      {toolkit.name}
                    </option>
                  ) : null // Ensure that undefined toolkits don't cause errors
              )}
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
          {currentToolkit && (
            <>
              <QuickLinks
                currentToolkit={currentToolkit.name}
                toolkitId={currentToolkit._id}
                currentToolkitLinks={currentToolkit.quickLinks as string[]}
              />
              <DocumentationLinks currentToolkit={currentToolkit.name} />
            </>
          )}
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

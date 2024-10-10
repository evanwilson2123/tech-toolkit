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
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<Toolkit | null>(null); // Track the toolkit to delete

  // Fetch toolkits once when the component mounts
  useEffect(() => {
    const fetchToolkits = async () => {
      try {
        const response = await fetch(`/api/toolkit`, { method: "GET" });
        const data = await response.json();

        if (data.toolkits && data.toolkits.length > 0) {
          setToolkits(data.toolkits);

          // Only set currentToolkit if it's not already set
          if (!currentToolkit) {
            const lastUsedToolkit = data.toolkits.find(
              (toolkit: Toolkit) =>
                toolkit._id.toString() === data.lastOn.toString()
            );
            setCurrentToolkit(lastUsedToolkit || data.toolkits[0]);
          }
        } else {
          setStatusMessage("No toolkits found.");
        }
      } catch (error) {
        setStatusMessage("Error fetching toolkits.");
        console.error("Fetch toolkits error:", error);
      }
    };

    if (toolkits.length === 0) {
      fetchToolkits();
    }
  }, [toolkits.length, currentToolkit]);

  const setLastToolKit = async (toolkit: Toolkit) => {
    if (currentToolkit) {
      await fetch(`/api/lastOn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: toolkit._id }),
      });
    }
  };

  // Handle toolkit selection from the dropdown
  const handleToolkitSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedToolkit = toolkits.find(
      (toolkit) => toolkit._id === event.target.value
    );
    if (selectedToolkit && selectedToolkit !== currentToolkit) {
      setCurrentToolkit(selectedToolkit);
    }
    if (selectedToolkit) setLastToolKit(selectedToolkit);
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

        if (!response.ok) {
          throw new Error("Failed to add toolkit.");
        }

        const data = await response.json();

        // Ensure toolkit is valid before adding
        if (data.toolkits && data.toolkits._id) {
          setToolkits((prevToolkits) => [...prevToolkits, data.toolkits]);
          setCurrentToolkit(data.toolkits);
          setLastToolKit(data.toolkits);
          setStatusMessage("Toolkit added successfully!");

          setTimeout(() => setStatusMessage(null), 3000);
        } else {
          throw new Error("Invalid toolkit data");
        }
      } catch (error) {
        console.error("Error adding toolkit:", error);
        setStatusMessage("Failed to add toolkit.");
      }

      setNewToolkitName("");
      setShowToolkitForm(false);
    }
  }, [newToolkitName, toolkits]);

  // Confirm deletion of toolkit
  const confirmDeleteToolkit = (toolkit: Toolkit) => {
    setShowDeleteConfirmation(toolkit); // Open delete confirmation modal
  };

  // Delete the toolkit after confirmation
  const deleteToolkit = async () => {
    if (showDeleteConfirmation) {
      try {
        const response = await fetch(`/api/toolkit`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: showDeleteConfirmation._id }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete toolkit.");
        }

        // Remove the toolkit from the state
        const updatedToolkits = toolkits.filter(
          (toolkit) => toolkit._id !== showDeleteConfirmation._id
        );
        setToolkits(updatedToolkits);

        // Set the next available toolkit or null if none
        setCurrentToolkit(updatedToolkits[0] || null);

        setStatusMessage("Toolkit deleted successfully!");

        // Clear message after 3 seconds
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (error) {
        console.error("Error deleting toolkit:", error);
        setStatusMessage("Failed to delete toolkit.");
      }

      // Close the delete confirmation modal
      setShowDeleteConfirmation(null);
    }
  };

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
              toolkits.map((toolkit) =>
                toolkit && toolkit._id ? (
                  <option key={toolkit._id} value={toolkit._id}>
                    {toolkit.name}
                  </option>
                ) : null
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
              <DocumentationLinks
                currentToolkit={currentToolkit.name}
                toolkitId={currentToolkit._id}
                currentToolkitLinks={currentToolkit.docLinks as string[]}
              />
            </>
          )}

          {/* Delete Toolkit Button */}
          {currentToolkit && (
            <div className="mt-4">
              <button
                onClick={() => confirmDeleteToolkit(currentToolkit)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-shadow"
              >
                Delete Toolkit
              </button>
            </div>
          )}
        </div>

        {/* Main content with consistent dark theme */}
        <div className="flex flex-col w-3/4 p-4 space-y-4 bg-techBg">
          <Chatbot />
          {currentToolkit && <Notes toolkitId={currentToolkit._id} />}
          {currentToolkit && currentToolkit.contacts && (
            <Contacts
              currentToolkit={currentToolkit?.name}
              toolkitId={currentToolkit._id}
              currentToolkitContacts={currentToolkit.contacts}
            />
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-md text-white">
            <h2 className="text-xl mb-4">Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the toolkit{" "}
              <strong>{showDeleteConfirmation.name}</strong>? This action cannot
              be undone.
            </p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDeleteConfirmation(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md mr-4"
              >
                Cancel
              </button>
              <button
                onClick={deleteToolkit}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

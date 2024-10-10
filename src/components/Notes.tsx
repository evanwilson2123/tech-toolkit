import React, { useState, useEffect } from "react";

const Notes: React.FC<{ toolkitId: string }> = ({ toolkitId }) => {
  const [notes, setNotes] = useState<string>(""); // State to manage notes
  const [statusMessage, setStatusMessage] = useState<string | null>(null); // Status message for feedback

  // Fetch existing notes when component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`/api/notes?toolkitId=${toolkitId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch notes.");
        }
        const data = await response.json();
        setNotes(data.notes || ""); // Set fetched notes or empty if none
      } catch (error: any) {
        console.error("Error fetching notes:", error);
        setStatusMessage("Failed to fetch notes.");
        setTimeout(() => setStatusMessage(null), 3000);
      }
    };

    fetchNotes();
  }, [toolkitId]);

  // Function to handle saving notes
  const saveNotes = async () => {
    try {
      const response = await fetch(`/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes, toolkitId }),
      });

      if (!response.ok) {
        throw new Error("Failed to save notes.");
      }

      setStatusMessage("Notes saved successfully!");

      // Clear status message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      console.error("Error saving notes:", error);
      setStatusMessage("Failed to save notes.");
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="flex-grow p-4 bg-gray-800 rounded shadow-md transition-all hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-techAccent">Notes</h2>
      <textarea
        className="w-full h-32 p-3 bg-gray-700 text-white rounded-lg resize-none focus:ring-2 focus:ring-techButton focus:outline-none"
        placeholder="Write your notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button
        onClick={saveNotes}
        className="mt-4 bg-techButton text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-all"
      >
        Save Notes
      </button>

      {/* Status Message */}
      {statusMessage && (
        <div className="p-2 bg-gray-900 text-center text-white font-semibold mt-2 rounded shadow-md">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default Notes;

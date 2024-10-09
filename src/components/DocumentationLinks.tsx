import React, { useState, useEffect } from "react";

interface DocumentationLinksProps {
  currentToolkit: string;
  toolkitId: string;
  currentToolkitLinks: string[];
}

const DocumentationLinks: React.FC<DocumentationLinksProps> = ({
  currentToolkit,
  toolkitId,
  currentToolkitLinks,
}) => {
  const [docLinks, setDocLinks] = useState<string[]>(currentToolkitLinks || []); // Initialize with prop links or empty array
  const [newDocLink, setNewDocLink] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showMenuIndex, setShowMenuIndex] = useState<number | null>(null); // Track which menu is open

  // Update doc links when currentToolkitLinks prop changes (to reflect toolkit changes)
  useEffect(() => {
    setDocLinks(currentToolkitLinks || []); // Ensure currentToolkitLinks is never undefined
  }, [currentToolkitLinks]);

  const normalizeLink = (link: string) => {
    if (!/^https?:\/\//i.test(link)) {
      return `https://${link}`;
    }
    return link;
  };

  const addDocLink = async () => {
    if (newDocLink) {
      const normalizedLink = normalizeLink(newDocLink);
      try {
        const response = await fetch("/api/doclink", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ link: normalizedLink, toolkitId: toolkitId }),
        });

        if (!response.ok) {
          throw new Error("Failed to add documentation link.");
        }

        const updatedDocLinks = [...docLinks, normalizedLink]; // Add new doc link to existing ones
        setDocLinks(updatedDocLinks); // Update the doc links state

        setNewDocLink("");
        setStatusMessage("Documentation link added successfully");

        // Clear message after 3 seconds
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (error: any) {
        console.error("Error adding documentation link:", error);
        setStatusMessage("Failed to add documentation link.");
        setTimeout(() => setStatusMessage(null), 3000);
      }
    }
  };

  const deleteDocLink = async (linkToDelete: string) => {
    try {
      const response = await fetch("/api/doclink", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link: linkToDelete, toolkitId: toolkitId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete documentation link.");
      }

      const updatedDocLinks = docLinks.filter((link) => link !== linkToDelete); // Remove the deleted doc link
      setDocLinks(updatedDocLinks); // Update the doc links state
      setStatusMessage("Documentation link deleted successfully");

      // Clear message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      console.error("Error deleting documentation link:", error);
      setStatusMessage("Failed to delete documentation link.");
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-techAccent">
        Documentation Links - {currentToolkit}
      </h2>
      <ul className="space-y-2">
        {(docLinks || []).map(
          (
            link,
            index // Ensure docLinks is never undefined
          ) => (
            <li key={index} className="flex items-center justify-between">
              {/* Styled button to open the link in a new tab */}
              <button
                onClick={() =>
                  window.open(link, "_blank", "noopener,noreferrer")
                }
                className="bg-techButton text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-all text-left flex-grow"
                style={{
                  whiteSpace: "nowrap", // Prevent wrapping
                  overflow: "hidden", // Hide overflow
                  textOverflow: "ellipsis", // Show ellipsis
                  maxWidth: "90%", // Adjust as needed to fit inside the container
                }}
              >
                {link}
              </button>
              {/* Three-dot button to open delete option */}
              <div className="relative">
                <button
                  onClick={() =>
                    setShowMenuIndex(showMenuIndex === index ? null : index)
                  } // Toggle the menu
                  className="text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  &#x2022;&#x2022;&#x2022;
                </button>
                {/* Delete menu (only shown for the selected link) */}
                {showMenuIndex === index && (
                  <div className="absolute right-0 mt-2 bg-gray-700 text-white py-2 px-4 rounded shadow-md z-50">
                    <button
                      onClick={() => deleteDocLink(link)}
                      className="hover:bg-red-600 px-4 py-2 rounded-md z-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          )
        )}
      </ul>
      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          value={newDocLink}
          onChange={(e) => setNewDocLink(e.target.value)}
          className="bg-gray-800 p-2 rounded w-full border border-techAccent focus:border-techButton focus:outline-none"
          placeholder="Enter new documentation link"
        />
        <button
          onClick={addDocLink}
          className="bg-techButton text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-all"
        >
          Add Doc Link
        </button>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className="p-2 bg-gray-900 text-center text-white font-semibold mt-2 rounded shadow-md">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default DocumentationLinks;

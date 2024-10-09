import React, { useState, useEffect } from "react";

interface QuickLinksProps {
  currentToolkit: string;
  toolkitId: string;
  currentToolkitLinks: string[]; // Links from the prop
}

const QuickLinks: React.FC<QuickLinksProps> = ({
  currentToolkit,
  toolkitId,
  currentToolkitLinks,
}) => {
  const [links, setLinks] = useState<string[]>(currentToolkitLinks); // Initialize with prop links
  const [newLink, setNewLink] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showMenuIndex, setShowMenuIndex] = useState<number | null>(null); // Track which menu is open

  // Update links when currentToolkitLinks prop changes (to reflect toolkit changes)
  useEffect(() => {
    setLinks(currentToolkitLinks);
  }, [currentToolkitLinks]);

  const normalizeLink = (link: string) => {
    if (!/^https?:\/\//i.test(link)) {
      return `https://${link}`;
    }
    return link;
  };

  const addLink = async () => {
    if (newLink) {
      const normalizedLink = normalizeLink(newLink);
      try {
        const response = await fetch("/api/quicklink", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ link: normalizedLink, toolkitId: toolkitId }),
        });

        if (!response.ok) {
          throw new Error("Failed to add link.");
        }

        const updatedLinks = [...links, normalizedLink]; // Add new link to existing ones
        setLinks(updatedLinks); // Update the links state

        setNewLink("");
        setStatusMessage("Link added successfully");

        // Clear message after 3 seconds
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (error: any) {
        console.error("Error adding link:", error);
        setStatusMessage("Failed to add link.");
        setTimeout(() => setStatusMessage(null), 3000);
      }
    }
  };

  const deleteLink = async (linkToDelete: string) => {
    try {
      const response = await fetch("/api/quicklink", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link: linkToDelete, toolkitId: toolkitId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete link.");
      }

      const updatedLinks = links.filter((link) => link !== linkToDelete); // Remove the deleted link
      setLinks(updatedLinks); // Update the links state
      setStatusMessage("Link deleted successfully");

      // Clear message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      console.error("Error deleting link:", error);
      setStatusMessage("Failed to delete link.");
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-techAccent">
        Quick Links - {currentToolkit}
      </h2>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index} className="flex items-center justify-between">
            {/* Styled button to open the link in a new tab */}
            <button
              onClick={() => window.open(link, "_blank", "noopener,noreferrer")}
              className="bg-techButton text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-all text-left flex-grow"
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
                    onClick={() => deleteLink(link)}
                    className="hover:bg-red-600 px-4 py-2 rounded-md z-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          className="bg-gray-800 p-2 rounded w-full border border-techAccent focus:border-techButton focus:outline-none"
          placeholder="Enter new link"
        />
        <button
          onClick={addLink}
          className="bg-techButton text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-all"
        >
          Add Link
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

export default QuickLinks;

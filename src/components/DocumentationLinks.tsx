import React, { useState } from "react";

interface DocumentationLinksProps {
  currentToolkit: string;
}

const DocumentationLinks: React.FC<DocumentationLinksProps> = ({
  currentToolkit,
}) => {
  const [docLinks, setDocLinks] = useState<Record<string, string[]>>({
    "Default Toolkit": ["https://docs.example.com"],
  });
  const [newDocLink, setNewDocLink] = useState("");

  const addDocLink = async () => {
    if (newDocLink) {
      const updatedDocLinks = [...(docLinks[currentToolkit] || []), newDocLink];
      setDocLinks({ ...docLinks, [currentToolkit]: updatedDocLinks });

      // Simulate sending doc link to backend
      setNewDocLink("");
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-techAccent">
        Documentation Links - {currentToolkit}
      </h2>
      <ul className="space-y-2">
        {(docLinks[currentToolkit] || []).map((link, index) => (
          <li
            key={index}
            className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-all"
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-techButton hover:underline"
            >
              {link}
            </a>
          </li>
        ))}
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
    </div>
  );
};

export default DocumentationLinks;

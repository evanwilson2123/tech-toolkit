import React, { useState } from "react";

interface QuickLinksProps {
  currentToolkit: string;
}

const QuickLinks: React.FC<QuickLinksProps> = ({ currentToolkit }) => {
  const [links, setLinks] = useState<Record<string, string[]>>({
    "Default Toolkit": ["https://example.com"],
  });
  const [newLink, setNewLink] = useState("");

  const addLink = async () => {
    if (newLink) {
      const updatedLinks = [...(links[currentToolkit] || []), newLink];
      setLinks({ ...links, [currentToolkit]: updatedLinks });

      setNewLink("");
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-techAccent">
        Quick Links - {currentToolkit}
      </h2>
      <ul className="space-y-2">
        {(links[currentToolkit] || []).map((link, index) => (
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
    </div>
  );
};

export default QuickLinks;

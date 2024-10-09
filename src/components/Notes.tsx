import React from "react";

const Notes: React.FC = () => {
  return (
    <div className="flex-grow p-4 bg-gray-800 rounded shadow-md transition-all hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-techAccent">Notes</h2>
      <textarea
        className="w-full h-32 p-3 bg-gray-700 text-white rounded-lg resize-none focus:ring-2 focus:ring-techButton focus:outline-none"
        placeholder="Write your notes here..."
      />
    </div>
  );
};

export default Notes;

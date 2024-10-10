import React, { useState } from "react";

interface Message {
  type: "user" | "bot";
  content: JSX.Element[]; // Allow formatted content (code blocks or text)
}

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState<string>(""); // User input
  const [messages, setMessages] = useState<Message[]>([]); // All chat messages
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    // Add the user's message to the conversation
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", content: [<p key={Date.now()}>{message}</p>] }, // Add unique key using Date.now()
    ]);

    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (res.ok) {
        const data = await res.json();
        const formattedResponse = formatResponse(data.response);
        // Add bot's response to the conversation
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", content: formattedResponse }, // Bot's response with properly formatted content
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "bot",
            content: [<p key={Date.now()}>Error: Unable to get a response.</p>],
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "bot",
          content: [<p key={Date.now()}>Error: Unable to get a response.</p>],
        },
      ]);
    } finally {
      setLoading(false);
      setMessage(""); // Clear input field
    }
  };

  // Helper function to format the response, splitting code and regular text
  const formatResponse = (responseText: string): JSX.Element[] => {
    const sections = responseText.split(/(```[\s\S]*?```)/g); // Capture code blocks
    return sections.map((section, index) => {
      if (section.startsWith("```") && section.endsWith("```")) {
        const codeContent = section.slice(3, -3); // Remove ``` around code
        return (
          <pre
            key={`code-${index}`} // Unique key for each code block
            className="bg-gray-900 p-3 rounded-md overflow-x-auto"
          >
            <code className="text-blue-400">{codeContent}</code>
          </pre>
        );
      } else {
        // Escape any HTML-like tags so they render as text
        const escapedText = section.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return (
          <p key={`text-${index}`} className="mb-2">
            {escapedText}
          </p>
        );
      }
    });
  };

  return (
    <div className="flex flex-col bg-gray-800 rounded shadow-md transition-all hover:shadow-lg">
      {/* Scrollable message container */}
      <div
        className="flex-grow overflow-y-auto p-4"
        style={{ maxHeight: "400px" }} // Fixed height to ensure the size doesn't grow
      >
        <h2 className="text-xl font-semibold mb-4 text-techAccent">Chatbot</h2>

        {/* Display all messages */}
        {messages.map((msg, idx) => (
          <div
            key={idx} // Ensure each message has a unique key
            className={`mb-4 p-4 rounded-lg ${
              msg.type === "user" ? "bg-blue-600 text-right" : "bg-gray-700"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* User input form (at the bottom) */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-gray-900 flex items-center space-x-4"
      >
        <textarea
          className="flex-grow p-3 bg-gray-700 text-white rounded-lg resize-none focus:ring-2 focus:ring-techButton focus:outline-none"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
        />
        <button
          type="submit"
          className="bg-techButton text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-all"
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;

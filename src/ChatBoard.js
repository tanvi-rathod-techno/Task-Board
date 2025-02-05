import { useState } from "react";

export default function ChatBoard() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMessages = [...messages, { sender: "user", text: message }];
    setMessages(newMessages);
    setMessage("");
    setTimeout(() => {
      setMessages([...newMessages, { sender: "bot", text: "Hello! How can I help you?" }]);
    }, 1000);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-between p-4 border rounded-lg shadow-lg bg-white">
      <div className="flex-1 overflow-y-auto border p-3 rounded-lg bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`my-2 text-${msg.sender === "user" ? "right" : "left"}`}>
            <span
              className={`inline-block px-3 py-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button onClick={handleSendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Send</button>
      </div>
    </div>
  );
}
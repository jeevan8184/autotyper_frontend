// frontend/src/App.tsx
import { useState } from "react";
import axios from "axios";

function App() {
  const [story, setStory] = useState("");
  const [status, setStatus] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStart = async () => {
    if (!story) return alert("Paste your story!");
    setStatus("Typing will start in 5 seconds...");
    setIsTyping(true);

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/start`, { text: story });

      const interval = setInterval(async () => {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/status`);
        setProgress(Number(res.data.progress));
        if (!res.data.running) {
          clearInterval(interval);
          setStatus("Typing finished!");
          setIsTyping(false);
        } else {
          setStatus(`Typing in progress: ${res.data.progress}%`);
        }
      }, 50); // poll very fast for smooth progress
    } catch (err) {
      console.error(err);
      setStatus("Error starting typing");
      setIsTyping(false);
    }
  };

  const handleStop = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/stop`);
      setStatus("Typing stopped.");
      setIsTyping(false);
      setProgress(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Ultra-Fast Auto Typing Keyboard</h1>

        <textarea
          className="w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 resize-none"
          placeholder="Paste your story here..."
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={handleStart}
            disabled={isTyping}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-md disabled:bg-gray-400"
          >
            Start
          </button>
          <button
            onClick={handleStop}
            disabled={!isTyping}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md disabled:bg-gray-400"
          >
            Stop
          </button>
        </div>

        <div className="h-4 w-full bg-gray-300 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-blue-500 transition-all duration-50"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center text-gray-700">{status}</p>
      </div>
    </div>
  );
}

export default App;

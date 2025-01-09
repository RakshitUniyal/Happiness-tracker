import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [mood, setMood] = useState(""); // State to store the current mood
  const [logs, setLogs] = useState([]); // State to store mood logs

  // Function to handle mood submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    if (!mood) return; // Ensure mood is not empty
    try {
      await axios.post("http://localhost:5000/mood", { mood });
      fetchLogs(); // Refresh the logs after submission
      setMood(""); // Clear the input field
    } catch (err) {
      console.error("Error submitting mood", err);
    }
  };

  // Function to fetch mood logs
  const fetchLogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/mood");
      setLogs(response.data); // Update logs state
    } catch (err) {
      console.error("Error fetching mood logs", err);
    }
  };

  // Fetch logs when the component loads
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Happiness Tracker</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="How are you feeling today?"
          style={{ padding: "10px", marginRight: "10px", width: "300px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Log Mood
        </button>
      </form>
      <h2>Mood Logs</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {logs.map((log) => (
          <li key={log._id} style={{ marginBottom: "10px" }}>
            {log.mood} - {new Date(log.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

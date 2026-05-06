import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      setResult(data.result || JSON.stringify(data));
    } catch (error) {
      console.error(error);
      setResult("Error connecting to backend");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Financial Risk Intelligence</h1>

      <input
        type="text"
        placeholder="Enter your query..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
      />

      <button onClick={handleSubmit}>Analyze</button>

      <div style={{ marginTop: "20px" }}>
        <strong>Result:</strong>
        <p>{result}</p>
      </div>
    </div>
  );
}

export default App;
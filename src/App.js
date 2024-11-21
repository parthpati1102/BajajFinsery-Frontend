import React, { useState } from "react";
import axios from "axios";

function App() {
  const [jsonInput, setJsonInput] = useState(""); // For JSON input from the user
  const [dropdownOptions, setDropdownOptions] = useState([]); // For selected dropdown options
  const [response, setResponse] = useState(null); // To store server response
  const [error, setError] = useState(""); // To store error messages

  const handleJsonSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);

    // Validate JSON input
    let parsedData;
    try {
      parsedData = JSON.parse(jsonInput);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid JSON structure. Ensure it contains a 'data' array.");
      }
    } catch (err) {
      setError("Invalid JSON. Please enter a valid JSON object.");
      return;
    }

    // Make API call
    try {
      const res = await axios.post("http://localhost:3001/bfhl", parsedData); // Changed HTTPS to HTTP
      setResponse(res.data);
    } catch (err) {
      console.error("Error fetching data from the server:", err);
      setError("Failed to fetch data from the server. Please ensure the backend is running.");
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = response;

    // Filter data based on selected dropdown options
    const filteredData = [];
    if (dropdownOptions.includes("Alphabets")) filteredData.push(...alphabets);
    if (dropdownOptions.includes("Numbers")) filteredData.push(...numbers);
    if (dropdownOptions.includes("Highest lowercase alphabet")) {
      filteredData.push(...highest_lowercase_alphabet);
    }

    return (
      <div>
        <h3>Filtered Response:</h3>
        {filteredData.length > 0 ? (
          <pre>{JSON.stringify(filteredData, null, 2)}</pre>
        ) : (
          <p>No data to display. Adjust your dropdown selections.</p>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>DataVerse App</h1>
      <form onSubmit={handleJsonSubmit} style={{ marginBottom: "20px" }}>
        <label>
          JSON Input:
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={5}
            style={{ width: "100%", margin: "10px 0", fontSize: "16px" }}
            placeholder='{"data": ["A", "1", "b", "3", "C"]}'
          />
        </label>
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
          Submit
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <label>
              Select Data to Render:
              <select
                multiple
                value={dropdownOptions}
                onChange={(e) =>
                  setDropdownOptions(Array.from(e.target.selectedOptions, (option) => option.value))
                }
                style={{
                  display: "block",
                  margin: "10px 0",
                  width: "100%",
                  fontSize: "16px",
                  padding: "5px",
                }}
              >
                <option value="Alphabets">Alphabets</option>
                <option value="Numbers">Numbers</option>
                <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
              </select>
            </label>
          </div>
          {renderResponse()}
        </>
      )}
    </div>
  );
}

export default App;

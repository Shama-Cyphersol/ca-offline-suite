const axios = require("axios");

async function analyzeStatements() {
  try {
    const url = "http://localhost:7500/analyze-statements/";
    const payload = {
      bank_names: ["HDFC"],
      pdf_paths: ["C:/Users/Harsh Jajal/Documents/coding/CypherSol Fintech India Pvt Ltd/clone--fork/ca-offline-suite/frontend/data/hdfc.pdf"],
      passwords: [""],
      start_date: ["26-01-2024"],
      end_date: ["22-02-2024"],
      ca_id: "HDFC",
    };

    console.log("Sending POST request to:", url);
    const response = await axios.post(url, payload);
    console.log("Status Code:", response.status);
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

analyzeStatements();
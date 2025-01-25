const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 5000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post('/ask', (req, res) => {
  const question = req.body.question;

  // const url = "https://ainexusbot101.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=ainexusbot&api-version=2021-10-01&deploymentName=production";
  const url = "https://ainexusbot102.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=ainexusbot&api-version=2021-10-01&deploymentName=test";
  
  const headers = {
    "Ocp-Apim-Subscription-Key": "C8YNEdDmbczDAHOaLVXctvjkV5q70Ze5VJTdGqV6FOCXmGlM46nBJQQJ99BAACYeBjFXJ3w3AAAaACOGVHyG",
    "Content-Type": "application/json"
  };

  const body = {
    top: 1,
    question: question,
    includeUnstructuredSources: true,
    confidenceScoreThreshold: "0.5",
    answerSpanRequest: {
      enable: true,
      topAnswersWithSpan: 1,
      confidenceScoreThreshold: "0.5"
    }
  };

  axios.post(url, body, { headers })
    .then(response => {
      // Extract the answer from the response
      console.log(response.data.answers[0].dialog.prompts) ;
      const answer = response.data.answers[0].answer;
      res.json({ answer });
    })
    .catch(error => {
      console.error("Error:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "An error occurred while fetching the answer." });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

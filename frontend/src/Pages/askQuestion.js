import axios from 'axios';

const askQuestion = async (question) => {
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

  try {
    const response = await axios.post(url, body, { headers });
    const prompts = response.data.answers[0].dialog.prompts;
    const answer = response.data.answers[0].answer;
    return { answer, prompts };
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    throw new Error("An error occurred while fetching the answer.");
  }
};

export default askQuestion;

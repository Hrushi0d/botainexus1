const axios = require("axios");
function QNA(question){
  const url = "https://ainexusbot101.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=ainexusbot&api-version=2021-10-01&deploymentName=production";

  const headers = {
    "Ocp-Apim-Subscription-Key": "VHw2UOnLBzkaXXhamAF3FVlJyg7dru32pgWnbwipHCSg61RHRJ7eJQQJ99BAACYeBjFXJ3w3AAAaACOGZ4Gt",
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
    },
    filters: {
      metadataFilter: {
        logicalOperation: "OR",
        // metadata: [
          // {
          //   key: "",
          //   value: ""
          // }
        // ]
      }
    }
  };

  axios.post(url, body, { headers })
    .then(response => {
      console.log("Response:", response.data);
      console.log(response.data.answers[0].dialog)
    })
    .catch(error => {
      console.error("Error:", error.response ? error.response.data : error.message);
    });

}

QNA('Frequently Asked Questions')
// while(true){
//   // userinput
//   // response = QNA(userinput)
//   // Print(response)
//   // Print(options)
//   // if optionselected = QNA(option)
  
// }
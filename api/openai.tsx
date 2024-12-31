import axios from 'axios';
const { apiKey } = require("../constants/index");

const client = axios.create({
  headers: {
"Authorization": "Bearer " + apiKey,
"content-type": "application/json"
  } , 
});
const _baseUrl = 'https://api.openai.com/v1/chat/completions';

export const apiCall = async (messages: {role: string; content: string;}[]) => {
    try {
        const response = await client.post(_baseUrl, {
            model: "gpt-4o-mini",
            messages: [
                {
                role: "system",
                content:"You are a well known experienced and knowledgeable english teacher. Your goal is to assist user to practice english tailored to the user's preferences, capacity and interested topics. Ensure user's sentences are accurate, meeting the grammar and balanced. You can correct them politely with pointing out the error and saying the correct form but punctuations are okay. Do not over correct the user, as it would be annoying. Strictly adhere to the constraints provided by the user and format your response."
                },
                ...messages,
            ],
        });
        if (response.status == 200) {
            const responseData = response.data;
            const answer = responseData.choices[0].message.content
            console.log(answer);
            messages.push({role: "assistant", content: answer.trim()});

            return Promise.resolve({success: true, data: messages});
          } else {
            console.log('Failed to generate haiku.');
          }
    } catch (error: any) {
        console.log('error: ', error);
        return Promise.resolve({success: false, data: error.msg})
    }
}
// test-hf-api.js
require('dotenv').config();
const axios = require('axios');

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN ;
const MODEL = 'mistralai/Mistral-7B-Instruct-v0.3';

async function testHuggingFaceAPI() {
  try {
    console.log('Testing Hugging Face API with token:', HF_TOKEN);
    
    const client = axios.create({
      baseURL: 'https://api-inference.huggingface.co/models',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const prompt = "Generate a simple study plan for Python in JSON format";
    
    console.log('Sending request to Hugging Face API...');
    
    const response = await client.post(`/${MODEL}`, {
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        return_full_text: false
      }
    });
    
    console.log('Response received:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return 'API test completed successfully';
  } catch (error) {
    console.error('API test failed:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error(error.message);
    }
    return 'API test failed';
  }
}

// Run the test
testHuggingFaceAPI()
  .then(result => console.log(result))
  .catch(err => console.error('Unhandled error:', err));
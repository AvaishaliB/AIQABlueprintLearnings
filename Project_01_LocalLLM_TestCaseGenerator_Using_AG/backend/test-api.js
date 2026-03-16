const axios = require('axios');

async function testGeneration() {
  try {
    const res = await axios.post('http://localhost:3001/api/generate', {
      config: {
        provider: 'ollama',
        model: 'gemma3:4b'
      },
      jiraRequirement: 'Login page'
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error(err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

testGeneration();

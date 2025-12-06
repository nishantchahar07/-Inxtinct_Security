import axios from 'axios';

async function run() {
  const url = process.env.TEST_URL || 'http://localhost:3000/api/query';
  console.log('Testing API at:', url);

  const tests = [
    { message: 'What is the weather in Delhi?' },
    { message: 'How many employees joined last month?' },
    { message: 'List employees in the engineering department' },
  ];

  for (const t of tests) {
    try {
      const res = await axios.post(url, t, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 });
      console.log(`Request: ${JSON.stringify(t)}\nResponse:`, res.data);
    } catch (err: any) {
      if (err.response) {
        console.error(`Request: ${JSON.stringify(t)}\nHTTP ${err.response.status}:`, err.response.data);
      } else {
        console.error(`Request: ${JSON.stringify(t)}\nError:`, err.message || err);
      }
    }
    console.log('---');
  }
}

run().catch((e) => {
  console.error('Test runner failed:', e);
  process.exit(1);
});

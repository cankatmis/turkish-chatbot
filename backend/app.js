const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { deepLTranslate, chatGptResponse } = require('./ai');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Zunzi!');
});

app.post('/chat', async (req, res) => {
  const input = req.body.message;
  const translatedInput = await deepLTranslate(input, 'TR', 'EN-US');
  const response = await chatGptResponse(translatedInput);
  const translatedResponse = await deepLTranslate(response, 'EN', 'TR');
  res.json({ message: translatedResponse });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

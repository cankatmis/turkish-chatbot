const axios = require('axios');

const deepLApiKey = 'YOUR DEEPL API KEY';
const chatGptApiKey = 'YOUR CHATGPT API KEY';


const deepLTranslate = async (texty, sourceLang, targetLang) => {

  try {
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate?" + `text=${texty}&target_lang=${targetLang}&source_lang=${sourceLang}`, null,
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${deepLApiKey}`
        }
      }
    );
    return response.data.translations[0].text;
  } catch (error) {
    console.error(error);
  }
};

const chatGptResponse = async (prompt) => {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds

  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          'model': "text-davinci-003",
          'prompt': prompt,
          'max_tokens': 1024,
          'n': 1,
          'stop': "None",
          'temperature': 0.5
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${chatGptApiKey}`,
          },
        }
      );
      return response.data.choices[0].text;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        retries += 1;
        if (retries >= maxRetries) {
          console.error('Max retries reached, request failed.');
          break;
        } else {
          console.log(`Retry ${retries}/${maxRetries} after ${retryDelay}ms`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      } else {
        console.error(error);
        break;
      }
    }
  }
};


module.exports = { deepLTranslate, chatGptResponse };
const functions = require('@google-cloud/functions-framework');
const { VertexAI } = require('@google-cloud/vertexai');

functions.http('generateImageDescription', async (req, res) => {
  try {
    const screenshotDataUrl = req.body.screenshotDataUrl;
    if (!screenshotDataUrl) {
      res
        .status(400)
        .json({ error: 'Missing screenshotDataUrl in request body' });
      return;
    }

    if (!screenshotDataUrl.startsWith('data:image/')) {
      res.status(400).json({ error: 'Invalid data URL format' });
      return;
    }

    const description = await generateContent(screenshotDataUrl);
    res.status(200).json({ description });
  } catch (error) {
    console.error('Error:', error);
    if (error.code === 'ECONNREFUSED') {
      res
        .status(503)
        .json({ error: 'Service unavailable. Please try again later.' });
    } else if (error instanceof SyntaxError) {
      res.status(400).json({ error: 'Invalid JSON in request body' });
    } else {
      res
        .status(500)
        .json({ error: 'Internal Server Error', message: error.message });
    }
  }
});

async function generateContent(screenshotDataUrl) {
  console.log('Generating description...');

  const image1 = {
    inlineData: {
      mimeType: 'image/png',
      data: screenshotDataUrl.split(',')[1],
    },
  };

  const vertex_ai = new VertexAI({
    project: 'aitx-hack24aus-622',
    location: 'us-central1',
  });

  const model = 'gemini-1.0-pro-vision-001';
  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      maxOutputTokens: 2048,
      topP: 0.4,
      topK: 32,
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  });

  const req = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `You are a web accessibility assistant helping a blind user. Describe the image.`,
          },
          image1,
        ],
      },
    ],
  };

  console.log('Prompt Text:');
  console.log(req.contents[0].parts[0].text);

  try {
    const response = await generativeModel.generateContent(req);
    const fullTextResponse =
      response.response.candidates[0]?.content?.parts[0]?.text;

    if (!fullTextResponse) {
      throw new Error('No text response generated');
    }

    console.log('Non-Streaming Response Text:');
    console.log(fullTextResponse);
    return fullTextResponse;
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

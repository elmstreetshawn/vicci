// src/utils/vision-service.js

class VisionService {
  constructor() {
    this.API_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate';
    this.API_KEY = 'AIzaSyBLuBRffv7b08n5xIm3nGzsowyduugAtmo'; // Remember to secure this
  }

  async analyzeImage(imageUrl) {
    const requestBody = {
      requests: [
        {
          image: {
            source: {
              imageUri: imageUrl
            }
          },
          features: [
            { type: 'LABEL_DETECTION' },
            { type: 'TEXT_DETECTION' },
            { type: 'FACE_DETECTION' },
            { type: 'LANDMARK_DETECTION' },
            { type: 'LOGO_DETECTION' },
            { type: 'SAFE_SEARCH_DETECTION' }
          ]
        }
      ]
    };

    try {
      const response = await fetch(`${this.API_ENDPOINT}?key=${this.API_KEY}`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Vision API request failed');
      }

      const data = await response.json();
      return this.parseVisionResponse(data);
    } catch (error) {
      console.error('Error analyzing image:', error);
      return null;
    }
  }

  parseVisionResponse(data) {
    const result = data.responses[0];
    return {
      labels: result.labelAnnotations?.map(label => label.description) || [],
      text: result.fullTextAnnotation?.text || '',
      faces: result.faceAnnotations?.length || 0,
      landmarks: result.landmarkAnnotations?.map(landmark => landmark.description) || [],
      logos: result.logoAnnotations?.map(logo => logo.description) || [],
      safeSearch: result.safeSearchAnnotation || {}
    };
  }

  describeImage(analysisResult) {
    let description = 'This image contains: ';

    if (analysisResult.labels.length > 0) {
      description += analysisResult.labels.slice(0, 5).join(', ') + '. ';
    }

    if (analysisResult.text) {
      description += `It contains text: "${analysisResult.text.substring(0, 100)}${analysisResult.text.length > 100 ? '...' : ''}". `;
    }

    if (analysisResult.faces > 0) {
      description += `It contains ${analysisResult.faces} face${analysisResult.faces > 1 ? 's' : ''}. `;
    }

    if (analysisResult.landmarks.length > 0) {
      description += `Landmarks detected: ${analysisResult.landmarks.join(', ')}. `;
    }

    if (analysisResult.logos.length > 0) {
      description += `Logos detected: ${analysisResult.logos.join(', ')}. `;
    }

    return description.trim();
  }
}

// Export the class if you're using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VisionService;
}
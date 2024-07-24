class TTSService {
  constructor() {
    this.API_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';
    this.API_KEY = 'AIzaSyBLuBRffv7b08n5xIm3nGzsowyduugAtmo'; // Remember to secure this
  }

  async synthesizeSpeech(text, language = 'en-US', voice = 'en-US-Wavenet-D') {
    const requestBody = {
      input: { text: text },
      voice: { languageCode: language, name: voice },
      audioConfig: { audioEncoding: 'MP3' }
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
        throw new Error('TTS API request failed');
      }

      const data = await response.json();
      return this.playAudio(data.audioContent);
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      return null;
    }
  }

  playAudio(audioContent) {
    const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
    return audio.play();
  }
}

// Export the class if you're using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TTSService;
}
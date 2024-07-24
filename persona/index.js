const config = {
  initialMessage: `Hello, I'm Vicky, your Vision Impaired Computer Control Interface. How can I assist you today?`,
  prompt: window.VICCI.prompt,
  actions: window.VICCI.actions,
  ttsConfig: {
    voiceId: "c47c1e8a-0cf4-43e4-9c10-484c7c73b00e",
  },
  llmConfig: {
    llm: "llama-3-70b",
    temperature: 0.9,
    repetitionPenalty: 0.5,
  },
  interjections: {
    enabled: true,
    minWait: 5000,
    maxWait: 7500,
    thought: `There was just a pause; I should keep the conversation going.`,
  },
};

// Expose the variable to the global scope
window.VICCI = window.VICCI || {};
window.VICCI.config = config;

document.addEventListener("DOMContentLoaded", () => {
  // Load the PersonaClient script dynamically
  var script = document.createElement("script");
  script.src =
    "https://api.prod.centralus.az.sindarin.tech/PersonaClientPublicV2?apikey=208afb4d-b3ba-473e-8926-c6b4e0e47795";
  script.onload = () => {
    window.personaClient = new window.PersonaClient.default(
      "c124b7ef-6236-4391-a492-a30052779d9b"
    );
    initializePersonaClient();
  };
  document.head.appendChild(script);

  //add some logs, behavior is strange.
  function initializePersonaClient() {
    const personaConfig = {
      userId: "admin",
      personaName: "John",
      options: {
        debugMode: true,
        streamTranscripts: true,
        shouldNotSaveConversation: true,
      },
    };

    window.personaClient
      .init(personaConfig)
      .then(() => {
        console.log("PersonaClient initialized successfully");
        configurePersonaEvents();
        promptMicrophoneAccess();
      })
      .catch((error) => {
        console.error("Error initializing PersonaClient:", error);
      });
  }

  //add logging try to determine whats going on here.
  function configurePersonaEvents() {
    window.personaClient.on("messages_update", (messages) => {
      console.log("Messages updated:", messages);
    });

    window.personaClient.on("state_updated", (newState) => {
      console.log("State updated:", newState);
    });

    window.personaClient.on("action", (action) => {
      console.log("Action received:", action);
    });

    window.personaClient.on("error", (error) => {
      console.error("Error event:", error);
    });

    window.personaClient.on("connect_error", (error) => {
      console.error("Connect error event:", error);
    });
  }

  function promptMicrophoneAccess() {
    speakFeedback("Please allow microphone access to enable voice commands.");

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log("Microphone access granted");
        speakFeedback(
          "Microphone access granted. You can now use voice commands."
        );
        initializeMicrophone();
      })
      .catch((error) => {
        console.error("Microphone access denied:", error);
        speakFeedback(
          "Microphone access denied. Please enable it in your browser settings."
        );
      });
  }

  function speakFeedback(text) {
    chrome.tts.speak(text, {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      voiceName: window.VICCI.config.ttsConfig.voiceId,
      onEvent: function (event) {
        if (event.type === "end") {
          console.log("Feedback spoken:", text);
        }
      },
    });
  }

  // Chat control functions
  window.VICCI.actions.startChat = () => {
    const personaConfig = {
      userId: "admin",
      personaName: "John",
      options: {
        debugMode: true,
        streamTranscripts: true,
        shouldNotSaveConversation: true,
      },
    };

    window.personaClient
      .init(personaConfig)
      .then(() => {
        configurePersonaEvents();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  window.VICCI.actions.pauseChat = () => {
    window.personaClient.pause().catch((error) => console.log(error));
  };

  window.VICCI.actions.resumeChat = () => {
    window.personaClient.resume().catch((error) => console.log(error));
  };

  window.VICCI.actions.stopChat = () => {
    window.personaClient.end().catch((error) => console.log(error));
  };

  window.VICCI.actions.updateState = (newState) => {
    window.personaClient
      .updateState(newState)
      .catch((error) => console.log(error));
  };

  window.VICCI.actions.reactTo = (thought) => {
    window.personaClient.reactTo(thought).catch((error) => console.log(error));
  };
});

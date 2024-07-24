// Function to initialize VICCI
function initVICCI() {
  chrome.commands.onCommand.addListener((command) => {
    console.log("VICCI Background Service: Received command:", command);
    if (command === "activate-vicci") {
      console.log("VICCI Background Service: Activating VICCI");
      chrome.tts.speak(
        "V.I.C.C.I. Initial Loading Complete. Welcome to the future.",
        {
          onEvent: function (event) {
            console.log("VICCI Background Service: TTS event:", event.type);
            if (event.type === "end") {
              // Send message to content script to activate VICCI
              chrome.tabs.query(
                { active: true, currentWindow: true },
                (tabs) => {
                  if (tabs.length > 0) {
                    console.log(
                      "VICCI Background Service: Sending activateVicci message to content script"
                    );
                    chrome.tabs.sendMessage(
                      tabs[0].id,
                      { action: "activateVicci" },
                      (response) => {
                        if (chrome.runtime.lastError) {
                          console.error(
                            "VICCI Background Service: Error sending message:",
                            chrome.runtime.lastError
                          );
                        } else {
                          console.log(
                            "VICCI Background Service: Response from content script:",
                            response
                          );
                        }
                      }
                    );
                  } else {
                    console.error(
                      "VICCI Background Service: No active tab found."
                    );
                  }
                }
              );
            }
          },
        }
      );
    } else if (command === "describe-page") {
      console.log("VICCI Background Service: Describing page");
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          console.log(
            "VICCI Background Service: Sending describePage message to content script"
          );
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "describePage" },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error(
                  "VICCI Background Service: Error sending message:",
                  chrome.runtime.lastError
                );
              } else {
                console.log(
                  "VICCI Background Service: Response from content script:",
                  response
                );
              }
            }
          );
        } else {
          console.error("VICCI Background Service: No active tab found.");
        }
      });
    }
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "captureScreenshot") {
      chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          sendResponse({ error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ dataURL: dataUrl });
        }
      });
      return true; // Indicates that the response will be sent asynchronously
    }
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "searchTerm") {
      console.log(
        "VICCI Background Service: Searching for term:",
        request.term
      );
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.update(tabs[0].id, {
            url: `https://www.google.com/search?q=${encodeURIComponent(
              request.term
            )}`,
          });
          sendResponse({ status: "searchTerm executed" });
        } else {
          sendResponse({ status: "No active tab found" });
        }
      });
      return true; // Indicates that the response will be sent asynchronously
    }
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchApi") {
      const { screenshotDataUrl } = request;

      fetch(
        "https://us-central1-aitx-hack24aus-622.cloudfunctions.net/browser-generation-test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ screenshotDataUrl }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((text) => {
          try {
            const data = JSON.parse(text);
            sendResponse({ data });
          } catch (error) {
            sendResponse({ error: "Failed to parse response." });
          }
        })
        .catch((error) => {
          sendResponse({ error: error.message });
        });

      return true;
    }
  });

  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      console.log("VICCI Background Service: Received message:", request);
      if (request.action === "speak") {
        console.log("VICCI Background Service: Speaking text:", request.text);
        try {
          chrome.tts.speak(request.text, {
            rate: 1.0,
            pitch: 1.0,
            onEvent: function (event) {
              console.log("VICCI Background Service: TTS event:", event.type);
              if (event.type === "end") {
                sendResponse({ status: "completed" });
              }
            },
          });
        } catch (error) {
          console.error(
            "VICCI Background Service: Error speaking text:",
            error
          );
        }
        return true; // Indicates we wish to send a response asynchronously
      } else if (request.action === "logExposedFunctions") {
        logExposedFunctions(request.functions);
        sendResponse({ status: "logged" });
      }
    }
  );

  console.log("VICCI Background Service: Initialization complete");
}

function requestExposedFunctions() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("VICCI Background Service: No active tab found.");
      return;
    }
    console.log(
      "VICCI Background Service: Requesting exposed functions from active tab:",
      tabs[0].id
    );
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getExposedFunctions" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "VICCI Background Service: Error requesting functions:",
            chrome.runtime.lastError
          );
        } else {
          console.log(
            "VICCI Background Service: Received functions:",
            response.functions
          );
          logExposedFunctions(response.functions);
        }
      }
    );
  });
}

function logExposedFunctions(functions) {
  console.log("Logging exposed functions and variables:");
  chrome.tts.speak("Logging exposed functions and variables.", {});

  functions.forEach((func) => {
    console.log(`Exposed function: ${func}`);
    chrome.tts.speak(`Exposed function: ${func}`, {});
  });

  console.log("Exposed functions and variables logged.");
  chrome.tts.speak("Exposed functions and variables logged.", {});
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("VICCI Background Service: Extension installed");
  initVICCI();
});

initVICCI();

self.addEventListener("fetch", function (event) {
  // This empty fetch listener is sometimes needed to keep the service worker alive
});

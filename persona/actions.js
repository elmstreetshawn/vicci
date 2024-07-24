const actions = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "click_element": {
      "_action_type": "perform_action",
      "_description": "When Vicci should click on a specified element on the user's screen.",
      "_examples": [
        {
          "user says": "Vicci, click on the button labeled 'Save'",
          "assistant action includes": {
            "click_element": {
              "element_identifier": "button:label=Save"
            }
          },
          "_response": "Clicking the button labeled 'Save'."
        },
        {
          "user says": "Vicci, click on the blue box",
          "assistant action includes": {},
          "_response": "I couldn't identify the element. Can you describe it in more detail, or try something else?"
        }
      ],
      "type": "object",
      "required": ["element_identifier"]
    },
    "describe_element": {
      "_action_type": "get_information",
      "_description": "When Vicci should describe a specific element on the user's screen.",
      "_examples": [
        {
          "user says": "Vicci, describe the button labeled 'Save'",
          "assistant action includes": {
            "describe_element": {
              "element_identifier": "button:label=Save"
            }
          },
          "_response": "The button labeled 'Save' is a rectangular button with a blue background and white text. It is located in the top right corner of the page."
        },
        {
          "user says": "Vicci, describe the image in the center",
          "assistant action includes": {
            "describe_element": {
              "element_identifier": "image:position=center"
            }
          },
          "_response": "The image in the center is a photograph of a cat. It appears to be a fluffy white cat sitting on a green chair."
        }
      ],
      "type": "object",
      "required": ["element_identifier"]
    },
    "describe_page": {
      "_action_type": "get_information",
      "_description": "When Vicci should provide a concise overview of the current page.",
      "_examples": [
        {
          "user says": "Vicci, what do you see?",
          "assistant action includes": {},
          "_response": "This page appears to be a news article titled 'New advancements in AI.' It has several paragraphs of text and an image at the top."
        }
      ]
    },
    "scroll_page": {
      "_action_type": "perform_action",
      "_description": "When Vicci should scroll the page in a specified direction.",
      "_examples": [
        {
          "user says": "Vicci, scroll down",
          "assistant action includes": {
            "scroll_page": {
              "direction": "down"
            }
          },
          "_response": "Scrolling down the page. Now you should see..."
        },
        {
          "user says": "Vicci, scroll left",
          "assistant action includes": {
            "scroll_page": {
              "direction": "left"
            }
          },
          "_response": "Scrolling left. Now you can access..."
        }
      ],
      "type": "object",
      "required": ["direction"]
    },
    "navigate": {
      "_action_type": "perform_action",
      "_description": "When Vicci should navigate to a specific URL or bookmark.",
      "_examples": [
        {
          "user says": "Vicci, go to https://www.google.co.uk/",
          "assistant action includes": {
            "navigate": {
              "url": "https://www.google.co.uk/"
            }
          },
          "_response": "Navigating to https://www.google.co.uk/"
        },
        {
          "user says": "Vicci, go back",
          "assistant action includes": {
            "navigate": {
              "direction": "back"
            }
          },
          "_response": "Going back to the previous page."
        }
      ]
    }
  }
};

// Expose the variable to the global scope
window.VICCI = window.VICCI || {};
window.VICCI.actions = actions;
console.log('Actions loaded:' , actions);

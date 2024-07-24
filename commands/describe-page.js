// commands/describe-page.js

console.log('VICCI Describe Page: Module loaded');

function describePage() {
  console.log('VICCI Describe Page: Generating page description');
  
  try {
    const pageStructure = window.VICCI.domParser.getPageStructure();
    let description = generateDescription(pageStructure);
    speakDescription(description);
  } catch (error) {
    console.error('VICCI Describe Page: Error describing page:', error);
    speakDescription("Sorry, I encountered an error while describing the page.");
  }
}

function generateDescription(pageStructure) {
  console.log('VICCI Describe Page: Generating description from page structure');
  
  let description = `Page title: ${pageStructure.title}. `;
  
  description += `This page contains ${pageStructure.headings.length} headings, `;
  description += `${pageStructure.links.length} links, `;
  description += `${pageStructure.images.length} images, and `;
  description += `approximately ${pageStructure.wordCount} words. `;

  if (pageStructure.headings.length > 0) {
    description += "The main headings are: ";
    description += pageStructure.headings.slice(0, 3).map(h => h.text).join(', ');
    if (pageStructure.headings.length > 3) {
      description += ", and others. ";
    } else {
      description += ". ";
    }
  }

  if (pageStructure.links.length > 0) {
    description += `The first few links are: `;
    description += pageStructure.links.slice(0, 3).map(l => l.text || 'Unnamed link').join(', ');
    description += ". ";
  }

  if (pageStructure.images.length > 0) {
    description += `The page includes images`;
    if (pageStructure.images.some(img => img.alt)) {
      description += `, some with descriptions like: `;
      description += pageStructure.images.filter(img => img.alt).slice(0, 2).map(img => img.alt).join(', ');
    }
    description += ". ";
  }

  if (pageStructure.lists.length > 0) {
    description += `There are ${pageStructure.lists.length} lists on the page. `;
  }

  if (pageStructure.tables.length > 0) {
    description += `The page contains ${pageStructure.tables.length} tables. `;
  }

  if (pageStructure.forms.length > 0) {
    description += `There are ${pageStructure.forms.length} forms on this page. `;
  }

  if (pageStructure.mainContent) {
    description += "The main content area has been identified. ";
  }

  if (pageStructure.navigation) {
    description += `A navigation menu with ${pageStructure.navigation.length} items has been found. `;
  }

  console.log('VICCI Describe Page: Description generated');
  return description;
}

function speakDescription(description) {
  console.log('VICCI Describe Page: Speaking description');
  chrome.runtime.sendMessage({action: "speak", text: description}, (response) => {
    console.log('VICCI Describe Page: TTS response:', response);
  });
}

// Export the main function if using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { describePage };
} else {
  // If not using modules, add to window object
  window.VICCI = window.VICCI || {};
  window.VICCI.describePage = describePage;
}

console.log('VICCI Describe Page: Module setup complete');
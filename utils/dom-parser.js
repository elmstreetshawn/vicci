// utils/dom-parser.js

(function(window) {
  console.log('VICCI DOM Parser: Initializing...');

  // Main function to get page structure
  function getPageStructure() {
    console.log('VICCI DOM Parser: Getting page structure');
    return {
      title: document.title,
      url: window.location.href,
      language: document.documentElement.lang || 'Not specified',
      headings: getHeadingStructure(),
      links: getLinkStructure(),
      images: getImageStructure(),
      lists: getListStructure(),
      tables: getTableStructure(),
      forms: getFormStructure(),
      mainContent: getMainContent(),
      navigation: getNavigation(),
      footer: getFooter(),
      paragraphCount: document.getElementsByTagName('p').length,
      wordCount: getWordCount()
    };
  }

  function getHeadingStructure() {
    return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
      level: parseInt(h.tagName.charAt(1)),
      text: h.textContent.trim(),
      id: h.id || null
    }));
  }

  function getLinkStructure() {
    return Array.from(document.links).map(link => ({
      text: link.textContent.trim(),
      url: link.href,
      isInternal: link.host === window.location.host,
      ariaLabel: link.getAttribute('aria-label')
    }));
  }

  function getImageStructure() {
    return Array.from(document.images).map(img => ({
      alt: img.alt,
      src: img.src,
      width: img.width,
      height: img.height
    }));
  }

  function getListStructure() {
    return Array.from(document.querySelectorAll('ul, ol')).map(list => ({
      type: list.tagName.toLowerCase(),
      items: Array.from(list.querySelectorAll('li')).map(li => li.textContent.trim())
    }));
  }

  function getTableStructure() {
    return Array.from(document.querySelectorAll('table')).map(table => ({
      caption: table.caption ? table.caption.textContent.trim() : null,
      headers: Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim()),
      rowCount: table.rows.length,
      columnCount: table.rows[0] ? table.rows[0].cells.length : 0
    }));
  }

  function getFormStructure() {
    return Array.from(document.forms).map(form => ({
      name: form.name || null,
      id: form.id || null,
      method: form.method,
      action: form.action,
      fields: Array.from(form.elements).map(element => ({
        type: element.type,
        name: element.name || null,
        id: element.id || null,
        label: element.labels && element.labels[0] ? element.labels[0].textContent.trim() : null
      }))
    }));
  }

  function getMainContent() {
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    return main ? main.textContent.trim() : null;
  }

  function getNavigation() {
    const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
    return nav ? Array.from(nav.querySelectorAll('a')).map(link => link.textContent.trim()) : null;
  }

  function getFooter() {
    const footer = document.querySelector('footer');
    return footer ? footer.textContent.trim() : null;
  }

  function getWordCount() {
    const text = document.body.innerText || document.body.textContent;
    return text.trim().split(/\s+/).length;
  }

  // Expose functions globally
  window.VICCI = window.VICCI || {};
  window.VICCI.domParser = {
    getPageStructure,
    getHeadingStructure,
    getLinkStructure,
    getImageStructure,
    getListStructure,
    getTableStructure,
    getFormStructure,
    getMainContent,
    getNavigation,
    getFooter,
    getWordCount
  };

  console.log('VICCI DOM Parser: Initialization complete');
})(window);
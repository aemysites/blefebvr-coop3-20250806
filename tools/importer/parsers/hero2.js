/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract the hero image (background image)
  let heroPicture = '';
  const heroImgDiv = element.querySelector('.SR_002_Auftrittsheader');
  if (heroImgDiv) {
    const pic = heroImgDiv.querySelector('picture');
    if (pic) heroPicture = pic;
  }

  // 2. Extract hero text content (headline, subheading, etc)
  // The hero text is usually immediately after the header (the nav/header image), most likely in the next sibling
  // We'll try to find all h1-h6 and p elements in the next sibling after the hero image
  let textContentElements = [];
  let textContainer = null;
  if (heroImgDiv && heroImgDiv.nextElementSibling) {
    textContainer = heroImgDiv.nextElementSibling;
  } else if (element.nextElementSibling) {
    textContainer = element.nextElementSibling;
  }

  if (textContainer) {
    // Only include visible elements that are headings or paragraphs (not nav, not unrelated content)
    textContentElements = Array.from(textContainer.querySelectorAll('h1, h2, h3, h4, h5, h6, p'));
    // If the container itself is a heading or paragraph, include it (e.g. <h1>...</h1> alone)
    if ((/H[1-6]|P/).test(textContainer.tagName)) {
      textContentElements.unshift(textContainer);
    }
    // Remove duplicates
    textContentElements = Array.from(new Set(textContentElements));
  }

  // As fallback, try searching globally for the first block under <main> (or document.body) with headings/paragraphs
  if (textContentElements.length === 0) {
    const main = document.querySelector('main') || document.body;
    const allCandidates = Array.from(main.children);
    for (let i = 0; i < allCandidates.length; i++) {
      const block = allCandidates[i];
      const found = block.querySelectorAll ? block.querySelectorAll('h1, h2, h3, h4, h5, h6, p') : [];
      if (found && found.length > 0) {
        textContentElements = Array.from(found);
        break;
      }
    }
  }

  // Clean up: only pass non-empty values (cell must contain at least an empty string for structure)
  const cells = [
    ['Hero'],
    [heroPicture || ''],
    [textContentElements.length > 0 ? textContentElements : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

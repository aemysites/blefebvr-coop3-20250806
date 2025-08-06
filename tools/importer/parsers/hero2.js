/* global WebImporter */
export default function parse(element, { document }) {
  // Get the hero image (the .SR_002_Auftrittsheader picture element)
  let heroImageEl = '';
  const auftrittsheader = element.querySelector('.SR_002_Auftrittsheader');
  if (auftrittsheader) {
    const picture = auftrittsheader.querySelector('picture');
    if (picture) heroImageEl = picture;
  }

  // Attempt to find the main heading and sub-elements for hero text
  // We'll consider only direct children after nav and .SR_002_Auftrittsheader
  let textContentBlock = '';
  // Get all direct children of <header>, ignore nav and .SR_002_Auftrittsheader
  const directChildren = Array.from(element.children).filter(child =>
    !child.matches('nav') && !child.classList.contains('SR_002_Auftrittsheader')
  );
  // Find the first element that contains heading/text
  for (const child of directChildren) {
    // If it contains an h1 or h2 or text node with visible text, use as content block
    if (
      child.querySelector('h1, h2, h3, h4, h5, h6, p') ||
      (child.textContent && child.textContent.trim().length > 0)
    ) {
      textContentBlock = child;
      break;
    }
  }
  // If nothing found, as fallback look for first heading in header
  if (!textContentBlock) {
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textContentBlock = heading;
  }

  const cells = [
    ['Hero'], // Header row, must match example exactly
    [heroImageEl || ''],
    [textContentBlock || '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

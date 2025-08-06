/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class (avoiding .querySelector on root)
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList && child.classList.contains(className));
  }

  // Find all immediate child divs with col-sm-6 (regardless of push/pull for robustness)
  const colDivs = Array.from(element.querySelectorAll(':scope > div')).filter(div =>
    div.classList && div.className.includes('col-sm-6')
  );

  // If there are not exactly two columns, we skip (edge case handling)
  if (colDivs.length !== 2) return;

  // Sort columns: left (text), right (image)
  let leftCol, rightCol;
  // The left text col usually has col-sm-pull-6, right image col has col-sm-push-6
  if (colDivs[0].className.includes('pull')) {
    leftCol = colDivs[0];
    rightCol = colDivs[1];
  } else if (colDivs[1].className.includes('pull')) {
    leftCol = colDivs[1];
    rightCol = colDivs[0];
  } else {
    // fallback: use HTML order
    leftCol = colDivs[0];
    rightCol = colDivs[1];
  }

  // LEFT COLUMN: gather all direct children (e.g. article, call-to-action)
  const leftContent = [];
  Array.from(leftCol.children).forEach(child => {
    // Only include if it contains meaningful content
    if (child.textContent.trim() || child.querySelector('img, picture')) leftContent.push(child);
  });

  // RIGHT COLUMN: search for figure or image container
  const rightContent = [];
  // Only the first figure (which contains the image and zoom icon)
  const figure = rightCol.querySelector('figure');
  if (figure) rightContent.push(figure);

  // Compose the table as in the example (header row, then a single row with two columns)
  const cells = [
    ['Columns (columns5)'],
    [leftContent, rightContent]
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

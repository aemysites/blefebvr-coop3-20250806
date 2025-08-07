/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct children that are columns
  const colDivs = Array.from(element.querySelectorAll(':scope > div.col-xs-12'));
  const leftCol = colDivs[0] || null;
  const rightCol = colDivs[1] || null;

  // LEFT COLUMN CONTENT
  let leftContent = null;
  if (leftCol) {
    leftContent = leftCol.querySelector('figure');
  }

  // RIGHT COLUMN CONTENT
  let rightContent = [];
  if (rightCol) {
    const article = rightCol.querySelector('article');
    if (article) rightContent.push(article);
    const cta = rightCol.querySelector('.KBK-024-call-to-action-button-small');
    if (cta) rightContent.push(cta);
  }

  if (!leftContent && rightContent.length === 0) {
    return;
  }

  // To match the example, header row must have two columns
  const headerRow = ['Columns (columns4)', ''];
  const contentRow = [leftContent, rightContent.length === 1 ? rightContent[0] : rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}

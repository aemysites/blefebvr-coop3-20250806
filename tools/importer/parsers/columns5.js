/* global WebImporter */
export default function parse(element, { document }) {
  // Find both content columns: these have col-xs-12 plus push/pull for order
  const cols = Array.from(element.querySelectorAll(':scope > div'))
    .filter(div => div.classList.contains('col-xs-12'));

  if (cols.length < 2) return;

  // Determine which column is left (text) and which is right (image)
  let leftCol, rightCol;
  cols.forEach(col => {
    if (col.classList.contains('col-sm-pull-6')) {
      leftCol = col;
    } else if (col.classList.contains('col-sm-push-6')) {
      rightCol = col;
    }
  });
  // Fallback to order if classes not set
  if (!leftCol || !rightCol) {
    [leftCol, rightCol] = cols;
  }

  // Left cell: article + cta
  const leftCellContent = [];
  const article = leftCol.querySelector('article');
  if (article) leftCellContent.push(article);
  const cta = leftCol.querySelector('.KBK-024-call-to-action-button-small');
  if (cta) leftCellContent.push(cta);

  // Right cell: the entire figure
  let rightCellContent = null;
  const figure = rightCol.querySelector('figure');
  if (figure) rightCellContent = figure;

  // The header row must have two columns: one for the header, one blank, to match content columns
  const cells = [
    ['Columns (columns5)', ''],
    [leftCellContent, rightCellContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

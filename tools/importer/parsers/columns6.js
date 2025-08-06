/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing columns
  const row = element.querySelector('.row.row-flex.row-flex-wrap');
  if (!row) return;
  const columns = Array.from(row.querySelectorAll(':scope > div'));
  if (columns.length === 0) return;

  // For each column, extract the main content (inside .wrapper inside .teaser)
  const columnCells = columns.map((col) => {
    const article = col.querySelector('article.teaser');
    if (!article) return col;
    const wrapper = article.querySelector('.wrapper');
    return wrapper || article;
  });

  // Header row: must be a single cell array
  const cells = [
    ['Columns (columns6)'],
    columnCells
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

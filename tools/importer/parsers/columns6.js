/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the two columns inside the .row
  let columns = [];
  const container = element.querySelector('.container-fluid');
  if (container) {
    const row = container.querySelector('.row');
    if (row) {
      columns = Array.from(row.querySelectorAll(':scope > [class*="col-"]'));
    }
  }
  // Fallback - just in case the structure changes
  if (!columns.length) {
    columns = Array.from(element.children);
  }
  // For each column, grab the .wrapper element for clean column content
  const colCells = columns.map(col => {
    const wrapper = col.querySelector('.wrapper');
    if (wrapper) return wrapper;
    return col;
  });
  if (colCells.length === 0) return;

  // Create the table using WebImporter.DOMUtils.createTable
  // Patch: Ensure the header cell spans all columns by setting colspan
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns6)'],
    colCells,
  ], document);

  // Set colspan on the header th, if there is more than one column
  const thead = table.querySelector('tr:first-child');
  if (thead && colCells.length > 1) {
    const th = thead.querySelector('th');
    if (th) {
      th.setAttribute('colspan', colCells.length);
    }
  }
  element.replaceWith(table);
}

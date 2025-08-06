/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate .footer-col children representing columns
  const columns = Array.from(element.querySelectorAll(':scope > div.footer-col'));

  // For each column, find the <ul.footer-nav.footer-linklist> (should be just one per column)
  const colCells = columns.map(col => {
    const ul = col.querySelector('ul.footer-nav.footer-linklist');
    return ul || document.createTextNode('');
  });

  // Build the table: header is a single cell, then one row with all columns
  const cells = [
    ['Columns (columns8)'],
    colCells
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

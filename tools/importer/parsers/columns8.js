/* global WebImporter */
export default function parse(element, { document }) {
  // Get all columns: immediate children with .footer-col
  const columns = Array.from(element.querySelectorAll(':scope > .footer-col'));

  // If there are no columns, do not replace; fail gracefully
  if (!columns.length) return;

  // The header row must be a single cell (one column), matching the markdown example exactly
  const headerRow = ['Columns (columns8)'];
  // The content row is one cell per column
  const contentRow = columns;

  // Table data: single header, then content row with one cell per column
  const tableData = [headerRow, contentRow];

  // Create the columns block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new table
  element.replaceWith(block);
}

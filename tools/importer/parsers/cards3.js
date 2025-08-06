/* global WebImporter */
export default function parse(element, { document }) {
  const cells = [ ['Cards (cards3)'] ];

  // Select all direct columns (cards)
  const row = element.querySelector('.row-flex.row-flex-wrap');
  if (row) {
    const cols = row.querySelectorAll(':scope > div');
    cols.forEach((col) => {
      const article = col.querySelector('article');
      if (!article) return;
      const link = article.querySelector('a');
      if (!link) return;

      // Get the picture (image) -- always present
      const picture = link.querySelector('picture');
      let imageCell = '';
      if (picture) {
        imageCell = picture;
      }

      // Build text content
      const frag = document.createDocumentFragment();
      // Title (used as heading, styled as <strong> for display)
      const h2 = link.querySelector('h2');
      if (h2) {
        const strong = document.createElement('strong');
        strong.textContent = h2.textContent;
        frag.appendChild(strong);
      }
      // Short and long description
      const pShort = link.querySelector('p.txt-short');
      if (pShort) {
        if (frag.childNodes.length > 0) frag.appendChild(document.createElement('br'));
        frag.appendChild(document.createTextNode(pShort.textContent));
      }
      const pLong = link.querySelector('p.txt-long');
      if (pLong) {
        if (frag.childNodes.length > 0) frag.appendChild(document.createElement('br'));
        frag.appendChild(document.createTextNode(pLong.textContent));
      }
      // CTA: Only if the card link is meaningful and not just the card container
      // In this structure, the link is the whole card, so don't add duplicate CTA.

      cells.push([imageCell, frag]);
    });
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

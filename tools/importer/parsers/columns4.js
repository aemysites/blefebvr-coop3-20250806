/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for columns block with variant
  const headerRow = ['Columns (columns4)'];

  // Get direct column children (should be two cols)
  const cols = Array.from(element.querySelectorAll(':scope > .col-xs-12'));

  // --- COLUMN 1: The image with zoom anchor ---
  let col1Content = [];
  const col1 = cols[0];
  if (col1) {
    // Find the figure containing the <a> and <picture>
    const figure = col1.querySelector('figure');
    if (figure) {
      // Prefer the largest/best image from <source srcset> or data-large-image-src
      let bestImgSrc = '';
      let alt = '';
      let width = '';
      let height = '';
      const a = figure.querySelector('a[data-large-image-src]');
      if (a) {
        // Try to find the best <source> or <img> src
        const picture = a.querySelector('picture');
        if (picture) {
          const sources = Array.from(picture.querySelectorAll('source'));
          let maxWidth = 0;
          sources.forEach(source => {
            const srcset = source.getAttribute('srcset');
            if (srcset) {
              // srcset may have multiple entries, use the largest
              const entries = srcset.split(',').map(s => s.trim());
              entries.forEach(entry => {
                const [url, size] = entry.split(' ');
                let w = 0;
                if (size && size.endsWith('w')) {
                  w = parseInt(size);
                }
                if (w > maxWidth) {
                  maxWidth = w;
                  bestImgSrc = url;
                }
              });
            }
          });
        }
        // fallback to data-large-image-src
        if (!bestImgSrc) {
          bestImgSrc = a.getAttribute('data-large-image-src');
        }
      }
      // fallback to <img src> if above didn't work
      if (!bestImgSrc) {
        const img = figure.querySelector('img');
        if (img && img.src && img.src !== '') {
          bestImgSrc = img.src;
        }
      }
      // get alt, width, height if possible
      const img = figure.querySelector('img');
      if (img) {
        alt = img.getAttribute('alt') || '';
        width = img.getAttribute('width') || '';
        height = img.getAttribute('height') || '';
      }
      if (bestImgSrc) {
        const realImg = document.createElement('img');
        realImg.src = bestImgSrc;
        if (alt) realImg.setAttribute('alt', alt);
        if (width) realImg.setAttribute('width', width);
        if (height) realImg.setAttribute('height', height);
        col1Content.push(realImg);
      }
    }
  }

  // --- COLUMN 2: The text and button ---
  let col2Content = [];
  const col2 = cols[1];
  if (col2) {
    // Get the main article (contains h3, p)
    const article = col2.querySelector('article');
    if (article) {
      col2Content.push(article);
    }
    // Get the call-to-action button div
    const cta = col2.querySelector('.KBK-024-call-to-action-button-small');
    if (cta) {
      // Find the anchor inside
      const ctaLink = cta.querySelector('a');
      if (ctaLink) {
        col2Content.push(ctaLink);
      }
    }
  }

  // If content is missing, ensure we provide an empty cell so table is always 2 columns as in example
  if (col1Content.length === 0) col1Content = [''];
  if (col2Content.length === 0) col2Content = [''];

  // Build rows for columns block
  const cells = [
    headerRow,
    [col1Content.length === 1 ? col1Content[0] : col1Content, col2Content.length === 1 ? col2Content[0] : col2Content]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

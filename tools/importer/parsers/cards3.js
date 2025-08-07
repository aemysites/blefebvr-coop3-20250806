/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get first real img from a picture element
  function getImageFromPicture(picture, fallbackAlt) {
    if (!picture) return null;
    let img = picture.querySelector('img');
    // If this is a loading GIF, try to extract src from a <source>
    if (img && img.src && img.src.includes('bx_loader.gif')) {
      img = null;
    }
    if (!img) {
      // Try to use <source> srcset
      const sources = picture.querySelectorAll('source');
      let src = '';
      for (const source of sources) {
        const srcset = source.getAttribute('srcset');
        if (srcset) {
          // Take first comma-separated value
          src = srcset.split(',')[0].split(' ')[0];
          break;
        }
      }
      if (src) {
        img = document.createElement('img');
        img.src = src;
        img.alt = fallbackAlt || '';
      }
    }
    return img;
  }

  // Get all article.teaser elements representing the cards
  const articles = element.querySelectorAll('article.teaser');
  const rows = [['Cards']]; // Header row

  articles.forEach(article => {
    // Each card is a link
    const link = article.querySelector('a');
    if (!link) return; // Defensive: skip if no link

    // Picture element & image
    const picture = link.querySelector('picture');
    // Title
    const titleEl = link.querySelector('h2');
    const title = titleEl ? titleEl.textContent.trim() : '';
    const img = getImageFromPicture(picture, title);

    // Text content: try to keep the exact content and structure
    const txtContainer = link.querySelector('.txt-container');
    let contentEls = [];
    if (txtContainer) {
      // If there's a title but not in the text container, add it first as <strong>
      if (title && !txtContainer.querySelector('h2')) {
        const strong = document.createElement('strong');
        strong.textContent = title;
        contentEls.push(strong);
      }
      // Add paragraphs with line breaks between
      const short = txtContainer.querySelector('.txt-short');
      const long = txtContainer.querySelector('.txt-long');
      if (short) {
        if (contentEls.length > 0) contentEls.push(document.createElement('br'));
        contentEls.push(short);
      }
      if (long) {
        if (contentEls.length > 0) contentEls.push(document.createElement('br'));
        contentEls.push(long);
      }
    } else {
      // Fallback: use the title as strong
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title;
        contentEls.push(strong);
      }
    }

    // Compose this card row
    rows.push([
      img || '',
      contentEls.length > 0 ? contentEls : ''
    ]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

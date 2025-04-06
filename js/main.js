document.addEventListener("DOMContentLoaded", () => {
  // Ensure the basePath is set correctly based on the environment (local or production)
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname) ||
                  window.location.protocol === "file:";
  const REPO = "TheLiteraryPavilion";  // Replace with your repo name if needed
  const basePath = isLocal ? "/" : `/${REPO}/`;

  // Initialize texts array
  let texts = [];

  // Function to fix text URLs dynamically
  function fixTextUrl(url) {
    const fullUrl = `${basePath}texts/text_pages/${url}`;
    console.log("Fixing text URL:", fullUrl);
    return fullUrl;
  }

  // Function to display results (only on pages with #results)
  function displayResults(data) {
    const resultsDiv = document.getElementById("results");
    if (resultsDiv) {
      if (data.length === 0) {
        resultsDiv.innerHTML = '<p>No matching texts found.</p>';
      } else {
        resultsDiv.innerHTML = data.map(text => `
          <div class="text-entry">
            <h3><a href="${fixTextUrl(text.url)}" title="${text.title}">${text.title}</a></h3>
            ${ text.author ? `<div class="metadata">${text.author}${text.date ? ' - ' + text.date : ''}</div>` : '' }
            ${ text.description ? `<p>${text.description}</p>` : '' }
            <div class="tags">Tags: ${text.tags.join(', ')}</div>
          </div>
        `).join("");
      }
    } else {
      console.warn("#results div not found on this page.");
    }
  }

  // Fetch text data (only if #results exists)
  if (document.getElementById("results")) {
    fetch(`${basePath}texts/index.json`)
      .then(response => response.json())
      .then(data => {
        texts = data;
        displayResults(texts);
      })
      .catch(error => {
        console.error('Error fetching texts:', error);
        const resultsDiv = document.getElementById("results");
        if (resultsDiv) {
          resultsDiv.innerHTML = '<p>Error loading texts data.</p>';
        }
      });
  }

  // Search functionality (only if #searchBox exists)
  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.addEventListener("input", function() {
      const query = this.value.toLowerCase();
      const tokens = query.split(/\s+/).filter(token => token);
      const filtered = texts.filter(text => {
        return tokens.every(token => 
          (text.title && text.title.toLowerCase().includes(token)) ||
          (text.title_pinyin && text.title_pinyin.toLowerCase().includes(token)) ||
          (text.desc && text.desc.toLowerCase().includes(token)) ||
          (text.author && text.author.toLowerCase().includes(token)) ||
          (text.author_pinyin && text.author_pinyin.toLowerCase().includes(token)) ||
          (text.tags && text.tags.some(tag => tag.toLowerCase().includes(token)))
        );
      });
      displayResults(filtered);
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    // Inject the font-face CSS dynamically (only if link tag exists)
    const link = document.querySelector('link[rel="stylesheet"]');
    if (link) {
      console.log('CSS found!')
      const cssText = `
        @font-face {
          font-family: 'FZKai-Z03S';
          src: url('${basePath}fonts/FZKai-Z03S-Regular.ttf') format('truetype');
          unicode-range: U+4E00-9FFF, U+3400-4DBF;
        }
      `;
      const styleSheet = link.sheet;
      styleSheet.insertRule(cssText, styleSheet.cssRules.length);
    } else {
      console.error('Stylesheet link not found!');
    }

    const tooltip = document.getElementById('char-tooltip');
    if (!tooltip) {
      console.warn('Tooltip element #char-tooltip not found!');
      return;
    }
  
    fetch(`${basePath}characters.json`)
      .then(res => res.json())
      .then(data => {
        console.log('Characters loaded:', data);
  
        // Use event delegation with bubbling mouseover
        document.body.addEventListener('mouseover', (e) => {
          const characterEl = e.target.closest('.character');
          if (!characterEl) return;
  
          const char = characterEl.dataset.char;
          const info = data[char];
          if (!info) {
            console.warn('No data for character:', char);
            return;
          }
  
          console.log('Hovered on:', char);
          tooltip.textContent = `${char} - ${info.pinyin} - ${info.meaning}`;
          tooltip.style.display = 'block';
        });
  
        // Move tooltip on mousemove
        document.body.addEventListener('mousemove', (e) => {
          const tooltipWidth = tooltip.offsetWidth;
          const tooltipHeight = tooltip.offsetHeight;
          const pageWidth = window.innerWidth;
          const pageHeight = window.innerHeight;
  
          let left = e.clientX + 15;
          let top = e.clientY + 15;
  
          if (left + tooltipWidth > pageWidth) {
            left = e.clientX - tooltipWidth - 15;
          }
  
          if (top + tooltipHeight > pageHeight) {
            top = e.clientY - tooltipHeight - 15;
          }
  
          tooltip.style.left = `${left}px`;
          tooltip.style.top = `${top}px`;
        });
  
        // Hide tooltip on mouseout
        document.body.addEventListener('mouseout', (e) => {
          if (e.target.closest('.character')) {
            tooltip.style.display = 'none';
          }
        });
      })
      .catch(err => {
        console.error('Could not load character data:', err);
      });
  });

  // Random button functionality (only if #randomBtn exists)
  const randomBtn = document.getElementById("randomBtn");
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      if (texts.length === 0) return;

      document.getElementById("searchBox").value = "";

      const validTexts = texts.filter(text => text.id !== undefined);
      const randomText = validTexts[Math.floor(Math.random() * validTexts.length)];

      displayResults([randomText]);
    });
  } else {
    console.warn("#randomBtn not found on this page.");
  }
});

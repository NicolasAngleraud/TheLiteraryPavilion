fetch('/components/header.html')
  .then(res => res.text())
  .then(data => document.getElementById('header').innerHTML = data);

fetch('/components/footer.html')
  .then(res => res.text())
  .then(data => document.getElementById('footer').innerHTML = data);

let texts = [];

function displayResults(data) {
  const resultsDiv = document.getElementById("results");
  if (data.length === 0) {
    resultsDiv.innerHTML = '<p>No matching texts found.</p>';
    return;
  }
  resultsDiv.innerHTML = data.map(text => `
    <div class="text-entry">
      <h3><a href="${text.url}" title="${text.title}">${text.title}</a></h3>
      ${ text.author ? `<div class="metadata">${text.author}${text.date ? ' - ' + text.date : ''}</div>` : '' }
      ${ text.description ? `<p>${text.description}</p>` : '' }
      <div class="tags">Tags: ${text.tags.join(', ')}</div>
    </div>
  `).join("");
}

fetch('/texts/index.json')
  .then(response => response.json())
  .then(data => {
    texts = data;
    displayResults(texts);
  })
  .catch(error => {
    console.error('Error fetching texts:', error);
    document.getElementById("results").innerHTML = '<p>Error loading texts data.</p>';
  });

document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("searchBox");
  if (!searchBox) return;

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
});

const tooltip = document.getElementById('char-tooltip');

fetch('/characters.json')
  .then(res => res.json())
  .then(data => {
    document.querySelectorAll('.text-page .character').forEach(el => {
      const char = el.dataset.char;
      const info = data[char];
      
      if (!info) return;

      el.addEventListener('mouseenter', (e) => {
        tooltip.textContent = `${char} - ${info.pinyin} - ${info.meaning}`;
        tooltip.style.display = 'block';
      });

      el.addEventListener('mousemove', (e) => {
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

      el.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  })
  .catch(err => {
    console.error('Could not load character data:', err);
  });

  document.getElementById("randomBtn").addEventListener("click", () => {
    if (texts.length === 0) return;
  
    document.getElementById("searchBox").value = "";
  
    const validTexts = texts.filter(text => text.id !== undefined);
    const randomText = validTexts[Math.floor(Math.random() * validTexts.length)];
  
    displayResults([randomText]);
  });


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

fetch('/characters.json')
  .then(response => response.json())
  .then(data => {
    document.querySelectorAll('.text-page .character').forEach(charElement => {
      const char = charElement.getAttribute('data-char');
      const charInfo = data[char];

      if (charInfo) {
        charElement.setAttribute('title', `${char} - ${charInfo.pinyin} - ${charInfo.meaning}`);
      }
    });
  })
  .catch(error => console.error('Error fetching character data:', error));


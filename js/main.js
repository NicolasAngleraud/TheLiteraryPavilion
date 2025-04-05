const searchBox = document.getElementById("searchBox");
const resultsDiv = document.getElementById("results");

function displayResults(data) {
  resultsDiv.innerHTML = data.map(text => `
    <div class="text-entry">
      <h3>${text.title}</h3>
      <p>${text.content}</p>
      <div class="tags">Tags: ${text.tags.join(', ')}</div>
    </div>
  `).join("");
  attachHoverEvents(); // Re-attach hover tooltips
}

function attachHoverEvents() {
  document.querySelectorAll(".info-word").forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      const tooltip = document.getElementById("tooltip");
      tooltip.textContent = el.dataset.info;
      tooltip.style.display = "block";
    });
    el.addEventListener("mousemove", (e) => {
      const tooltip = document.getElementById("tooltip");
      tooltip.style.left = e.pageX + 15 + "px";
      tooltip.style.top = e.pageY + 15 + "px";
    });
    el.addEventListener("mouseleave", () => {
      document.getElementById("tooltip").style.display = "none";
    });
  });
}

searchBox.addEventListener("input", () => {
  const query = searchBox.value.toLowerCase();
  const filtered = texts.filter(text =>
    text.content.toLowerCase().includes(query) ||
    text.tags.some(tag => tag.toLowerCase().includes(query)) ||
    text.title.toLowerCase().includes(query)
  );
  displayResults(filtered);
});

// Display all by default
displayResults(texts);

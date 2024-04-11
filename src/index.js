const quoteList = document.getElementById('quote-list');
const newQuoteForm = document.getElementById('new-quote-form');

// Fetch initial quotes
fetchQuotes();

// Function to fetch quotes
function fetchQuotes() {
  fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quotes => {
      quoteList.innerHTML = ''; // Clear existing quotes
      quotes.forEach(renderQuote);
    });
}

// Function to render a single quote
function renderQuote(quote) {
  const li = document.createElement('li');
  li.classList.add('quote-card');
  li.innerHTML = `
    <blockquote class="blockquote">
      <p class="mb-0">${quote.content}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
      <button class='btn-danger' data-id="${quote.id}">Delete</button>
    </blockquote>
  `;
  li.querySelector('.btn-danger').addEventListener('click', () => deleteQuote(quote.id));
  li.querySelector('.btn-success').addEventListener('click', () => likeQuote(quote.id));
  quoteList.appendChild(li);
}

// Function to delete a quote
function deleteQuote(id) {
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'DELETE'
  })
    .then(() => fetchQuotes()); // Refresh quote list
}

// Function to like a quote
function likeQuote(id) {
  fetch('http://localhost:3000/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quoteId: id })
  })
    .then(() => fetchQuotes()); // Refresh quote list
}

// Handle new quote submission
newQuoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const content = document.getElementById('quote-content').value;
  const author = document.getElementById('quote-author').value;

  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content, author })
  })
    .then(() => {
      fetchQuotes(); // Refresh quote list
      newQuoteForm.reset(); // Clear form fields
    });
});

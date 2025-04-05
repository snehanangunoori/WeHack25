// Constants
const NEWS_API_KEY = '6987caceea154109b01379f7aa6bffed'; 
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// DOM Elements
const inputSearch = document.getElementById('search-input');
const buttonSearch = document.getElementById('search-button');
const containNews = document.getElementById('news-container');
const indicatorLoader = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// Add event listeners
buttonSearch.addEventListener('click', fetchNews);
inputSearch.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        fetchNews();
    }
});

// Fetch news function
async function fetchNews() {
    const query = inputSearch.value.trim();
    
    if (!query) {
        showError('Please enter a stock symbol or company name');
        return;
    }
    
    // Show loading indicator
    indicatorLoader.style.display = 'block';
    containNews.innerHTML = '';
    errorMessage.style.display = 'none';
    
    try {
        // Construct the API URL with the query
        const url = `${NEWS_API_URL}?q=${encodeURIComponent(query)}+stock+finance&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Check if the request was successful
        if (data.status !== 'ok') {
            throw new Error(data.message || 'Failed to fetch news');
        }
        
        // Display the news articles
        displayNews(data.articles);
    } catch (error) {
        showError(`Error fetching news: ${error.message}`);
    } finally {
        // Hide loading indicator
        indicatorLoader.style.display = 'none';
    }
}

// Display news function
function displayNews(articles) {
    // Clear previous results
    containNews.innerHTML = '';
    
    if (!articles || articles.length === 0) {
        showError('No news found for this query');
        return;
    }
    
    // Create HTML for each article
    articles.slice(0, 10).forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
        const publishedDate = new Date(article.publishedAt);
        const formattedDate = publishedDate.toLocaleDateString() + ' ' + publishedDate.toLocaleTimeString();
        
        newsItem.innerHTML = `
            <div class="news-title">${article.title}</div>
            <div class="news-source">${article.source.name} · ${formattedDate}</div>
            <div class="news-description">${article.description || ''}</div>
            <a href="${article.url}" target="_blank" class="news-link">Read full article</a>
        `;
        
        containNews.appendChild(newsItem);
    });
}

// Show error function
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}
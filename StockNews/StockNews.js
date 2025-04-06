// Constants
const NEWS_API_KEY = '6987caceea154109b01379f7aa6bffed'; 
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const newsContainer = document.getElementById('news-container');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// Enhanced sentiment analysis dictionaries
const sentimentDict = {
  // Positive phrases with weights
  positive: {
    // Growth and profit related
    'record high': 3.0, 'all-time high': 3.0, 'beat expectations': 2.5, 'exceed expectations': 2.5,
    'exceeded expectations': 2.5, 'exceeds expectations': 2.5, 'raised guidance': 2.5, 'better than expected': 2.5,
    'strong growth': 2.2, 'revenue growth': 2.0, 'profit growth': 2.0, 'earnings growth': 2.0,
    'market share gain': 2.0, 'dividend increase': 2.0, 'increased dividend': 2.0, 'raising dividend': 2.0,
    'share buyback': 1.8, 'stock repurchase': 1.8, 'return to shareholders': 1.8,
    
    // Ratings related
    'upgrade to buy': 2.2, 'upgraded to outperform': 2.2, 'upgraded to overweight': 2.0,
    'strong buy': 2.5, 'reiterated buy': 1.5, 'reiterated outperform': 1.5,
    
    // Business development
    'new partnership': 1.5, 'strategic acquisition': 1.8, 'successful launch': 1.8,
    'exclusive deal': 1.5, 'market leader': 1.5, 'competitive advantage': 1.5,
    'patent approval': 1.8, 'regulatory approval': 1.8, 'breakthrough technology': 2.0,
    
    // Stock movement
    'shares soared': 1.8, 'stock surged': 1.8, 'rallied': 1.5, 'stock jumped': 1.5,
    'share price increased': 1.2, 'gained ground': 1.2
  },
  
  // Negative phrases with weights
  negative: {
    // Financial problems
    'missed expectations': 2.5, 'below expectations': 2.5, 'lowered guidance': 2.5,
    'profit warning': 3.0, 'earnings warning': 3.0, 'revenue miss': 2.0, 'earnings miss': 2.0,
    'declining revenue': 2.0, 'declining profits': 2.0, 'margin pressure': 1.8,
    'cost pressure': 1.5, 'increased costs': 1.5, 'dividend cut': 2.5, 'suspended dividend': 2.5,
    'negative cash flow': 2.2, 'cash burn': 2.0, 'debt concerns': 2.0,
    
    // Ratings related
    'downgrade to sell': 2.5, 'downgraded to underperform': 2.5, 'downgraded to underweight': 2.0,
    'strong sell': 2.5, 'initiated at sell': 2.0, 'downgraded to neutral': 1.5,
    
    // Business problems
    'restructuring': 1.5, 'laying off': 2.0, 'layoffs': 2.0, 'job cuts': 2.0,
    'factory closure': 2.0, 'store closures': 2.0, 'losing market share': 2.0,
    'product recall': 2.5, 'lawsuit': 1.8, 'legal challenge': 1.8, 'regulatory investigation': 2.0,
    'sec investigation': 2.5, 'accounting issues': 2.5, 'accounting irregularities': 3.0,
    
    // Stock movement
    'shares plunged': 2.2, 'stock crashed': 2.5, 'tumbled': 2.0, 'plummeted': 2.2,
    'sell-off': 2.0, 'share price dropped': 1.5, 'lost value': 1.5
  },
  
  // Context modifiers - words that affect nearby sentiment
  modifiers: {
    // Negations - flip sentiment
    'not': -1, 'no': -1, 'never': -1, 'without': -1, 'lack': -1, 'lacks': -1, 'lacking': -1,
    'failed to': -1, 'unable to': -1, 'doesn\'t': -1, 'does not': -1, 'didn\'t': -1, 'did not': -1,
    'won\'t': -1, 'will not': -1, 'cannot': -1, 'can\'t': -1,
    
    // Intensifiers - amplify sentiment
    'very': 1.5, 'highly': 1.5, 'extremely': 1.8, 'significantly': 1.5, 'substantially': 1.5,
    'sharply': 1.5, 'considerably': 1.4, 'notably': 1.3, 'markedly': 1.3, 'deeply': 1.4,
    
    // Diminishers - reduce sentiment
    'slightly': 0.6, 'marginally': 0.7, 'somewhat': 0.8, 'a bit': 0.7, 'modest': 0.8,
    'minor': 0.7, 'small': 0.8, 'limited': 0.8, 'partially': 0.8
  },
  
  // Industry-specific sentiment terms
  industrySpecific: {
    tech: {
      positive: {'innovation': 1.5, 'disruption': 1.3, 'cloud growth': 1.8, 'digital transformation': 1.5},
      negative: {'security breach': 2.5, 'data leak': 2.3, 'antitrust': 2.0}
    },
    finance: {
      positive: {'interest income': 1.5, 'loan growth': 1.5, 'asset quality': 1.3},
      negative: {'loan loss provisions': 1.8, 'net charge-offs': 1.8, 'non-performing loans': 2.0}
    },
    retail: {
      positive: {'same-store sales growth': 1.8, 'foot traffic increase': 1.5},
      negative: {'inventory glut': 1.8, 'same-store sales decline': 1.8}
    },
    pharma: {
      positive: {'fda approval': 2.5, 'successful trial': 2.3, 'breakthrough designation': 2.0},
      negative: {'clinical trial failure': 3.0, 'patent expiration': 2.0, 'side effects': 2.0}
    }
  }
};

// Add individual keyword lists for backward compatibility
const positiveWords = [
  'growth', 'profit', 'increase', 'rise', 'gain', 'positive', 'success', 'up', 'bull', 'bullish',
  'outperform', 'beat', 'exceed', 'opportunity', 'promising', 'strong', 'strength', 'rally',
  'upgrade', 'recommend', 'buy', 'innovation', 'leader', 'breakthrough', 'launch', 'partnership',
  'expansion', 'dividend', 'surged', 'soared', 'jumped', 'milestone', 'record', 'high', 'revenue'
];

const negativeWords = [
  'loss', 'decline', 'decrease', 'fall', 'drop', 'negative', 'fail', 'down', 'bear', 'bearish',
  'underperform', 'miss', 'below', 'risk', 'warning', 'weak', 'weakness', 'sell', 'downgrade', 
  'avoid', 'struggle', 'trouble', 'debt', 'bankruptcy', 'lawsuit', 'investigation', 'recall', 
  'layoff', 'cut', 'crash', 'plunge', 'plummet', 'uncertainty', 'concern', 'volatile', 'inflation'
];

// Add event listeners
searchButton.addEventListener('click', fetchNews);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        fetchNews();
    }
});

// Hide loading indicator when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadingIndicator.style.display = 'none';
});

// Fetch news function
async function fetchNews() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showError('Please enter a stock symbol or company name');
        return;
    }
    
    // Show loading indicator
    loadingIndicator.style.display = 'block';
    newsContainer.innerHTML = '';
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
        
        // Perform sentiment analysis and display the news articles
        displayNewsWithAnalysis(data.articles, query);
    } catch (error) {
        showError(`Error fetching news: ${error.message}`);
    } finally {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    }
}

// Advanced sentiment analysis
function analyzeSentiment(text, stockName) {
    if (!text) return 5; // Minimum 5% sentiment
    
    // Preprocess text
    const originalText = text;
    text = text.toLowerCase();
    
    // Add stock name to lower case for contextual analysis
    const stockNameLower = stockName ? stockName.toLowerCase() : '';
    
    // Initialize scores
    let sentimentScore = 0;
    let sentimentCount = 0;
    
    // Check for phrases first (more specific)
    let phraseMatches = 0;
    
    // Check positive phrases
    for (const [phrase, weight] of Object.entries(sentimentDict.positive)) {
        if (text.includes(phrase)) {
            // Find all occurrences
            let startPos = 0;
            let phrasePos;
            
            while ((phrasePos = text.indexOf(phrase, startPos)) !== -1) {
                // Check for negations in the preceding words
                const precedingText = text.substring(Math.max(0, phrasePos - 40), phrasePos);
                const words = precedingText.split(/\s+/);
                let multiplier = 1;
                
                // Check last 5 words for modifiers
                for (let i = Math.max(0, words.length - 5); i < words.length; i++) {
                    const word = words[i].trim();
                    if (sentimentDict.modifiers[word]) {
                        if (sentimentDict.modifiers[word] < 0) {
                            // Negation
                            multiplier *= -1;
                        } else {
                            // Intensifier or diminisher
                            multiplier *= sentimentDict.modifiers[word];
                        }
                    }
                }
                
                // Apply sentiment with context
                sentimentScore += weight * multiplier;
                sentimentCount++;
                phraseMatches++;
                
                startPos = phrasePos + phrase.length;
            }
        }
    }
    
    // Check negative phrases
    for (const [phrase, weight] of Object.entries(sentimentDict.negative)) {
        if (text.includes(phrase)) {
            // Find all occurrences
            let startPos = 0;
            let phrasePos;
            
            while ((phrasePos = text.indexOf(phrase, startPos)) !== -1) {
                // Check for negations in the preceding words
                const precedingText = text.substring(Math.max(0, phrasePos - 40), phrasePos);
                const words = precedingText.split(/\s+/);
                let multiplier = 1;
                
                // Check last 5 words for modifiers
                for (let i = Math.max(0, words.length - 5); i < words.length; i++) {
                    const word = words[i].trim();
                    if (sentimentDict.modifiers[word]) {
                        if (sentimentDict.modifiers[word] < 0) {
                            // Negation
                            multiplier *= -1;
                        } else {
                            // Intensifier or diminisher
                            multiplier *= sentimentDict.modifiers[word];
                        }
                    }
                }
                
                // Apply sentiment with context
                sentimentScore -= weight * multiplier;
                sentimentCount++;
                phraseMatches++;
                
                startPos = phrasePos + phrase.length;
            }
        }
    }
    
    // Check for industry-specific phrases if few phrase matches were found
    let industryContext = null;
    
    // Try to determine industry context
    for (const [industry, terms] of Object.entries(sentimentDict.industrySpecific)) {
        for (const term of Object.keys(terms.positive).concat(Object.keys(terms.negative))) {
            if (text.includes(term)) {
                industryContext = industry;
                break;
            }
        }
        if (industryContext) break;
    }
    
    // Apply industry-specific analysis if context was found
    if (industryContext) {
        const industryTerms = sentimentDict.industrySpecific[industryContext];
        
        // Check positive industry terms
        for (const [term, weight] of Object.entries(industryTerms.positive)) {
            if (text.includes(term)) {
                sentimentScore += weight;
                sentimentCount++;
                phraseMatches++;
            }
        }
        
        // Check negative industry terms
        for (const [term, weight] of Object.entries(industryTerms.negative)) {
            if (text.includes(term)) {
                sentimentScore -= weight;
                sentimentCount++;
                phraseMatches++;
            }
        }
    }
    
    // If no phrases matched, fall back to individual word analysis
    if (phraseMatches === 0) {
        const words = text.split(/\s+/);
        let negationActive = false;
        let intensifier = 1.0;
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i].replace(/[.,!?;:'"()\[\]{}]/g, '');
            
            // Check for modifiers
            if (sentimentDict.modifiers[word]) {
                if (sentimentDict.modifiers[word] < 0) {
                    // Negation applies to next few words
                    negationActive = !negationActive;  // Toggle negation state
                    continue;
                } else {
                    // Intensifier/diminisher
                    intensifier = sentimentDict.modifiers[word];
                    continue;
                }
            }
            
            // Reset negation after 3 words
            if (negationActive && i % 3 === 0) {
                negationActive = false;
                intensifier = 1.0;
            }
            
            // Apply word-based sentiment
            if (positiveWords.includes(word)) {
                sentimentScore += (negationActive ? -1 : 1) * intensifier;
                sentimentCount++;
            } else if (negativeWords.includes(word)) {
                sentimentScore -= (negationActive ? -1 : 1) * intensifier;
                sentimentCount++;
            }
            
            // Reset intensifier after each sentiment word
            intensifier = 1.0;
        }
    }
    
    // Calculate final sentiment score
    let finalScore;
    
    if (sentimentCount === 0) {
        // No sentiment detected, default to neutral
        finalScore = 50;
    } else {
        // Calculate normalized score
        // Adjusted to create better distribution between 5-95
        const avgSentiment = sentimentScore / sentimentCount;
        
        // Using improved sigmoid function
        finalScore = 50 + (Math.atan(avgSentiment * 1.5) / (Math.PI/2) * 45);
    }
    
    // Add proximity bonus if stock name is mentioned near strong sentiment terms
    if (stockNameLower) {
        // Find position of stock name in text
        const stockNamePos = text.indexOf(stockNameLower);
        if (stockNamePos >= 0) {
            // Check 10 words before and after for strong sentiment terms
            const contextWindow = text.substring(
                Math.max(0, stockNamePos - 50),
                Math.min(text.length, stockNamePos + stockNameLower.length + 50)
            );
            
            let proximityScore = 0;
            
            // Check for strong positive phrases
            for (const [phrase, weight] of Object.entries(sentimentDict.positive)) {
                if (weight > 1.5 && contextWindow.includes(phrase)) {
                    proximityScore += 5;
                }
            }
            
            // Check for strong negative phrases
            for (const [phrase, weight] of Object.entries(sentimentDict.negative)) {
                if (weight > 1.5 && contextWindow.includes(phrase)) {
                    proximityScore -= 5;
                }
            }
            
            // Apply proximity adjustment
            finalScore += proximityScore;
        }
    }
    
    // Additional considerations if the text is a headline
    if (text === originalText.toLowerCase() && text.length < 150) {
        // Headlines tend to have stronger impact
        finalScore = 50 + ((finalScore - 50) * 1.2);
    }
    
    // Title case check (ALL CAPS or Title Case often indicates important breaking news)
    if (/[A-Z]{2,}/.test(originalText) || 
        (originalText.split(' ').filter(word => word.length > 1 && word[0] === word[0].toUpperCase()).length > 3)) {
        // Amplify sentiment in either direction
        finalScore = 50 + ((finalScore - 50) * 1.3);
    }
    
    // Ensure the score is between 5 and 95
    return Math.max(Math.min(finalScore, 95), 5);
}

// Display news function with sentiment analysis
function displayNewsWithAnalysis(articles, stockName) {
    // Clear previous results
    newsContainer.innerHTML = '';
    
    if (!articles || articles.length === 0) {
        showError('No news found for this query');
        return;
    }
    
    // Calculate overall sentiment
    let overallSentiment = 0;
    let totalWeight = 0;
    const recentWeight = 2.0; // Give even more weight to recent articles
    
    // Analyze each article
    const analyzedArticles = articles.slice(0, 10).map((article, index) => {
        const titleSentiment = analyzeSentiment(article.title, stockName);
        const descriptionSentiment = analyzeSentiment(article.description, stockName);
        const contentSentiment = (titleSentiment * 2 + descriptionSentiment) / 3; // Title has more weight
        
        // Add to overall scores (more weight to recent news)
        const weight = index < 3 ? recentWeight : 1;
        overallSentiment += contentSentiment * weight;
        totalWeight += weight;
        
        return {
            ...article,
            sentiment: contentSentiment
        };
    });
    
    // Calculate final sentiment score
    const finalSentiment = overallSentiment / totalWeight;
    
    // Determine investment recommendation with more granular thresholds
    let recommendation, recommendationClass;
    
    if (finalSentiment > 75) {
        recommendation = "STRONG BUY - The recent news sentiment is very positive for this stock";
        recommendationClass = "positive-recommendation";
    } else if (finalSentiment > 60) {
        recommendation = "BUY - The recent news sentiment is positive for this stock";
        recommendationClass = "positive-recommendation";
    } else if (finalSentiment > 45) {
        recommendation = "HOLD/BUY - The recent news sentiment is moderately positive";
        recommendationClass = "positive-recommendation";
    } else if (finalSentiment > 30) {
        recommendation = "HOLD - The recent news sentiment is neutral to slightly positive";
        recommendationClass = "neutral-recommendation";
    } else if (finalSentiment > 15) {
        recommendation = "HOLD/SELL - The recent news sentiment is moderately negative";
        recommendationClass = "negative-recommendation";
    } else {
        recommendation = "SELL - The recent news sentiment is negative for this stock";
        recommendationClass = "negative-recommendation";
    }
    
    // Create recommendation and sentiment assessment element
    const analysisElement = document.createElement('div');
    analysisElement.className = `recommendation ${recommendationClass}`;
    
    // Create sentiment meter HTML - Circular design that fills from top
    const sentimentPercentage = finalSentiment.toFixed(1);
    const sentimentMeterHTML = `
        <div class="sentiment-assessment">
            <h3>Sentiment Assessment</h3>
            <div class="sentiment-meter-container">
                <div class="sentiment-meter">
                    <div class="sentiment-meter-fill" style="--sentiment-percentage: ${sentimentPercentage}"></div>
                    <div class="sentiment-percentage">${sentimentPercentage}%</div>
                </div>
            </div>
            <div class="sentiment-label">${getSentimentLabel(finalSentiment)}</div>
        </div>
    `;
    
    // Add all elements to the analysis container
    analysisElement.innerHTML = `
        <h2>Investment Analysis for ${stockName}</h2>
        <div class="recommendation-text">${recommendation}</div>
        ${sentimentMeterHTML}
        <div class="disclaimer">This is an automated analysis based on recent news articles only. 
        Always conduct thorough research and consider consulting financial advisors before making investment decisions.</div>
    `;
    
    // Insert at the top of the news container
    newsContainer.appendChild(analysisElement);
    
    // Create HTML for each article
    analyzedArticles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
        const publishedDate = new Date(article.publishedAt);
        const formattedDate = publishedDate.toLocaleDateString() + ' ' + publishedDate.toLocaleTimeString();
        
        // Determine sentiment class and text
        const sentimentScore = article.sentiment.toFixed(1);
        const sentimentInfo = getSentimentInfo(article.sentiment);
        
        newsItem.innerHTML = `
            <div class="news-title">${article.title}</div>
            <div class="news-source">${article.source.name} · ${formattedDate}</div>
            <div class="news-description">${article.description || ''}</div>
            <div class="article-analysis">
                <div class="sentiment ${sentimentInfo.class}">Sentiment: ${sentimentInfo.text} (${sentimentScore}%)</div>
            </div>
            <a href="${article.url}" target="_blank" class="news-link">Read full article</a>
        `;
        
        newsContainer.appendChild(newsItem);
    });
}

// Helper function to get sentiment label based on score
function getSentimentLabel(score) {
    if (score > 75) return "Extremely Positive";
    if (score > 60) return "Very Positive";
    if (score > 45) return "Positive";
    if (score > 30) return "Neutral";
    if (score > 15) return "Negative";
    return "Very Negative";
}

// Helper function to get sentiment info for an article
function getSentimentInfo(score) {
    if (score > 75) {
        return { text: "Extremely Positive", class: "positive-sentiment" };
    } else if (score > 60) {
        return { text: "Very Positive", class: "positive-sentiment" };
    } else if (score > 45) {
        return { text: "Positive", class: "positive-sentiment" };
    } else if (score > 30) {
        return { text: "Neutral", class: "neutral-sentiment" };
    } else if (score > 15) {
        return { text: "Negative", class: "negative-sentiment" };
    } else {
        return { text: "Very Negative", class: "negative-sentiment" };
    }
}

// Show error function
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}
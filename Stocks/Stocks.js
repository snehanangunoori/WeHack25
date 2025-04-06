document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'cvp8741r01qve7inb820cvp8741r01qve7inb82g'; 
    
    // Common stock symbols to fetch
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NFLX', 
                     'JPM', 'BAC', 'WMT', 'DIS', 'NVDA', 'AMD', 'INTC',
                     'PYPL', 'V', 'MA', 'ADBE', 'CRM', 'ORCL', 'IBM'];
    
    // Function to fetch stock data from Finnhub API
    async function fetchStockData() {
        try {
            const stockData = [];
            
            // Finnhub requires individual API calls for each stock
            // Creating all promises first
            const promises = symbols.map(symbol => {
                return fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`API error for ${symbol}: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Add the symbol to the data object
                        return {
                            symbol: symbol,
                            price: data.c.toFixed(2), // Current price
                            change: data.dp.toFixed(1), // Percent change
                            isUp: data.dp >= 0
                        };
                    })
                    .catch(error => {
                        console.error(`Error fetching ${symbol}:`, error);
                        // Return mock data for this symbol if there's an error
                        return generateMockStockData([symbol])[0];
                    });
            });
            
            // Wait for all API calls to complete
            const results = await Promise.all(promises);
            return results;
            
        } catch (error) {
            console.error('Error fetching stock data:', error);
            return generateMockStockData(symbols); // Fallback to mock data on error
        }
    }
    
    // Function to generate mock stock data for demonstration or fallback
    function generateMockStockData(symbols) {
        return symbols.map(symbol => {
            const price = (Math.random() * 1000).toFixed(2);
            const change = (Math.random() * 8 - 4).toFixed(1); // Random between -4% and +4%
            
            return {
                symbol: symbol,
                price: price,
                change: change,
                isUp: parseFloat(change) >= 0
            };
        });
    }
    
    // Function to create ticker rows with stock data
    function createTickerRows(stockData) {
        const tickerElement = document.getElementById('stock-ticker');
        
        // Clear any existing content
        tickerElement.innerHTML = '';
        
        // Create 3 rows of tickers for visual effect
        for (let row = 0; row < 3; row++) {
            const rowElement = document.createElement('div');
            rowElement.className = 'ticker-row';
            
            // Shuffle the stock data differently for each row
            const shuffledStocks = [...stockData].sort(() => Math.random() - 0.5);
            
            // Create ticker items
            shuffledStocks.forEach(stock => {
                const tickerItem = document.createElement('span');
                tickerItem.className = 'ticker-item';
                
                const changeClass = stock.isUp ? 'stock-up' : 'stock-down';
                const arrow = stock.isUp ? '↑' : '↓';
                
                tickerItem.innerHTML = `${stock.symbol} <span class="${changeClass}">$${stock.price} ${arrow}${Math.abs(stock.change)}%</span>`;
                
                rowElement.appendChild(tickerItem);
            });
            
            // Add duplicates to ensure continuous scrolling
            shuffledStocks.forEach(stock => {
                const tickerItem = document.createElement('span');
                tickerItem.className = 'ticker-item';
                
                const changeClass = stock.isUp ? 'stock-up' : 'stock-down';
                const arrow = stock.isUp ? '↑' : '↓';
                
                tickerItem.innerHTML = `${stock.symbol} <span class="${changeClass}">$${stock.price} ${arrow}${Math.abs(stock.change)}%</span>`;
                
                rowElement.appendChild(tickerItem);
            });
            
            tickerElement.appendChild(rowElement);
        }
    }
    
    // Handle API rate limits with a delay between requests
    async function fetchWithDelay(symbols, delayMs = 250) {
        const results = [];
        
        for (const symbol of symbols) {
            try {
                const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
                if (!response.ok) {
                    throw new Error(`API error for ${symbol}: ${response.status}`);
                }
                const data = await response.json();
                
                results.push({
                    symbol: symbol,
                    price: data.c.toFixed(2),
                    change: data.dp.toFixed(1),
                    isUp: data.dp >= 0
                });
                
                // Add delay between requests to respect rate limits
                await new Promise(resolve => setTimeout(resolve, delayMs));
                
            } catch (error) {
                console.error(`Error fetching ${symbol}:`, error);
                results.push(generateMockStockData([symbol])[0]);
            }
        }
        
        return results;
    }
    
    // Initialize the ticker with rate limiting
    async function initializeTicker() {
        // Option 1: Use parallel requests (may hit rate limits)
        // const stockData = await fetchStockData();
        
        // Option 2: Use sequential requests with delay (more reliable)
        const stockData = await fetchWithDelay(symbols);
        
        createTickerRows(stockData);
        
        // Refresh stock data periodically
        setInterval(async () => {
            const updatedStockData = await fetchWithDelay(symbols);
            createTickerRows(updatedStockData);
        }, 60000); // Update every minute (adjust based on API rate limits)
    }
    
    // Start the ticker
    initializeTicker();
});
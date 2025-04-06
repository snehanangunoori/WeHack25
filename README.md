# InvestiBestie

## Inspiration

We noticed that many people want to start investing but feel overwhelmed by the risks and the vast amount of information available. Whether it's choosing the right stock or evaluating a real estate property, making an informed decision can be tough without proper tools. We wanted to create something that acts like a best friend—**InvestiBestie**—to help users feel more confident in their investment decisions by providing clear, accessible, and insightful analysis.

## What it does

InvestiBestie is a user-friendly investment assistant that helps users evaluate both real estate and stock options.

- For **real estate**, users can input details about a property, and the app provides a **risk analysis**, indicating whether the investment might be high-risk or more secure.
- For **stocks**, users can type in the name of a company or a stock symbol, and the app performs **sentiment analysis** by scanning the most recent news articles, identifying positive or negative language to determine public sentiment. Users can also view the actual news articles to explore further.

## How we built it

We built _InvestiBestie_ using **Visual Studio Code** as our IDE and structured the web application with **HTML, CSS, and JavaScript** for the frontend. Our goal was to create a clean, intuitive user interface that makes investment analysis easy to understand, even for beginners.

To power the backend and data analysis:

- We used **NewsAPI** to fetch the latest news articles for stock-related sentiment analysis.
- The **Finnhub API** provided additional financial data for accurate stock evaluation.
- We integrated a **Flask API** to handle backend logic and serve data between components.
- For **real estate risk analysis**, we developed a custom **machine learning model** trained to assess risk levels based on property data input by the user.

These components work together to deliver real-time, insightful results to help users make informed investment decisions.

## Challenges we ran into

One major challenge we faced was integrating our **machine learning model** for real estate risk analysis. The model was saved as a `.pkl` file, but we ran into issues loading it due to **server compatibility problems**—our **Flask API and Firebase** backend weren’t syncing well, which caused delays in getting the model to respond correctly.

Another challenge was with the **sentiment analysis** for stock data. While we were able to fetch news articles successfully, getting consistently **accurate sentiment results** proved difficult. Since our sentiment scoring was based on specific keywords, it sometimes missed the context of the article or misclassified neutral news as positive or negative.

## Accomplishments that we're proud of

- Successfully combining both **stock and real estate investment analysis** into one seamless platform.
- Implementing **real-time sentiment analysis** using news articles and APIs.
- Developing a functioning **ML-based risk assessment** for real estate.
- Creating a clean, beginner-friendly dashboard interface that makes investing more approachable.

## What we learned

Throughout the development of _InvestiBestie_, we gained valuable hands-on experience with several key technologies and concepts:

- **Working with APIs**: We learned how to effectively fetch, parse, and use data from multiple external sources like NewsAPI and Finnhub, handling both successful responses and errors.
- **Firebase Authentication**: We implemented a secure login system using Firebase, which taught us how to manage user authentication and sessions in a real-world application.
- **ML Integration with Flask**: One of the biggest takeaways was learning how to **integrate a machine learning model** into a web application using a **Flask API**, bridging the gap between backend data science and frontend usability.

## What's Next for **InvestiBestie**

- **Enhance Sentiment Analysis**: Integrate more advanced **natural language processing (NLP)** models, such as transformer-based techniques, to better capture context and improve the accuracy of sentiment detection.
- **Expand Real Estate Analysis**: Incorporate additional data points like **neighborhood crime rates**, **school district ratings**, and **historical price trends** to offer more comprehensive investment insights.

- **Portfolio Tracking Feature**: Develop a feature that allows users to track and manage their **real estate investment portfolios**, making it easier to monitor performance and adjust strategies.

- **Mobile-Friendly Experience**: Optimize **InvestiBestie** for mobile devices, ensuring users can access their investment insights on the go. Additionally, explore the possibility of creating a **companion mobile app** to further enhance user experience.

- **Past Investments Tracker**: Implement a tracker that allows users to revisit past investments, analyze trends, and see how well their previous decisions performed.

- **Live Chat with Real Estate Experts**: Introduce a chatbot powered by a **live CBRE representative** to offer real-time advice and personalized recommendations.

- **Personalized Model Training**: Leverage user data to fine-tune the model, ensuring more **accurate, personalized predictions** by pulling relevant data from the user’s investment history and preferences stored in a secure database.

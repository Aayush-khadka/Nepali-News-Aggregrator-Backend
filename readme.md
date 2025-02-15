# Nepali News Aggregator Backend

[Live with Mock Frontend](https://thesamachar.vercel.app/)

The **Nepali News Aggregator** is a backend service designed to scrape, store, and serve news articles from various Nepali news sources in English. It provides a RESTful API to fetch articles by category, source, or individual ID. The backend also features advanced capabilities such as trending news calculation using Large Language Models (LLM) and a search functionality powered by MongoDB Atlas Search. A mock frontend is available, hosted on Vercel, to demonstrate the backend's capabilities.

## Features

- **News Scraping:** Automatically scrapes news articles and metadata from multiple Nepali news sources.
- **Database Storage:** Efficiently stores scraped articles in a MongoDB database for quick querying and retrieval.
- **RESTful API:** Provides endpoints to fetch articles by category, source, or individual ID.
- **Trending News:** Utilizes LLM to dynamically calculate and update trending articles based on titles.
- **Search Functionality:** Allows users to search for articles using MongoDB Atlas Search.
- **Scalable Architecture:** Designed to easily support additional news sources in the future.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with MongoDB Atlas)
- **Web Scraping:** Puppeteer
- **Trending Calculation:** LLM (via Groq SDK)
- **Search:** MongoDB Atlas Search
- **Environment Management:** Dotenv
- **Cron Jobs:** Node-cron (for periodic scraping)
- **Dependency Management:** npm

## API Endpoints

### Articles

- `GET /api/v1/articles/get-latest-articles` - Fetch the latest articles.
- `GET /api/v1/articles/get-article/:id` - Fetch a specific article by ID.
- `GET /api/v1/articles/trending` - Fetch trending articles.
- `GET /api/v1/articles/count` - Get the total count of articles.

### Categories

- `GET /api/v1/category/politics` - Fetch articles in the Politics category.
- `GET /api/v1/category/business` - Fetch articles in the Business category.
- `GET /api/v1/category/national` - Fetch articles in the National category.
- `GET /api/v1/category/sports` - Fetch articles in the Sports category.
- `GET /api/v1/category/society` - Fetch articles in the Society category.
- `GET /api/v1/category/science-tech` - Fetch articles in the Science & Tech category.
- `GET /api/v1/category/opinion` - Fetch articles in the Opinion category.
- `GET /api/v1/category/health` - Fetch articles in the Health category.
- `GET /api/v1/category/world` - Fetch articles in the World category.
- `GET /api/v1/category/art-culture` - Fetch articles in the Art & Culture category.
- `GET /api/v1/category/climate-enviroment` - Fetch articles in the Climate & Environment category.
- `GET /api/v1/category/investigations` - Fetch articles in the Investigations category.

### Sources

- `GET /api/v1/by-source/kathmandu-post` - Fetch articles from The Kathmandu Post.
- `GET /api/v1/by-source/rising-nepal` - Fetch articles from Rising Nepal.

### Search

- `GET /api/v1/search/` - Search for articles using MongoDB Atlas Search.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Aayush-khadka/Nepali-News-Aggregator.git
   cd Nepali-News-Aggregator
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=4000
   CORS_ORIGIN=*
   GROQ_API_KEY=your_groq_api_key
   MONGO_URL=your_mongodb_atlas_url
   ```

4. **Run the application:**
   ```bash
   npm start
   ```

## Configuration

- **Scraping Logic:** The scraping logic is based on the [Nepali News Scraper project](https://github.com/Aayush-khadka/Nepali-News-Scraper).
- **Trending Calculation:** The LLM (via Groq SDK) analyzes article titles to calculate trending scores.
- **Cron Jobs:** The scraper runs periodically using node-cron to fetch new articles.

## Dependencies

### Production

- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling for Node.js.
- `puppeteer`: Headless browser for web scraping.
- `groq-sdk`: SDK for interacting with Groq API (LLM).
- `mongodb`: MongoDB driver for Node.js.
- `dotenv`: Environment variable management.
- `node-cron`: Cron job scheduler for periodic tasks.
- `cors`: Middleware for enabling CORS.

### Development

- `nodemon`: Automatically restarts the server during development.

## Contribution Guidelines

If you would like to contribute to the Nepali News Aggregator project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Create a pull request detailing your changes.

## Contact

For any questions or feedback, feel free to reach out:

- **GitHub:** Aayush-khadka
- **Email:** Khadkaaayush90@gmail.com

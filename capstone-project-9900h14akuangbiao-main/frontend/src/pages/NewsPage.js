import React, { useState, useEffect } from "react";
import "../assets/NewsPage.css"
import { apiGetNews, apiGetNewseID } from "../api/apis";

const itemsPerPage = 8;

// format the date data for better display
function formatDate(dateString) {
  const date = new Date(dateString);
  const form = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleString("en-US", form);
};

export default function NewsPage() {
  console.log('[NewsPage] is being rendered')
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState(null);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      const [ok, data] = await apiGetNews();
      if (ok) {
        console.log('[NewsPage] Request successful.');
        setNews(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } else {
        console.log('[NewsPage] Request failed.')
      }
    };
    fetchNews();
  },[]);

  // Sort the news articles by date in descending order (newest first)
  const sortedNews = news.sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);

  //when user click one of the news, call this function to fetch the news details
  const handleNewsClick = async (newsId) => {
    const [ok,data] = await apiGetNewseID(newsId);
    if (ok) {
      console.log("Successed to fetch news details");
      setSelectedNews(data);
    } else {
      console.error("Failed to fetch news details");
    }
  };
  
  //function to switch the page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  //to display the number of the current page 
  const getCurrentPageNews = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedNews.slice(startIndex, endIndex);
  };

  return (
    <div className="news-page">
      <h1>Top Headlines</h1>
      <div className="news-list">
        {getCurrentPageNews().map((news) => (
          <div key={news.news_id} className="news-item" onClick={() => handleNewsClick(news.news_id)}>
            <h3 className="news-title">{news.title}</h3>
            <h3 className="news-date">{formatDate(news.date)}</h3>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous page
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next page
        </button>
      </div>
      {selectedNews && (
        <div className="modal" onClick={() => setSelectedNews(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* img */} 
            <h2>{selectedNews.title}</h2>
            <p>Author: {selectedNews.author}</p>
            <p>Date: {formatDate(selectedNews.date)}</p>
            <img src={selectedNews.img} alt={selectedNews.title} />
            <p>{selectedNews.details}</p>
            <button onClick={() => setSelectedNews(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};


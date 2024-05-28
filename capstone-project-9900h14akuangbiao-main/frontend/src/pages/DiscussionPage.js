import React, { useState, useEffect } from "react";
import { apiGetAllDiscussions, apiCreateDiscussion } from "../api/apis";
import { getToken } from "../components/Token";
import "../assets/DiscussionPage.css";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { linksMap, router } from "../router/router";
import { generatePath } from "react-router-dom";

const itemsPerPage = 4;

//create a box to show some contents for each article
function DiscussionBox({ discussion }) {
  const create_date = formatDate(discussion.created_at);
  console.log(discussion);

  function handleClick() {
    router.navigate(
      generatePath(linksMap.discussionDetails.path, {
        discussionid: discussion.id,
      })
    );
  }

  return (
    <div className="discussion-box" onClick={handleClick}>
      <div className="discussion-header">
        <span className="author">{discussion.author_name}</span>
        <span className="date">{create_date}</span>
      </div>
      <hr />
      <div className="discussion-content">
        <h3 className="title">{discussion.title}</h3>
        <p className="content">{discussion.content}</p>
      </div>
    </div>
  );
}

// format the date data for better display
function formatDate(dateString) {
  const date = new Date(dateString);
  const form = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleString("en-US", form);
}

export default function DiscussionPage() {
  console.log("[DiscussionPage] is being rendered");
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      const [ok, data] = await apiGetAllDiscussions(getToken());
      if (ok) {
        console.log("[DiscussionPage] Request successful.");
        const results = data.results;
        setArticles(
          results.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
          )
        );
      } else {
        console.log("[DiscussionPage] Request failed.");
      }
    };
    fetchArticle();
  }, []);

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  
	//function to switch the page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
	//to display the number of the current page 
  const getCurrentPageArticles = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return articles.slice(startIndex, endIndex);
  };

  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [open, setOpen] = useState(false);
  const req = {title, content}
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  async function handleSubmit () {
    const [ok, data] = await apiCreateDiscussion(req, getToken());
    console.log(data)
    handleClose()
  }
  return (
    <>
    <div className="discussion-page">
      <div className="discussion-list">
        {getCurrentPageArticles().map((article) => (
          <DiscussionBox key={article.id} discussion={article} />
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous page
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next page
        </button>
      </div>
			<button className="create-article-btn" onClick={handleClickOpen}>Create a forum</button>
    </div>
      <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a new forum</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Feel free to discuss the movies
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => {setTitle(e.target.value)}}
            sx={{marginBottom:'20px'}}
          />
          
          <TextField
            id="outlined-multiline-static"
            label="Content"
            multiline
            rows={4}
            onChange={(e) => {setContent(e.target.value)}}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
    </>
  );
}

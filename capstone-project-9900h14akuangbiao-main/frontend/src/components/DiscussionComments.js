import { useEffect, useState } from "react";
import { getToken } from "./Token";
import {
  apiCreateDiscussionComment,
  apiGetAllDiscussionCommentsByDiscussionID,
} from "../api/apis";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";

export default function DiscussionComments({ discussionid }) {
  const token = getToken();
  const [comments, setComments] = useState({});
  const [myComment, setMyComment] = useState("");
  const [submit, setSubmit] = useState(false);
  console.log(comments);

  useEffect(() => {
    const fetchData = async (discussionid) => {
      const [, comments] = await apiGetAllDiscussionCommentsByDiscussionID(
        token,
        discussionid
      );
      setComments(comments);
      setSubmit(false);
    };

    fetchData(discussionid);
  }, [token, discussionid, submit]);

  async function handleSubmit() {
    const reqBody = {
      content: myComment,
    };
    const [ok, data] = await apiCreateDiscussionComment(
      getToken(),
      discussionid,
      reqBody
    );
    console.log(ok, data);
    setSubmit(true);
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: "90%", md: 700 },
          margin: "3% 0 0 0",
          padding: "0 10px 0 10px",
        }}
      >
        <Typography variant="h6">Write your comment:</Typography>
        <TextField
          value={myComment}
          onChange={(e) => {
            setMyComment(e.target.value);
          }}
          fullWidth
          multiline
          sx={{ margin: "3% 0 0 0" }}
        />
        <Box sx={{ margin: "3% 0 0 0" }}>
          <Button variant="contained" onClick={handleSubmit}>
            submit
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: "90%", md: 700 },
          margin: "3% 0 0 0",
          padding: "0 10px 0 10px",
        }}
      >
        <Typography variant="h6">Comments:</Typography>
        {comments.count !== undefined && comments.count !== 0 && (
          <List sx={{ width: "100%" }}>
            {comments.results.map((comment) => (
              <ListItem key={comment.id}>
                <ItemComment comment={comment} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </>
  );
}

function ItemComment({ comment }) {
  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader
        avatar={<Avatar alt={comment.author_name} />}
        title={comment.author_name ? comment.author_name : "Anonymous User"}
        subheader={`create time: ${
          comment.created_at
            ? new Date(comment.created_at).toLocaleDateString()
            : "no recording time"
        }`}
      />
      <CardContent sx={{ paddingTop: 0 }}>
        <Typography variant="body1" component="p">
          {comment.content}
        </Typography>
      </CardContent>
    </Card>
  );
}

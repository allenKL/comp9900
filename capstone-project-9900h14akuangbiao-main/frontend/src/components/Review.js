import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { linksMap, router } from "../router/router";
import { generatePath, useOutletContext } from "react-router-dom";
import {
  apiCreateMovieIDComment,
  apiGetMovieIDComments,
  apiGetUserProfileByUsername,
  apiUpdateMovieIDComment,
} from "../api/apis";
import { getUsername } from "./Token";

/**
 * Display `MyReview` and `OtherReview`
 */
export default function Review({ movieID }) {
  console.log(`[Review] is being rendered`);
  const [token] = useOutletContext();
  const username = getUsername();

  return (
    <Box>
      {token && <h1>My Review</h1>}
      {token && (
        <MyReview token={token} username={username} movieID={movieID} />
      )}
      <h1>OtherReview</h1>
      <OtherReview username={username} movieID={movieID} />
    </Box>
  );
}

/**
 * User can crud a review and a rating in `MyReview`
 * - Visitor
 *      - When user is visitor, then visitor will see a `Rating`, a `TextField` and a `Submit` button.
 *        When visitor click the `Submit`, `MyReview` will valid the `Rating` and `TextField`.
 *        If they pass the validation, then visitor will see a `LogInPage` because visitor doesn't login.
 *        If visitor login, visitor will become user and will go back to `MyReview`.
 *        After login, please see the User part.
 * - User
 *      - If user haven't leave a review but make a review draft,
 *        then the draft will still remain here.
 *      - If user haven't leave a review and doesn't make a review draft,
 *        then there is a empty `MyReview`.
 *      - If user have leave a review, then user will see the review and
 *        can change or delete the review.
 *      - Submit, Update and Delete will re-render `MyReview`
 * @param token - User token
 */
function MyReview({ token, username, movieID }) {
  console.log(
    `[MyReview] is being rendered, token is ${token}, username is ${username}`
  );

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasComment, setHasComment] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    console.log(`[[MyReview] useEffect()]`);
    if (token && !edit) {
      console.log(`[MyReview] Requesting rating and review data.`);
      async function fetchData() {
        const [status, data] = await apiGetUserProfileByUsername(
          username,
          token
        );
        console.log(status, data);
        if (status === 200) {
          const myComment = data.comments.filter((comment) => {
            return comment.movie === Number(movieID);
          });
          console.log(myComment);
          if (myComment.length !== 0) {
            console.log(`${username} has comment of this movie ${movieID}`);
            const myCommentOfThisMovie = myComment[0];
            console.log(myCommentOfThisMovie);
            setRating(Number(myCommentOfThisMovie.score));
            setComment(myCommentOfThisMovie.content);
            setHasComment(true);
          } else {
            console.log(
              `${username} does not has comment of this movie ${movieID}`
            );
            setRating(0);
            setComment("");
            setHasComment(false);
          }
        }
      }
      fetchData();
    }
  }, [token, username, movieID, hasComment, edit]);

  if (hasComment) {
    if (edit) {
      return (
        <EditMyReview
          token={token}
          movieID={movieID}
          rating={rating}
          setRating={setRating}
          review={comment}
          setReview={setComment}
          setEdit={setEdit}
        />
      );
    } else {
      return (
        <ReadMyReview rating={rating} review={comment} setEdit={setEdit} />
      );
    }
  } else {
    return (
      <WriteMyReview
        token={token}
        movieID={movieID}
        rating={rating}
        setRating={setRating}
        review={comment}
        setReview={setComment}
        setHasReview={setHasComment}
      />
    );
  }
}

function OtherReview({ username, movieID }) {
  console.log(`[OtherReview] is being rendered`);
  const [comments, setComments] = useState([]);
  // console.log(comments);

  useEffect(() => {
    console.log(`[OtherReview] In useEffect(), requesting other reviews.`);
    async function fetchData() {
      const [ok, data] = await apiGetMovieIDComments(movieID);
      console.log(ok, data);
      if (ok) {
        const comments = data.results.filter(
          (comment) => comment.user !== username
        );
        setComments(comments);
      }
    }
    fetchData();
  }, [username, movieID]);

  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id}>
          <OtherComment
            user={comment.user}
            score={comment.score}
            comment={comment.content}
            createTime={comment.create_time}
          />
        </div>
      ))}
    </>
  );
}

function OtherComment({ user, score, comment, createTime }) {
  const creatTimeFormat = new Date(createTime);

  const handleClick = () => {
    router.navigate(
      generatePath(`/${linksMap.profileOthers.path}`, {
        userName: user,
      })
    );
  };

  return (
    <Card variant="outlined" sx={{ marginBottom: "10px" }}>
      <CardActionArea onClick={handleClick}>
        <CardHeader
          avatar={<Avatar src={user} alt={user} />}
          title={user ? user : "Anonymous User"}
          subheader={`Rating: ${score} create time: ${
            createTime
              ? creatTimeFormat.toLocaleDateString()
              : "no recording time"
          }`}
        />
        <CardContent sx={{ paddingTop: 0 }}>
          <Typography variant="body1" component="p">
            {comment}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

/**
 * User can write review in this component.
 * @param token - User token
 */
function WriteMyReview({
  token,
  movieID,
  rating,
  setRating,
  review,
  setReview,
  setHasReview,
}) {
  console.log(`[WriteMyReview] is being rendered`);

  async function handleSubmit(e) {
    e.preventDefault();
    if (token) {
      console.log(
        `[WriteMyReview] Submit user review, rating: ${rating}, review: ${review}`
      );
      const reqBody = {
        movie: movieID,
        score: rating,
        content: review,
      };
      console.log(reqBody);
      const [ok, data] = await apiCreateMovieIDComment(reqBody, token);
      console.log(ok, data);
      if (ok) {
        setRating(data.score);
        setReview(data.content);
        setHasReview(true);
      }
    } else {
      console.log(`[WriteMyReview] Sorry, you aren't login.`);
      router.navigate("/" + linksMap.signIn.path);
    }
  }

  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <BasicMyReview
          rating={rating}
          setRating={setRating}
          review={review}
          setReview={setReview}
        />
        <Button type="submit" variant="contained" sx={{ margin: "5px" }}>
          Submit
        </Button>
      </form>
    </>
  );
}

/**
 * User can read review in this component.
 * @param token - User token
 */
function ReadMyReview({ rating, review, setEdit }) {
  console.log(`[ReadMyReview] is being rendered`);

  function handleClick() {
    console.log(`[ReadMyReview] User want to edit`);
    setEdit(true);
  }

  return (
    <>
      <BasicMyReview rating={rating} review={review} disabled={true} />
      <Button variant="contained" onClick={handleClick} sx={{ margin: "5px" }}>
        Edit
      </Button>
    </>
  );
}

/**
 * User can edit review in this component.
 * @param token - User token
 */
function EditMyReview({
  token,
  movieID,
  rating,
  setRating,
  review,
  setReview,
  setEdit,
}) {
  console.log(`[EditMyReview] is being rendered`);

  async function handleSubmit(e) {
    e.preventDefault();
    // const data = { rating: review, review: review };
    console.log(
      `[EditMyReview] Submit user review, rating: ${rating}, review: ${review}`
    );
    if (token) {
      console.log(
        `[EditMyReview] Submit user review, rating: ${rating}, review: ${review}`
      );
      const reqBody = {
        score: rating,
        content: review,
      };
      console.log(reqBody);
      const [ok, data] = await apiUpdateMovieIDComment(movieID, reqBody, token);
      console.log(ok, data);
      if (ok) {
        setRating(data.score);
        setReview(data.content);
        setEdit(false);
      }
    } else {
      console.log(`[EditMyReview] Sorry, you aren't login.`);
      router.navigate("/" + linksMap.signIn.path);
    }
  }

  function handleCancle(e) {
    e.preventDefault();
    console.log(`[EditMyReview] Cancle edit`);
    setEdit(false);
  }

  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <BasicMyReview
          rating={rating}
          setRating={setRating}
          review={review}
          setReview={setReview}
        />
        <Button variant="contained" type="submit" sx={{ margin: "5px" }}>
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleCancle}
          sx={{ margin: "5px" }}
        >
          Cancle
        </Button>
      </form>
    </>
  );
}

/**
 * Display and change the rating and review
 */
function BasicMyReview({ rating, setRating, review, setReview, disabled }) {
  console.log(rating);
  console.log(typeof rating);
  return (
    <>
      <Typography component="legend">Rating</Typography>
      <Rating
        name="rating"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        max={10}
        disabled={disabled}
      />
      <Box
        sx={{
          width: "100vw",
          maxWidth: "95%",
        }}
      >
        <TextField
          name="myreview"
          label="comment"
          value={review}
          onChange={(e) => {
            setReview(e.target.value);
          }}
          fullWidth
          multiline
          disabled={disabled}
          sx={{ margin: "5px" }}
        />
      </Box>
    </>
  );
}

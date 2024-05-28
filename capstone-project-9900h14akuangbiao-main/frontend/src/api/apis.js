import {
  URL,
  URL_CREATE_MOVIEID_COMMENT,
  URL_GET_MOVIEID,
  URL_GET_MOVIEID_COMMENTS,
  URL_GET_MOVIES,
  URL_USER_LOGIN,
  URL_USER_LOGOUT,
  URL_USER_REGISTER,
  URL_USER_WISHLIST,
  URL_USER_WISHLIST_MOVIEID,
  URL_USER_BANNEDLIST,
  URL_USER_BANNEDLIST_USERID,
  URL_USER_PROFILE_BY_USERNAME,
  URL_UPDATE_MOVIEID_COMMENT,
  URL_GET_RECOMMENDATION_MOVIES,
  URL_CREATE_DISCUSSION,
  URL_GET_ALL_DISCUSSIONS,
  URL_GET_DISCUSSION_BY_ID,
  URL_UPDATE_DISCUSSION_BY_ID,
  URL_DELETE_DISCUSSION_BY_ID,
  URL_CREATE_DISCUSSION_COMMENT,
  URL_GET_DISCUSSION_COMMENTS,
  URL_GET_DISCUSSION_COMMENT_BY_COMMENTID,
  URL_UPDATE_DISCUSSION_COMMENT_BY_ID,
  URL_DELETE_DISCUSSION_COMMENT_BY_ID,
  URL_GET_DIRECTORS,
  URL_GET_GENRES,
  URL_GET_NEWS,
  URL_GET_NEWS_BY_ID,
} from "./api_backend";

/***************************************************************
                          User
***************************************************************/
export async function apiRegister(reqBody) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };
  const response = await fetch(`${URL}${URL_USER_REGISTER}`, init);
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiLogin(reqBody) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };
  const response = await fetch(`${URL}${URL_USER_LOGIN}`, init);
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiLogout(token) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };
  // console.log(init);
  const response = await fetch(`${URL}${URL_USER_LOGOUT}`, init);
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiGetWishlist(token) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };
  // console.log(init);
  const response = await fetch(`${URL}${URL_USER_WISHLIST}`, init);
  // console.log(response);
  const data = await response.json();
  // console.log(data);
  return [response.ok, data];
}

export async function apiIsMovieInWishlist(movieID, token) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };
  // console.log(init);
  // console.log(`${URL}${URL_USER_WISHLIST_MOVIEID.replace("movie_id", movieID)}`);
  const response = await fetch(
    `${URL}${URL_USER_WISHLIST_MOVIEID.replace("movie_id", movieID)}`,
    init
  );
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.status, data];
}

export async function apiUpdateMovieToWishlist(movieID, token) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ movie_id: movieID }),
  };
  // console.log(init);
  // console.log(`${URL}${URL_USER_WISHLIST_MOVIEID.replace("movie_id", movieID)}`);
  const response = await fetch(
    `${URL}${URL_USER_WISHLIST_MOVIEID.replace("movie_id", movieID)}`,
    init
  );
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.status, data];
}

export async function apiGetBannedList(token) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };
  const response = await fetch(`${URL}${URL_USER_BANNEDLIST}`, init);
  const data = await response.json();
  return [response.status, data];
}

export async function apiUpdateBannedlist(userID, token) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ user_id: userID }),
  };
  const response = await fetch(
    `${URL}${URL_USER_BANNEDLIST_USERID.replace("user_id", userID)}`,
    init
  );
  const data = await response.json();

  // console.log("response of update banned list----------", data);
  return [response.status, data];
}

export async function apiUpdateUserProfile(userName, reqBody, token) {
  const init = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(reqBody),
  };
  const response = await fetch(
    `${URL}${URL_USER_PROFILE_BY_USERNAME.replace("username", userName)}`,
    init
  );
  // console.log(response);
  const data = await response.json();
  //console.log("response of update user profile----------", data);
  return [response.status, data];
}

export async function apiGetUserProfileByUsername(username, token) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };
  // console.log(`${URL}${URL_USER_PROFILE_BY_USERNAME.replace("username", username)}`);
  const response = await fetch(
    `${URL}${URL_USER_PROFILE_BY_USERNAME.replace("username", username)}`,
    init
  );
  const data = await response.json();

  // console.log('response of user profile----------',data);
  return [response.status, data];
}

/***************************************************************
                          Movie
***************************************************************/
export async function apiGetMovies(urlSearchParams) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(
    `${URL}${URL_GET_MOVIES}?${urlSearchParams}`,
    init
  );
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiGetMovieID(movieID, wish=false) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  // console.log(`${URL}${URL_GET_MOVIEID.replace("id", movieID)}`);
  const response = await fetch(
    `${URL}${URL_GET_MOVIEID.replace("id", movieID)}`,
    init
  );
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  if (wish) {
    return data
  }
  return [response.ok, data];
}

export async function apiGetMovieIDComments(movieID, token) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) {
    init.headers.Authorization = `Token ${token}`;
  }
  // console.log(`${URL}${URL_GET_MOVIEID_COMMENTS.replace("id", movieID)}`);
  const response = await fetch(
    `${URL}${URL_GET_MOVIEID_COMMENTS.replace("id", movieID)}`,
    init
  );
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiCreateMovieIDComment(reqBody, token) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(reqBody),
  };
  // console.log(
  //   `${URL}${URL_CREATE_MOVIEID_COMMENT.replace("id", reqBody.movie)}`
  // );
  // console.log(init);
  const response = await fetch(
    `${URL}${URL_CREATE_MOVIEID_COMMENT.replace("id", reqBody.movie)}`,
    init
  );
  // console.log(response);
  const data = await response.json();
  // console.log(data);
  return [response.ok, data];
}

export async function apiUpdateMovieIDComment(movieid, reqBody, token) {
  const init = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(reqBody),
  };
  // console.log(`${URL}${URL_UPDATE_MOVIEID_COMMENT.replace("id", movieid)}`);
  // console.log(init);
  const response = await fetch(
    `${URL}${URL_UPDATE_MOVIEID_COMMENT.replace("id", movieid)}`,
    init
  );
  // console.log(response);
  const data = await response.json();
  // console.log(data);
  return [response.ok, data];
}

export async function apiGetRecommendationMovies(token) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };
  const response = await fetch(`${URL}${URL_GET_RECOMMENDATION_MOVIES}`, init);
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiGetDirectors() {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(`${URL}${URL_GET_DIRECTORS}`, init);
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiGetGenres() {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(`${URL}${URL_GET_GENRES}`, init);
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

/***************************************************************
                          News
***************************************************************/
export async function apiGetNews() {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(`${URL}${URL_GET_NEWS}`, init);
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiGetNewseID(newsID) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  // console.log(`${URL}${URL_GET_MOVIEID.replace("id", movieID)}`);
  const response = await fetch(
    `${URL}${URL_GET_NEWS_BY_ID.replace("id", newsID)}`,
    init
  );
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}


/***************************************************************
                          Discussion
***************************************************************/
export async function apiCreateDiscussion(reqBody, token) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(reqBody),
  };
  // console.log(`${URL}${URL_CREATE_DISCUSSION}`);
  // console.log(init);
  const response = await fetch(`${URL}${URL_CREATE_DISCUSSION}`, init);
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiGetAllDiscussions(token) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };
  const response = await fetch(`${URL}${URL_GET_ALL_DISCUSSIONS}`, init);
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiGetDiscussionByID(token, discussionID) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };
  const response = await fetch(
    `${URL}${URL_GET_DISCUSSION_BY_ID.replace("id", discussionID)}`,
    init
  );
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiUpdateDiscussionByID(token, discussionID, reqBody) {
  const init = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(reqBody),
  };
  // console.log(`${URL}${URL_UPDATE_DISCUSSION_BY_ID.replace("id", discussionID)}`);
  // console.log(init);
  const response = await fetch(
    `${URL}${URL_UPDATE_DISCUSSION_BY_ID.replace("id", discussionID)}`,
    init
  );
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiDeleteDiscussionByID(token, discussionID) {
  const init = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };
  // console.log(`${URL}${URL_DELETE_DISCUSSION_BY_ID.replace("id", discussionID)}`);
  // console.log(init);
  const response = await fetch(
    `${URL}${URL_DELETE_DISCUSSION_BY_ID.replace("id", discussionID)}`,
    init
  );
  // console.log(response);
  return [response.ok, {}];
}

export async function apiCreateDiscussionComment(token, discussionID, reqBody) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(reqBody),
  };
  // console.log(
  //   `${URL}${URL_CREATE_DISCUSSION_COMMENT.replace("id", discussionID)}`
  // );
  // console.log(init);
  const response = await fetch(
    `${URL}${URL_CREATE_DISCUSSION_COMMENT.replace("id", discussionID)}`,
    init
  );
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiGetAllDiscussionCommentsByDiscussionID(
  token,
  discussionID
) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };
  const response = await fetch(
    `${URL}${URL_GET_DISCUSSION_COMMENTS.replace("id", discussionID)}`,
    init
  );
  // console.log(response);
  const data = await response.json();
  // console.log(data);
  return [response.ok, data];
}

export async function apiGetDiscussionCommentByCommentID(token, commentID) {
  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };
  // console.log(
  //   `${URL}${URL_GET_DISCUSSION_COMMENT_BY_COMMENTID.replace("id", commentID)}`
  // );
  const response = await fetch(
    `${URL}${URL_GET_DISCUSSION_COMMENT_BY_COMMENTID.replace("id", commentID)}`,
    init
  );
  // console.log(response);
  const data = await response.json();
  // console.log(data);
  return [response.ok, data];
}

export async function apiUpdateDiscussionCommentByID(
  token,
  commentID,
  reqBody
) {
  const init = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(reqBody),
  };
  // console.log(`${URL}${URL_UPDATE_DISCUSSION_COMMENT_BY_ID.replace("id", commentID)}`);
  // console.log(init);
  const response = await fetch(
    `${URL}${URL_UPDATE_DISCUSSION_COMMENT_BY_ID.replace("id", commentID)}`,
    init
  );
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  return [response.ok, data];
}

export async function apiDeleteDiscussionCommentByID(token, commentID) {
  const init = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };
  // console.log(`${URL}${URL_DELETE_DISCUSSION_COMMENT_BY_ID.replace("id", commentID)}`);
  // console.log(init);
  const response = await fetch(
    `${URL}${URL_DELETE_DISCUSSION_COMMENT_BY_ID.replace("id", commentID)}`,
    init
  );
  // console.log(response);
  return [response.ok, {}];
}

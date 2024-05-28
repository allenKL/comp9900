export const URL = "http://127.0.0.1:8000";

/**
 * User APIs
 */
export const URL_USER_REGISTER = "/user/register/";
export const URL_USER_LOGIN = "/user/login/";
export const URL_USER_LOGOUT = "/user/logout/";
export const URL_USER_WISHLIST = "/user/waitlist/";
export const URL_USER_WISHLIST_MOVIEID = "/user/waitlist/movie_id/";
export const URL_USER_BANNEDLIST = "/user/ban/";
export const URL_USER_BANNEDLIST_USERID = "/user/ban/user_id/";

export const URL_USER_PROFILE_BY_USERNAME = "/user/profile/username/";

/**
 * Movie APIs
 */
export const URL_GET_MOVIES = "/movie/";
export const URL_GET_MOVIEID = "/movie/id/";
export const URL_GET_DIRECTORS = "/movie/director_search/";
export const URL_GET_GENRES = "/movie/genres_search/";
export const URL_GET_MOVIEID_COMMENTS = "/movie/id/comments/";
export const URL_UPDATE_MOVIEID_COMMENT = "/movie/id/comments/update/";
export const URL_CREATE_MOVIEID_COMMENT = "/movie/id/comments/create/";
export const URL_GET_RECOMMENDATION_MOVIES = "/movie/reco_movie/";

/**
 * Discussion APIs
 */
export const URL_CREATE_DISCUSSION = "/forum/posts/";
export const URL_GET_ALL_DISCUSSIONS = "/forum/posts/";
export const URL_GET_DISCUSSION_BY_ID = "/forum/posts/id/";
export const URL_UPDATE_DISCUSSION_BY_ID = "/forum/posts/id/";
export const URL_DELETE_DISCUSSION_BY_ID = "/forum/posts/id/";
export const URL_CREATE_DISCUSSION_COMMENT = "/forum/posts/id/comments/";
export const URL_GET_DISCUSSION_COMMENTS = "/forum/posts/id/comments/";
export const URL_GET_DISCUSSION_COMMENT_BY_COMMENTID = "/forum/comments/id/";
export const URL_UPDATE_DISCUSSION_COMMENT_BY_ID = "/forum/comments/id/";
export const URL_DELETE_DISCUSSION_COMMENT_BY_ID = "/forum/comments/id/";

/**
 * News APIs
 */
export const URL_GET_NEWS = "/movie/news/";
export const URL_GET_NEWS_BY_ID = "/movie/news/id/";

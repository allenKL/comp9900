import { createBrowserRouter } from "react-router-dom";
import App from "../components/App";
import BrowsePage from "../pages/BrowsePage";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import LogInPage from "../pages/LogInPage";
import ProfilePage from "../pages/ProfilePage";
import SignUpPage from "../pages/SignUpPage";
import WishListPage from "../pages/WishListPage";
import BannedListPage from "../pages/BannedListPage";
import DetailsPage from "../pages/DetailsPage";
import NewsPage from "../pages/NewsPage";
import DiscussionPage from "../pages/DiscussionPage";
import ProfileOthers from "../pages/ProfileOthers";
import DiscussionDetailsPage from "../pages/DiscussionDetailsPage";

export const linksMap = {
  home: { name: "home", path: "/", element: <HomePage /> },
  browse: {
    name: "browse",
    path: "browse",
    element: <BrowsePage />,
  },
  wishlist: {
    name: "wish list",
    path: "wish-list",
    element: <WishListPage />,
  },
  signIn: {
    name: "sign in",
    path: "sign-in",
    element: <LogInPage />,
  },
  signUp: {
    name: "sign up",
    path: "sign-up",
    element: <SignUpPage />,
  },
  movieDetails: {
    name: "movie details",
    path: "browse/:movieId",
    element: <DetailsPage />,
  },
  profile: {
    name: "profile",
    path: "profile",
    element: <ProfilePage />,
  },
  profileOthers: {
    name: "profileothers",
    path: "profile-others/:userName",
    element: <ProfileOthers />,
  },
  bannedList: {
    name: "banned list",
    path: "banned-list",
    element: <BannedListPage />,
  },
  news: {
    name: "news",
    path: "news",
    element: <NewsPage />,
  },
  discussion: {
    name: "discussion",
    path: "discussion",
    element: <DiscussionPage />,
  },
  discussionDetails: {
    name: "discussion",
    path: "discussion/:discussionid",
    element: <DiscussionDetailsPage />,
  },
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      linksMap.home,
      linksMap.browse,
      linksMap.wishlist,
      linksMap.news,
      linksMap.discussion,
      linksMap.signIn,
      linksMap.signUp,
      linksMap.movieDetails,
      linksMap.bannedList,
      linksMap.profile,
      linksMap.profileOthers,
      linksMap.discussionDetails,
    ],
  },
]);

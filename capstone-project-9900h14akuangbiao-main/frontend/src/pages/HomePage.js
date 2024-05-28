import { Divider, Typography } from "@mui/material";
import { MoviePosters, NewMovies, TopMovies } from "../components/Movie";

/**
 * This component defines the `Home Page` of the `App`, including:
 * 1. Movie posters
 * 2. New movie list
 * 3. Top movie list
 */
export default function HomePage() {
  return (
    <>
      <MoviePosters />
      <Divider textAlign="left">
        <Typography variant="h3">NEW</Typography>
      </Divider>
      <NewMovies />
      <Divider textAlign="left">
        <Typography variant="h3">TOP</Typography>
      </Divider>
      <TopMovies />
    </>
  );
}

// import function to register Swiper custom elements
import { useEffect, useState } from "react";
import { generatePath, Link } from "react-router-dom";
import { register } from "swiper/element/bundle";
import { linksMap } from "../router/router";
import { posters } from "../test/fakedata";
import { apiGetMovies } from "../api/apis";
import { Card, CardMedia } from "@mui/material";
// register Swiper custom elements
register();

/**
 * Movie Posters Swiper
 */
export function MoviePosters() {
  console.log(`[MoviePosters] is being rendered`);

  const [data, setData] = useState(posters);

  useEffect(() => {
    console.log(
      `[MoviePosters] In useEffect(), requesting movie posters data.`
    );
    setData(posters);
  }, []);

  return (
    <swiper-container navigation="true" loop="true">
      {data.map((poster) => (
        <swiper-slide key={poster.id}>
          <img alt={poster.alt} src={poster.src} width={"100%"} />
        </swiper-slide>
      ))}
    </swiper-container>
  );
}

/**
 * Display New Movies
 */
export function NewMovies() {
  console.log(`[NewMovies] is being rendered`);

  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(`[NewMovies] In useEffect(), requesting new movies data.`);
    async function fetchData() {
      const [ok, data] = await apiGetMovies();
      if (ok) {
        setData(data.results);
      }
    }
    fetchData();
  }, []);

  return <MovieListH data={data} />;
}

/**
 * Display Top Movies
 */
export function TopMovies() {
  console.log(`[TopMovies] is being rendered`);

  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(`[TopMovies] In useEffect(), requesting top movies data.`);
    async function fetchData() {
      const [ok, data] = await apiGetMovies();
      if (ok) {
        setData(data.results.reverse());
      }
    }
    fetchData();
  }, []);

  return <MovieListH data={data} />;
}

/**
 * Display movies horizontally.
 */
export function MovieListH({ data }) {
  return (
    <swiper-container
      navigation="true"
      slides-per-view="auto"
      space-between={30}
      loop="true"
      style={{ margin: "2% 5% 0 5%" }}
    >
      {data.map((movie) => (
        <swiper-slide key={movie.id} style={{ width: "auto" }}>
          <Card
            key={movie.id}
            sx={{ "&:hover": { transform: "scale(1.2)", opacity: 0.5 }, margin: "0 10px 0 0" }}
          >
            <CardMedia
              sx={{
                height: { xs: 150, sm: 258 },
                width: { xs: 100, sm: 180 },
              }}
              image={movie.poster}
              title={movie.name}
              component={Link}
              to={generatePath(`/${linksMap.movieDetails.path}`, {
                movieId: movie.id,
              })}
            />
          </Card>
        </swiper-slide>
      ))}
    </swiper-container>
  );
}

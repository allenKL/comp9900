import { Form, Link, useSearchParams, generatePath } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardMedia,
  Pagination,
  Stack,
  TextField,
} from "@mui/material";
import { linksMap } from "../router/router";
import { apiGetDirectors, apiGetGenres, apiGetMovies } from "../api/apis";

/**
 * Display the searching or browsing movies.
 * 1. Click the `BROWSE` button will jump in this page, showing a director
 *    list, a genre list and the 1st page movies.
 * 2. Use `Search` will display the searching movies.
 * 3. Use `Director` and `Genre` selector will display related movies.
 * 4. Refresh the page will render the URL query movies.
 * 5. Click the `back` or `forward` button on browser will render the URL query movies.
 *
 * Summarize, `BrowsePage` will display movies according to the URL query.
 */
export default function BrowsePage() {
  console.log(`[BrowsePage] is being rendered`);

  const [data, setData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.toString());
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log(
      `[BrowsePage] In useEffect(), requesting browsing movie data. Browsing data is ${
        searchParams.toString() === "" ? '""' : searchParams.toString()
      }`
    );
    async function fetchData() {
      const [ok, data] = await apiGetMovies(searchParams.toString());
      console.log(ok, data);
      if (ok) {
        setData(data.results);
        setCount(Math.ceil(data.count / 10));
      }
    }
    fetchData();
  }, [searchParams]);

  return (
    <>
      <Form method="get">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            margin: {xs : "2% 5% 0 5%", lg: "2% 20% 0 20%"},
          }}
        >
          <BrowseInput type={"director__icontains"} />
          <BrowseInput type={"genres__icontains"} />
          <Button type="submit" variant="contained">
            BROWSE
          </Button>
        </Box>
      </Form>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          margin: {xs : "2% 5% 0 5%", lg: "2% 20% 0 20%"},
        }}
      >
        {data &&
          data.map((movie) => (
            <Card
              key={movie.id}
              sx={{
                margin: "0 10px 20px 10px",
                "&:hover": { transform: "scale(1.2)", opacity: 0.5 },
              }}
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
          ))}
      </Box>
      <Stack
        spacing={2}
        sx={{
          alignItems: "center",
          margin: "0 5% 0 5%",
        }}
      >
        <Pagination
          count={count}
          page={page}
          onChange={(event, value) => {
            setPage(value);
            if (searchParams.get("page")) {
              searchParams.set("page", value);
              setSearchParams(searchParams);
            } else {
              searchParams.append("page", value);
              setSearchParams(searchParams);
            }
          }}
          color="primary"
          size="large"
        />
      </Stack>
    </>
  );
}

/**
 * Selections of `Browse Page`
 */
function BrowseInput({ type }) {
  const [data, setData] = useState([]);
  const [searchParams] = useSearchParams();
  const searchValue =
    searchParams.get(type) === "" ? null : searchParams.get(type);
  const [value, setValue] = useState(searchValue);
  console.log(`[BrowseInput ${type}] is being rendered, ${type} is ${value}`);

  // This useEffect() is used to initialize the `Input` data.
  useEffect(() => {
    async function fetchData() {
      if (type === "director__icontains") {
        const [, data] = await apiGetDirectors();
        setData(data);
      } else {
        const [, data] = await apiGetGenres();
        setData(data);
      }
    }
    fetchData();
  }, [type]);

  // This useEffect() is used to response to the `Input` selection.
  useEffect(() => {
    setValue(searchValue);
  }, [searchValue]);

  return (
    <Autocomplete
      options={data}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue === "" ? null : newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={type}
          label={type === "genres__icontains" ? "Genres" : "Directors"}
        />
      )}
      sx={{ margin: "0 10px 0 10px", width: { xs: "120px", sm: "300px" } }}
    />
  );
}

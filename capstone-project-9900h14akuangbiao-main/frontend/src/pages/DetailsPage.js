import { Link, generatePath, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Review from "../components/Review";
import { getToken } from "../components/Token";
import {
  apiGetMovieID,
  apiUpdateMovieToWishlist,
  apiGetWishlist,
  apiGetRecommendationMovies,
} from "../api/apis";
import { Box, Button, Typography } from "@mui/material";
import { linksMap } from "../router/router";
import { MovieListH } from "../components/Movie";

//since some data may be NULL or empty, I create this function to filter the details data
const shouldDisplay = (value) => {
  if (!value) return false;
  const upperCaseValue = value.toString().toUpperCase();
  return upperCaseValue !== "NONE";
};

export default function DetailsPage() {
  const navigate = useNavigate()
  console.log(`[DetailsPage] is being rendered`);
  const [detail, setDetail] = useState({});
  const movieid = useParams();
  const [myWishList, setWishList] = useState([]);
  const [recommendation, setRecommendation] = useState([]);

  //getMyWish();
  async function handleLike(id) {
    await apiUpdateMovieToWishlist(id, getToken());
    const data = await apiGetWishlist(getToken());
    setWishList(data[1]);
  }
  async function getWish () {
    const data = await apiGetWishlist(getToken());
    setWishList(data[1]);
  }
  // Fetch movie details data
  useEffect(() => {
    const fetchData = async () => {
      console.log(`[DetailsPage] requesting movie details data.`);
      const [ok, data] = await apiGetMovieID(movieid.movieId);
      if (ok) {
        console.log(`[DetailsPage] Request successful.`);
        setDetail(data);
      } else {
        console.error(`[DetailsPage] Request failed.`);
      }
    };
    fetchData();
    getWish()
  }, [movieid.movieId]);

  useEffect(() => {
    const fetchRecommendation = async () => {
      const [ok, data] = await apiGetRecommendationMovies(getToken());
      if (ok) {
        console.log(data);
        setRecommendation(data);
      }
    };
    fetchRecommendation();
  }, [movieid.movidID]);

  //the data format of the genres is a list, and I use ',' to connect them to display the genres better
  const genresDisplay = detail?.genres?.length > 0 ? detail.genres.join(', ') : 'Not available';



  return (
    <div>
      <h1>Movie Details: {detail.name} </h1>
      <div
        id="details_box"
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          left: "175px",
        }}
      >
        <img alt={detail.name} src={detail.poster} width="270" height="400" />
        <table
          cellSpacing={25}
          style={{ display: "flex", position: "relative", left: "200px" }}
        >
          <tbody align="left">
            {shouldDisplay(detail.average_rating) && (
              <tr>
                <th style={{ textAlign: "left" }}>Rating:</th>
                <td style={{ textAlign: "right" }}>{detail.average_rating}</td>
              </tr>
            )}
            {shouldDisplay(detail.genres) && (
              <tr>
                <th style={{ textAlign: "left" }}>Genre:</th>
                <td style={{ textAlign: "right" }}>{genresDisplay}</td>
              </tr>
            )}
            {shouldDisplay(detail.original_language) && (
              <tr>
                <th style={{ textAlign: "left" }}>Original Language:</th>
                <td style={{ textAlign: "right" }}>
                  {detail.original_language}
                </td>
              </tr>
            )}
            {shouldDisplay(detail.director) && (
              <tr>
                <th style={{ textAlign: "left" }}>Director:</th>
                <td style={{ textAlign: "right" }}>{detail.director}</td>
              </tr>
            )}
            {shouldDisplay(detail.producer) && (
              <tr>
                <th style={{ textAlign: "left" }}>Producer:</th>
                <td style={{ textAlign: "right" }}>{detail.producer}</td>
              </tr>
            )}
            {shouldDisplay(detail.writer) && (
              <tr>
                <th style={{ textAlign: "left" }}>Writer:</th>
                <td style={{ textAlign: "right" }}>{detail.writer}</td>
              </tr>
            )}
            {detail.streaming_date && (
              <tr>
                <th style={{ textAlign: "left" }}>Streaming date:</th>
                <td style={{ textAlign: "right" }}>{detail.streaming_date}</td>
              </tr>
            )}
            {shouldDisplay(detail.run_time) && (
              <tr>
                <th style={{ textAlign: "left" }}>Runtime:</th>
                <td style={{ textAlign: "right" }}>{detail.run_time}</td>
              </tr>
            )}
            {shouldDisplay(detail.distributor) && (
              <tr>
                <th style={{ textAlign: "left" }}>Distributor:</th>
                <td style={{ textAlign: "right" }}>{detail.distributor}</td>
              </tr>
            )}
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                {getToken()
                  ? (<>
                    {myWishList.some(
                      (wishedMovie) => wishedMovie.id === detail.id
                    ) ? (
                      <Button
                        variant="contained"
                        style={{ marginLeft: "10px", marginBottom: "20px" }}
                        onClick={() => {
                          handleLike(detail.id);
                        }}
                      >
                        Remove from wish list
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        style={{ marginLeft: "10px", marginBottom: "20px" }}
                        onClick={() => {
                          handleLike(detail.id);
                        }}
                      >
                        Add to my wish list
                      </Button>
                    )}
                    </>
                  )
                  : (
                    <Button
                    variant="contained"
                    style={{ marginLeft: "10px", marginBottom: "20px" }}
                    onClick={() => {
                      navigate('/sign-in');
                    }}
                  >
                    Add to my wish list
                  </Button>
                  )}
                
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Typography variant="h4" sx={{ margin: "2% 5% 0 5%" }}>
        Recommendation:
      </Typography>
      {recommendation && <MovieListH data={recommendation} />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "2% 5% 0 5%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", sm: "90%", md: 700 },
            padding: "0 10px 0 10px",
          }}
        >
          <Review movieID={movieid.movieId} />
        </Box>
      </Box>
    </div>
  );
}

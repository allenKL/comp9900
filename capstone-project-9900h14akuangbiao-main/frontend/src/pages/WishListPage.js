import '../assets/wishlist.css';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../components/Token';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useState, useEffect} from "react";
import { apiGetMovieID, apiGetWishlist, apiUpdateMovieToWishlist } from '../api/apis';

/* This page render the wishlist page,
it will display all the user's favorate
movies.
*/ 
export default function WishListPage () {
    const navigate = useNavigate()
    const [movies, setMovies] = useState([]);
    async function unLike (event,id) {
        event.stopPropagation();
        await apiUpdateMovieToWishlist(id,getToken())
        setMovies(movies.filter(movie => movie.id !== id))
    };
    async function getData() {
        const data = await apiGetWishlist(getToken());
        const movieDetailPromises = data[1].map((moviesD) =>
            apiGetMovieID(moviesD.id, true)
        );
        const movieDetail = await Promise.all(movieDetailPromises);
        setMovies(movieDetail);
    }
    useEffect(() => {
        if (!getToken()) {
            navigate('/sign-in')
        } else {
            getData();
        } 
    });
    return (
        <>
            <div>
                <h1 style={{margin:'5% 0 0 5%'}}>My wish list:</h1>
            </div>
            <div className="layout">
                {movies.length > 0 
                ? 
                (
                <>
                { movies.map((movie)=>( 
                    <div className="card" key={movie.id} >
                        <Card sx={{ 
                            width: 200, 
                            height:350, cursor: 'pointer',
                            transition: 'transform 0.3s',
                            ':hover': {
                                transform: 'scale(1.1)',
                            },}} onClick={ () => { navigate(`/browse/${movie.id}`) }}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="220"
                                    image={movie.poster}
                                    alt="image"
                                    sx={{ objectFit: "fill" }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="subtitle1" component="div" height={40}>
                                        {movie.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button variant="contained" size="small" color="primary" sx={{marginLeft:'60%'}} onClick={(e) => unLike(e,movie.id)}>
                                    Remove
                                </Button>
                            </CardActions>
                        </Card>
                        
                    </div>
                ))
                }
                </>
                ) 
                :(
                    <h2 style={{margin:'20% 45%'}}>No result</h2>
                )}
                
            </div>
        </>
    );
}

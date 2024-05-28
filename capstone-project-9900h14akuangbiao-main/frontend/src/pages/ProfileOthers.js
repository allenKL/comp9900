import '../assets/profile.css';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../components/Token';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea} from '@mui/material';
import { useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import defaultProfile from '../assets/default-profile.png';
import { timeConvert } from '../components/TimeConvert';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { 
    apiGetUserProfileByUsername, 
    apiUpdateBannedlist, 
    apiUpdateMovieToWishlist,
    apiGetBannedList,
    apiGetWishlist,
    apiGetMovieID,
} from '../api/apis';

/* This page render other users' profile,
it will display that user's comments and
wishlist, the logged-in user can add this 
user to the banned list.
*/ 
const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectPosition: "center -7px",
    objectFit: 'cover', 
});
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function ProfileOthers () {
    const { userName } = useParams();
    const navigate = useNavigate()
    const [userInfo, setInfo] = useState([]);
    const [show, setShow] = useState(false);
    const [showWishlist, setShowWishlist] = useState([]);
    const [bannedUsers, setBanned] = useState([]);
    const [myWishList, setWishList] = useState([]);
    async function getBanned () {
        const data = await apiGetBannedList(getToken())
        setBanned(data[1])
    }
    async function getMyWish () {
        const data = await apiGetWishlist(getToken())
        setWishList(data[1])
    }
    async function getData (username) {
        const data = await apiGetUserProfileByUsername(username,getToken())
        setInfo(data[1])
        getBanned();
        getMyWish();
    }
    async function handleLike(e,id) {
        e.stopPropagation();
        await apiUpdateMovieToWishlist(id, getToken());
        const data = await apiGetWishlist(getToken());
        setWishList(data[1]);
    }
    async function handleShowWishlist (wishlist) {
        const movieDetailPromises = wishlist.map((moviesD) =>
            apiGetMovieID(moviesD.id, true)
        );
        const movieDetail = await Promise.all(movieDetailPromises);
        setShowWishlist(movieDetail);
        setShow(!show)
    };
    async function handleBanned (id) {
        await apiUpdateBannedlist(id,getToken())
        const data = await apiGetBannedList(getToken())
        setBanned(data[1])
    };
    useEffect(() => {
        getData(userName);
        
    }, []);
    return (
        <>
            <div>
                <Paper
                sx={{
                    p: 2,
                    margin: 'auto',
                    marginTop: '50px',
                    flexGrow: 1,
                    backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
                style={{width: '50%', height:'30%',paddingTop: '5%',paddingBottom: '5%'}}
                >
                    <Grid container spacing={8}  >
                        <Grid item>
                            <ButtonBase sx={{ width: 128, height: 128}} style={{marginLeft:'20px'}}>
                                <Img src={userInfo.profile_pic || defaultProfile} />
                            </ButtonBase>
                        </Grid>
                        
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={3}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="subtitle1" component="div">
                                        <h2>{userInfo.username}</h2>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}  >
                        <Grid item style={{display:'flex'}}>
                                <Button variant="contained" style={{marginLeft:'320px', marginBottom:'-20px'}} onClick={() => {handleShowWishlist(userInfo.waitlist)}}>Wish list</Button>
                                {getToken() 
                                    ? <>
                                        {bannedUsers.some(banned => banned.id === userInfo.id) 
                                            ? (
                                            <Button variant="contained" style={{marginLeft:'10px',marginBottom:'-20px'}} onClick={() => {handleBanned(userInfo.id)}}>Remove from banned list</Button>
                                            ) : (
                                                <Button variant="contained" style={{marginLeft:'10px',marginBottom:'-20px'}} onClick={() => {handleBanned(userInfo.id)}}>Add to banned list</Button>
                                            )}
                                    </>
                                    : (
                                        <Button variant="contained" style={{marginLeft:'10px',marginBottom:'-20px'}} onClick={() => {navigate('/sign-in')}}>Add to banned list</Button>
                                    )}
                                
                                
                        </Grid>
                    </Grid>
                </Paper>
            
            </div>
            {
            // click wish list botton action
            show ? (
                    <div>
                    <Grid container spacing={0} style={{ width: "50%", margin: "auto", paddingTop: "20px" }}>
                        <Grid item xs={12}>
                        <Item style={{ textAlign: "left" }}>Wishlist:</Item>
                        </Grid>
                    </Grid>
                    <div className="layout">
                    {showWishlist.length !== 0 ? (
                        showWishlist.map((movie) => (
                        <div className="card" key={movie.id}>
                            <Card sx={{ 
                            width: 200, 
                            height:350, cursor: 'pointer',
                            transition: 'transform 0.3s',
                            ':hover': {
                                transform: 'scale(1.1)',
                            },}} onClick={ () => { navigate(`/browse/${movie.id}`) }} key={movie.id}>
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
                                    {getToken() 
                                        ? <>
                                            {myWishList.some(wishedMovie => wishedMovie.id === movie.id) ? (
                                            <Button variant="contained" style={{width: '90%', marginLeft:'10px',marginBottom:'20px'}} onClick={(e) => {handleLike(e,movie.id)}}>Remove from wish list</Button>
                                            ) : (
                                                <Button variant="contained" style={{width: '90%',margin:'0 0 20px 10px'}} onClick={(e) => {handleLike(e,movie.id)}}>Add to my wish list</Button>
                                            )}
                                        </>
                                        : (
                                            <Button variant="contained" style={{width: '90%',margin:'0 0 20px 10px'}} onClick={(e) => {navigate('/sign-in')}}>Add to my wish list</Button>
                                        )}
                            </Card>
                        </div>
                        ))
                    ) : (
                        <h1 style={{margin:'0 0 0 45%'}}>No result</h1>
                    )}</div>
                    </div>
                ) : (
                    <Grid container spacing={0} style={{ width: "50%", margin: "auto", paddingTop: "20px" }}>
                    <Grid item xs={12}>
                        <Item style={{ textAlign: "left" }}>Reviews:</Item>
                    </Grid>
                    {bannedUsers.some(banned => banned.id === userInfo.id) 
                        ? (<h3 style={{margin:'auto',paddingTop:'50px'}}>Comments have been hidden</h3>)
                        : (
                            <>
                            {userInfo.comments 
                                ? (userInfo.comments.length !== 0 
                                    ? (userInfo.comments.map((comment) => (
                                            <Grid key={comment.id} container spacing={0} style={{width:'100%', margin:'auto'}}>
                                                <Grid item xs={12} sx={{ 
                                                                cursor: 'pointer',
                                                                transition: 'transform 0.3s',
                                                                ':hover': {
                                                                    transform: 'scale(1.1)',
                                                                },}} onClick={ () => { navigate(`/browse/${comment.movie}`) }}>
                                                    <Item style={{
                                                                display: 'flex',
                                                                width: '100%', 
                                                                marginTop:'20px',
                                                                textAlign: 'left'
                                                            }}>
                                                            <DialogContent sx={{width:'100%', height:'100%'}}>
                                                                <DialogContentText>
                                                                {`Comment:  ${comment.content}`}
                                                                </DialogContentText>
                                                                <DialogContentText>
                                                                {`Score:  ${comment.score}`}
                                                                </DialogContentText>
                                                                <DialogContentText style={{ fontSize: '12px' }}>
                                                                {timeConvert(comment.create_time)}
                                                                </DialogContentText>
                                                            </DialogContent>
                                                            <DialogContent>
                                                            </DialogContent>
                                                    </Item>
                                                </Grid>
                                            </Grid>
                                    ))
                                    ) 
                                    : (
                                        <h2 style={{margin:'auto'}}>No result</h2>
                                        )
                                ) 
                                : 
                                ( <h2 style={{margin:'auto'}}>Loading...</h2>
                                )}
                    </>)}
                    </Grid>
                )
            }
        </>
    );
}

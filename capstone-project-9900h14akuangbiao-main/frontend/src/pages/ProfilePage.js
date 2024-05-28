import '../assets/profile.css';
import {getToken} from '../components/Token';
import {Button} from '@mui/material';
import {useState, useEffect} from "react";
import * as React from 'react';
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import defaultProfile from '../assets/default-profile.png';
import TextField from '@mui/material/TextField';
import {apiGetMovieID, apiGetUserProfileByUsername, apiUpdateMovieIDComment, apiUpdateUserProfile} from '../api/apis';
import {timeConvert} from '../components/TimeConvert';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {fileToDataUrl} from '../components/FileConvert';

/* This page render the logged-in user's profile,
it will display all the user's comments. The user
can edit the comments or the username and avtar
*/ 
const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectPosition: "center -7px",
    objectFit: 'cover'
});
const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
}));

export default function ProfilePage() {
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('')
    const [userInfo, setInfo] = useState([]);
    const [open, setOpen] = useState(false);
    const [scoreC, setScoreC] = useState('')
    const [contentC, setContentC] = useState('')
    const [movieDetail, setMovieDetail] = useState('')
    const [movieIdC, setMovieIdC] = useState('')
    const [openC, setOpenC] = useState(false);
    const reqC = {
        score: scoreC,
        content: contentC
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const userName = window.localStorage.getItem('userName');
    // Edit profile
    async function handleFormSubmit(event) {
        setOpen(false);
        event.preventDefault();
        const req = {
            email,
            profile_pic: image
        }
        const newData = await apiUpdateUserProfile(userName, req, getToken())
        setInfo(newData[1]);
    }
    async function getData(username) {
        const data = await apiGetUserProfileByUsername(username, getToken())
        setInfo(data[1])
    }
    useEffect(() => {
        getData(userName);
    });
    async function handleUpload(file) {
        const base64 = await fileToDataUrl(file)
        setImage(base64)
    }
    const handleClickOpenC = () => {
        setOpenC(true);
    };
    const handleCloseC = () => {
        setOpenC(false);
    };
    async function handleSubmitC() {
        await apiUpdateMovieIDComment(movieIdC, reqC, getToken());
        handleCloseC()
    }
    async function handleEditComment(id) {
        handleClickOpenC()
        setMovieIdC(id)
        const detail = await apiGetMovieID(id)
        setMovieDetail(detail[1])
    };
    return (
        <>
            <Dialog open={openC}
                onClose={handleCloseC}>
                <DialogTitle>Edit your comment</DialogTitle>
                <DialogContent>
                    <DialogContentText> {
                        `Movie name: ${
                            movieDetail.name
                        }`
                    } </DialogContentText>
                    <TextField autoFocus margin="dense" id="name" label="Score" type="email" fullWidth variant="standard"
                        onChange={
                            (e) => {
                                setScoreC(e.target.value)
                            }
                        }
                        sx={
                            {marginBottom: '20px'}
                        }/>
                    <TextField id="outlined-multiline-static" label="Comment" multiline
                        rows={4}
                        onChange={
                            (e) => {
                                setContentC(e.target.value)
                            }
                        }
                        fullWidth/>
                </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseC}>Cancel</Button>
                <Button onClick={
                    () => {
                        handleSubmitC(movieIdC)
                    }
                }>Submit</Button>
            </DialogActions>
        </Dialog>
        {
        (
            <Dialog open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title"
                    sx={
                        {width: '100%'}
                }>
                    Update your profile
                </DialogTitle>
                <DialogContent>
                    <TextField label='Email'
                        onChange={
                            (e) => {
                                setEmail(e.target.value)
                            }
                        }/>
                </DialogContent>
            <DialogContent>
                <IconButton color="primary" aria-label="upload picture" component="label">
                    <input hidden accept="image/*" type="file"
                        onChange={
                            (e) => {
                                handleUpload(e.target.files[0])
                            }
                        }/>
                    <PhotoCamera/>
                </IconButton>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={handleFormSubmit}
                    autoFocus>Submit</Button>
            </DialogActions>
        </Dialog>
        )
    }
        <div>
            <Paper sx={
                    {
                        p: 2,
                        margin: 'auto',
                        marginTop: '50px',
                        flexGrow: 1,
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
                    }
                }
                style={
                    {
                        width: '50%',
                        height: '30%',
                        paddingTop: '5%',
                        paddingBottom: '5%'
                    }
            }>
                <Grid container
                    spacing={8}>
                    <Grid item>
                        <ButtonBase sx={
                            {
                                width: 128,
                                height: 128,
                                marginTop: '10px',
                                marginLeft: '20px'
                            }
                        }>
                            <Img src={
                                userInfo.profile_pic || defaultProfile
                            }/>
                        </ButtonBase>
                    </Grid>
                    <Grid item
                        xs={12}
                        sm
                        container>
                        <Grid item xs container direction="column"
                            spacing={3}>
                            <Grid item xs>
                                <Typography gutterBottom variant="subtitle1" component="div">
                                    {
                                    userInfo.username
                                } </Typography>
                                <Typography variant="body2" gutterBottom
                                    style={
                                        {paddingTop: '40px'}
                                }>
                                    {
                                    userInfo.email
                                } </Typography>
                            </Grid>
                            <Grid item>
                                <Button variant="contained"
                                    style={
                                        {
                                            marginLeft: '80%',
                                            marginBottom: '-40px'
                                        }
                                    }
                                    onClick={handleClickOpen}>Edit</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
        <Grid container
            spacing={0}
            style={
                {
                    width: '50%',
                    margin: 'auto',
                    paddingTop: '20px'
                }
        }>
            <Grid item
                xs={12}>
                <Item style={
                    {textAlign: 'left'}
                }>My reviews:</Item>
            </Grid>
            {
            userInfo.comments ? (userInfo.comments.length !== 0 ? (userInfo.comments.map((comment) => (
                <Grid key={
                        comment.id
                    }
                    container
                    spacing={0}
                    style={
                        {
                            width: '100%',
                            margin: 'auto'
                        }
                }>
                    <Grid item
                        xs={12}>
                        <Item style={
                            {
                                display: 'flex',
                                width: '100%',
                                marginTop: '20px',
                                textAlign: 'left'
                            }
                        }>
                            <DialogContent sx={
                                {
                                    width: '100%',
                                    height: '100%'
                                }
                            }>
                                <DialogContentText> {
                                    `Comment:  ${
                                        comment.content
                                    }`
                                } </DialogContentText>
                                <DialogContentText> {
                                    `Score:  ${
                                        comment.score
                                    }`
                                } </DialogContentText>
                                <DialogContentText style={
                                    {fontSize: '12px'}
                                }>
                                    {
                                    timeConvert(comment.create_time)
                                } </DialogContentText>
                            </DialogContent>
                            <DialogContent>
                                <Button variant="contained"
                                    sx={
                                        {marginTop: '25%'}
                                    }
                                    onClick={
                                        () => {
                                            handleEditComment(comment.movie)
                                        }
                                }>
                                    Edit
                                </Button>
                            </DialogContent>
                        </Item>
                    </Grid>
                </Grid>
            ))) : (
                <h2 style={
                    {margin: '30px auto'}
                }>No result</h2>
            )) : (
                <h2>Loading...</h2>
            )
        } </Grid>
    </>
    );
}

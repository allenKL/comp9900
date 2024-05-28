import '../assets/profile.css';
import {Link} from 'react-router-dom';
import {getToken} from '../components/Token';
import {Button} from '@mui/material';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ButtonBase from '@mui/material/ButtonBase';
import {useState, useEffect} from "react";
import {apiGetBannedList, apiUpdateBannedlist} from '../api/apis';
import defaultProfile from '../assets/default-profile.png';

/* This page render the banned list page.
All the banned user will appear here, the
user can remove the banned user from banned
list or view the banned user's profile
*/ 

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    alignItems: 'center',
    color: theme.palette.text.secondary,
    padding: '10px',
    marginTop: '20px'
}));
const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectPosition: "center -7px",
    objectFit: 'cover'
});

export default function BannedListPage() {
    const [bannedUsers, setBanned] = useState([]);
    async function handleRemove(id) {
        const response = await apiUpdateBannedlist(id, getToken())
        setBanned(bannedUsers.filter(bannedUser => bannedUser.id !== id))
        console.log('update banned list response :==========', response);
    };
    async function getData() {
        const data = await apiGetBannedList(getToken())
        setBanned(data[1])
    }
    useEffect(() => {
        getData();
    }, []);
    return (
        <>
            <div>
                <h1 style={
                    {margin: '5% 0 0 5%'}
                }>My banned list:</h1>
            </div>
            {
            bannedUsers.length > 0 ? (
                <> {
                    bannedUsers.map((bannedUser) => (
                        <Box sx={
                                {flexGrow: 1}
                            }
                            key={
                                bannedUser.id
                        }>
                            <Grid container
                                spacing={0}
                                style={
                                    {
                                        width: '60%',
                                        margin: 'auto'
                                    }
                            }>
                                <Grid item
                                    xs={12}>
                                    <Item>
                                        <div style={
                                            {
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                width: '100%'
                                            }
                                        }>
                                            <div>
                                                <ButtonBase sx={
                                                    {
                                                        width: 70,
                                                        height: 70,
                                                        borderRadius: '50%'
                                                    }
                                                }>
                                                    <Img src={
                                                        bannedUser.profile_pic || defaultProfile
                                                    }/>
                                                </ButtonBase>
                                                <Link to={
                                                        `/profile-others/${
                                                            bannedUser.username
                                                        }`
                                                    }
                                                    style={
                                                        {
                                                            textDecoration: 'none',
                                                            color: 'inherit',
                                                            paddingLeft: '50px'
                                                        }
                                                }>
                                                    {
                                                    bannedUser.username
                                                } </Link>
                                            </div>
                                            <Button variant="contained"
                                                onClick={
                                                    () => {
                                                        handleRemove(bannedUser.id)
                                                    }
                                            }>
                                                Remove
                                            </Button>
                                        </div>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Box>
                    ))
                } </>
            ) : (
                <h2 style={
                    {margin: '15% 45%'}
                }>No result</h2>
            )
        } </>
    );
}

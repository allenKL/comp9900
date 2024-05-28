import "../assets/login.css";
import {Button} from "@mui/material";
import {useState} from "react";
import {linksMap, router} from "../router/router";
import {apiRegister} from "../api/apis";

/* This page render the registration page,
it needs user input a valid email, name and
password. Once register sucseeds, it will
navigate to login page
*/ 
export default function SignUpPage() {
    console.log(`[SignUpPage] is being rendered`);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirm_password) {
            alert('The two entered passwords do not match, try again.')
        }
        console.log(`[SignUpPage] Signing up, email: ${email}, username: ${username}, password: ${password}, confirm_password: ${confirm_password}`);
        const req = {
            email: email,
            username: username,
            password: password,
            confirm_password: confirm_password
        };
        const [ok, data] = await apiRegister(req)
        if (ok) {
            console.log(`[SignUpPage] Request successful`);
            // To make a URL an absolute path, add a forward slash (/) at the beginning of the URL.
            router.navigate("/" + linksMap.signIn.path);
        } else {
            console.log(data)
        }
    }
    return (
        <div className="auth-form">
            <form method="post"
                onSubmit={handleSubmit}>
                <div className="auth-form-header">
                    <h2>Join Moviehub</h2>
                </div>
                <div className="auth-form-body">
                    <div className="login-field">
                        <div className="username-field">
                            <label>
                                Email address
                            </label>
                            <input className="username-input" type="text" name="email"
                                value={email}
                                onChange={
                                    (e) => {
                                        setEmail(e.target.value);
                                    }
                                }/>
                        </div>
                    <div className="username-field">
                        <label>
                            Username</label>
                        <input className="username-input" type="text" name="username"
                            value={username}
                            onChange={
                                (e) => {
                                    setUsername(e.target.value);
                                }
                            }/>
                    </div>
                <div className="password-field">
                    <label>
                        Password
                    </label>
                    <input className="password-input" type="password" name="password"
                        value={password}
                        onChange={
                            (e) => {
                                setPassword(e.target.value);
                            }
                        }/>
                </div>
            <div className="password-field">
                <label>Confirm Password
                </label>
                <input className="password-input" type="password" name="confirm_password"
                    value={confirm_password}
                    onChange={
                        (e) => {
                            setConfirmPassword(e.target.value);
                        }
                    }/>
            </div>
        <div className="submit-field">
            <Button variant="contained" color="success" fullWidth type="submit">
                Sign up
            </Button>
        </div>
    </div>
</div></form></div>
    );
}

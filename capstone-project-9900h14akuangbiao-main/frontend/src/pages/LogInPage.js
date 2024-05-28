import "../assets/login.css";
import {Button} from "@mui/material";
import {useState} from "react";
import {Link, useOutletContext} from "react-router-dom";
import {saveToken} from "../components/Token";
import {linksMap, router} from "../router/router";
import {apiLogin} from "../api/apis";

/* This page render the login page, it needs to user 
input correct username and password, the user can 
navigate to register page by clicking the link
'create an account'
*/ 
export default function LogInPage() {
  //data initiate
  console.log(`[LogInPage] is being rendered`);
  const [, setToken] = useOutletContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit(e) {
      e.preventDefault();
      console.log(`[LogInPage] Log in, username: ${username}, password: ${password}`);
      const req = {
          username: username,
          password: password
      };
      const [ok, data] = await apiLogin(req)
      if (ok) {
          console.log(`[LogInPage] Request successful. Token is ${
              data.data.token
          }`);
          saveToken(data.data.token);
          setToken(data.data.token);
          window.localStorage.setItem('userName', data.data.username);
          window.localStorage.setItem('userId', data.data.user_id);
          router.navigate(linksMap.home.path);
      } else {
          console.log(data);
          alert('Invalid password')
      }
  }
  return (
      <div className="auth-form">
          <form method="post"
              onSubmit={handleSubmit}>
              <div className="auth-form-header">
                  <h2>Sign in to Moviehub</h2>
              </div>
              <div className="auth-form-body">
                  <div className="login-field">
                      <div className="username-field">
                          <label>
                              Username or email address
                          </label>
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
              <div className="submit-field">
                  <Button variant="contained" color="success" fullWidth type="submit">
                      Sign in
                  </Button>
              </div>
          </div>
      </div>
  </form>
  <div className="register-field">
      <p>
          New to Moviehub?
          <Link to="/sign-up">Create an account.</Link>
      </p>
  </div>
</div>
  );
}

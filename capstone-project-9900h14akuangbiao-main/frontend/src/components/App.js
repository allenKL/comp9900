import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useState } from "react";
import { getToken } from "./Token";

/**
 * This component define the commom layouts like Header, Main, Footer of the App.
 */
function App() {
  // console.log(`[App] is being rendered`);
  const [token, setToken] = useState(getToken());
  // console.log(
  //   `[App] current token is ${token}, the App is ${
  //     token ? "User" : "Visitor"
  //   } mode`
  // );

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Header token={token} setToken={setToken} />
      <Box flexGrow="1">
        {/* 
        https://reactrouter.com/en/main/components/outlet 
        An <Outlet> should be used in parent route elements to render their 
        child route elements. This allows nested UI to show up when child routes 
        are rendered. If the parent route matched exactly, it will render a child 
        index route or nothing if there is no index route.
        */}
        <Outlet context={[token, setToken]} />
      </Box>
    </Box>
  );
}

export default App;

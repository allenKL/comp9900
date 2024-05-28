import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, matchPath, useLocation } from "react-router-dom";
import { linksMap, router } from "../router/router";
import Logo from "./Logo";
import Search from "./Search";
import ThemeSwitcher from "./ThemeSwitcher";
import { removeToken } from "./Token";
import { apiLogout } from "../api/apis";

/**
 * This component is a responsive `Header` of the `App`.
 */
export default function Header({ token, setToken }) {
  // console.log(`[Header] is being rendered`);

  const links = {
    navigation: [
      linksMap.home,
      linksMap.browse,
      linksMap.wishlist,
      linksMap.news,
      linksMap.discussion,
    ],
    visitor: [linksMap.signIn, linksMap.signUp],
    user: [linksMap.wishlist, linksMap.profile, linksMap.bannedList],
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {/* <HeaderWindow links={links} token={token} setToken={setToken} />
          <HeaderMobile links={links} token={token} setToken={setToken} /> */}
          <Box display="flex" width="100vw">
            {/* For window size */}
            <Box flexGrow={1} display={{ xs: "none", sm: "flex" }}>
              <Logo />
              <LinksButton links={links.navigation} />
            </Box>
            {/* For mobile size */}
            <Box flexGrow={1} display={{ xs: "block", sm: "none" }}>
              <HeaderMenu
                componentName="NavMenu"
                links={links.navigation}
                icon={<MenuIcon />}
              />
            </Box>
            <Search />
            <ThemeSwitcher />
            {/* For window size */}
            <Box display={{ xs: "none", sm: "flex" }}>
              {token ? (
                <HeaderMenu
                  componentName="UserMenu"
                  links={links.user}
                  token={token}
                  setToken={setToken}
                  icon={<AccountCircle />}
                />
              ) : (
                <LinksButton links={links.visitor} />
              )}
            </Box>
            {/* For mobile size */}
            <Box display={{ xs: "block", sm: "none" }}>
              {token ? (
                <HeaderMenu
                  componentName="UserMenu"
                  links={links.user}
                  token={token}
                  setToken={setToken}
                  icon={<AccountCircle />}
                />
              ) : (
                <HeaderMenu
                  componentName="VisitorMenu"
                  links={links.visitor}
                  icon={<AccountCircle />}
                />
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      {/* 
        https://mui.com/material-ui/react-app-bar/#fixed-placement
        Fixed placement
        When you render the app bar position fixed, 
        the dimension of the element doesn't impact the rest of the page. 
        This can cause some part of your content to be invisible, behind the app bar. 
        Here are 3 possible solutions:
            1. You can use position="sticky" instead of fixed. ⚠️ sticky is not supported by IE11.
            2. You can render a second <Toolbar /> component:
                <AppBar ></AppBar>
                <Toolbar />
            3. You can use theme.mixins.toolbar CSS.
      */}
      <Toolbar />
    </>
  );
}

function LinksButton({ links }) {
  // console.log(`[LinksButton] is being rendered`);
  let location = useLocation();
  const firstSlashIndex = location.pathname.indexOf("/");
  if (firstSlashIndex !== -1) {
    const secondSlashIndex = location.pathname.indexOf(
      "/",
      firstSlashIndex + 1
    );
    if (secondSlashIndex !== -1) {
      console.log(`The second slash is at index ${secondSlashIndex}`);
      location.pathname = location.pathname.substring(0, secondSlashIndex);
    }
  }

  return (
    <>
      {links.map((link) => (
        <Button
          key={link.name}
          variant={
            matchPath(link.path, location.pathname) ? "contained" : "text"
          }
          color={matchPath(link.path, location.pathname) ? "error" : "inherit"}
          sx={{ whiteSpace: "nowrap", minWidth: "auto" }}
          component={RouterLink}
          to={link.path}
        >
          {link.name.toUpperCase()}
        </Button>
      ))}
    </>
  );
}

function HeaderMenu({ componentName, links, token, setToken, icon }) {
  // console.log(`[${componentName}] is being rendered`);
  const location = useLocation();

  const [anchorElMenu, setAnchorElMenu] = useState(null);

  const openMenu = Boolean(anchorElMenu);

  function handleOpenMenu(event) {
    setAnchorElMenu(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorElMenu(null);
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleOpenMenu}>
        {icon}
      </IconButton>
      <Menu anchorEl={anchorElMenu} open={openMenu} onClose={handleCloseMenu}>
        {links.map((link) => (
          <MenuItem key={link.name} onClick={handleCloseMenu}>
            <Button
              variant={
                matchPath(link.path, location.pathname) ? "contained" : "text"
              }
              color={
                matchPath(link.path, location.pathname) ? "error" : "inherit"
              }
              sx={{ whiteSpace: "nowrap", minWidth: "auto" }}
              component={RouterLink}
              to={link.path}
            >
              {link.name}
            </Button>
          </MenuItem>
        ))}
        {componentName === "UserMenu" && (
          <MenuItem key={"sign out"}>
            <SignOut token={token} setToken={setToken} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

function SignOut({ token, setToken }) {
  // console.log(`[SignOut] is being rendered`);

  async function handleSignOut() {
    console.log(`[SignOut] User click sign out, with token: ${token}`);
    console.log(`[SignOut] Request backend to remove the token: ${token}`);

    const [ok, data] = await apiLogout(token);
    if (ok) {
      console.log(data);
      console.log(`[SignOut] Removing the token...`);
      removeToken();
      setToken(null);
      window.localStorage.removeItem("userName");
      window.localStorage.removeItem("userId");
      console.log(`[SignOut] Token, ${token}, is removed`);
      console.log(`[SignOut] Navigate to LogInPage`);
      router.navigate(linksMap.signIn.path);
    }
  }

  return (
    <Button
      sx={{ color: "inherit", whiteSpace: "nowrap", minWidth: "auto" }}
      onClick={handleSignOut}
    >
      {"sign out"}
    </Button>
  );
}

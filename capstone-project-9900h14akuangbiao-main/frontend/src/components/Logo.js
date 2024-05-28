import { ReactComponent as LogoSvg } from "../assets/logo.svg";
import { IconButton, SvgIcon } from "@mui/material";

function Logo({ fontSize = "medium" }) {
  return (
    <IconButton>
      <SvgIcon component={LogoSvg} fontSize={fontSize} inheritViewBox />
    </IconButton>
  );
}

export default Logo;

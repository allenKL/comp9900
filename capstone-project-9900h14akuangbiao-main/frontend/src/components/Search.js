import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Form, useSearchParams } from "react-router-dom";
import { linksMap } from "../router/router";
import { useEffect, useState } from "react";

/**
 * Search movie and jump to `Browse Page`.
 */
export default function Search() {
  const [searchParams] = useSearchParams();
  const searchValue =
    searchParams.get("search") === null ? "" : searchParams.get("search");
  const [value, setValue] = useState(searchValue);
  // console.log(`[Search] is being rendered, search value is ${value}`);

  useEffect(() => {
    setValue(searchValue);
  }, [searchValue]);

  return (
    <Form method="get" role="search" action={linksMap.browse.path}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search Movies"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        type="search"
        name="search"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </Form>
  );
}

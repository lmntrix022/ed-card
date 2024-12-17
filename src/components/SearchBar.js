import React from 'react';
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ value, onChange }) => {
  return (
    <TextField
      label="Rechercher"
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "56px",
          backgroundColor: "transparent",
          "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
          "&:hover fieldset": { borderColor: "rgb(219, 39, 119)" },
        },
      }}
    />
  );
};

export default SearchBar;

import React, { Component } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

class Header extends Component {
  render() {
    return (
      <div className="App">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" style={{ maxWidth: "100%" }}>
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, padding: 1.5 }}
            >
              Migration App
            </Typography>
          </AppBar>
        </Box>
      </div>
    );
  }
}

export default Header;

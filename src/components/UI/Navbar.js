import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const handleSubscribe = () => {
    navigate("/subscription");
  };

  const handleBrandClick = () => {
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          style={{ cursor: "pointer" }}
          onClick={handleBrandClick}
        >
          ImageHub
        </Typography>
        <div>
          <Button color="inherit" onClick={handleSubscribe}>
            Subscription
          </Button>
          <Button
            color="inherit"
            onClick={handleLogout}
            endIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

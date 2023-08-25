import React from "react";
import { Typography } from "@mui/material";

const footerStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "#111",
  color: "#fff",
  textAlign: "center",
  padding: "10px 0",
};

const Footer = () => {
  return (
    <div style={footerStyle}>
      <Typography variant="body2">
        &copy; {new Date().getFullYear()}{" "}
        <a
          href="https://chandanchoudhury.in/"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "none", color: "#87CEFA" }}
        >
          chandanchoudhury.in
        </a>{" "}
        . All rights reserved.
      </Typography>
    </div>
  );
};

export default Footer;

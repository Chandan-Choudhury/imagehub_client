import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import Footer from "../UI/Footer";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const setToken = useStore((state) => state.setToken);
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${config.API_URL}/login`,
        JSON.stringify({ email, password, recaptchaValue }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const accessToken = response?.data?.token;
      sessionStorage.setItem("token", accessToken);
      sessionStorage.setItem("userId", response?.data?.userId);
      sessionStorage.setItem("name", response?.data?.name);
      sessionStorage.setItem("email", response?.data?.email);
      setToken(accessToken);
      history("/");
    } catch (err) {
      console.log("Catch block", err);
      setError(true);
      setErrorMessage(err?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(false);
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xs">
        <Typography
          variant="h4"
          sx={{ textAlign: "center", marginTop: "100px" }}
        >
          Log In
        </Typography>
        <Snackbar
          open={error}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            autoFocus
            required
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            id="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            fullWidth
          />
          <ReCAPTCHA
            sitekey={config.RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: 120 }}
            disabled={isLoading || !recaptchaValue}
          >
            {isLoading ? (
              <CircularProgress size={22} color="success" />
            ) : (
              "Log In"
            )}
          </Button>
          <Typography variant="h6">
            Don't have an account?{" "}
            <a href="/signup" style={{ textDecoration: "none" }}>
              Sign Up
            </a>{" "}
            here.
          </Typography>
        </form>
      </Container>
      <Container maxWidth="xs">
        <Typography
          variant="h6"
          sx={{ textAlign: "center", marginTop: "100px" }}
        >
          Information
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ textAlign: "center" }}
          gutterBottom
        >
          <b>To login with Demo account use:</b>
          <br />
          Email: johndoe@example.com
          <br /> Password: Johndoe@123
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default LoginForm;

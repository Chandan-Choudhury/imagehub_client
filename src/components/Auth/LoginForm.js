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
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        JSON.stringify({ email, password }),
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: 120 }}
            disabled={isLoading}
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
    </>
  );
};

export default LoginForm;

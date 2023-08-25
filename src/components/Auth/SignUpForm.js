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
import config from "../../config";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const setToken = useStore((state) => state.setToken);
  const history = useNavigate();

  const handleSignup = async (e) => {
    console.log("signup process started");
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${config.API_URL}/signup`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
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
          Sign Up
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
        <form onSubmit={handleSignup}>
          <TextField
            label="Full Name"
            id="name"
            autoFocus
            required
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
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
            required
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ width: 120 }}
          >
            {isLoading ? (
              <CircularProgress size={22} color="success" />
            ) : (
              "Sign Up"
            )}
          </Button>
          <Typography variant="h6">
            Already have an account?{" "}
            <a href="/login" style={{ textDecoration: "none" }}>
              Sign In
            </a>{" "}
            here.
          </Typography>
        </form>
      </Container>
    </>
  );
};

export default SignUpForm;

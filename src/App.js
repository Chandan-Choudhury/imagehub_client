import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./store";
import SignUpForm from "./components/Auth/SignUpForm";
import LoginForm from "./components/Auth/LoginForm";
import Home from "./containers/Home";
import Stripe from "./components/Subscription/Stripe";
import jwtDecode from "jwt-decode";

function App() {
  const token = useStore((state) => state.token);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.exp) {
        const currentTime = Date.now();
        const expiryTime = decodedToken.exp * 1000;
        const timeUntilExpiry = expiryTime - currentTime;
        const autoLogoutTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);
        const timer = setTimeout(handleAutoLogout, autoLogoutTime);
        return () => clearTimeout(timer);
      }
    }
  }, [token]);

  const handleAutoLogout = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <Routes>
      <Route exact={true} path="/signup" element={<SignUpForm />} />
      <Route exact={true} path="/login" element={<LoginForm />} />
      <Route
        path="/"
        element={token ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        exact={true}
        path="/subscription"
        element={token ? <Stripe /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;

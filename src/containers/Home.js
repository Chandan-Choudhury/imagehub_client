import React, { useState, useEffect } from "react";
import { Typography, Container, Paper } from "@mui/material";
import ImageUpload from "../components/Image/ImageUpload";
import ImageGrid from "../components/Image/ImageGrid";
import Navbar from "../components/UI/Navbar";
import axios from "axios";
import moment from "moment";
import config from "../config";

const Home = () => {
  const [user, setUser] = useState({});
  const [isExpired, setIsExpired] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const accessToken = sessionStorage.getItem("token");
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/fetch-user-details/${userId}`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );

        const timestamp = response.data.expiryOfSubscription;
        const formattedDuration = calculateFormattedDuration(timestamp);

        setUser({
          ...response.data,
          formattedDuration: formattedDuration,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const calculateFormattedDuration = (timestamp) => {
      if (timestamp) {
        const expiryDate = moment(timestamp, "YYYYMMDDHHmmssSSS");
        const currentDate = moment();
        const duration = moment.duration(expiryDate.diff(currentDate));

        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();

        return `${days} Days ${hours} hours ${minutes} minutes`;
      }
      return "";
    };

    if (user.expiryOfSubscription) {
      const expiryDate = moment(user.expiryOfSubscription, "YYYYMMDDHHmmssSSS");
      const currentDate = moment();
      setIsExpired(currentDate.isAfter(expiryDate));
    } else {
      setIsExpired(true);
    }

    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.expiryOfSubscription]);
  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Typography
          variant="h4"
          align="center"
          sx={{ marginBottom: 2, marginTop: 2 }}
        >
          Welcome {user.name} to ImageHub!
        </Typography>
        {user.expiryOfSubscription && (
          <>
            <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
              Your Pro subscription will expire in {user.formattedDuration}
            </Typography>
            <hr />
            <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
              {" "}
              You are a Pro member, hence you can upload 5 images at once (no
              hourly limit & max. upload size is 10 MB).
            </Typography>
          </>
        )}
        {isExpired && (
          <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
            {" "}
            You are not a Pro member, hence you can upload single image at once
            in one hour (Max. file size 2 MB). <br />
            For just $5/month or ₹449/month, you may subscribe to have the cap
            lifted.{" "}
          </Typography>
        )}

        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
          <ImageUpload />
        </Paper>

        <Typography variant="h6" sx={{ marginTop: 3 }}>
          Your Uploaded Images
        </Typography>
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <ImageGrid userId={userId} />
        </Paper>
      </Container>
    </>
  );
};

export default Home;

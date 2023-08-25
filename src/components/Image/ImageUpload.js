import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Grid,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import axios from "axios";
import moment from "moment";
import config from "../../config";

const ImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [user, setUser] = useState({});
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user.expiryOfSubscription) {
      const expiryDate = moment(user.expiryOfSubscription, "YYYYMMDDHHmmssSSS");
      const currentDate = moment();
      setIsExpired(currentDate.isAfter(expiryDate));
      // console.log("isExpired :", isExpired);
    } else {
      setIsExpired(true);
    }
  }, [user.expiryOfSubscription]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      for (const file of selectedFiles) {
        formData.append("UploadFiles", file);
      }

      const uploadUrl = isExpired
        ? `${config.API_URL}/image-upload/${userId}`
        : `${config.API_URL}/image-upload-multiple/${userId}`;

      await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: accessToken,
        },
      });
      setSelectedFiles([]);
      setUploadSuccess(true);
      setFileInputKey(fileInputKey + 1);
      window.location.reload();
    } catch (error) {
      setError(true);
      setErrorMessage("Error uploading images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(false);
    setUploadSuccess(false);
  };
  // console.log("user :", user);
  // console.log("isExpired :", isExpired);

  return (
    <Container>
      <Typography variant="h6">Upload Images</Typography>
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
      <Snackbar
        open={uploadSuccess}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Successfully uploaded images
        </Alert>
      </Snackbar>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <input
          key={fileInputKey}
          type="file"
          accept=".jpg,.jpeg,.png"
          {...(isExpired ? {} : { multiple: true })}
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUpload />}
          onClick={handleUpload}
          disabled={isLoading || selectedFiles.length === 0}
          sx={{
            width: "120px",
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Upload"}
        </Button>
      </div>
      <Grid container spacing={2}>
        {selectedFiles.map((file, index) => (
          <Grid item xs={4} key={index}>
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              style={{ maxWidth: "100%" }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ImageUpload;

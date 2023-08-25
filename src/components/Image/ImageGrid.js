import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Pagination,
  Button,
  Card,
  CardMedia,
  CardActionArea,
  CardActions,
} from "@mui/material";
import config from "../../config";
import axios from "axios";
import { saveAs } from "file-saver";

const ImageGrid = ({ userId }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const accessToken = sessionStorage.getItem("token");

  const fetchImageUrls = async (userId, page) => {
    try {
      const response = await axios.get(`${config.API_URL}/images/${userId}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: accessToken,
        },
      });
      setImageUrls(response.data.imageUrls);
    } catch (error) {
      console.error("Error fetching imageUrls:", error);
    }
  };

  const handleDownloadImage = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "blob",
      });

      const urlParts = imageUrl.split("/");
      const filename = urlParts[urlParts.length - 1];

      saveAs(response.data, filename);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  useEffect(() => {
    fetchImageUrls(userId, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const totalPageCount = Math.ceil(imageUrls.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const displayedImageUrls = imageUrls.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // console.log("url: ", imageUrls.length);

  return (
    <Container>
      {imageUrls.length !== 0 ? (
        <>
          <Grid container spacing={2} sx={{ marginBottom: "30px" }}>
            {displayedImageUrls.map((imageUrl, index) => (
              <Grid item xs={6} key={index}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={imageUrl}
                      alt={imageUrl}
                    />
                  </CardActionArea>
                  <CardActions>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleDownloadImage(imageUrl)}
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <hr />
          <Pagination
            count={totalPageCount}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
          />
        </>
      ) : (
        <Typography variant="h6">No images uploaded yet</Typography>
      )}
    </Container>
  );
};

export default ImageGrid;

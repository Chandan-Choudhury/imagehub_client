import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  CssBaseline,
  Button,
  Card,
  CardContent,
  FormControl,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import config from "../../config";
import Navbar from "../UI/Navbar";
import countries from "../Utils/CountryList";
import moment from "moment";
import Swal from "sweetalert2";

const Subscription = () => {
  const stripe = useStripe();
  const elements = useElements();
  const accessToken = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");
  const [user, setUser] = useState({});
  const [customer, setCustomer] = useState({});
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const email = sessionStorage.getItem("email");
  const priceId = config.STRIPE_PRICE_ID;
  const priceIdIndia = config.STRIPE_INDIA_PRICE_ID;
  const history = useNavigate();

  const createSubscription = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const paymentMethod = await stripe?.createPaymentMethod({
        type: "card",
        card: elements?.getElement(
          CardCvcElement,
          CardExpiryElement,
          CardNumberElement
        ),
        billing_details: {
          name,
          email,
        },
      });

      if (!stripe || !elements) {
        return;
      }
      let selectedPriceId = priceId;
      if (country === "IN") {
        selectedPriceId = priceIdIndia;
      }
      const response = await axios.post(
        `${config.API_URL}/create-subscription`,
        {
          name,
          email,
          address: {
            line1,
            postal_code: postalCode,
            city,
            state,
            country,
          },
          paymentMethod: paymentMethod.paymentMethod?.id,
          priceId: selectedPriceId,
        },
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      const confirmPayment = await stripe?.confirmCardPayment(
        response.data.data.clientSecret,
        console.log(
          "resp.clientSecret from create sub :",
          response.data.data.clientSecret
        ),
        {
          payment_method: paymentMethod.paymentMethod?.id,
        },
        console.log(
          "payment_method in confirm payment func :",
          paymentMethod.paymentMethod?.id
        )
      );

      if (confirmPayment?.error) {
        Swal.fire({
          title: "Payment Failed",
          text: "An error occurred while creating subscription.",
          icon: "error",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        Swal.fire({
          title: "Payment Successful",
          text: "You have successfully subscribed to ImageHub Pro!",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            history("/");
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Payment Failed",
        text: "An error occurred while creating subscription.",
        icon: "error",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renewSubscription = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${config.API_URL}/renew-subscription/${userId}`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      Swal.fire({
        title: "Subscription Renewed",
        text: response.message,
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating subscription.",
        icon: "error",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${config.API_URL}/cancel-subscription/${userId}`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      Swal.fire({
        title: "Subscription Cancelled",
        text: response.message,
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while cancelling subscription.",
        icon: "error",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/fetch-subscription/${userId}`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
        setSubscription(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCustomer = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/fetch-customer/${userId}`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
        setCustomer(response.data);
        setIsExistingCustomer(true);
        if (response.data.customer) {
          setName(response.data.customer.name);
          setLine1(response.data.customer.address.line1);
          setPostalCode(response.data.customer.address.postal_code);
          setCity(response.data.customer.address.city);
          setState(response.data.customer.address.state);
          setCountry(response.data.customer.address.country);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCustomer();
    fetchSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subscriptionStatus = subscription?.subscription.status;

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const useOptions = () => {
    const fontSize = window.innerWidth < 450 ? "14px" : "16px";
    const options = useMemo(
      () => ({
        style: {
          base: {
            fontSize,
            color: "#424770",
            letterSpacing: "0.025em",
            "::placeholder": {
              color: "#aab7c4",
            },
            border: "1px solid black",
          },
          invalid: {
            color: "#9e2146",
          },
        },
      }),
      [fontSize]
    );

    return options;
  };
  const options = useOptions();

  return (
    <>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="sm">
        <Card sx={{ margin: "100px 0px", border: "1px solid black" }}>
          <CardContent>
            <Typography variant="h4">Subscription</Typography>
            {user.expiryOfSubscription && (
              <Typography variant="h6">
                Current Plan active till: {user.formattedDuration}
              </Typography>
            )}
            <hr />
            {(subscriptionStatus === "active" && user.isSubscribed === false) ||
            user.isSubscribed === false ? (
              <form onSubmit={createSubscription}>
                {subscriptionStatus === "active" &&
                user.isSubscribed === false ? (
                  <Typography variant="h6">
                    It's seems like you have cancelled the subscription, please
                    renew to use the Pro benefits before current plan expired.
                  </Typography>
                ) : (
                  <Typography variant="h6">
                    Subscribe to use the Pro benefits only at $5/month or
                    ₹449/month.
                  </Typography>
                )}
                <hr />
                {user.isSubscribed === false && (
                  <FormControl fullWidth>
                    {isExistingCustomer && (
                      <Typography variant="h6">
                        You are already a customer with us, your details :{" "}
                        <br />
                        Name : <b>{customer.customer.name}</b> <br />
                        Address : <b>{customer.customer.address.line1}</b>{" "}
                        <br />
                        Postal Code :{" "}
                        <b>{customer.customer.address.postal_code}</b>
                        <br />
                        City : <b>{customer.customer.address.city}</b> <br />
                        State : <b>{customer.customer.address.state}</b> <br />
                        Country : <b>
                          {customer.customer.address.country}
                        </b>{" "}
                        <br />
                      </Typography>
                    )}
                    {!isExistingCustomer && (
                      <div>
                        <TextField
                          label="Name on Card"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          margin="normal"
                        />
                        <TextField
                          label="Address"
                          value={line1}
                          onChange={(e) => setLine1(e.target.value)}
                          required
                          margin="normal"
                        />
                        <TextField
                          label="Postal Code"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          required
                          margin="normal"
                        />
                        <TextField
                          label="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          margin="normal"
                        />
                        <TextField
                          label="State"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                          margin="normal"
                        />
                        <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
                          <InputLabel id="country-select" required>
                            Country
                          </InputLabel>
                          <Select
                            labelId="country-select"
                            id="country-select"
                            value={country}
                            label="Country"
                            onChange={handleCountryChange}
                          >
                            <MenuItem value="">Select a country</MenuItem>
                            {countries.map((countryObj) => (
                              <MenuItem
                                key={countryObj.code}
                                value={countryObj.code}
                              >
                                {countryObj.country}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <h3>Card Details :</h3>
                        <label style={{ margin: "10px 0px 10px 10px" }}>
                          Card number *
                        </label>
                        <div
                          style={{
                            border: "1px solid #bdbdbd",
                            height: "50px",
                            borderRadius: "4px",
                          }}
                        >
                          <div style={{ padding: 14 }}>
                            <CardNumberElement options={options} />
                          </div>
                        </div>
                        <label style={{ margin: "10px 0px 7px 10px" }}>
                          Expiry *
                        </label>
                        <div
                          style={{
                            border: "1px solid #bdbdbd",
                            height: "50px",
                            borderRadius: "4px",
                          }}
                        >
                          <div style={{ padding: 14 }}>
                            <CardExpiryElement options={options} />
                          </div>
                        </div>
                        <label style={{ margin: "10px 0px 10px 10px" }}>
                          CVC *
                        </label>
                        <div
                          style={{
                            border: "1px solid #bdbdbd",
                            height: "50px",
                            borderRadius: "4px",
                          }}
                        >
                          <div style={{ padding: 14 }}>
                            <CardCvcElement options={options} />
                          </div>
                        </div>
                      </div>
                    )}
                    {subscriptionStatus === "active" &&
                    user.isSubscribed === false ? (
                      <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={renewSubscription}
                        style={{ marginTop: "16px" }}
                        disabled={isLoading}
                        fullWidth
                      >
                        {isLoading ? <CircularProgress size={24} /> : "Renew"}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{ marginTop: "16px" }}
                        disabled={isLoading}
                        fullWidth
                      >
                        {isLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Subscribe"
                        )}
                      </Button>
                    )}
                  </FormControl>
                )}
              </form>
            ) : (
              <Typography variant="h6">You are subscribed!</Typography>
            )}
            {subscriptionStatus === "active" && user.isSubscribed === true && (
              <form onSubmit={cancelSubscription}>
                <FormControl fullWidth>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{ marginTop: "16px" }}
                  >
                    Unsubscribe
                  </Button>
                </FormControl>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default Subscription;

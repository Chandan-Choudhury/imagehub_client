import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Subscription from "./Subscription";
import config from "../../config";

const publishableKey = config.STRIPE_P_KEY;
const stripePromise = loadStripe(publishableKey);

const Stripe = () => {
  return (
    <Elements stripe={stripePromise}>
      <Subscription />
    </Elements>
  );
};

export default Stripe;

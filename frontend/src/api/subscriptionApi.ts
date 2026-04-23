import { CreateSubscriptionType } from "../redux/slice/SubscriptionSlice";
import api from "./axios";

export const subscriptionCheckoutSession = async ({
  lookup_key,
}: {
  lookup_key: string;
}) => {
  const res = await api.post("/subscriptions/create-checkout-session", {
    lookup_key,
  });

  const { sessionUrl } = res.data.data;

  window.location.href = sessionUrl;
};

export const subscriptionUpdateCheckoutSession = async (sessionId: string) => {
  const res = await api.put(
    "/subscriptions/update-checkout-session",
    {},
    { params: { sessionId } },
  );

  return res.data.data;
};

export const fetchSubscriptionApi = async () => {
  const res = await api.get("/subscriptions/fetch-subscription");

  return res.data.data;
};

export const cancelSubscriptionApi = async ({
  subscriptionId,
}: {
  subscriptionId: string;
}) => {
  const res = await api.put(
    "/subscriptions/cancel-subscription",
    {},
    { params: { subscriptionId } },
  );

  return res.data.data;
};

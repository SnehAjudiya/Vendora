import { Items } from "../redux/slice/CartSlice";
import api from "./axios";

export const checkoutCart = async (data: Items[]) => {
  const res = await api.post("/payment/create-checkout-session", data);
  const sessionUrl = res.data.data.sessionUrl;
  const sessionId = res.data.data.sessionId;
  window.location.href = sessionUrl;
  return sessionId;
};

export const updateCheckout = async (sessionId: string) => {
  const res = await api.put(
    "/payment/update-checkout-session",
    {},
    {
      params: { sessionId },
    },
  );

  return res.data.data;
};

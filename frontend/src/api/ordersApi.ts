import { Items } from "../redux/slice/CartSlice";
import { CreateOrderType } from "../redux/slice/OrderSlice";
import api from "./axios";

export const fetchOrdersApi = async () => {
  const res = await api.get("/orders");

  return res.data.data;
};

export const createOrderApi = async ({
  data,
  sessionId,
}: {
  data: CreateOrderType;
  sessionId: string;
}) => {
  const res = await api.post("/orders", data, { params: { sessionId } });

  return res.data.data;
};

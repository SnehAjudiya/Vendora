import api from "./axios";

export interface FetchMessagesParams {
  roomId?: string | null;
  fetcherId?: string | null;
}
export const fetchMessagesApi = async (params: FetchMessagesParams) => {
  const { roomId, fetcherId } = params;
  const res = await api.get("/messages", { params: { roomId, fetcherId } });

  return res.data.data;
};

export const createMessagesApi = async (data: any) => {
  const res = await api.post("/messages", data);
  return res.data.data;
};

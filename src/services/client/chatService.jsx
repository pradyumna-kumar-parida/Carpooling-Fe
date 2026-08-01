import getClientAxios from "@/lib/axiosClient";

export const getConversationsApi = async (bookingId) => {
  const { data } = await getClientAxios.get(`/conversation/${bookingId}`);
  return data.data;
};
export const getMessagessApi = async (conversationId) => {
  const { data } = await getClientAxios.get(`/messages/${conversationId}`);
  return data.data;
};

export const sendMessageApi = (data) => getClientAxios.post("/send", data);

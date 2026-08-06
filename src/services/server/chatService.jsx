import getServerAxios from "@/lib/axiosServer";

export const getConversationsApi = async (bookingId) => {
  const axios = await getServerAxios();
  const { data } = await axios.get(`/conversation/${bookingId}`);
  return data.data;
};

export const getChatListApi = async () => {
  const axios = await getServerAxios();
  const { data } = await axios.get("/driver/chats");
  return data.data;
};

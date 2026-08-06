import ChatPage from "@/features/driver-chat/Chat";
import { getChatListApi } from "@/services/server/chatService";

const Page = async () => {
  let chatList = [];

  try {
    chatList = await getChatListApi();
  } catch (error) {
    console.error("Failed to load chat list:", error);
  }

  return <ChatPage chatList={chatList} />;
};

export default Page;

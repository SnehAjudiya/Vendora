import { useEffect, useState } from "react";
import { socket } from "../../../../socket/socket.js";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, CheckCheck, SendHorizonal } from "lucide-react";
import Button from "../../../../common-components/Button";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { RootState } from "../../../../redux/store/store";
import {
  createMessages,
  fetchMessages,
  readMessages,
  receivedMessage,
} from "../../../../redux/slice/MessageSlice";

type Message = {
  text: string;
  senderId: string | null;
  senderName: string | null;
  roomId: string | null;
  isRead: boolean;
};

export default function ChatPageForVendorAndCustomer() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const auth = useAppSelector((state: RootState) => state.auth);
  const userId = auth.id;

  const { role, fullName } = auth;
  const dispatch = useAppDispatch();
  const roomId = userId ? `admin_${userId}` : null;

  useEffect(() => {
    if (!userId) return;
    socket.connect();

    // Join room
    socket.emit("join-room", roomId);

    // Fetch all messages
    dispatch(fetchMessages({ roomId: roomId, fetcherId: userId }));

    // Receiving message
    socket.on("receive-message", (message: Message) => {
      socket.emit("message-received", message);
      if (message.senderId !== userId) dispatch(receivedMessage(message));
    });

    // Receiver on reading messages
    socket.on("read-messages", () => {
      dispatch(readMessages(userId));
    });

    return () => {
      socket.off("read-messages");
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [userId]);

  const messages = useAppSelector(
    (state: RootState) => state.messages.messages,
  );

  // Send Message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const message: Message = {
      text: input,
      senderId: userId,
      senderName: fullName,
      roomId: roomId,
      isRead: false,
    };

    // Create message
    await dispatch(createMessages(message));
    socket.emit("send-message", message);
    setInput("");
  };

  return (
    <div className="">
      <div className="flex flex-col gap-5 h-screen bg-gray-100 rounded-lg p-5">
        <div className="flex justify-between items-center">
          <Button onClick={() => navigate("/chat")}>
            <ArrowLeft size={18} />
          </Button>
          <div className="font-bold text-2xl"> Admin </div>
          <div className="text-gray-500">admin</div>
        </div>
        <hr />
        <div className="flex-1 overflow-y-auto p-4 space-y-2 border rounded-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.senderId === userId ? "items-end" : "items-start"
              }`}
            >
              <span className="text-xs text-gray-500 mt-1">
                {msg.senderId === userId ? "You" : "Admin"}
              </span>
              <div
                className={`p-2 rounded-2xl shadow-sm max-w-xs ${
                  msg.senderId === userId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-black rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>

              {msg.senderId === userId && (
                <div>
                  {msg.isRead ? (
                    <CheckCheck style={{ color: "blue" }} size={15} />
                  ) : (
                    <Check style={{ color: "gray" }} size={15} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="pb-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-3 py-2 outline-none"
          />
          <Button variant="green" onClick={() => sendMessage()}>
            <SendHorizonal size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

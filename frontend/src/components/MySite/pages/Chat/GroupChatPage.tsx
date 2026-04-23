import { useEffect, useState } from "react";
import { socket } from "../../../../socket/socket.js";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, SendHorizonal } from "lucide-react";
import Button from "../../../../common-components/Button";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { RootState } from "../../../../redux/store/store";
import {
  createMessages,
  fetchMessages,
  receivedMessage,
} from "../../../../redux/slice/MessageSlice";

type Message = {
  text: string;
  senderId: string | null;
  senderName: string | null;
  roomId: string | null;
  isRead: boolean;
};

export default function GroupChatPage() {
  const { group } = useParams<{ group: string }>();

  const [input, setInput] = useState("");

  const navigate = useNavigate();

  const auth = useAppSelector((state: RootState) => state.auth);
  const userId = auth.id;

  const { role, fullName } = auth;
  const dispatch = useAppDispatch();

  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (!group) return;
    setRoomId(`admin_${group}`);
  }, [group]);

  useEffect(() => {
    if (!roomId) return;
    socket.connect();
    socket.emit("join-room", roomId);
    dispatch(fetchMessages({ roomId: roomId, fetcherId: userId }));
    socket.on("receive-message", (message: Message) => {
      if (message.senderId !== userId) dispatch(receivedMessage(message));
    });

    return () => {
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [roomId]);

  const messages = useAppSelector(
    (state: RootState) => state.messages.messages,
  );

  const sendMessage = () => {
    if (!input.trim()) return;
    const message: Message = {
      text: input,
      senderId: userId,
      senderName: role === "Admin" ? "Admin" : fullName,
      roomId: roomId,
      isRead: false,
    };
    dispatch(createMessages(message));
    socket.emit("send-message", message);
    setInput("");
  };

  return (
    <div className="">
      <div className="flex flex-col gap-5 h-screen bg-gray-100 rounded-lg p-5">
        <div className="flex justify-between items-center">
          <Button
            onClick={() =>
              role === "Admin" ? navigate("/users") : navigate("/chat")
            }
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="font-bold text-2xl">Group Chat </div>
          <div className="text-gray-500 ">{group}</div>
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
              <div
                className={`p-2 rounded-2xl shadow-sm max-w-xs ${
                  msg.senderId === userId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-black rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {msg.senderId === userId ? "You" : msg.senderName}
              </span>
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

          <Button variant="green" onClick={sendMessage}>
            <SendHorizonal size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

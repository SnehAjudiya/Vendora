import { useEffect, useState } from "react";
import { socket } from "../../../../socket/socket.js";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  MarsStroke,
  SendHorizonal,
} from "lucide-react";
import Button from "../../../../common-components/Button";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { getUserById } from "../../../../redux/slice/UsersSlice";
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

export default function ChatPageForAdmin() {
  const { id } = useParams<{ id: string }>();
  // const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const auth = useAppSelector((state: RootState) => state.auth);
  const userId = auth.id;

  const { role, fullName } = auth;

  const selectedUser = useAppSelector(
    (state: RootState) => state.users.selectedUser,
  );

  const messages = useAppSelector(
    (state: RootState) => state.messages.messages,
  );

  useEffect(() => {
    if (id) dispatch(getUserById(Number(id)));
  }, [id]);

  const roomId = selectedUser ? `admin_${selectedUser?._id}` : null;

  useEffect(() => {
    if (!selectedUser) return;
    socket.connect();
    socket.emit("join-room", roomId);
    dispatch(fetchMessages({ roomId: roomId, fetcherId: userId }));
    socket.on("receive-message", (message: Message) => {
      socket.emit("message-received", message);
      if (message.senderId !== userId) dispatch(receivedMessage(message));
    });

    socket.on("new-message", () => {});

    socket.on("read-messages", () => {
      dispatch(readMessages(userId));
    });

    return () => {
      socket.off("read-messages");
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!selectedUser || !input.trim()) return;
    const message: Message = {
      text: input,
      senderId: userId,
      senderName: fullName,
      roomId: roomId,
      isRead: false,
    };
    await dispatch(createMessages(message));
    socket.emit("send-message", message);
    setInput("");
  };

  useEffect(() => {}, [messages]);

  return (
    <div className="">
      <div className="flex flex-col gap-5 h-screen bg-gray-100 rounded-lg p-5">
        <div className="flex justify-between items-center">
          <Button onClick={() => navigate("/users")}>
            <ArrowLeft size={18} />
          </Button>
          <div className="flex justify-center items-center gap-2">
            <img
              className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-4xl font-bold"
              src={`http://localhost:5000/uploads/${selectedUser?.avatar}`}
              alt="Profile"
            />
            <div className="font-bold text-2xl">{selectedUser?.fullName} </div>
          </div>
          <div className="text-gray-500 ">{selectedUser?.phone}</div>
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
                {msg.senderId === userId ? "You" : selectedUser?.fullName}
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
          <Button variant="green" onClick={sendMessage}>
            <SendHorizonal size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

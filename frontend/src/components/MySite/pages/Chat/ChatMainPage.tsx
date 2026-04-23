import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import { RootState } from "../../../../redux/store/store";

function ChatMainPage() {
  const navigate = useNavigate();
  const role = useAppSelector((state: RootState) => state.auth.role);
  return (
    <div>
      <div className="flex flex-col gap-5 text-xl font-bold">
        <div
          className="hover:bg-gray-100 px-4 py-2 rounded-lg cursor-pointer"
          onClick={() => navigate("/chat/admin")}
        >
          Admin
        </div>
        <hr />
        <div
          className="hover:bg-gray-100 px-4 py-2 rounded-lg cursor-pointer"
          onClick={() => navigate(`/chat/group/${role}`)}
        >
          Group ({role}s, Admin)
        </div>
        <hr />
        <div
          className="hover:bg-gray-100 px-4 py-2 rounded-lg cursor-pointer"
          onClick={() => navigate(`/chat/group/All`)}
        >
          Group (Admin, Vendors, Customers)
        </div>
      </div>
    </div>
  );
}

export default ChatMainPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  LogOut,
  Globe,
  Landmark,
} from "lucide-react";
import Button from "../../../../common-components/Button";
import api from "../../../../api/axios";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { logout } from "../../../../redux/slice/AuthSlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        if (res.data.success) {
          setUserData(res.data.data);
        }
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/login");
    } catch (error) {}
  };

  if (loading)
    return <div className="p-10 text-center">Loading Profile...</div>;

  if (!userData) return <div className="p-10 text-center">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">
        Account Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col items-center text-center">
          <img
            className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4"
            src={`http://localhost:5000/uploads/${userData.avatar}`}
            alt="Profile"
          />

          <h2 className="text-xl font-bold text-slate-900">
            {userData.fullName}
          </h2>

          <p className="text-slate-500 text-sm">@{userData.username}</p>

          <div
            className={`inline-flex items-center px-3 py-1 mt-10 rounded-full text-sm font-medium
            ${
              userData.isAccountVerified
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {userData.isAccountVerified ? "Verified" : "Not Verified"}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Personal Information</h3>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoBlock
                icon={<Mail size={18} />}
                label="Email Address"
                value={userData.email}
              />
              <InfoBlock
                icon={<Phone size={18} />}
                label="Phone Number"
                value={userData.phone}
              />
              <InfoBlock
                icon={<Calendar size={18} />}
                label="Date of Birth"
                value={userData.dob}
              />
              <InfoBlock
                icon={<User size={18} />}
                label="Gender"
                value={userData.gender === "Male" ? "Male" : "Female"}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Location & Address</h3>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoBlock
                icon={<MapPin size={18} />}
                label="Address"
                value={userData.address}
              />
              <InfoBlock
                icon={<Landmark size={18} />}
                label="City & State"
                value={`${userData.city}, ${userData.state}`}
              />
              <InfoBlock
                icon={<Globe size={18} />}
                label="Country"
                value={userData.country}
              />
            </div>
          </div>

          <div className="flex gap-10 justify-end">
            <Button
              variant="primary"
              onClick={() => navigate(`/profile/edit`)}
              className="w-auto px-6 shadow-sm"
            >
              Edit Profile
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/verify-email")}
              className="w-auto px-6 shadow-sm"
            >
              Verify Email
            </Button>

            <Button
              variant="danger"
              onClick={handleLogout}
              className="w-auto px-6 shadow-sm"
            >
              <LogOut size={18} />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">{icon}</div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </p>

        <p className="text-sm font-bold text-slate-900 mt-0.5">
          {value || "Not Provided"}
        </p>
      </div>
    </div>
  );
}

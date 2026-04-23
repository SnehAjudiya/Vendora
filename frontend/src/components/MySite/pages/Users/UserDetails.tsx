import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../../../../common-components/Button";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks/hooks";
import { getUserById } from "../../../../redux/slice/UsersSlice";
import { useEffect, useState } from "react";
import { RootState } from "../../../../redux/store/store";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Landmark,
  CalendarPlus2,
  Info,
  UserKey,
} from "lucide-react";
import { UserValues } from "./UserTable";

export default function UserDetails({ vendor }: { vendor?: any | null }) {
  let { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, selectedUser } = useAppSelector(
    (state: RootState) => state.users,
  );
  const role = useAppSelector((state: RootState) => state.auth.role);

  const [userData, setUserData] = useState<UserValues | null>(null);

  useEffect(() => {
    if (!vendor && id) {
      dispatch(getUserById(id));
    }
  }, [id, vendor]);

  useEffect(() => {
    if (vendor) {
      setUserData(vendor);
    } else if (selectedUser) {
      setUserData(selectedUser);
    }
  }, [vendor, selectedUser]);

  const handleBack = () => {
    navigate("/users");
  };

  if (loading) {
    return <p className="text-center py-10">Loading user...</p>;
  }

  if (!id) {
    return (
      <div className="max-w-4xl mx-auto pb-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            User Details
          </h1>
          <Button variant="secondary" onClick={handleBack} className="w-auto">
            Back to Users
          </Button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <p className="text-slate-600">No user id provided.</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto pb-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            User Details
          </h1>
          <Button variant="secondary" onClick={handleBack} className="w-auto">
            <ArrowLeft size={18} />
          </Button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <p className="text-slate-600">User not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="w-auto mx-auto pb-10">
        {!vendor ? (
          <div className="flex gap-4 items-center mb-8">
            <Button variant="secondary" onClick={handleBack} className="w-auto">
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-3xl font-extrabold text-slate-900">
              User Profile
            </h1>
          </div>
        ) : (
          <div className="flex gap-4 items-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900">
              Vendor Details
            </h1>
          </div>
        )}
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
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoBlock
                  icon={<UserKey size={18} />}
                  label="Role"
                  value={userData.role}
                />
                <StatusBadge
                  icon={<Info size={18} />}
                  status={userData.status}
                />
                <InfoBlock
                  icon={<CalendarPlus2 size={18} />}
                  label="Created Date"
                  value={userData.createdAt}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      {/* {role === "Admin" && userData.role === "Vendor" && (
        <Products vendorId={userData._id} />
      )} */}
    </div>
  );
}

function InfoBlock({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
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

function StatusBadge({
  icon,
  status,
}: {
  icon?: React.ReactNode;
  status: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">{icon}</div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-1 tracking-wider">
          Status
        </p>

        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            status === "Active"
              ? "bg-green-100 text-green-700"
              : status === "Pending"
                ? "bg-gray-200 text-gray-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, UserCircle } from "lucide-react";
import { RootState } from "../../redux/store/store";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Navbar() {
  // const totalItems = useAppSelector(
  //   (state: RootState) => state.cart.totalItems,
  // );
  const location = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const role = useAppSelector((state: RootState) => state.auth.role);

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

  // Logic to turn "/projects/add" into "Projects / Add"
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left - Breadcrumbs */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block" />

        <nav className="flex items-center text-sm font-medium">
          <Link
            to="/"
            className="text-gray-500 hover:text-black transition-colors"
          >
            Main
          </Link>

          {pathnames.map((name, index) => {
            const routeTo = "/" + pathnames.slice(0, index + 1).join("/");

            return (
              <div key={name} className="flex items-center capitalize">
                <span className="mx-2 text-gray-300">/</span>

                <Link
                  to={routeTo}
                  className={
                    index === pathnames.length - 1
                      ? "text-black font-semibold"
                      : "text-gray-500 hover:text-black transition-colors"
                  }
                >
                  {name.replace(/-/g, " ")}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="hidden md:flex items-center flex-1 justify-center max-w-md px-4">
        <div className="relative w-full group">
          {/* <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={16} />
          </div>
          <Formik
            initialValues={{ search: "" }}
            onSubmit={(values) => console.log("Search:", values.search)}
          >
            <Form className="w-full">
              <input
                name="search"
                placeholder="Search projects or clients..."
                className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-12 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none border border-transparent focus:border-blue-400"
              />
            </Form>
          </Formik>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded">
              <Command size={10} /> K
            </kbd>
          </div> */}
        </div>
      </div>

      {/* Right - Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon (SaaS Standard) */}
        {/* <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button> */}

        {role === "Customer" && (
          <div
            onClick={() => navigate("/orders")}
            className="text-gray-700 font-semibold hover:bg-gray-50 px-4 py-1 rounded-lg border cursor-pointer hover:shadow-sm"
          >
            My Orders
          </div>
        )}
        <div className="h-6 w-[1px] bg-gray-100 mx-1" />

        {role === "Customer" && (
          <div
            onClick={() => navigate("/subscriptions")}
            className="text-gray-700 font-semibold hover:bg-gray-50 px-4 py-1 rounded-lg border cursor-pointer hover:shadow-sm"
          >
            My Subscriptions
          </div>
        )}
        <div className="h-6 w-[1px] bg-gray-100 mx-1" />

        <Link
          to="/profile"
          className="flex justify-center items-center gap-2 group pl-1 pr-3 py-1 rounded-full border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all"
        >
          <img
            className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-4xl font-bold"
            src={`http://localhost:5000/uploads/${userData?.avatar}`}
            alt="Profile"
          />
          <div className="flex flex-col items-start leading-none gap-1">
            <span className="text-[13px] font-bold text-gray-800 group-hover:text-black">
              {userData?.fullName}
            </span>
            <span className="text-[10px] text-gray-400">{role}</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}

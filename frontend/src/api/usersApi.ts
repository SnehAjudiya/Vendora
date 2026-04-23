import api from "./axios";

export interface FetchUsersParams {
  userRole?: string;
}
export const fetchUsersApi = async (params: FetchUsersParams) => {
  const { userRole } = params;
  const res = await api.get("/users", { params: { userRole } });

  return res.data.data.map((u: any) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone,
    username: u.username,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
    _id: u._id,
  }));
};

export const createUserApi = async (data: FormData) => {
  const res = await api.post("/users", data);
  const u = res.data.data;
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone,
    gender: u.gender,
    dob: u.dob,
    address: u.address,
    country: u.country,
    state: u.state,
    city: u.city,
    username: u.username,
    password: u.password,
    role: u.role,
    status: u.status,
    avatar: u.avatar,
    gallery: u.gallery,
    createdAt: u.createdAt,
  };
};

export const updateUserApi = async ({
  id,
  data,
}: {
  id: number;
  data: FormData;
}) => {
  const res = await api.put(`/users/${id}`, data);
  const u = res.data.data;
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone,
    gender: u.gender,
    dob: u.dob,
    address: u.address,
    country: u.country,
    state: u.state,
    city: u.city,
    username: u.username,
    password: u.password,
    role: u.role,
    status: u.status,
    avatar: u.avatar,
    gallery: u.gallery,
    createdAt: u.createdAt,
  };
};

export const deleteUserApi = async (id: number) => {
  const res = await api.delete(`/users/${id}`);
  return id;
};

export const checkAuthenticated = async () => {
  const res = await api.get("/auth/is-auth");
  return res.data;
};

export const getUserByIdApi = async (id: number | string) => {
  const res = await api.get(`/users/${id}`);
  const u = res.data.data;
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone,
    gender: u.gender,
    dob: u.dob,
    address: u.address,
    country: u.country,
    state: u.state,
    city: u.city,
    username: u.username,
    password: u.password,
    role: u.role,
    status: u.status,
    avatar: u.avatar,
    gallery: u.gallery,
    createdAt: u.createdAt,
    isAccountVerified: u.isAccountVerified,
    _id: u._id,
  };
};

export const editProfile = async (data: FormData) => {
  const res = await api.post(`/users/profile/edit`, data);
  const u = res.data.data;
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone,
    gender: u.gender,
    dob: u.dob,
    address: u.address,
    country: u.country,
    state: u.state,
    city: u.city,
    username: u.username,
    password: u.password,
    role: u.role,
    status: u.status,
    avatar: u.avatar,
    gallery: u.gallery,
    createdAt: u.createdAt,
  };
};

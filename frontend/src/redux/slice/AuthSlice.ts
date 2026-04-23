import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkAuthenticated } from "../../api/usersApi";

interface AuthState {
  isAuthenticated: boolean;
  id: string;
  role: "Admin" | "Vendor" | "Customer" | "";
  fullName: string;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  id: "",
  role: "",
  fullName: "",
  loading: true,
};

export const checkAuth = createAsyncThunk("auth/checkAuth", checkAuthenticated);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.role = action.payload;
      state.id = action.payload;
      state.fullName = action.payload;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.role = "";
      state.id = "";
      state.fullName = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          state.isAuthenticated = true;
          state.role = action.payload.data.role;
          state.id = action.payload.data.id;
          state.fullName = action.payload.data.fullName;
        } else {
          state.isAuthenticated = false;
          state.role = "";
          state.id = "";
          state.fullName = "";
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.role = "";
        state.id = "";
        state.fullName = "";
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

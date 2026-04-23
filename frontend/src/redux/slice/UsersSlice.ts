import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserValues } from "../../components/MySite/pages/Users/UserTable";
import {
  createUserApi,
  deleteUserApi,
  fetchUsersApi,
  getUserByIdApi,
  updateUserApi,
} from "../../api/usersApi";
import { CreateUserPayload } from "../../components/MySite/pages/Users/AddEditForm";

interface UsersState {
  users: UserValues[];
  loading: boolean;
  error: string | null;
  selectedUser: CreateUserPayload | any | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
};

// fetch
export const fetchUsers = createAsyncThunk("users/fetchUsers", fetchUsersApi);

// create
export const addUser = createAsyncThunk<UserValues, FormData>(
  "users/addUser",
  createUserApi,
);

// update
export const updateUser = createAsyncThunk<
  UserValues,
  { id: number; data: FormData }
>("users/updateUser", updateUserApi);

// delete
export const deleteUser = createAsyncThunk("users/deleteUser", deleteUserApi);

// fetch one
export const getUserById = createAsyncThunk(
  "users/getUserById",
  getUserByIdApi,
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UserValues[]>) => {
          state.loading = false;
          state.users = action.payload;
        },
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Fail to fetch Users";
      })

      // Create
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addUser.fulfilled,
        (state, action: PayloadAction<UserValues>) => {
          state.loading = false;
          state.users.unshift(action.payload);
        },
      )
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add user";
      })

      // Update
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserValues>) => {
          const index = state.users.findIndex(
            (u) => u.id === action.payload.id,
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          }
          state.loading = false;
        },
      )
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      })

      // Delete
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      })

      // Fetch one
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      });
  },
});

export default usersSlice.reducer;

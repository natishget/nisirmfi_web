import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { RootState } from "../store";

interface ApiState {
  registerResponse: RegisterResponse;
  loginResponse: LoginResponse;
  News: News[];
  Career: Career[];
  loading: boolean;
  error: string | null;
  user: User | null;
  initialized?: boolean;
  pageMeta: { totalItems: number; page: number; totalPages: number };
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
}

interface LoginResponse {
  message?: string;
  error?: string;
  access_token?: string;
}

interface User {
  userId: String;
  email: String;
  fullName: String;
  createdAt: Date;
  updatedAt: Date;
}

interface News {
  id: String;
  title: String;
  category: String;
  status: String;
  summary: String;
  publishedDate: Date;
  readTime: number;
  imageUrl: String;
  isFeatured: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Career {
  id: String;
  title: String;
  description: String;
  department: String;
  type: String;
  purpose: String;
  requirements: String;
  location: String;
  status: String;
  createdAt: Date;
  updatedAt: Date;
}

const initialState: ApiState = {
  registerResponse: { message: "", user: { id: "", name: "", email: "" } },
  loginResponse: { message: "", error: "", access_token: "" },
  News: [],
  Career: [],
  loading: false,
  error: null,
  user: null,
  initialized: false,
  pageMeta: { totalItems: 0, page: 1, totalPages: 1 },
};

export const loginAsync = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string; dispatch: any }
>("auth/login", async (credentials, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.post("/auth/login", credentials);
    dispatch(protectedRouteAsync());
    return response.data as LoginResponse;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const protectedRouteAsync = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("protectedRouteAsync", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/auth/protected", {
      withCredentials: true,
    });
    return response.data as User;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to access protected route",
    );
  }
});

export const logoutAsync = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("logoutAsync", async (_, { rejectWithValue, dispatch }) => {
  try {
    await api.post("/auth/logout", { withCredentials: true });
    dispatch(clearUser()); // clear user immediately
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

export const registerAsync = createAsyncThunk<
  RegisterResponse,
  object,
  { rejectValue: string }
>("registerAsync", async (data, { rejectWithValue }) => {
  try {
    const registerResponse = await api.post("/auth/register", data, {
      withCredentials: true,
    });
    console.log("api", api);
    return registerResponse.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Register failed");
  }
});

const ApiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //login
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.loginResponse = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "something went wrong";
      })

      //logout
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.initialized = true;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "something went wrong";
      })

      // register
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.registerResponse = action.payload;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "something went wrong";
      });
  },
});

export const { setUser, clearUser, clearError } = ApiSlice.actions;
export default ApiSlice.reducer;

// selector helper (use in components to read user)
export const selectUser = (state: any) => state.api.user;
export const selectIsAuthenticated = (state: any) => !!state.api.user;

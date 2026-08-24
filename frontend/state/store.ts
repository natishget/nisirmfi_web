import { configureStore, isRejectedWithValue, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { apiSlice } from "./api/ApiSlice";
import { toast } from "sonner";

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action: any) => {
    if (isRejectedWithValue(action)) {
      const endpointName = action.meta?.arg?.endpointName;
      if (endpointName !== "getProtectedUser") {
        if (action.payload?.status === 401) {
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error(
            action.payload?.data?.message || "An error occurred. Please try again later."
          );
        }
      }
    }
    return next(action);
  };

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, rtkQueryErrorLogger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

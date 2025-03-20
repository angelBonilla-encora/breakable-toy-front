import { configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./slices/ui";
import { inventoryApi } from "./api/inventoryApi";



export const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,

    [inventoryApi.reducerPath] : inventoryApi.reducer,
  },
  middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(inventoryApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


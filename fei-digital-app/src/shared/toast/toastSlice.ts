import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface Toast {
  isShowed: boolean;
  status: string;
  content?: string[];
  message?: string;
}

const initialState: Toast = {
  isShowed: false,
  status: "success",
  content: ["Todo ha salido bien!!"],
  message: "Todo ha salido bien!!",
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToastError: (state, action: PayloadAction<{ content: string[] }>) => {
      state.status = "error";
      state.content = action.payload.content;
      state.isShowed = true;
    },
    showToastSuccess: (state, action: PayloadAction<string>) => {
      state.status = "success";
      state.message = action.payload;
      state.isShowed = true;
    },
    closeToast: (state) => {
      state.isShowed = false;
    },
  },
});

export const { showToastError, showToastSuccess, closeToast } =
  toastSlice.actions;
export const selectToast = (state: RootState) => state.toast;
export default toastSlice.reducer;

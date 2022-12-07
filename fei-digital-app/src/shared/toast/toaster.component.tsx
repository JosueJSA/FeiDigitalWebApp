import { Snackbar } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeToast, selectToast } from "./toastSlice";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function Toaster() {
  const toast = useAppSelector(selectToast);
  const dispatch = useAppDispatch();

  return (
    <Snackbar
      open={toast.isShowed}
      autoHideDuration={6000}
      onClose={() => dispatch(closeToast())}
    >
      <Alert
        onClose={() => dispatch(closeToast())}
        severity={toast.status === "error" ? "error" : "success"}
        sx={{ width: "100%" }}
      >
        {toast.status === "error"
          ? toast.content?.map((message) => (
              <div key={message}>
                {message}
                <br />
              </div>
            ))
          : toast.message}
      </Alert>
    </Snackbar>
  );
}

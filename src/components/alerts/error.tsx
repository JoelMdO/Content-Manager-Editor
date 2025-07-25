import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Swal from "sweetalert2";

const errorAlert = (
  type: string,
  status: string = "",
  message: string | unknown = "",
  router?: AppRouterInstance
) => {
  ///=============================================================
  // Error Alerts with use of sweetalert
  ///=============================================================
  //
  let text: string;
  let button_text: string = "Retry";
  let confirmButtonColor = "red";
  //
  //Type of Alerts messages
  switch (status) {
    case "non200":
      text = `Upload ${type} failed ${message}.`;
      break;
    case "nonauth":
      text = `Authentication failed ${message}. Please Login again.`;
      button_text = "Close";
      break;
    case "logout":
      text = `Attempt to logout failed ${message}.`;
      break;
    case "playbook":
      text = `${message}, please log in again`;
      button_text = "Go to Login";
      confirmButtonColor = "green";
      break;
    case "nonTranslated":
      text = `Translation failed ${message}.`;
      break;
    default:
      text = `Error uploading the ${type}: ${message}`;
      break;
  }
  ///------------------------------
  // Sweetalert
  ///------------------------------
  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: true,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "error",
    title: text,
    showConfirmButton: true,
    confirmButtonText: button_text,
    confirmButtonColor: confirmButtonColor,
  }).then((result) => {
    if (result.isConfirmed && status === "playbook") {
      router!.push("/");
    }
  });
};

export default errorAlert;

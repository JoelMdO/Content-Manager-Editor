import Swal from "sweetalert2";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const successAlert = (
  type: string,
  data?: string,
  resetForm?: () => void,
  router?: AppRouterInstance
) => {
  ///=============================================================
  // Sucess Alerts with use of sweetalert
  ///=============================================================
  //
  //
  let text: string;
  //
  // Alert types and messages
  switch (type) {
    case "link":
      text = "Link inserted";
      break;
    case "saved":
      text = "Article sent";
      break;
    case "auth":
      text = `Welcome!! \n${data!}`;
      break;
    case "translate":
      text = `Article translated`;
      break;
    case "summary":
      text = `Summary saved`;
      break;
    default:
      text = "Image uploaded";
      break;
  }
  ///------------------------------
  // Sweetalert
  ///------------------------------
  if (type === "playbook") {
    const Toast = Swal.mixin({
      toast: true,
      position: "center",
      showCancelButton: true,
      showConfirmButton: true,
    });
    Toast.fire({
      icon: "success",
      title: "Would you like to add a new entry?",
      confirmButtonText: "Yes",
      confirmButtonColor: "green",
      cancelButtonText: "No",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        resetForm!();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        router!.push("/home");
      }
    });
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: `${text}  successfully`,
    });
  }
};

export default successAlert;

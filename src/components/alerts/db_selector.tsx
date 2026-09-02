import { useLoadArticleStore } from "@/store/useLoadArticleStore";
import "animate.css";
import Swal from "sweetalert2";

const dbSelector = () => {
  ///=============================================================
  // A sweet alert for the user to select which database to be used
  // can be for DeCav or Joel
  ///=============================================================
  const setDbIsReady = useLoadArticleStore.getState().setDbIsReady;
  //
  ///------------------------------
  // Sweetalert
  ///------------------------------
  Swal.mixin({
    position: "center",
    showCancelButton: true,
    showConfirmButton: true,
  })
    .fire({
      icon: "question",
      width: "90% md-[55vw]",
      title: "Are you creating an article for?",
      confirmButtonText: "DeCav",
      cancelButtonText: "Joel",
      customClass: {
        confirmButton: "bg-decav-toast-color py-2 px-2 text-black font-normal",
        cancelButton:
          "bg-joel-toast-color text-black py-2 px-2 ml-2 font-normal",
      },
      buttonsStyling: false,
      showClass: {
        popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                `,
      },
      hideClass: {
        popup: `
                  animate__animated
                  animate__fadeOutDown  
                  animate__faster
                `,
      },
      backdrop: `
            rgba(0,90,123,0.4)
            url("/byJoel.png")
            right top
            no-repeat
            width: 25%
            height: 25%
            `,
    })
    .then((result) => {
      if (result.isConfirmed) {
        sessionStorage.setItem("db", "DeCav");
        setDbIsReady(true);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        sessionStorage.setItem("db", "Joel");
        setDbIsReady(true);
      }
    });
};

export default dbSelector;

import 'animate.css';
import { NextRouter } from 'next/router';
import Swal from 'sweetalert2';
import Colors from '@/utils/colors';
import { SetStateAction } from 'react';

const dbSelector = () => {
    ///=============================================================
    // A sweet alert for the user to select which database to be used
    // can be for DeCav or Joel
    ///=============================================================
    //
    ///------------------------------
    // Sweetalert
    ///------------------------------
        Swal.mixin({
            toast: true,
            position: "center",
            showCancelButton: true,
            showConfirmButton: true,
        }).fire({
            icon: "question",
            width: "90%",
            title: "Are you creating an article for?",
            confirmButtonText: "DeCav",
            cancelButtonText: "Joel",
            customClass: {
              confirmButton: "bg-decav-toast-color py-2 px-2 text-black font-bold",
              cancelButton: "bg-joel-toast-color text-black py-2 px-2 ml-2 font-bold",
            },
            buttonsStyling: false,
            showClass: {
                popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                `
              },
              hideClass: {
                popup: `
                  animate__animated
                  animate__fadeOutDown  
                  animate__faster
                `
              },
            backdrop: `
            rgba(0,90,123,0.4)
            url("/byJoel.png")
            right top
            no-repeat
            `
        }).then((result) => {
          console.log('result');
          
            if (result.isConfirmed) {
              console.log('dbSelector is Confirmed');
              sessionStorage.setItem("db", "DeCav");
            }else if (result.dismiss === Swal.DismissReason.cancel) {
              console.log('dbSelector dismiss or cancel');
              sessionStorage.setItem("db", "Joel");
            }
        });
}

export default dbSelector
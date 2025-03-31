import Swal from 'sweetalert2';

const successAlert = (type: string, data: string = "") => {
    //
    let text: string;
    //
    switch (type) {
        case "link":
        text = "Link inserted";
        break;
        case "saved":
        text = "Article sent";
        break;
        case "auth":
        text = `Welcome!! \n${data}`;
        break;
        default:
        text = "Image uploaded";
        break;
    }
    //

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: `${text}  successfully`
    });
}

export default successAlert
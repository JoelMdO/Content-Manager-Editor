const emailMe = async () => {
    ///========================================================
    // Function to allow the user to contact me
    ///========================================================
    const email = process.env.NEXT_PUBLIC_email; // Replace with your actual email
    window.location.href = `mailto:${email}`;
};

export default emailMe;
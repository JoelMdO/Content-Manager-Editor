
interface ButtonProps {
 type?: string;
}

const InopButton: React.FC<ButtonProps> = ({ type }) => {
   
    // Define the button type
    let label: string = "";
    switch (type) {
        case "load_article":
            label = "Read Article";
            break;
        case "edit_entry":
            label = "Edit Entry";
            break;
        default:
            label = "Default Label";
            break;
    }   
    // Function to handle button click
    const handleClick = () => {
        console.log(type);
    };

  return (
    <>
    <button className="bg-gray-800 ml-4 text-white py-3 px-4 rounded mt-2 pointer-events-none" type="button" onClick={() => handleClick()}>
    <span className="ml-8 absolute text-xs font-bold text-black bg-yellow px-6 py-1 rotate-45 pointer-events-none">INOP</span>{label}</button>
    </>
  );
};

export default InopButton;
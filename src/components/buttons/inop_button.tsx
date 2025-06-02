import text from "../../constants/buttons_data_text.json";
interface ButtonProps {
  type?: string;
}

const InopButton: React.FC<ButtonProps> = ({ type }) => {
  // Define the button type
  let label: string = "";
  switch (type) {
    case "load_article":
      label = `${text.buttons.labelReadArticle}`;
      break;
    case "edit_entry":
      label = `${text.buttons.labelEditEntry}`;
      break;
    default:
      label = `${text.buttons.labelDefault}`;
      break;
  }
  // Function to handle button click
  const handleClick = () => {};

  return (
    <>
      <button
        className="bg-gray-800 ml-4 text-white py-3 px-4 rounded mt-2 pointer-events-none"
        type="button"
        onClick={() => handleClick()}
      >
        <span className="ml-8 absolute text-xs font-bold text-black bg-yellow px-6 py-1 rotate-45 pointer-events-none">
          {text.buttons.inop}
        </span>
        {label}
      </button>
    </>
  );
};

export default InopButton;

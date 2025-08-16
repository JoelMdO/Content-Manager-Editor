import { ButtonProps } from "../type/type_menu_button";
import { createContext } from "react";

// Create MenuContext
const MenuContext = createContext<Partial<ButtonProps> | null>(null);
export default MenuContext;

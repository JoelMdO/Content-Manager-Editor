import { ButtonProps } from "../../components/Menu/Menu Button/type/type_menu_button";
import { createContext, useContext } from "react";

// Create MenuContext
const MenuContext = createContext<Partial<ButtonProps> | null>(null);
export default MenuContext;

// // useMenuContext should not be exported from a Next.js page file
// export const useMenuContext = () => {
//   const context = useContext(MenuContext);
//   if (!context) {
//     throw new Error("useMenuContext must be used within a MenuProvider");
//   }
//   return context;
// };

// export default MenuContext;
// //

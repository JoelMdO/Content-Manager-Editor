import { ButtonProps } from "../type/type_menu_button";
<<<<<<< HEAD
import { createContext } from "react";
=======
import { createContext, useContext } from "react";
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

// Create MenuContext
const MenuContext = createContext<Partial<ButtonProps> | null>(null);
export default MenuContext;
<<<<<<< HEAD
=======

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
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

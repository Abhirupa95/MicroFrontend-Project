
declare module "todo_components/List" {
    import React from "react";
  
    interface ListProps {
      items: string[];
    }
  
    const List: React.FC<ListProps>;
    export default List;
  }
  
  declare module "todo_components/Input" {
    import React from "react";
  
    interface InputProps {
      onSubmit: (item: string) => void; 
    }
  
    const Input: React.FC<InputProps>;
    export default Input;
  }
  declare module "todo_components/Button" {
    import React from "react";

    interface ButtonProps {
        onClick?: () => void;
        label?: string;
    }

    const Button: React.FC<ButtonProps>;
    export default Button;
}
declare module "todo_components/store" {
  import { Atom, PrimitiveAtom } from "jotai";

  export const countAtom: PrimitiveAtom<number>; // Assuming `countAtom` is exported in store.tsx
}


  
  
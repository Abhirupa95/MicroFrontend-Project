declare module 'yourRemotePath' {
    const RemoteApp: any;
    export default RemoteApp;
    }
    
    

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
          value: string;
          onChange: (value: string) => void;
          onSubmit: () => void;
        }
      
        const Input: React.FC<InputProps>;
        export default Input;
      }
      
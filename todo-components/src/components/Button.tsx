import { useState } from "react";
import "../App.css";
import useCount from "../store";


const Button: React.FC = () => {
//   const [count, setCount] = useState<number>(0);
  const [showCount, setShowCount] = useCount()


  return (
    <div>
      <button className="shared-btn" onClick={() => setShowCount((s) => s + 1)}>
        <p className="btn-text">Click me: {showCount}</p>
      </button>
    </div>
  );
};

export default Button; // 👈 Exporting as default to match `host.d.ts`

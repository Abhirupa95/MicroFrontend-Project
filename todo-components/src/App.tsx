import { useState } from "react";
import "./App.css";
import Input from "../src/components/Input";
import List from "../src/components/List";
import  Button  from "./components/Button";
import useCount from "./store";

function App() {
  const [items, setItems] = useState<string[]>([
    "Learn React",
    "Learn Vite",
    "Make an awesome app",
  ]);
  const [showCount, setShowCount] = useCount()

  const handleAddItem = (newItem: string) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <>
      <Input onSubmit={handleAddItem} />
      <List items={items} />
      <Button /> 
      <div>
        <button onClick={() => setShowCount((prev) => prev + 1)}>
          Count is {showCount}
        </button>
      </div>
    </>
  );
}

export default App;

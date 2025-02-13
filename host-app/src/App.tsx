import { useState } from "react";
import List from "todo_components/List";
import Input from "todo_components/Input";
import Button from "todo_components/Button";
import { useAtom } from "jotai";
import { countAtom } from "todo_components/store"; // Import from remote
// import useStore from "to"
import { useStore } from "jotai";

function App() {
  const [todos, setTodos] = useState<string[]>([
    "Learn React",
    "Learn Vite",
    "Make an awesome app",
  ]);
  const [count, setCount] = useAtom(countAtom);
  const handleSubmit = (newItem: string) => {
    if (newItem.trim() === "") return; // Prevent adding empty items
    setTodos((prev) => [...prev, newItem]); // Append new item to list
  };

  return (
    <>
      <Input onSubmit={handleSubmit} /> {/* Removed value & onChange */}
      <List items={todos} />
      <Button />
      <button onClick={() => setCount((prev) => prev + 1)}>Count - {count}</button>
    </>
  );
}
export default App
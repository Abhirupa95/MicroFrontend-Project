import React, { useState } from "react";

interface InputProps {
  onSubmit: (item: string) => void;
}

const Input: React.FC<InputProps> = ({ onSubmit }) => {
  const [text, setText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() !== "") {
      onSubmit(text);
      setText(""); // Clear input after adding
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex-row">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default Input;

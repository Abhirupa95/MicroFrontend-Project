import { importShared } from './__federation_fn_import-BV9PeGej.js';
import { j as jsxRuntimeExports } from './jsx-runtime-XI9uIe3W.js';

const {useState} = await importShared('react');

const Input = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== "") {
      onSubmit(text);
      setText("");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        value: text,
        onChange: (e) => setText(e.target.value)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", children: "Add" })
  ] }) });
};

export { Input as default };

import { j as jsxRuntimeExports } from './jsx-runtime-XI9uIe3W.js';
import useCount from './__federation_expose_Store-BRXbH7wj.js';

const Button = () => {
  const [showCount, setShowCount] = useCount();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "shared-btn", onClick: () => setShowCount((s) => s + 1), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "btn-text", children: [
    "Click me: ",
    showCount
  ] }) }) });
};

export { Button as default };

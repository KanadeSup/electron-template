import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<div>Hello World</div>} />
    </Routes>
  </BrowserRouter>,
);

import { createRoot } from "react-dom/client";

function App() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
} else {
  throw new Error("Root element not found");
}

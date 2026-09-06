import { createRoot } from "react-dom/client";
import { Button } from "./modules/design-system/components/shadcn-ui/button";

function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button>Click me</Button>
    </div>
  );
}
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
} else {
  throw new Error("Root element not found");
}

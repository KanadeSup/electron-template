import Logger from "electron-log";
import "./index.css";

// invoke say hello channel
window.electron.ipcRenderer.invoke("say-hello", { name: "World" }).then((response) => {
  Logger.info(response);
});

console.log('👋 This message is being logged by "renderer.ts", included via Vite');

import "./global.css";
import "./pages/Game/Game";
import "./pages/LevelSelect/LevelSelect";
import "./pages/Lobby/Lobby";
import "./router";
import "./utils/cssVariables";
import { ROUTER_COMPONENT } from "./utils/constants";
import Alert from "./components/alert";

document.body.innerHTML = `<${ROUTER_COMPONENT.ROUTER} class='df jc ai'>${Alert.render()}</${ROUTER_COMPONENT.ROUTER}>`;
Alert.events();

if ("serviceWorker" in navigator) {
  void navigator.serviceWorker.register("./sw.js");
}

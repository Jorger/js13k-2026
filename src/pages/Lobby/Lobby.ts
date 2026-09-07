import "./styles.css";
import { $on, qs, setHtml } from "../../utils/helpers";
import { getCurrentLevelFromCache, getTotalLevels } from "../../levels";
import { navigate } from "../../utils/navigate";
import {
  EVENT_TYPE,
  ROUTER_COMPONENT,
  ROUTER_PAGE,
} from "../../utils/constants";
import template from "./template.html?raw";

// import ButtonGame from "../../components/button";

// Total de niveles disponibles en el juego
const TOTAL_LEVELS = getTotalLevels();

/**
 * Representa la pantalla de inicio o lobby del juego.
 */
class Lobby extends HTMLElement {
  connectedCallback() {
    // Renderiza el template base del lobby
    this.innerHTML = template;

    // Referencias a los elementos clave dentro del template
    const startBtn = qs("button", this) as HTMLElement; // Botón "Play"
    const labelLevel = qs(".lob-l span", this) as HTMLElement;
    const completedLevel = getCurrentLevelFromCache();

    // Actualiza el label para mostrar progreso: "niveles completados / total"
    setHtml(labelLevel, `${completedLevel}/${TOTAL_LEVELS}`);

    // Agrega evento al botón para navegar a la página de selección de niveles
    $on(startBtn, EVENT_TYPE.CLICK, () => navigate(ROUTER_PAGE.LEVEL_SELECT));
  }
}

customElements.define(ROUTER_COMPONENT.LOBBY, Lobby);

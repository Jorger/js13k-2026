import {
  BASE_PAGE_CLASS,
  GAME_LABEL_ATTRIBUTE,
  ROUTER_COMPONENT,
} from "../../utils/constants";
import { getLevel, getTotalLevels, saveLevelCache } from "../../levels";
import { Grid } from "./components";
import { setHtml } from "../../utils/helpers";
import Alert from "../../components/alert";
import { navigate } from "../../utils/navigate";

class Game extends HTMLElement {
  static get observedAttributes() {
    return [GAME_LABEL_ATTRIBUTE];
  }

  private grid: Grid | null = null;
  private currentLevel: number = 0;

  connectedCallback() {
    // Obtener el atributo "level" definido en el HTML (ej. <app-game level="1">)
    const attrLevel = this.getAttribute(GAME_LABEL_ATTRIBUTE);
    this.currentLevel = attrLevel ? parseInt(attrLevel, 10) : 0;

    this.render();
  }

  private render() {
    this.grid?.unmount();

    // 7
    this.grid = new Grid(
      getLevel(this.currentLevel),
      this.nextLevel.bind(this),
    );

    setHtml(
      this,
      /*html*/ `<div class="${BASE_PAGE_CLASS}">${this.grid}</div>${Alert.render()}`,
    );

    this.grid.mount();
    Alert.events();
  }

  private nextLevel(isNextLevel = false) {
    const data = {
      icon: "🦄",
      txt: !isNextLevel
        ? "Ouch! Try again."
        : "Level Complete! Get ready for the next one.",
      no: "Home",
      yes: !isNextLevel ? "Restart" : "Next Level",
    };

    Alert.show({
      ...data,
      cb: (success) => {
        if (success) {
          if (!isNextLevel) {
            return this.render();
          }

          const nextLevel = this.currentLevel + 1;
          if (nextLevel <= getTotalLevels()) {
            saveLevelCache(this.currentLevel);
            this.currentLevel++;
            this.render();
            return;
          }
        }

        navigate();
      },
    });
  }
}

customElements.define(ROUTER_COMPONENT.GAME, Game);

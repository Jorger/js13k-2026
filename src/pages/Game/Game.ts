import { getLevel, getTotalLevels, saveLevelCache } from "../../levels";
import { Grid } from "./components";
import { navigate } from "../../utils/navigate";
import { setHtml } from "../../utils/helpers";
import {
  BASE_PAGE_CLASS,
  GAME_LABEL_ATTRIBUTE,
  ROUTER_COMPONENT,
} from "../../utils/constants";
import Alert from "../../components/alert";
import ButtonGame from "../../components/button";

class Game extends HTMLElement {
  static get observedAttributes() {
    return [GAME_LABEL_ATTRIBUTE];
  }

  private grid: Grid | null = null;
  private currentLevel: number = 0;
  private backButton: ButtonGame | null = null;
  private restart: ButtonGame | null = null;

  connectedCallback() {
    // Obtener el atributo "level" definido en el HTML (ej. <app-game level="1">)
    const attrLevel = this.getAttribute(GAME_LABEL_ATTRIBUTE);
    this.currentLevel = attrLevel ? parseInt(attrLevel, 10) : 0;

    this.backButton = new ButtonGame("back", "Back", () => {
      this.grid?.unmount();

      navigate();
    });

    this.restart = new ButtonGame("restart", "Restart", () => this.render());

    this.render();
  }

  private render() {
    this.grid?.unmount();

    this.grid = new Grid(
      getLevel(this.currentLevel),
      this.nextLevel.bind(this),
    );

    setHtml(
      this,
      /*html*/ `<div class="${BASE_PAGE_CLASS}">${this.backButton!.render()}${this.restart!.render()}${this.grid}</div>`,
    );

    this.grid.mount();
    this.backButton!.event();
    this.restart!.event();
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

          if (nextLevel < getTotalLevels()) {
            saveLevelCache(this.currentLevel);
            this.currentLevel++;
            this.render();
            return;
          }
        }

        this.grid?.unmount();
        navigate();
      },
    });
  }
}

customElements.define(ROUTER_COMPONENT.GAME, Game);

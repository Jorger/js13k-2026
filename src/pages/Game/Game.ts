import { setHtml } from "../../utils/helpers";
import { BASE_PAGE_CLASS, ROUTER_COMPONENT } from "../../utils/constants";
import { Grid } from "./components";
import { getLevel } from "../../levels";

class Game extends HTMLElement {
  private grid: Grid | null = null;

  connectedCallback() {
    this.render();
  }

  private render() {
    this.grid = new Grid(getLevel(0));

    setHtml(
      this,
      /*html*/ `<div class="${BASE_PAGE_CLASS}">${this.grid}</div>`,
    );

    this.grid.mount();
  }
}

customElements.define(ROUTER_COMPONENT.GAME, Game);

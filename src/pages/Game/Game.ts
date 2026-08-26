import { setHtml } from "../../utils/helpers";
import { BASE_PAGE_CLASS, ROUTER_COMPONENT } from "../../utils/constants";
import { Grid } from "./components";
import { getLevel } from "../../levels";

class Game extends HTMLElement {
  private grid: Grid | null = null;

  connectedCallback() {
    // console.log(getLevel(0));
    this.render();
  }

  private render() {
    // console.log(getLevel(4));

    this.grid = new Grid(getLevel(0));

    setHtml(
      this,
      /*html*/ `<div class="${BASE_PAGE_CLASS}">${this.grid}</div>`,
    );

    this.grid.mount();
  }
}

customElements.define(ROUTER_COMPONENT.GAME, Game);

import { ROUTER_COMPONENT } from "../../utils/constants";
import { setHtml } from "../../utils/helpers";

class Game extends HTMLElement {
  connectedCallback() {
    console.log("LLEGA AL COMPONENTE GAME");

    this.render();
  }

  private render() {
    // Renderizar estructura HTML del juego
    setHtml(
      this,
      /*html*/ `<div class="df jc ai wi he">Renderiza algo</div>`
    );
  }
}

customElements.define(ROUTER_COMPONENT.GAME, Game);

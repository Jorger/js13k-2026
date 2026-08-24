import Box from "../../components/box";
import Brick from "../../components/brick";
import Rainbow from "../../components/rainbow";
import Tile from "../../components/tile";
import Unicorn from "../../components/unicorn";
import { ETypeUnicorn, ROUTER_COMPONENT } from "../../utils/constants";
import { setHtml } from "../../utils/helpers";

const TEST_SIZE = 100;

class Game extends HTMLElement {
  connectedCallback() {
    console.log("LLEGA AL COMPONENTE GAME");
    this.render();
  }

  private render() {
    const testUnicorn = new Unicorn({
      position: { x: 0, y: 0 },
      size: TEST_SIZE,
    });
    const testUnicorn2 = new Unicorn({
      position: { x: TEST_SIZE, y: 0 },
      size: TEST_SIZE,
      type: ETypeUnicorn.INVERT,
    });

    const testBrick = new Brick({
      position: { x: 0, y: TEST_SIZE * 1 },
      size: TEST_SIZE,
    });

    // const testRainbow = new Rainbow({
    //   position: { x: 0, y: TEST_SIZE * 2 },
    //   size: TEST_SIZE,
    // });
    const testBox = new Box({
      position: { x: 0, y: TEST_SIZE * 2 },
      size: TEST_SIZE,
      label: 2,
    });

    const testTile = new Tile({
      position: { x: 0, y: 0 },
      size: TEST_SIZE,
    });

    const testTile2 = new Tile({
      position: { x: 0, y: TEST_SIZE * 1 },
      size: TEST_SIZE,
    });

    const testTile3 = new Tile({
      position: { x: 0, y: TEST_SIZE * 2 },
      size: TEST_SIZE,
    });

    // Renderizar estructura HTML del juego
    setHtml(
      this,
      /*html*/ `<div class="df jc ai wi he">${testTile}${testTile2}${testTile3}${testUnicorn}${testUnicorn2}${testBrick}${testBox}</div>`,
    );

    // console.log(testUnicorn.el);
  }
}

customElements.define(ROUTER_COMPONENT.GAME, Game);

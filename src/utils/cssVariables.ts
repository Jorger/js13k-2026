import { BASE_HEIGHT, BASE_WIDTH, SPEED_MOVEMENT } from "./constants";
import { setCssVariable } from "./helpers";

setCssVariable(document.documentElement, "bh", `${BASE_HEIGHT}px`);
setCssVariable(document.documentElement, "bw", `${BASE_WIDTH}px`);
setCssVariable(document.documentElement, "sp", `${SPEED_MOVEMENT}ms`);

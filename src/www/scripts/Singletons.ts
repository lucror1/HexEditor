// This definitely isn't the "nicest" way to manage signletons, but this is a good "stopgap"
// I don't want to make everything static to eventually allow for switching between multiple maps

import { Application } from "pixi.js";
import { HexStorage } from "./models/Hex.js";
import { InteractionManager } from "./controllers/InteractionManager.js";
import { DisplayManager } from "./views/DisplayManager.js";
import { Camera } from "./views/Camera.js";

const app = new Application({
    resizeTo: window,
    background: "#333333"
});
const hexStorage = new HexStorage();
const interactionManager = new InteractionManager();
const displayManager = new DisplayManager();
const camera = new Camera();

export { app, hexStorage, interactionManager, displayManager, camera };
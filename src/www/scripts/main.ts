import * as PIXI from "pixi.js";

import { app, hexStorage } from "./Singletons.js";
import { Hex, HexStorage } from "./models/Hex.js";
import { InteractionManager } from "./controllers/InteractionManager.js";

// Load assets
PIXI.Assets.init({
    manifest: "config/assetManifest.json"
}).then(() => {
    PIXI.Assets.backgroundLoadBundle(["map-icons"]);
});

document.addEventListener("DOMContentLoaded", async () => {
    document.body.appendChild(app.view as unknown as Node);
    
    for (let q = 0; q < 10; q++) {
        for (let r = 0; r < 10; r++) {
            hexStorage.set(new Hex(q, r));
        }
    }
});
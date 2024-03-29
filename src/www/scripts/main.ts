import * as PIXI from "pixi.js";

import { app, hexStorage } from "./Singletons.js";
import { Hex } from "./models/Hex.js";
import { DecorationTypes, TerrainTypes } from "./views/Style.js";

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

    /* let root = document.createElement("div");
    root.setAttribute("id", "editor-window");
    document.querySelector("body").appendChild(root); */
});
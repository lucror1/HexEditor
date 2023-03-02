import * as PIXI from "pixi.js";
import { Hex, HexStorage } from "./Hex.js";
import { InteractionManager } from "./InteractionManager.js";

await PIXI.Assets.init({
    manifest: "manifest.json"
});
PIXI.Assets.backgroundLoadBundle(["map-icons"]);

const app = new PIXI.Application({
    resizeTo: window,
    background: "#333333"
});
document.body.appendChild(app.view as unknown as Node);

const map = new HexStorage();
for (let q = 10; q <= 16; q++) {
    for (let r = 0; r <= 6; r++) {
        if (Math.abs(-(q - 13)-(r - 3)) > 3) {
            continue;
        }

        map.set(new Hex(app, q, r));
    }
}

const manager = new InteractionManager(map);
document.addEventListener("pointerdown", (evt: MouseEvent) => {
    manager.handleClick(evt);
});
document.addEventListener("keydown", (evt: KeyboardEvent) => {
    manager.handleKey(evt);
});

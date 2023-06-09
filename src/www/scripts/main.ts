import * as PIXI from "pixi.js";
import { Hex, HexStorage } from "./Hex.js";
import { InteractionManager } from "./InteractionManager.js";

PIXI.Assets.init({
    manifest: "config/assetManifest.json"
}).then(() => {
    PIXI.Assets.backgroundLoadBundle(["map-icons"]);
});

const app = new PIXI.Application({
    resizeTo: window,
    background: "#333333"
});
app.stage.sortableChildren = true;
document.body.appendChild(app.view as unknown as Node);

const map = new HexStorage();
for (let q = 0; q < 10; q++) {
    for (let r = 0; r < 10; r++) {
        map.set(new Hex(app, q, r));
    }
}

const manager = new InteractionManager(map);

/* let g = new PIXI.Graphics();
g.beginFill(0x30b700);
g.lineStyle({
    width: 3,
    color: 0xffff00,
    alignment: 1
});
g.drawPolygon(Hex.hexPoints);
g.pivot.x = g.width / 2;
g.pivot.y = g.height / 2;
let coords = Hex.axialToRect(13, 0);
g.x = coords.x;
g.y = coords.y;
app.stage.addChild(g); */
// https://www.redblobgames.com/grids/hexagons/

import * as PIXI from "pixi.js";

// Stores a 2D array of Hexes, allowing for negative indices
class HexStorage {
    // ++, +-, -+, --
    #pospos: Hex[][];
    #posneg: Hex[][];
    #negpos: Hex[][];
    #negneg: Hex[][];

    constructor() {
        this.#pospos = [];  // (0, 0) lives here
        this.#posneg = [];
        this.#negpos = [];
        this.#negneg = [];
    }

    get(q: number, r: number): Hex {
        let active = this.#selectArray(q, r);

        if (active.length <= q || active[q].length <= r) {
            return null;
        }

        return active[Math.abs(q)][Math.abs(r)];
    }

    set(h: Hex): void {
        let active = this.#selectArray(h.q, h.r);
        let aQ = Math.abs(h.q);
        let aR = Math.abs(h.r);

        // If the array is too short, fill it
        if (active[aQ] === undefined) {
            active[aQ] = [];
        }

        active[aQ][aR] = h;
    }

    // Select which array should be used based on the coordinate's sign
    #selectArray(q: number, r: number): Hex[][] {
        let qSign = Math.sign(q);
        let rSign = Math.sign(r);
        if (qSign >= 0 && rSign >= 0) {
            return this.#pospos;
        } else if (qSign < 0 && rSign >= 0) {
            return this.#negpos;
        } else if (qSign >= 0 && rSign < 0) {
            return this.#posneg;
        } else if (qSign < 0 && rSign < 0) {
            return this.#negneg;
        }
    }
}

class Hex {
    static size = 25;
    static s3 = Math.sqrt(3);
    static s32 = Math.sqrt(3)/2;
    static hexPoints = [
        {x: Hex.size * 2,   y: Hex.s32*Hex.size     },
        {x: Hex.size * 3/2, y: Hex.s32*Hex.size * 2 },
        {x: Hex.size / 2,   y: Hex.s32*Hex.size * 2 },
        {x: 0,              y: Hex.s32*Hex.size     },
        {x: Hex.size/2,     y: 0                    },
        {x: Hex.size * 3/2, y: 0                    }
    ];

    static #debug = {
        showCoords: false
    };

    #q: number;
    #r: number;
    #s: number;
    #graphics: PIXI.Graphics;

    constructor(q: number, r: number, color: number=0xffffff) {
        this.#q = q;
        this.#r = r;
        this.#s = -q-r;

        this.#graphics = this.#initGraphics(color);
        app.stage.addChild(this.#graphics);

        /* this.#graphics.interactive = true;
        this.#graphics.on("pointerdown", () => {
            console.log(`${q}, ${r}`);
        }); */
    }

    #initGraphics(color: number): PIXI.Graphics {
        let g = new PIXI.Graphics();
        g.beginFill(color);
        g.lineStyle({
            width: 1,
            color: 0x000000,
            alignment: 0
        });
        g.drawPolygon(Hex.hexPoints);
        g.pivot.x = g.width / 2;
        g.pivot.y = g.height / 2;
        let coords = Hex.axialToRect(this.#q, this.#r);
        //g.x = app.screen.width / 2 + coords.x;
        //g.y = app.screen.height / 2 + coords.y;
        g.x = coords.x;
        g.y = coords.y;

        if (Hex.#debug.showCoords) {
            const style = new PIXI.TextStyle({
                fontSize: 12
            });
            const text = new PIXI.Text(`${this.#q}, ${this.#r}`, style);
            text.x = text.width;
            text.y = text.height;
            text.pivot.x = text.width / 2;
            text.pivot.y = text.height / 2;
            g.addChild(text);
        }

        return g;
    }

    static axialToRect(q: number, r: number): {x: number, y: number} {
        return {
            x: Hex.size * 3/2 * q,
            y: Hex.size * (Hex.s32 * q + Hex.s3 * r)
        };
    }

    static rectToAxial(x: number, y: number): {q: number, r: number} {
        let q = 2/3 * x / Hex.size;
        let r = (-1/3 * x + Hex.s3/3 * y) / Hex.size;
        let s = -q - r;

        let rq = Math.round(q);
        let rr = Math.round(r);
        let rs = Math.round(s);

        let diffQ = Math.abs(q - rq);
        let diffR = Math.abs(r - rr);
        let diffS = Math.abs(s - rs);

        if (diffQ > diffR && diffQ > diffS) {
            rq = -rr-rs;
        } else if (diffR > diffS) {
            rr = -rq-rs;
        }

        return {
            q: rq,
            r: rr
        };
    }

    get q(): number {
        return this.#q;
    }

    get r(): number {
        return this.#r;
    }

    get graphics(): PIXI.Graphics {
        return this.#graphics;
    }
}

class InteractionManager {
    static #tintColor = 0xffff00;

    #selected: Hex;

    constructor() {
        this.#selected = null;
    }

    handleHexClick(evt: MouseEvent) {
        this.selectHex(evt);
    }

    selectHex(evt: MouseEvent) {
        this.unselectHex();

        let coord = Hex.rectToAxial(evt.clientX, evt.clientY);
        this.#selected = arr.get(coord.q, coord.r);
        if (this.#selected === null) {
            return;
        }
        this.#selected.graphics.tint = InteractionManager.#tintColor;
    }

    unselectHex() {
        if (this.#selected !== null) {
            this.#selected.graphics.tint = 0xffffff;
        }
    }
}

PIXI.Assets.init({
    manifest: "manifest.json"
});

const app = new PIXI.Application({
    resizeTo: window,
    background: "#333333"
});
document.body.appendChild(app.view as unknown as Node);

const arr = new HexStorage();
for (let q = 10; q <= 16; q++) {
    for (let r = 0; r <= 6; r++) {
        if (Math.abs(-(q - 13)-(r - 3)) > 3) {
            continue;
        }

        arr.set(new Hex(q, r));
    }
}

const manager = new InteractionManager();
document.addEventListener("pointerdown", (evt: MouseEvent) => {
    manager.handleHexClick(evt);
});
document.addEventListener("keydown", (evt: KeyboardEvent) => {
    if (evt.code === "Escape") {
        manager.unselectHex();
    }
});

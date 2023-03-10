import * as PIXI from "pixi.js";
import { TerrainType, TerrainStyle, TerrainMap } from "./Terrain.js";
export { Hex, HexStorage };

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
        let aq = Math.abs(q);
        let ar = Math.abs(r);

        if (aq >= active.length || active[aq] === undefined || ar >= active[aq].length) {
            return null;
        }

        return active[aq][ar] || null;
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
    static defaultLineStyle: PIXI.ILineStyleOptions = {
        width: 1,
        color: 0x000000,
        alignment: 0
    };
    static highlightLineStyle: PIXI.ILineStyleOptions = {
        width: 4,
        color: 0xffff00,
        alignment: 0.5
    };
    static defaultZIndex = 0;
    static furtherZIndex = -1;
    static closerZIndex = 1;

    static #debug = {
        showCoords: false
    };

    #q: number;
    #r: number;
    #s: number;
    #graphics: PIXI.Graphics;
    #terrain: TerrainType;
    #style: TerrainStyle;

    constructor(app: PIXI.Application, q: number, r: number,
                terrainType: TerrainType=TerrainType.Plains) {
        this.#q = q;
        this.#r = r;
        this.#s = -q-r;
        this.#terrain = terrainType;
        this.#style = TerrainMap.get(terrainType);

        this.#graphics = this.#initGraphics(this.#style.color);
        app.stage.addChild(this.#graphics);
    }

    #initGraphics(color: number): PIXI.Graphics {
        let g = new PIXI.Graphics();
        g.beginFill(color);
        g.lineStyle(Hex.defaultLineStyle);
        g.drawPolygon(Hex.hexPoints);
        g.pivot.x = g.width / 2;
        g.pivot.y = g.height / 2;
        let coords = Hex.axialToRect(this.#q, this.#r);
        g.x = coords.x;
        g.y = coords.y;

        g.zIndex = Hex.defaultZIndex;

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

    get style(): TerrainStyle {
        return this.#style;
    }

    get color(): number | undefined {
        return this.#style.color;
    }
}
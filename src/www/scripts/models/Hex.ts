import { Graphics, Sprite } from "pixi.js";

import { DecorationType, DecorationTypes, TerrainType, TerrainTypes } from "../views/Style.js";
import { displayManager } from "../Singletons.js";

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

    set(hex: Hex): void {
        let active = this.#selectArray(hex.q, hex.r);
        let aQ = Math.abs(hex.q);
        let aR = Math.abs(hex.r);

        // If the array is too short, fill it
        if (active[aQ] === undefined) {
            active[aQ] = [];
        }

        active[aQ][aR] = hex;

        displayManager.drawHex(hex);
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
    #q: number;
    #r: number;
    #s: number;
    graphics: Graphics;
    decorationSprite: Sprite;
    terrain: TerrainType;
    decoration: DecorationType
    highlighted: boolean;

    constructor(q: number, r: number,
                terrainType: TerrainType=TerrainTypes.Plains,
                decorationType: DecorationType=null) {
        this.#q = q;
        this.#r = r;
        this.#s = -q-r;
        this.terrain = terrainType;
        this.decoration = decorationType;
        this.graphics = new Graphics();
        this.decorationSprite = new Sprite();
        this.highlighted = false;
    }

    get q(): number {
        return this.#q;
    }

    get r(): number {
        return this.#r;
    }
}

type RectCoord = {
    x: number,
    y: number
}

type AxialCoord = {
    q: number,
    r: number
}

export { Hex, HexStorage, RectCoord, AxialCoord };
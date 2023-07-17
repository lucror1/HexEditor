import * as PIXI from "pixi.js";

import { Hex, RectCoord, AxialCoord } from "../models/Hex";
import { app } from "../Singletons.js";
import { terrainMap } from "../Terrain.js";

class DisplayManager {
    // A bunch of settings and conveinence calculations for drawing hexes
    static #size = 25;
    static #s3 = Math.sqrt(3);
    static #s32 = Math.sqrt(3)/2;
    static #hexPoints = [
        {x: DisplayManager.#size * 2,   y: DisplayManager.#s32*DisplayManager.#size     },
        {x: DisplayManager.#size * 3/2, y: DisplayManager.#s32*DisplayManager.#size * 2 },
        {x: DisplayManager.#size / 2,   y: DisplayManager.#s32*DisplayManager.#size * 2 },
        {x: 0,                          y: DisplayManager.#s32*DisplayManager.#size     },
        {x: DisplayManager.#size/2,     y: 0                                            },
        {x: DisplayManager.#size * 3/2, y: 0                                            }
    ];
    static #defaultZIndex = 0;
    static #furtherZIndex = -1;
    static #closerZIndex = 1;
    
    static #minScale = 0.5;
    static #maxScale = 2.0;

    static #defaultLineStyle: PIXI.ILineStyleOptions = {
        width: 1,
        color: 0x000000,
        alignment: 0
    };
    static #highlightLineStyle: PIXI.ILineStyleOptions = {
        width: 4,
        color: 0xffff00,
        alignment: 0.5
    };

    // TODO: remove this debug option
    static #debug = {
        showCoords: false
    };

    #container: PIXI.Container;
    #scale: number;

    constructor() {
        this.#scale = 1.0;
        this.#initContainer();
    }

    drawHex(hex: Hex) {
        this.#initGraphics(hex);
        this.#container.addChild(hex.graphics);
    }

    // Shift the pan in the direction indicated by dx and dy
    // TODO: add clamping in panning
    alterPan(dx: number, dy: number) {
        this.#container.x += dx;
        this.#container.y += dy;
    }

    // Alter the scale by the amount shown, with clamping
    incrementScale(val: number) {
        this.#scale += val;
        this.#scale = Math.min(this.#scale, DisplayManager.#maxScale)
        this.#scale = Math.max(this.#scale, DisplayManager.#minScale);
        this.#container.scale.set(this.#scale);
    }

    #initContainer() {
        // Create an empty container to allow panning
        this.#container = new PIXI.Container();
        this.#container.sortableChildren = true;
        this.#container.scale.set(this.#scale);
        app.stage.addChild(this.#container);
        
    }

    #initGraphics(hex: Hex): PIXI.Graphics {
        this.redrawHex(hex);

        let g = hex.graphics;
        g.pivot.x = g.width / 2;
        g.pivot.y = g.height / 2;
        let coords = this.axialToRect(hex.q, hex.r);
        g.x = coords.x;
        g.y = coords.y;

        return g;
    }

    redrawHex(hex: Hex) {
        let g = hex.graphics;
        g.clear();

        const style = terrainMap.get(hex.terrain);

        // Determine fill color
        let fillColor = style.color;
        g.beginFill(fillColor);

        // Determine if highlighted
        if (hex.highlighted) {
            g.lineStyle(DisplayManager.#highlightLineStyle);
            g.zIndex = DisplayManager.#closerZIndex;
        } else {
            g.lineStyle(DisplayManager.#defaultLineStyle);
            g.zIndex = DisplayManager.#defaultZIndex;
        }

        g.drawPolygon(DisplayManager.#hexPoints);

        this.#debugDraw(hex);
    }

    #debugDraw(hex: Hex) {
        if (DisplayManager.#debug.showCoords) {
            let g = hex.graphics;
            const style = new PIXI.TextStyle({
                fontSize: 12
            });
            const text = new PIXI.Text(`${hex.q}, ${hex.r}`, style);
            text.x = text.width;
            text.y = text.height;
            text.pivot.x = text.width / 2;
            text.pivot.y = text.height / 2;
            g.addChild(text);
        }
    }

    get container() {
        return this.#container;
    }

    axialToRect(q: number, r: number, applyTransform: boolean=true): RectCoord {
        // Need to account for the shift from the container
        let x = DisplayManager.#size * 3/2 * q;
        let y = DisplayManager.#size * (DisplayManager.#s32 * q + DisplayManager.#s3 * r);

        if (applyTransform) {
            x *= this.#container.scale.x;
            y *= this.#container.scale.y;

            x += this.#container.x;
            y += this.#container.y;
        }

        return {
            x: x,
            y: y
       };
    }
    
    rectToAxial(x: number, y: number, applyTransform: boolean=true): AxialCoord {
        if (applyTransform) {
            x -= this.#container.x;
            y -= this.#container.y;

            x /= this.#container.scale.x;
            y /= this.#container.scale.y;
        }

        // Need to account for the shift from the container
        let q = 2/3 * x / DisplayManager.#size;
        let r = (-1/3 * x + DisplayManager.#s3/3 * y) / DisplayManager.#size;
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
}

export { DisplayManager };
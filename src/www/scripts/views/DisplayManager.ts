import * as PIXI from "pixi.js";

import { Hex, RectCoord, AxialCoord } from "../models/Hex.js";
import { app, camera } from "../Singletons.js";
import { DecorationTypes } from "./Style.js";

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
    static #decorationZIndex = 2;

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
        showCoords: false,
        showCenter: false,
        showDecorationCenter: false
    };

    // Only call this the first time a hex is being draw. For all future calls, use redrawHex
    drawHex(hex: Hex) {
        this.#initGraphics(hex);
        camera.container.addChild(hex.graphics);
        camera.container.addChild(hex.decorationSprite);
    }

    async #initGraphics(hex: Hex) {
        await this.redrawHex(hex);

        let coords = this.axialToRect(hex.q, hex.r);

        let g = hex.graphics;
        g.pivot.x = g.width / 2;
        g.pivot.y = g.height / 2;

        g.x = coords.x;
        g.y = coords.y;
    }

    // Redraw an *already drawn* hex to update its appearance
    async redrawHex(hex: Hex) {
        const g = hex.graphics;
        const s = hex.decorationSprite;
        g.clear();

        // Style according to the terrain
        const terrainStyle = hex.terrain.style;
        let fillColor = terrainStyle.color;
        g.beginFill(fillColor);

        // Apply a terrain decoration if needed
        const decoration = hex.decoration;
        if (decoration !== null) {
            s.zIndex = DisplayManager.#decorationZIndex;
            PIXI.Assets.load(decoration.style.imgPath).then(texture => {
                s.texture = texture;

                let coords = this.axialToRect(hex.q, hex.r);
                s.x = coords.x;
                s.y = coords.y;

                if (decoration.style.dx) {
                    s.x += decoration.style.dx;
                }
                if (decoration.style.dy) {
                    s.y += decoration.style.dy;
                }

                s.pivot.x = s.width / s.scale.x / 2;
                s.pivot.y = s.height / s.scale.y / 2;

                if (decoration.style.scale) {
                    s.scale.set(decoration.style.scale);
                } else {
                    let xScale = DecorationTypes.DEFAULT.style.xScale;
                    let yScale = DecorationTypes.DEFAULT.style.xScale;
                    s.scale.set(decoration.style.xScale || xScale,
                        decoration.style.yScale || yScale);
                }
            });
        }

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

        if (DisplayManager.#debug.showCenter) {
            let g = hex.graphics;
            g.beginFill(0xff0000);
            g.lineStyle(DisplayManager.#defaultLineStyle);
            g.arc(g.width / 2, g.height / 2, 3, 0, 2*Math.PI);
        }
    }

    axialToRect(q: number, r: number, toGlobal: boolean=false): RectCoord {
        // Need to account for the shift from the container
        let x = DisplayManager.#size * 3/2 * q;
        let y = DisplayManager.#size * (DisplayManager.#s32 * q + DisplayManager.#s3 * r);

        if (toGlobal) {
            let p = new PIXI.Point(x, y);
            p = camera.container.toGlobal(p);
            x = p.x;
            y = p.y;
        }

        return {
            x: x,
            y: y
       };
    }
    
    rectToAxial(x: number, y: number, applyTransform: boolean=true): AxialCoord {
        if (applyTransform) {
            let p = new PIXI.Point(x, y);
            p = camera.container.toLocal(p);
            x = p.x;
            y = p.y;
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
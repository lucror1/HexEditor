import { hexStorage } from "../Singletons.js";
import { Hex, HexStorage } from "../models/Hex.js";
import { DisplayManager } from "../views/DisplayManager.js";

class InteractionManager {
    static #tintColor = 0xffff00;

    #selected: Hex;

    constructor() {
        this.#selected = null;

        // Register event listeners
        document.addEventListener("pointerdown", (evt: MouseEvent) => {
            this.handleClick(evt);
        });
        document.addEventListener("keydown", (evt: KeyboardEvent) => {
            this.handleKey(evt);
        });
    }

    handleClick(evt: MouseEvent) {
        this.#selectHex(evt);
    }

    handleKey(evt: KeyboardEvent) {
        switch (evt.code) {
            case "Escape":
                this.#unselectHex();
                break;
        }
    }

    #selectHex(evt: MouseEvent) {
        this.#unselectHex();

        let coord = DisplayManager.rectToAxial(evt.clientX, evt.clientY);
        this.#selected = hexStorage.get(coord.q, coord.r);
        if (this.#selected === null) {
            return;
        }
        //this.#selected.graphics.tint = InteractionManager.#tintColor;
        let g = this.#selected.graphics;
        g.clear();
        //g.beginFill(this.#selected.color);
        g.beginFill(0x00ff00);
        g.lineStyle(DisplayManager.highlightLineStyle);
        g.zIndex = DisplayManager.closerZIndex;
        g.drawPolygon(DisplayManager.hexPoints);
    }

    #unselectHex() {
        if (this.#selected !== null) {
            //this.#selected.graphics.tint = 0xffffff;
            let g = this.#selected.graphics;
            g.clear();
            //g.beginFill(this.#selected.color);
            g.beginFill(0x00ff00);
            g.lineStyle(DisplayManager.defaultLineStyle);
            g.zIndex = DisplayManager.defaultZIndex;
            g.drawPolygon(DisplayManager.hexPoints);
            this.#selected = null;
        }
    }
}

export { InteractionManager };
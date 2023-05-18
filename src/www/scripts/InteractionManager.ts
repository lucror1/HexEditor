import { Hex, HexStorage } from "./Hex.js";

class InteractionManager {
    static #tintColor = 0xffff00;

    #selected: Hex;
    #map: HexStorage;

    constructor(map: HexStorage) {
        this.#selected = null;
        this.#map = map;

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

        let coord = Hex.rectToAxial(evt.clientX, evt.clientY);
        this.#selected = this.#map.get(coord.q, coord.r);
        if (this.#selected === null) {
            return;
        }
        //this.#selected.graphics.tint = InteractionManager.#tintColor;
        let g = this.#selected.graphics;
        g.clear();
        g.beginFill(this.#selected.color);
        g.lineStyle(Hex.highlightLineStyle);
        g.zIndex = Hex.closerZIndex;
        g.drawPolygon(Hex.hexPoints);
    }

    #unselectHex() {
        if (this.#selected !== null) {
            //this.#selected.graphics.tint = 0xffffff;
            let g = this.#selected.graphics;
            g.clear();
            g.beginFill(this.#selected.color);
            g.lineStyle(Hex.defaultLineStyle);
            g.zIndex = Hex.defaultZIndex;
            g.drawPolygon(Hex.hexPoints);
            this.#selected = null;
        }
    }
}

export { InteractionManager };
import { Hex } from "./Hex.js";
export { InteractionManager };
class InteractionManager {
    static #tintColor = 0xffff00;
    #selected;
    #map;
    constructor(map) {
        this.#selected = null;
        this.#map = map;
        // Register event listeners
        document.addEventListener("pointerdown", (evt) => {
            this.handleClick(evt);
        });
        document.addEventListener("keydown", (evt) => {
            this.handleKey(evt);
        });
    }
    handleClick(evt) {
        this.#selectHex(evt);
    }
    handleKey(evt) {
        switch (evt.code) {
            case "Escape":
                this.#unselectHex();
                break;
        }
    }
    #selectHex(evt) {
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
//# sourceMappingURL=InteractionManager.js.map
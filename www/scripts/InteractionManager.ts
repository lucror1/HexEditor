import { Hex, HexStorage } from "./Hex.js";
export { InteractionManager };

class InteractionManager {
    static #tintColor = 0xffff00;

    #selected: Hex;
    #map: HexStorage;

    constructor(map: HexStorage) {
        this.#selected = null;
        this.#map = map;
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
        this.#selected.graphics.tint = InteractionManager.#tintColor;
    }

    #unselectHex() {
        if (this.#selected !== null) {
            this.#selected.graphics.tint = 0xffffff;
            this.#selected = null;
        }
    }
}
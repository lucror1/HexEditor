import { hexStorage, displayManager } from "../Singletons.js";
import { AxialCoord, Hex, HexStorage, RectCoord } from "../models/Hex.js";
import { DisplayManager } from "../views/DisplayManager.js";

class InteractionManager {
    // MouseEvent.buttons encodes which buttons are pressed as a bitmask
    static #leftMouse = 0b001;
    static #rightMouse = 0b010;
    static #middleMouse = 0b100;

    #pointerDownHex: AxialCoord;
    #selected: Hex;
    #lastMousePos: RectCoord;

    constructor() {
        this.#pointerDownHex = null;
        this.#selected = null;
        this.#lastMousePos = null;

        // Register event listeners
        document.addEventListener("pointerdown", (evt: MouseEvent) => {
            this.handlePointerDown(evt);
        });
        document.addEventListener("pointerup", (evt: MouseEvent) => {
            this.handlePointerUp(evt);
        });
        document.addEventListener("pointermove", (evt: MouseEvent) => {
            this.handlePointerMove(evt);
        });
        document.addEventListener("keydown", (evt: KeyboardEvent) => {
            this.handleKey(evt);
        });
        document.addEventListener("wheel", (evt: WheelEvent) => {
            this.handleWheel(evt);
        });
    }

    handlePointerDown(evt: MouseEvent) {
        // Only listen to left mouse clicks
        if (!(evt.buttons & InteractionManager.#leftMouse)) {
            return;
        }

        this.#pointerDownHex = displayManager.rectToAxial(evt.clientX, evt.clientY);
    }

    handlePointerUp(evt: MouseEvent) {
        let coord = displayManager.rectToAxial(evt.clientX, evt.clientY);
        if (this.#pointerDownHex !== null && coord.q === this.#pointerDownHex.q
            && coord.r === this.#pointerDownHex.r) {
            this.#selectHex(evt);
        }
    }

    handlePointerMove(evt: MouseEvent) {
        // A move has occured, prevent a hex from being selected
        this.#pointerDownHex = null;
        
        // If left click is being clicked, pan
        if ((evt.buttons & InteractionManager.#leftMouse) && this.#lastMousePos != null) {
            /* console.log("Panning"); */
            //console.log(displayManager.container.x);
            let dx = evt.clientX - this.#lastMousePos.x;
            let dy = evt.clientY - this.#lastMousePos.y;
            displayManager.container.x += dx;
            displayManager.container.y += dy;
        }

        // Update last known position
        this.#lastMousePos = {x: evt.clientX, y: evt.clientY};
    }

    handleKey(evt: KeyboardEvent) {
        switch (evt.code) {
            case "Escape":
                this.#unselectHex();
                break;
        }
    }

    handleWheel(evt: WheelEvent) {
        displayManager.incrementScale(-Math.sign(evt.deltaY) * 0.1);
    }

    #selectHex(evt: MouseEvent) {
        this.#unselectHex();

        let coord = displayManager.rectToAxial(evt.clientX, evt.clientY);
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
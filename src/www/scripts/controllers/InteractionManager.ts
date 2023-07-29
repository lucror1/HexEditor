import { Editor } from "../Editor.js";
import { hexStorage, displayManager, camera } from "../Singletons.js";
import { AxialCoord, Hex, HexStorage, RectCoord } from "../models/Hex.js";
import { DisplayManager } from "../views/DisplayManager.js";

enum MouseTarget {
    None,
    Canvas,
    Editor
}

class InteractionManager {
    // MouseEvent.buttons encodes which buttons are pressed as a bitmask
    static #leftMouse = 0b001;
    static #rightMouse = 0b010;
    static #middleMouse = 0b100;

    #pointerDownHex: AxialCoord;
    #selectedHex: Hex;
    #lastMousePos: RectCoord;
    #mouseTarget: MouseTarget;
    //#editorPos: RectCoord;
    #editor: Editor;

    constructor() {
        this.#pointerDownHex = null;
        this.#selectedHex = null;
        this.#lastMousePos = null;
        this.#mouseTarget = MouseTarget.None;
        this.#editor = new Editor();

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

        /* if ((evt.target as HTMLElement).id === "editor-window") {
            this.#mouseTarget = MouseTarget.Editor;
        } else {
            this.#mouseTarget = MouseTarget.Canvas;
            this.#pointerDownHex = displayManager.rectToAxial(evt.clientX, evt.clientY);
        } */
        if ((evt.target as HTMLElement).tagName === "CANVAS") {
            this.#mouseTarget = MouseTarget.Canvas;
            this.#pointerDownHex = displayManager.rectToAxial(evt.clientX, evt.clientY);
        } else {
            this.#mouseTarget = MouseTarget.Editor;
        }
    }

    handlePointerUp(evt: MouseEvent) {
        if (this.#mouseTarget === MouseTarget.Canvas) {
            let coord = displayManager.rectToAxial(evt.clientX, evt.clientY);
            if (this.#pointerDownHex !== null && coord.q === this.#pointerDownHex.q
                && coord.r === this.#pointerDownHex.r) {
                this.#selectHex(evt);
            }
        }
    }

    handlePointerMove(evt: MouseEvent) {
        // Do nothing if the mouse isn't down
        if ((evt.buttons & InteractionManager.#leftMouse) !== 0) {
            // Compute distance moved by mouse if possible
            let dx = 0;
            let dy = 0;
            if (this.#lastMousePos !== null) {
                dx = evt.clientX - this.#lastMousePos.x;
                dy = evt.clientY - this.#lastMousePos.y;
            }

            if (this.#mouseTarget === MouseTarget.Canvas) {
                // A move has occured, prevent a hex from being selected
                // TODO: prevent this deselection from happening if the mouse moves only a little
                this.#pointerDownHex = null;
                
                // Pan the camera
                camera.alterPan(dx, dy);
            } else {
                this.#editor.x += dx;
                this.#editor.y += dy;
            }
        }

        // Update last known mouse position
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
        if ((evt.target as HTMLElement).id !== "editor-window") {
            let point = {x: evt.clientX, y: evt.clientY};
            camera.scaleAtPoint(-Math.sign(evt.deltaY) * 0.1, point);
        }
    }

    #selectHex(evt: MouseEvent) {
        this.#unselectHex();

        let coord = displayManager.rectToAxial(evt.clientX, evt.clientY);
        this.#selectedHex = hexStorage.get(coord.q, coord.r);
        if (this.#selectedHex === null) {
            return;
        }

        this.#selectedHex.highlighted = true;
        displayManager.redrawHex(this.#selectedHex);
    }

    #unselectHex() {
        if (this.#selectedHex !== null) {
            this.#selectedHex.highlighted = false;
            displayManager.redrawHex(this.#selectedHex);
            this.#selectedHex = null;
        }
    }

    #getEditorWindow(): HTMLElement {
        return document.querySelector("#editor-window");
    }
}

export { InteractionManager };
import { Container } from "pixi.js";
import { RectCoord } from "../models/Hex.js";
import { app } from "../Singletons.js";

class Camera {
    static #maxScale = 2.0;
    static #minScale = 1.0;

    #container: Container;
    #scale: number;

    constructor() {
        this.#scale = 1.0;
        this.#initContainer();
    }

    // Shift the pan in the direction indicated by dx and dy
    // TODO: add clamping in panning
    alterPan(dx: number, dy: number) {
        this.#container.x += dx;
        this.#container.y += dy;
    }

    scaleAtPoint(ds: number, point: RectCoord) {
        // Set the pivot to the mouse's position
        let local = this.#container.toLocal(point);
        this.#container.pivot.set(local.x, local.y);

        // Scale the container
        this.scale(ds);

        // After the scaling the pivot won't be on the mouse
        // Need to shift to be on the mouse for scaling to look good
        this.#container.position.set(point.x, point.y);
    }

    // Alter the scale by the amount shown, with clamping
    scale(ds: number) {
        this.#scale += ds;
        this.#scale = Math.min(this.#scale, Camera.#maxScale)
        this.#scale = Math.max(this.#scale, Camera.#minScale);
        this.#container.scale.set(this.#scale);
    }

    #initContainer() {
        // Create an empty container to allow panning
        this.#container = new Container();
        this.#container.sortableChildren = true;
        this.#container.scale.set(this.#scale);
        app.stage.addChild(this.#container);
        
    }

    get container() {
        return this.#container;
    }
}

export { Camera };
import { RectCoord } from "./models/Hex.js";
import { DecorationTypes, TerrainTypes } from "./views/Style.js";

class Editor {
    static id = "editor-window";
    static #startX = 20;
    static #startY = 20;

    #element: HTMLElement;
    #x: number;
    #y: number;

    constructor() {
        this.#x = Editor.#startX;
        this.#y = Editor.#startY;
        this.#element = this.#createElement();

        document.body.appendChild(this.#element);
    }

    #createElement() {
        let elem = document.createElement("div");
        elem.id = Editor.id;
        elem.style.right = this.#x.toString() + "px";
        elem.style.top = this.#y.toString() + "px";

        // Add a title
        let title = document.createElement("h2");
        title.innerHTML = "Editor";
        elem.appendChild(title);

        // Create the terrain editor
        let terrain = document.createElement("div");
        {
            let label = document.createElement("label");
            label.setAttribute("for", "terrain");
            label.innerHTML = "Terrain: ";
            terrain.appendChild(label);

            let select = document.createElement("select");
            select.name = "terrain";
            select.id = "terrain";
            for (let t of TerrainTypes.ALL) {
                let o = document.createElement("option");
                o.innerHTML = t;
                select.appendChild(o);
            }
            terrain.appendChild(select);
        }
        elem.appendChild(terrain);

        // Create the decoration editor
        let decoration = document.createElement("div");
        {
            let label = document.createElement("label");
            label.setAttribute("for", "decoration");
            label.innerHTML = "Decoration: ";
            decoration.appendChild(label);

            let select = document.createElement("select");
            select.name = "terrain";
            select.id = "terrain";
            for (let t of DecorationTypes.ALL) {
                let o = document.createElement("option");
                o.innerHTML = DecorationTypes[t].niceName;
                o.value = t;
                select.appendChild(o);
            }
            decoration.appendChild(select);
        }
        elem.appendChild(decoration);

        return elem;
    }

    get x() {
        return -this.#x;
    }

    set x(x: number) {
        this.#x = -x;
        this.#element.style.right = -x.toString() + "px";
    }

    get y() {
        return this.#y;
    }

    set y(y) {
        this.#y = y;
        this.#element.style.top = y.toString() + "px";
    }

    get pos(): RectCoord {
        return {x: this.#x, y: this.#y};
    }

    set pos(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }
}

export { Editor };
import { displayManager } from "./Singletons.js";
import { Hex, RectCoord } from "./models/Hex.js";
import { DecorationTypes, TerrainTypes } from "./views/Style.js";

class Editor {
    static id = "editor-window";
    static #startX = 20;
    static #startY = 20;

    #element: HTMLElement;
    #terrainInput: HTMLSelectElement;
    #decorationInput: HTMLSelectElement;
    #x: number;
    #y: number;
    #hex: Hex;

    constructor() {
        this.#x = Editor.#startX;
        this.#y = Editor.#startY;
        this.#element = this.#createElement();
        this.#hex = null;

        this.#addEventListeners();

        document.body.appendChild(this.#element);
    }

    setHex(hex: Hex) {
        this.#hex = hex;
        
        // Handle deselection
        if (hex === null) {
            this.#element.style.display = "none";
            return;
        }

        this.#element.style.display = "block";

        this.#terrainInput.value = hex.terrain.name;
        
        if (hex.decoration !== null) {
            this.#decorationInput.value = hex.decoration.name;
        } else {
            this.#decorationInput.value = "DEFAULT";
        }
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

            this.#terrainInput = select;
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

            this.#decorationInput = select;
        }
        elem.appendChild(decoration);

        // Hide the editor by default
        elem.style.display = "none";

        return elem;
    }

    #addEventListeners() {
        this.#terrainInput.addEventListener("change", evt => {
            this.#terrainHandler(evt);
        });
        this.#decorationInput.addEventListener("change", evt => {
            this.#decorationHandler(evt);
        });
    }

    #terrainHandler(evt: Event) {
        let ter = TerrainTypes[this.#terrainInput.value];
        this.#hex.terrain = ter;
        displayManager.redrawHex(this.#hex);
    }

    #decorationHandler(evt: Event) {
        let dec = DecorationTypes[this.#decorationInput.value];
        if (dec === DecorationTypes.DEFAULT) {
            this.#hex.decoration = null;
        } else {
            this.#hex.decoration = dec;
        }
        displayManager.redrawHex(this.#hex);
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
}

export { Editor };
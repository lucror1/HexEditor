export { TerrainType, terrainMap as TerrainMap };
var TerrainType;
(function (TerrainType) {
    TerrainType["Plains"] = "Plains";
    TerrainType["Forest"] = "Forest";
    TerrainType["River"] = "River";
    TerrainType["Mountain"] = "Mountain";
})(TerrainType || (TerrainType = {}));
const terrains = [
    {
        name: "Plains",
        style: {
            "color": 3192576,
            "colorStr": "0x30b700"
        }
    },
    {
        name: "Forrest",
        style: {
            "color": 65280,
            "colorStr": "0x00ff00"
        }
    },
    {
        name: "River",
        style: {
            "color": 255,
            "colorStr": "0x0000ff"
        }
    },
    {
        name: "Mountain",
        style: {
            "color": 5000786,
            "colorStr": "0x4c4e52"
        }
    }
];
const terrainMap = new Map();
for (let terrain of terrains) {
    terrainMap.set(terrain.name, terrain.style);
}
//# sourceMappingURL=Terrain.js.map
enum TerrainType {
    Plains = "Plains",
    Forest = "Forest",
    River = "River",
    Mountain = "Mountain"
}

type TerrainStyle = {
    color: number | undefined,
    colorStr: string | undefined
}

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

const terrainMap = new Map<TerrainType, TerrainStyle>();
for (let terrain of terrains) {
    terrainMap.set(terrain.name as TerrainType, terrain.style);
}

export { TerrainType, TerrainStyle, terrainMap as TerrainMap };
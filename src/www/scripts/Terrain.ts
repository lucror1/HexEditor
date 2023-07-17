enum TerrainType {
    Plains = "Plains",
    Forest = "Forest",
    River = "River",
    Mountain = "Mountain"
}

type TerrainStyle = {
    color: number
}

const terrains = [
    {
        name: "Plains",
        style: {
            "color": 0x30b700
        }
    },
    {
        name: "Forest",
        style: {
            "color": 0x00ff00
        }
    },
    {
        name: "River",
        style: {
            "color": 0x0000ff
        }
    },
    {
        name: "Mountain",
        style: {
            "color": 0x4c4e52
        }
    }
];

const terrainMap = new Map<TerrainType, TerrainStyle>();
for (let terrain of terrains) {
    terrainMap.set(terrain.name as TerrainType, terrain.style);
}

export { TerrainType, TerrainStyle, terrainMap };
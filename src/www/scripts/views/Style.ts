type TerrainStyle = {
    color: number
}

class TerrainType {
    #name: String;
    #style: TerrainStyle;

    constructor(name: String, style: TerrainStyle) {
        this.#name = name;
        this.#style = style;
    }

    get name() {
        return this.#name;
    }

    get style() {
        return this.#style;
    }
}

const TerrainTypes = {
    Plains: new TerrainType("Plains", {
        color: 0x30b700
    }),
    Forest: new TerrainType("Forest", {
        color: 0x00ff00
    }),
    River: new TerrainType("River", {
        color: 0x0000ff
    }),
    Moutain: new TerrainType("Mountain", {
        color: 0x4c4e52
    })
}

// If scale exists, it should be applied to both x and y
// If scale does not exist, then xScale and yScale should be applied when they exist
// DecorationTypes.DEFAULT defines the scale if none of scale, xScale, or yScale exist
type DecorationStyle = {
    imgPath: string,
    dx?: number,
    dy?: number,
    scale?: number,
    xScale?: number,
    yScale?: number
}

class DecorationType {
    #name: string;
    #style: DecorationStyle;

    constructor(name: string, style: DecorationStyle) {
        this.#name = name;
        this.#style = style;
    }

    get name() {
        return this.#name;
    }

    get style() {
        return this.#style;
    }
}

const DecorationTypes = {
    DEFAULT: new DecorationType("DEFAULT", {
        imgPath: null,
        scale: 0.15,
        xScale: 0.15,
        yScale: 0.15
    }),
    Camp: new DecorationType("Camp", {
        imgPath: "img/map_icons/Camp.png",
        dy: 3,
        scale: 0.25
    }),
    Castle: new DecorationType("Castle", {
        imgPath: "img/map_icons/Castle.png"
    }),
    CastleRuin: new DecorationType("CastleRuin", {
        imgPath: "img/map_icons/CastleRuin.png"
    }),
    Cathedral: new DecorationType("Cathedral", {
        imgPath: "img/map_icons/Cathedral.png"
    }),
    CathedralRuin: new DecorationType("CathedralRuin", {
        imgPath: "img/map_icons/CathedralRuin.png"
    }),
    Clocktower: new DecorationType("Clocktower", {
        imgPath: "img/map_icons/Clocktower.png",
        xScale: 0.2
    }),
    Crater: new DecorationType("Crater", {
        imgPath: "img/map_icons/Crater.png",
        scale: 0.07
    }),
    DarkTower: new DecorationType("DarkTower", {
        imgPath: "img/map_icons/DarkTower.png",
        xScale: 0.13,
        yScale: 0.1
    }),
    DwarvenBuilding: new DecorationType("DwarvenBuilding", {
        imgPath: "img/map_icons/DwarvenBuilding.png",
        scale: 0.18
    }),
    DwarvenBuildingRuin: new DecorationType("DwarvenBuildingRuin", {
        imgPath: "img/map_icons/DwarvenBuildingRuin.png",
        scale: 0.18
    }),
    FortifiedTower: new DecorationType("FortifiedTower", {
        imgPath: "img/map_icons/FortifiedTower.png",
        xScale: 0.2
    }),
    FortifiedTowerRuin: new DecorationType("FortifiedTowerRuin", {
        imgPath: "img/map_icons/FortifiedTowerRuin.png",
        xScale: 0.2
    }),
    Fortress: new DecorationType("Fortress", {
        imgPath: "img/map_icons/Fortress.png",
        xScale: 0.13,
        yScale: 0.10
    }),
    House: new DecorationType("House", {
        imgPath: "img/map_icons/House.png",
        scale: 0.2
    }),
    Hut: new DecorationType("Hut", {
        imgPath: "img/map_icons/Hut.png",
        scale: 0.2
    }),
    Keep: new DecorationType("Keep", {
        imgPath: "img/map_icons/Keep.png",
        scale: 0.13
    }),
    LargeCity: new DecorationType("LargeCity", {
        imgPath: "img/map_icons/LargeCity.png",
        xScale: 0.08,
        yScale: 0.1
    }),
    LargeCityStoneWall: new DecorationType("LargeCityStoneWall", {
        imgPath: "img/map_icons/LargeCityStoneWall.png",
        xScale: 0.08,
        yScale: 0.1
    }),
    LargeCityStoneWallTowers: new DecorationType("LargeCityStoneWallTowers", {
        imgPath: "img/map_icons/LargeCityStoneWallTowers.png",
        xScale: 0.07,
        yScale: 0.1
    }),
    LargeStoneWall: new DecorationType("LargeStoneWall", {
        imgPath: "img/map_icons/LargeStoneWall.png",
        xScale: 0.08,
        yScale: 0.2
    }),
    Mill: new DecorationType("Mill", {
        imgPath: "img/map_icons/Mill.png",
        scale: 0.2
    }),
    Mine: new DecorationType("Mine", {
        imgPath: "img/map_icons/Mine.png",
        dy: -5,
        scale: 0.25
    }),
    MineRuin: new DecorationType("MineRuin", {
        imgPath: "img/map_icons/MineRuin.png",
        dy: -5,
        scale: 0.25
    }),
    MonsterTown: new DecorationType("MonsterTown", {
        imgPath: "img/map_icons/MonsterTown.png",
        xScale: 0.13
    }),
    MonsterVillage: new DecorationType("MonsterVillage", {
        imgPath: "img/map_icons/MonsterVillage.png",
        scale: 0.2
    }),
    OrcCamp: new DecorationType("OrcCamp", {
        imgPath: "img/map_icons/OrcCamp.png",
        scale: 0.12
    }),
    SmallCity: new DecorationType("SmallCity", {
        imgPath: "img/map_icons/SmallCity.png",
        xScale: 0.08,
        yScale: 0.1
    }),
    SmallCityStoneWall: new DecorationType("SmallCityStoneWall", {
        imgPath: "img/map_icons/SmallCityStoneWall.png",
        xScale: 0.08,
        yScale: 0.1
    }),
    SmallCityStoneWallTowers: new DecorationType("SmallCityStoneWallTowers", {
        imgPath: "img/map_icons/SmallCityStoneWallTowers.png",
        xScale: 0.07,
        yScale: 0.1
    }),
    SmallStoneWall: new DecorationType("SmallStoneWall", {
        imgPath: "img/map_icons/SmallStoneWall.png",
        xScale: 0.14,
        yScale: 0.2
    }),
    SmallTower: new DecorationType("SmallTower", {
        imgPath: "img/map_icons/SmallTower.png",
        xScale: 0.2
    }),
    StrangeCastle: new DecorationType("StrangeCastle", {
        imgPath: "img/map_icons/StrangeCastle.png",
        scale: 0.1
    }),
    Tavern: new DecorationType("Tavern", {
        imgPath: "img/map_icons/Tavern.png",
        scale: 0.17
    }),
    TavernRuin: new DecorationType("TavernRuin", {
        imgPath: "img/map_icons/TavernRuin.png",
        scale: 0.17
    }),
    Town: new DecorationType("Town", {
        imgPath: "img/map_icons/Town.png",
        scale: 0.13
    }),
    TownRuin: new DecorationType("TownRuin", {
        imgPath: "img/map_icons/TownRuin.png",
        scale: 0.13
    }),
    TownStoneWall: new DecorationType("TownStoneWall", {
        imgPath: "img/map_icons/TownStoneWall.png",
        xScale: 0.11,
        yScale: 0.13
    }),
    TownWoodWall: new DecorationType("TownWoodWall", {
        imgPath: "img/map_icons/TownWoodWall.png",
        xScale: 0.11,
        yScale: 0.13
    }),
    Townhouse: new DecorationType("Townhouse", {
        imgPath: "img/map_icons/Townhouse.png",
        scale: 0.2
    }),
    Village: new DecorationType("Village", {
        imgPath: "img/map_icons/Village.png"
    }),
    VillageRuin: new DecorationType("VillageRuin", {
        imgPath: "img/map_icons/VillageRuin.png"
    }),
    VillageStoneWall: new DecorationType("VillageStoneWall", {
        imgPath: "img/map_icons/VillageStoneWall.png",
        xScale: 0.12
    }),
    VillageStoneWallRuin: new DecorationType("VillageStoneWallRuin", {
        imgPath: "img/map_icons/VillageStoneWallRuin.png",
        xScale: 0.12
    }),
    VillageWoodWall: new DecorationType("VillageWoodWall", {
        imgPath: "img/map_icons/VillageWoodWall.png",
        xScale: 0.12
    }),
    WitchesHut: new DecorationType("WitchesHut", {
        imgPath: "img/map_icons/WitchesHut.png",
        scale: 0.18
    }),
    WoodenGate: new DecorationType("WoodenGate", {
        imgPath: "img/map_icons/WoodenGate.png",
        dy: -7,
        yScale: 0.18
    }),
    WoodenWall: new DecorationType("WoodenWall", {
        imgPath: "img/map_icons/WoodenWall.png",
        xScale: 0.13,
        yScale: 0.17
    })    
}

export {
    TerrainTypes, TerrainType, TerrainStyle,
    DecorationTypes, DecorationType, DecorationStyle
};
window.HorseTypes = {
    normal: "normal",
    pegasus: "pegasus",
    unicorn: "unicorn",
    alicorn: "alicorn",
}

window.Horses = {
    //Player
    "n001": {
        name: "Lucky",
        description: "Your very first horse! Some say he is a good luck charm",
        type: HorseTypes.normal,
        src: "/images/characters/horses/n001.png",
        icon: "/images/icons/horseIconBrown.png", 
        actions: ["spookedStatus", "nuzzlingBondStatus", "damage1"]
    },
    //Enemy
    "n002": {
        name: "Shadow",
        description: "A fearless steed, who races through the shadows for you!",
        type: HorseTypes.normal,
        src: "/images/characters/horses/n002.png",
        icon: "/images/icons/horseIconBlack.png",
        actions: ["damage1", "nuzzlingBondStatus", "spookedStatus"]
    },
    //Player
    "n003": {
        name: "Bandit",
        description: "A mischievous trickster, galloping like a whirlwind!",
        type: HorseTypes.normal,
        src: "/images/characters/horses/n003.png", 
        icon: "/images/icons/horseIconBrownWhitePaint.png",
        actions: ["spookedStatus", "nuzzlingBondStatus", "damage2"],
    },
    //Enemy
    "n004": {
        name: "Lightning",
        description: "With the power of a storm in its hooves!",
        type: HorseTypes.normal,
        src: "/images/characters/horses/n004.png", 
        icon: "/images/icons/horseIconBrown.png",
        actions: ["damage1", "spookedStatus", "nuzzlingBondStatus"]
    },
    //Enemy
    "n005": {
        name: "Tango",
        description: "She is a solid dance partner.",
        type: HorseTypes.normal,
        src: "/images/characters/horses/n005.png", 
        icon: "/images/icons/horseIconLightBrown.png",
        actions: ["damage1", "spookedStatus", "nuzzlingBondStatus"]
    },
    //Player
    "n006": {
        name: "Honey",
        description: "A sweet pony who would do anything to protect you.",
        type: HorseTypes.normal,
        src: "/images/characters/horses/n006.png", 
        icon: "/images/icons/horseIconLightBrown.png",
        actions: ["damage2", "spookedStatus", "nuzzlingBondStatus"]
    },
    //Enemy
    "n009": {
        name: "Picasso",
        description: "A true artist in battle.",
        type: HorseTypes.normal,
        src: "/images/characters/horses/n009.png", 
        icon: "/images/icons/horseIconBrownWhitePaint.png", 
        actions: ["damage1", "spookedStatus", "nuzzlingBondStatus"]
    },
    //Enemy
    "n010": {
        name: "Pebble",
        description: "A noble steed with a coat like gravel.",
        type: HorseTypes.normal,
        src: "/images/characters/horses/n010.png", 
        icon: "/images/icons/horseIconBlackWhitePaint.png",
        actions: ["damage1", "spookedStatus", "nuzzlingBondStatus"]
    },
}
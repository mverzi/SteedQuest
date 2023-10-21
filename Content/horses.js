window.HorseTypes = {
    normal: "normal",
    pegasus: "pegasus",
    unicorn: "unicorn",
    alicorn: "alicorn",
}

window.Horses = {
    "n001": {
        name: "Lucky",
        description: "Your very first horse! Some say he is a good luck charm",
        type: HorseTypes.normal,
        src: "/images/characters/horses/n001-hero.png",
        icon: "/images/icons/spicy.png", //to do, placeholder currently being used
        actions: ["spookedStatus", "nuzzlingBondStatus", "damage1"]
    },
    "n002": {
        name: "Shadow",
        description: "A fearless steed, who races through the shadows for you!",
        type: HorseTypes.normal,
        src: "/images/characters/horses/n001.png", //update to another horse
        icon: "/images/icons/spicy.png", //to do, placeholder currently being used
        actions: ["damage1"]
    },
    "n003": {
        name: "Bandit",
        description: "A mischievous trickster, galloping like a whirlwind!",
        type: HorseTypes.normal,
        src: "/images/characters/horses/n002-hero.png", 
        icon: "/images/icons/spicy.png", //to do, placeholder currently being used
        actions: ["spookedStatus", "nuzzlingBondStatus", "damage1"],
    },
    "n004": {
        name: "Lightning",
        description: "With the power of a storm in its hooves!",
        type: HorseTypes.normal,
        src: "/images/characters/horses/n002.png", 
        icon: "/images/icons/spicy.png", //to do, placeholder currently being used
        actions: ["damage1", "spookedStatus", "nuzzlingBondStatus"]
    },

}
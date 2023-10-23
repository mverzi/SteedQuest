class PlayerState {
    constructor() {
        this.horses = {
            "h1": {
                horseId: "n001",
                hp: 50,
                maxHp: 50,
                xp: 0,
                maxXp: 100,
                level: 1,
                status: { type: "nuzzling bond"},
            },
            "h2": {
                horseId: "n003",
                hp: 55,
                maxHp: 55,
                xp: 0,
                maxXp: 100,
                level: 1,
                status: null,
            },
        }
        this.lineup = ["h1", "h2"];
        this.items = [
            {actionId: "item_recoverStatus", instanceId: "item1"},
            {actionId: "item_recoverHp", instanceId: "item2"},
        ]
    }
}

window.playerState = new PlayerState();
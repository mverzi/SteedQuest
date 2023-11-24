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
                status: null,
            },
        }
        this.lineup = ["h1"];
        this.items = [
            {actionId: "item_recoverStatus", instanceId: "item1"},
            {actionId: "item_recoverHp", instanceId: "item2"},
        ]
        this.storyFlags = {
            
        }
    }

    addHorse(horseId) {
        const newId = `n${Date.now()}` + Math.floor(Math.random() * 99999);
        this.horses[newId] = {
            horseId,
            hp: 60,
            maxHp: 60,
            xp: 0,
            maxXp: 100,
            level: 1,
            status: null,
        }
        if(this.lineup.length < 3) {
            this.lineup.push(newId)
        }
        utils.emitEvent("LineupChanged");
        console.log(this);
    }

    swapLineup(oldId, incomingId) {
        const oldIndex = this.lineup.indexOf(oldId);
        this.lineup[oldIndex] = incomingId;
        utils.emitEvent("LineupChanged");
    }

    moveToFront(futureFrontId) {
        this.lineup = this.lineup.filter(id => id !== futureFrontId);
        this.lineup.unshift(futureFrontId);
        utils.emitEvent("LineupChanged");
    }

    healHorsesHp() {
        for (const horseId of this.lineup) {
            const horse = this.horses[horseId];
            console.log(horse);
            horse.hp = horse.maxHp;
            console.log(horse.hp);
        }
        const hud = new Hud();
        hud.init(document.querySelector(".game-container"));
    }

}

window.playerState = new PlayerState();
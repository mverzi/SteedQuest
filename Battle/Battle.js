class Battle {
    constructor() {
        this.combatants = {
            "player1": new Combatant({
                ...Horses.n001,
                team: "player",
                hp: 30,
                maxHp: 50,
                xp: 0,
                maxXp: 100,
                level: 1,
                status: null
            }, this),
            "enemy1": new Combatant({
                ...Horses.n002,
                team: "enemy",
                hp: 20,
                maxHp: 50,
                xp: 20,
                maxXp: 100,
                level: 1,
                status: null
            }, this),
            "enemy2": new Combatant({
                ...Horses.n002,
                team: "enemy",
                hp: 20,
                maxHp: 50,
                xp: 30,
                maxXp: 100,
                level: 1,
                status: null
            }, this)
        }
        this.activeCombatants = {
            player: "player1",
            enemy: "enemy1",
        }
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Battle");
        this.element.innerHTML = (`
        <div class="Battle_hero">
            <img src="${'images/characters/people/hero.png'}" alt="Hero" />
        </div>
        <div class="Battle_enemy">
            <img src="${'images/characters/people/trainer1.png'}" alt="Enemy" />
        </div>
        `)
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);

        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element);
        })
    }
}
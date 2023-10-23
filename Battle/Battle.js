class Battle {
    constructor({enemy, onComplete}) {

        this.enemy = enemy;
        this.onComplete = onComplete;

        this.combatants = {
            // "player1": new Combatant({
            //     ...Horses.n001,
            //     team: "player",
            //     hp: 30,
            //     maxHp: 50,
            //     xp: 95,
            //     maxXp: 100,
            //     level: 1,
            //     status: { type: "nuzzling bond"},
            //     isPlayerControlled: true
            // }, this),
            // "player2": new Combatant({
            //     ...Horses.n003,
            //     team: "player",
            //     hp: 35,
            //     maxHp: 50,
            //     xp: 0,
            //     maxXp: 100,
            //     level: 1,
            //     status: { type: "nuzzling bond"},
            //     isPlayerControlled: true
            // }, this),
            // "enemy1": new Combatant({
            //     ...Horses.n002,
            //     team: "enemy",
            //     hp: 1,
            //     maxHp: 50,
            //     xp: 20,
            //     maxXp: 100,
            //     level: 1,
            //     status: null
            // }, this),
            // "enemy2": new Combatant({
            //     ...Horses.n004,
            //     team: "enemy",
            //     hp: 20,
            //     maxHp: 50,
            //     xp: 30,
            //     maxXp: 100,
            //     level: 1,
            //     status: null
            // }, this)
        }

        this.activeCombatants = {
            player: null,
            enemy: null,
        }

        //Add player team to screen
        window.playerState.lineup.forEach(id => {
            this.addCombatant(id, "player", window.playerState.horses[id]);
        })

        //Add enemy team to screen
        Object.keys(this.enemy.horses).forEach(key => {
          this.addCombatant("e_" + key, "enemy", this.enemy.horses[key]);
        })

        this.items = [];
        window.playerState.items.forEach(item => {
          this.items.push({
            ...item,
            team: "player"
          })
        })
        this.usedInstanceIds = {};
    }

    addCombatant(id, team, config) {
        this.combatants[id] = new Combatant({
          ...Horses[config.horseId],
          ...config,
          team,
          isPlayerControlled: team === "player"
        }, this)
  
        //Populate first active horse
  
        console.log(this)
        this.activeCombatants[team] = this.activeCombatants[team] || id
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Battle");
        this.element.innerHTML = (`
        <div class="Battle_hero">
            <img src="${'images/characters/people/hero.png'}" alt="Hero" />
        </div>
        <div class="Battle_enemy">
            <img src="${this.enemy.src}" alt=${this.enemy.name} />
        </div>
        `)
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    
        this.playerTeam = new Team("player", "Hero");
        this.enemyTeam = new Team("enemy", "Bully");
    
        Object.keys(this.combatants).forEach(key => {
          let combatant = this.combatants[key];
          combatant.id = key;
          combatant.init(this.element)
          
          //Add to correct team
          if (combatant.team === "player") {
            this.playerTeam.combatants.push(combatant);
          } else if (combatant.team === "enemy") {
            this.enemyTeam.combatants.push(combatant);
          }
        })
    
        this.playerTeam.init(this.element);
        this.enemyTeam.init(this.element);
    
        this.turnCycle = new TurnCycle({
          battle: this,
          onNewEvent: event => {
            return new Promise(resolve => {
              const battleEvent = new BattleEvent(event, this)
              battleEvent.init(resolve);
            })
          },
          onWinner: winner => {
            if(winner === "player"){
              const playerState = window.playerState;
              Object.keys(playerState.horses).forEach(id => {
                const playerStateHorse = playerState.horses[id];
                const combatant = this.combatants[id];
                if(combatant) {
                  playerStateHorse.hp = combatant.hp;
                  playerStateHorse.xp = combatant.xp;
                  playerStateHorse.maxXp = combatant.maxXp;
                  playerStateHorse.level = combatant.level;
                }
              })
              //Remove used items from player inventory
              playerState.items = playerState.items.filter(item => {
                return !this.usedInstanceIds[item.instanceId];
              })

            }
            this.element.remove();
            this.onComplete();
          }
        })
        this.turnCycle.init();
    }
}
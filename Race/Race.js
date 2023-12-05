class Race {
    constructor({ enemy, onComplete}) {
        this.parallax = 0;
        this.enemy = enemy;
        this.onComplete = onComplete;
        this.competitors = {
            // "player1": new Competitor({
            //     ...Horses.n001,
            //     team: "player",
            //     hp: 50,
            //     maxHp: 50,
            //     xp: 75,
            //     maxXp: 100,
            //     speed: 2,
            //     acceleration: 10,
            //     jump: 10,
            //     x: 0,
            //     level: 1,
            //     status: {type: "saucy"},
            //     isPlayerControlled: true
            // }, this), 
            // "player2": n ew Competitor({
            //     ...Horses.n003,
            //     team: "player",
            //     hp: 50,
            //     maxHp: 50,
            //     xp: 35,
            //     maxXp: 100, 
            //     speed: 2.3,
            //     acceleration: 1,
            //     jump: 10,
            //     x: 0,
            //     level: 1,
            //     status: null,
            //     isPlayerControlled: true
            // }, this), 
            // "enemy1": new Competitor({
            //     ...Horses. n002,
            //     team: "enemy",
            //     hp: 50,
            //     maxHp: 50,
            //     xp: 75,
            //     maxXp: 100,
            //     speed: 2,
            //     acceleration: 10,
            //     jump: 10,
            //     x: 0,
            //     level: 1,
            //      status: null
            // }, this)

        
        }

        this.activeCompetitors = {
            player: null, //"player1",
            enemy: null, //"enemy1",
        }

        window.playerState.lineup.forEach(id => {
            this.addCompetitor(id, "player", window.playerState.horses[id])
        }); 

        Object.keys(this.enemy.horses).forEach(key => [
            this.addCompetitor("e_"+key, "enemy", this.enemy.horses[key])
        ])

       
        this.items = [
            // {actionId: "item_recoverStatus", instanceId: "p1", team: "player"},
            // {actionId: "item_recoverStatus", instanceId: "p2", team: "player"},
            // {actionId: "item_recoverStatus", instanceId: "p3", team: "enemy"}
        ]
        
    }
    addCompetitor(id, team, config) {
        this.competitors[id] = new Competitor({
            ...Horses[config.horseId],
            ...config,
            team,
            x: 0,
            isPlayerControlled: team === "player",
        }, this);
    
        this.activeCompetitors[team] = this.activeCompetitors[team] || id;
    }

    getWinningTeam() {
        let winner = null;
        let winningPosition = -1;
    
        Object.values(this.competitors).forEach(competitor => {
          if (competitor.x >= 300 && (winner === null || competitor.x > winningPosition)) {
            winner = competitor.team;
            winningPosition = competitor.x;
          }
        });
    
        return winner;
      }

    createElement() {
        
        this.element = document.createElement("div");
        this.element.classList.add("Race");
        this.element.innerHTML = (`
        <div class="Race_background">
            <canvas id="parallaxCanvas" width="352" height="198"><  /canvas>
        </div>
        `);

        const boostContainer = document.createElement("div");
        boostContainer.classList.add("BoostButtonContainer");

        boostContainer.style.display = "none";

        const boostButton = document.createElement("button");
        boostButton.innerText = "Boost";
        boostButton.addEventListener("click", () => this.boostPlayer());
        boostButton.classList.add("BoostButton"); // Add a class to style the button
        boostButton.style.display = "none"; // Set initial display to none
         boostContainer.appendChild(boostButton);

    // Append BoostContainer to the main race element
    this.element.appendChild(boostContainer);
    }
   
    init(container) {
        this.createElement();
        container.appendChild(this.element); 
        const canvas = document.getElementById("parallaxCanvas");
        const parallax = new Parallax(canvas, this);
     

        Object.keys(this.competitors).forEach(key => {
            let competitor = this.competitors[key];
            competitor.id = key;
            competitor.init(this.element);
        })

        this.removeEnemyCompetitorUI();

        this.raceEvent = new RaceEvent ({
            race: this,
            onNewEvent: rcevent => {
                return new Promise(resolve => {
                    const blankEvent = new BlankEvent(rcevent, this)
                     blankEvent.init(resolve);
                })
            },
            onWinner(winner) {
                if (winner === "player") {
                    const message = "Winner!";
                    this.onNewEvent({
                        type: "textMessage",
                        text: message
                    }).then(() => {
                        
                        console.log(message);
                    });
                } else {
                    const message = "Better luck next time!";
                    this.onNewEvent({
                        type: "textMessage",
                        text: message
                    }).then(() => {
                        // Handle any additional logic after showing the "Better luck next time" message for the player
                        // For example, update UI, award consolation prizes, etc.
                        console.log(message);
                    });
                }
            }
            
        })
        this.raceEvent.init();

        container.classList.add("RaceContainer");

         
    }

    boostPlayer() {
        const playerCompetitorId = this.activeCompetitors.player;
        const playerCompetitor = this.competitors[playerCompetitorId];
        playerCompetitor.useBoost();
    }

    boostComputerRandomly(competitorId) {
        const competitor = this.competitors[competitorId];

        if (Math.random() < 0.1 && competitor.boosts > 0) {
            competitor.useBoost();
            console.log(`${competitor.name} boosted!`);
        }
    }


    startRace() {

        this.parallax = 2;
        // Move the horses based on their speed
        const raceInterval = setInterval(() => {
            Object.values(this.competitors).forEach(competitor => {
                competitor.updatePosition();
                if (!competitor.isPlayerControlled) {
                    this.boostComputerRandomly(competitor.id);
                }
            });

            // Check if any horse has reached the finish line (for example, x >= 300)
            const isRaceFinished = Object.values(this.competitors).some(competitor => competitor.x >= 300);

            if (isRaceFinished) {
                clearInterval(raceInterval);
                console.log("Race Finished!");

                const winner = this.raceEvent.getWinningTeam();

                // Call the onWinner function
                this.raceEvent.onWinner(winner);

                // Cleanup and log
                console.log(`The winning team is: ${winner}`);
                this.parallax = 0;
                setTimeout(() => {
                    this.element.remove();
                    this.onComplete(winner === "player");
                }, 1500); // Adjust the delay time as needed
            }
        }, 100);
    }

    removeEnemyCompetitorUI() {
        const enemyCompetitorId = this.activeCompetitors.enemy;
        const enemyCompetitor = this.competitors[enemyCompetitorId];
        const enemyCompetitorUI = enemyCompetitor.hudElement;

        if (enemyCompetitorUI && enemyCompetitorUI.parentNode) {
            enemyCompetitorUI.parentNode.removeChild(enemyCompetitorUI);
        }
    }
} 

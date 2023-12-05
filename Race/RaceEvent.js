class RaceEvent {
  constructor({ race, onNewEvent, onWinner }) {
    this.race = race;
    this.onNewEvent = onNewEvent;
    this.onWinner = onWinner; 
    this.currentTeam = "player";
    this.horseMenuInitialized = false;
  }

  async turn() {
      const casterId = this.race.activeCompetitors[this.currentTeam];
      const caster = this.race.competitors[casterId];
      const enemyId = this.race.activeCompetitors[caster.team === "player" ? "enemy" : "player"]
      const enemy = this.race.competitors[enemyId];

      const submission = await this.onNewEvent({
        type: "horseMenu",
        caster,
        enemy,
      })

      if (submission.replacement) {
        await this.onNewEvent({
          type: "replace",
           replacement:submission.replacement
        })
        await this.onNewEvent({
          type: "textMessage",
          text: `Go Get Em, ${submission.replacement.name}! `
        });

        const boostButton = this.race.element.querySelector(".BoostButton");
        if (boostButton) {
            boostButton.style.display = "block";
        }

        const boostContainer = this.race.element.querySelector(".BoostButtonContainer");
        if (boostContainer) {
            boostContainer.style.display = "block";
        }


    
        this.race.startRace();

        return;
        }


        const winner= this.getWinningTeam();
        console.log(`The winning team is: ${winner}`);

        // Check for a winner and end the race if there is one
        if (winner) {
            await this.onNewEvent({
                type: "textMessage",
                text: "Winner!"
            })
              this.onWinner(winner)
            
            const playerActiveHorseId = this.race.activeCompetitors.player;
            const xp = playerActiveHorseId.givesXp;

            await this.onNewEvent({
              type: "textMessage",
              text: `Gained ${xp}!`
            })
            await this.onNewEvent({
              type: "giveXp",
              xp ,
              competitor: this.race.competitors[playerActiveHorseId]
            })

            // END THE BATTLE -> TOacDO
            return;
        }

      
      
      if (submission.instanceId) {
        this.race.usedInstanceIds[submission.instanceId] = true;
        this.race.items = this.race.items.filter(i => i.instanceId !== submission.instanceId)
      }

      const resultingEvents = submission.action.success;
      for (let i=0; i<resultingEvents.length; i++) {
        const rcevent = {
          ...resultingEvents[i],
          submission,
          action: submission.action,
          caster,
          target: submission.target,
        }  
        await this.onNewEvent(rcevent);
      }

      this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
      this.turn();

  }

  getWinningTeam() {
    let winner = null;
    let winningPosition = -1;

    Object.values(this.race.competitors).forEach(competitor => {
      if (competitor.x >= 300 && (winner === null || competitor.x > winningPosition)) {
            winner = competitor.team;
            winningPosition = competitor.x;
        }
    });

    return winner;
}


  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: "The race is starting!"
    })

    this.turn();
  }
} 
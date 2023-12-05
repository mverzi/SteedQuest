class BlankEvent {
    constructor(rcevent, race) {
        this.rcevent = rcevent;
        this.race = race;
    }

    textMessage(resolve) {

        const text = this.rcevent.text
        .replace("{CASTER}", this.rcevent.caster?.name)
        .replace("{TARGET}", this.rcevent.target?.name)
        .replace("{ACTION}", this.rcevent.action?.name)

        const message = new TextMessage({
             text,
             onComplete: () => {
                resolve();
             }
        })
        message.init( this.race.element  );
    }

    async  stateChange(resolve) {
        const {caster, target, damage, recover, status, action} = this.rcevent;
        let who = this.rcevent.onCaster ? caster : target;
        if (damage) {
            //modify the target to have less HP
            target.update({
                hp: target - damage
            })
            //start blinking
            target.competitorHorseElement.classList.add("battle-damage-blink");
        }
        await utils.wait(600); 
        //Wait a lil bit 
        //stop blinking 
        
        target.competitorHorseElement.classList.remove("battle-damage-blink");
        resolve();
    }

    horseMenu(resolve) {
        const {caster} = this.rcevent;
        const menu = new HorseMenu({
            caster: this.rcevent.caster,
            enemy: this.rcevent.enemy, 
            items: this.race.items,
            replacements: Object.values(this.race.competitors).filter(c =>{
                return c.team === this.rcevent.caster.team
            }),
            onComplete: submission => {
                //submission {what move to use, who to use it on}
                resolve(submission)
            }
        })
        menu.init( this.race.element )
    }

    async replace(resolve) {
        const {replacement} = this.rcevent;

        const prevCompetitor = this.race.competitors[this.race.activeCompetitors[replacement.team]];
        this.race.activeCompetitors[replacement.team] = null;
        prevCompetitor.update();
        await utils.wait(400);

        this.race.activeCompetitors[replacement.team] = replacement.id;
        replacement.update();

        await utils.wait(400);
        resolve();
     }

    giveXp(resolve) {
        let amount = this.rcevent.xp;
        const {competitor} = this.rcevent;
        const step = () => {
            if (amount > 0) {
                amount -= 1;
                competitor.xp += 1;

                competitor.update();
                requestAnimationFrame(step);
                return;
            }
            resolve();
        }
        requestAnimationFrame(step); 
    }

    animation(resolve) {
         const fn = RaceAnimations[this.rcevent.animation];
         fn(this.event, resolve);
    }
      
    init(resolve) {
        this[this.rcevent.type](resolve); 
    }
} 
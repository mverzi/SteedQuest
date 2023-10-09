class GameObject {
    constructor(config) {
        this.id = null;
        this.isMounted = false;
        this.x = config.x || 0
        this.y = config.y || 0
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "images/characters/people/hero.png"
        })

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || [];
    }

    mount(map) {
        this.isMounted = true;
        map.addWall(this.x, this.y);

        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10)
      }

    update() {
    
    }

    //Handles NPC behavior
    async doBehaviorEvent(map) {

        //If something more important, like a cutscene, is happening, honor this
        if(map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding){
            return;
        }

        //Event set up
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex]
        eventConfig.who = this.id;

        //Event creation
        const eventHandler = new OverworldEvent({ map, event: eventConfig });
        await eventHandler.init();

        this.behaviorLoopIndex += 1;
        //If end of behavior loop is reached, start over
        if(this.behaviorLoopIndex === this.behaviorLoop.length){
            this.behaviorLoopIndex = 0;
        }

        //Redo the loop
        this.doBehaviorEvent(map);
    }
}


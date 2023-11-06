class Overworld {
    constructor(config){
        this.element = config.element
        this.canvas = this.element.querySelector(".game-canvas")
        this.ctx = this.canvas.getContext("2d")
        this.map = null
    }

    // Game loop 
    startGameLoop(){
        const step = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Camera
            const cameraPerson = this.map.gameObjects.hero

            // Update game objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map
                })
            })

            // Draw background layers and game objects
            this.map.drawLowerImage(this.ctx, cameraPerson)
            

            //Draw game objects in the correct order so Northern is drawn before Southern
            Object.values(this.map.gameObjects).sort((a,b) => {
                return a.y - b.y;
            }).forEach(object => {
                object.sprite.draw(this.ctx, cameraPerson)
            })

            this.map.drawUpperImage(this.ctx, cameraPerson)

            if(!this.map.isPaused){
                requestAnimationFrame(() => {
                    step();
                })
            }
        }
        step();
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            //Find if there is an NPC to talk to 
            this.map.checkForActionCutscene();
        })

        new KeyPressListener("Escape", () => {
            if(!this.map.isCutscenePlaying){
                this.map.startCutscene([
                    {type: "pause"}
                ])
            }
        })
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if(e.detail.whoId === "hero"){
                //Check for events as the player moves the hero around
                this.map.checkForFootstepCutscene();
            }
        })
    }

    startMap(mapConfig, heroInitialState=null) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();

        if(heroInitialState){
            const {hero} = this.map.gameObjects;
            hero.x = heroInitialState.x;
            hero.y = heroInitialState.y;
            hero.direction = heroInitialState.direction;
        }

        this.progress.mapId = mapConfig.id;
        this.progress.startingHeroX = this.map.gameObjects.hero.x;
        this.progress.startingHeroY = this.map.gameObjects.hero.y;
        this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;

    }

    async init(){

        const container = document.querySelector(".game-container");

        //Progress tracker
        this.progress = new Progress();

        //Title screen
        this.titleScreen = new TitleScreen({
            progress: this.progress
        })
        const useSaveFile = await this.titleScreen.init(container);

        //Check for save data
        let initialHeroState = null;
        
        if(useSaveFile) {
            this.progress.load();
            initialHeroState = {
                x: this.progress.startingHeroX,
                y: this.progress.startingHeroY,
                direction: this.progress.startingHeroDirection,
            }
        }

        this.hud = new Hud();
        this.hud.init(container);

        //Load first map, or map game saved on
        this.startMap(window.OverworldMaps[this.progress.mapId], initialHeroState);

        //Controls
        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction;

        this.startGameLoop();
        
        // this.map.startCutscene([
        //     { type: "battle", enemyId: "ellie" }
        //     //{ type: "changeMap", map: "DemoRoom" }
        //     //{ type: "textMessage", text: "Hello there!" }
        // ]);

    }

    

}
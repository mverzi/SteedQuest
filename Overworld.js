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

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            //Find if there is an NPC to talk to 
            this.map.checkForActionCutscene();
        })
    }

    init(){
        this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
        this.map.mountObjects();

        this.bindActionInput();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction;

        this.startGameLoop();
        
        this.map.startCutscene([
            { who:"hero", type: "walk", direction: "down" },
            { who:"hero", type: "walk", direction: "down" },
            { who:"npcA", type: "walk", direction: "left" },
            { who:"npcA", type: "stand", direction: "up",  time: 800 },
            { type: "textMessage", text: "Hello there!" }
        ]);

    }

    

}
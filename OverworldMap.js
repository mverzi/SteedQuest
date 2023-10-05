class OverworldMap {
    constructor(config) {
      this.gameObjects = config.gameObjects;
      this.walls = config.walls || {};
  
      this.lowerImage = new Image();
      this.lowerImage.src = config.lowerSrc;
  
      this.upperImage = new Image();
      this.upperImage.src = config.upperSrc;

      this.isCutscenePlaying = false;
    }
  
    drawLowerImage(ctx, cameraPerson) {
      ctx.drawImage(
        this.lowerImage, 
        utils.withGrid(10.5) - cameraPerson.x, 
        utils.withGrid(6) - cameraPerson.y
        )
    }
  
    drawUpperImage(ctx, cameraPerson) {
      ctx.drawImage(
        this.upperImage, 
        utils.withGrid(10.5) - cameraPerson.x, 
        utils.withGrid(6) - cameraPerson.y
      )
    } 
  
    isSpaceTaken(currentX, currentY, direction) {
      const {x,y} = utils.nextPosition(currentX, currentY, direction);
      return this.walls[`${x},${y}`] || false;
    }
  
    mountObjects() {
      Object.keys(this.gameObjects).forEach(key => {

        let object = this.gameObjects[key];
        object.id = key;
  
        //TODO: determine if this object should actually mount
        object.mount(this);
  
      })
    }

    async startCutscene(events){
      this.isCutscenePlaying = true;
      //Start
      for(let i = 0; i < events.length; i++){
        const eventHandler = new OverworldEvent({
          event: events[i],
          map: this,
        })
        await eventHandler.init();
      }
      this.isCutscenePlaying = false;
      //Reset NPCs to resume behavior
      Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this));
    }

    checkForActionCutscene() {
      const hero = this.gameObjects["hero"];
      const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
      const match = Object.values(this.gameObjects).find(object => {
        return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
      });
      console.log({ match })
    }
  
    addWall(x,y) {
      this.walls[`${x},${y}`] = true;
    }
    removeWall(x,y) {
      delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction) {
      this.removeWall(wasX, wasY);
      const {x,y} = utils.nextPosition(wasX, wasY, direction);
      this.addWall(x,y);
    }
  
  }

window.OverworldMaps = {
    DemoRoom: {
        lowerSrc: "/images/backgrounds/DemoLower.png",
        upperSrc: "/images/backgrounds/DemoUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6),
                src: "/images/characters/people/hero.png"
            }),
            npcA: new Person({
                x:utils.withGrid(6),
                y: utils.withGrid(9),
                src: "/images/characters/people/npc1.png",
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 800},
                    { type: "stand", direction: "up", time: 800 },
                    { type: "stand", direction: "right", time: 1200 },
                    { type: "stand", direction: "up", time: 300 },
                ]
            }),
            npcB: new Person({
                x:utils.withGrid(3),
                y: utils.withGrid(8),
                src: "/images/characters/people/trainer1.png",
                behaviorLoop: [
                    { type: "walk", direction: "left" },
                    { type: "stand", direction: "up", time: 800 },
                    { type: "walk", direction: "up" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "down" }
                ]
            })
        },
        walls: {
            [utils.asGridCoords(7,6)] : true,
            [utils.asGridCoords(8,6)] : true,
            [utils.asGridCoords(7,7)] : true,
            [utils.asGridCoords(8,7)] : true,
            [utils.asGridCoords(9,3)] : true,
            [utils.asGridCoords(10,3)] : true,
            [utils.asGridCoords(3,3)] : true,
            [utils.asGridCoords(4,3)] : true,
            [utils.asGridCoords(1,3)] : true,
            [utils.asGridCoords(2,3)] : true,
            [utils.asGridCoords(5,3)] : true,
            [utils.asGridCoords(6,4)] : true,
            [utils.asGridCoords(8,4)] : true,
        }
    }, 
    ForestRoom: {
        lowerSrc: "/images/backgrounds/ForestLower.png",
        upperSrc: "images/backgrounds/ForestUpper.png",
        gameObjects: {
            hero: new GameObject({
                x: 0,
                y: 0,
                src: "/images/characters/people/hero.png"
            })
        }
    }
}
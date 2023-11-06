class OverworldMap {
    constructor(config) {
      this.overworld = null;
      this.gameObjects = {};
      this.configObjects = config.configObjects;

      this.cutsceneSpaces = config.cutsceneSpaces || {};
      this.walls = config.walls || {};
  
      this.lowerImage = new Image();
      this.lowerImage.src = config.lowerSrc;
  
      this.upperImage = new Image();
      this.upperImage.src = config.upperSrc;

      this.isCutscenePlaying = false;
      this.isPaused = false;
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
      if(this.walls[`${x},${y}`]){
        return true;
      }
      return Object.values(this.gameObjects).find(obj => {
        if(obj.x === x && obj.y === y) {return true};
        if(obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition[1] === y) {
          return true;
        }
        return false;
      })
    }
  
    mountObjects() {
      Object.keys(this.configObjects).forEach(key => {

        let object = this.configObjects[key];
        object.id = key;

        let instance;
        if(object.type === "Person"){
          instance = new Person(object);
        }
        if(object.type === "HorseSpawner"){
          instance = new HorseSpawner(object);
        }
        this.gameObjects[key] = instance;
        this.gameObjects[key].id = key;
        instance.mount[this];
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
        const result = await eventHandler.init();
        if(result === "LOST_BATTLE"){
          break;
        }
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
      if(!this.isCutscenePlaying && match && match.talking.length) {

        const relevantScenario = match.talking.find(scenario => {
          return (scenario.required || []).every(sf => {
            return playerState.storyFlags[sf]
          })
        })

        relevantScenario && this.startCutscene(relevantScenario.events);
      }
    }

    checkForFootstepCutscene() {
      const hero = this.gameObjects["hero"];
      const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
      if(!this.isCutscenePlaying && match) {
        this.startCutscene(match[0].events);
      }
    }
  }

window.OverworldMaps = {
    DemoRoom: {
        id: "DemoRoom",
        lowerSrc: "/images/backgrounds/DemoLower.png",
        upperSrc: "/images/backgrounds/DemoUpper.png",
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6),
                //src: "/images/characters/people/hero.png"
            },
            npcA: {
                type: "Person",
                x: utils.withGrid(6),
                y: utils.withGrid(9),
                src: "/images/characters/people/npc1.png",
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 1800},
                    { type: "stand", direction: "up", time: 1800 },
                    { type: "stand", direction: "right", time: 1400 },
                    { type: "stand", direction: "up", time: 1300 },
                ],
                talking: [
                  {
                    required: ["TALKED_TO_ROBERT"],
                    events: [
                      { type: "textMessage", text: "Isn't Robert over there kind of annoying?", faceHero: "npcA" },
                    ]
                  },
                  {
                    events: [
                      { type: "textMessage", text: "Oh, you want to battle, don't you?", faceHero: "npcA" },
                      { type: "battle", enemyId: "ellie" },
                      { type: "addStoryFlag", flag: "DEFEATED_ELLIE" },
                      { type: "textMessage", text: "Oh man, you're stronger than you look.", faceHero: "npcA" },
                      //{ who: "hero", type: "walk", direction: "up" }
                    ]
                  }
                ]
            },
            npcB: {
                type: "Person",
                x:utils.withGrid(8),
                y: utils.withGrid(5),
                src: "/images/characters/people/trainer1.png",
                talking: [
                  {
                    events: [
                      { type: "textMessage", text: "Bahahaha!", faceHero: "npcB" },
                      { type: "addStoryFlag", flag: "TALKED_TO_ROBERT" }
                      //{ type: "battle", enemyId: "robert" }
                    ]
                  }
                ],
                // behaviorLoop: [
                //     { type: "walk", direction: "left" },
                //     { type: "stand", direction: "up", time: 800 },
                //     { type: "walk", direction: "up" },
                //     { type: "walk", direction: "right" },
                //     { type: "walk", direction: "down" }
                // ]
            },
              horseSpawner: {
                type: "HorseSpawner",
                x: utils.withGrid(2),
                y: utils.withGrid(7),
                storyFlag: "USED_HORSE_SPAWNER",
                horses: ["n006", "n003"]
              }
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
        },
        cutsceneSpaces: {
          [utils.asGridCoords(7,4)]: [
            {
              events: [
                { who: "npcB", type: "walk", direction: "left" },
                { who: "npcB", type: "stand", direction: "up", time: 500 },
                { type: "textMessage", text: "You can't go in there!"},
                { who: "npcB", type: "walk", direction: "right" },
                { who: "npcB", type: "stand", direction: "down" },
                { who: "hero", type: "walk", direction: "down" },
                { who: "hero", type: "walk", direction: "left" },
              ]
            }
          ],
          [utils.asGridCoords(5,10)]: [
            {
              events: [
                { 
                  type: "changeMap", 
                  map: "Street",
                  x: utils.withGrid(29),
                  y: utils.withGrid(9),
                  direction: "down" 
                }
              ]
            }
          ]
        }
    }, 
    ForestRoom: {
        id: "ForestRoom",
        lowerSrc: "/images/backgrounds/ForestLower.png",
        upperSrc: "images/backgrounds/ForestUpper.png",
        configObjects: {
            hero: {
              type: "Person",
              isPlayerControlled: true,
              x: utils.withGrid(7),
              y: utils.withGrid(6),
              src: "/images/characters/people/hero.png"
            },
            npcA: {
              type: "Person",
              x: utils.withGrid(10),
              y: utils.withGrid(8),
              src: "/images/characters/people/npc4.png",
              talking: [
                {
                  events: [
                    { type: "textMessage", text: "You made it!", faceHero:"npcA" }
                  ]
                }
              ]
            }
        }
    },
    Street: {
      id: "Street",
        lowerSrc: "/images/maps/StreetLower.png",
        upperSrc: "images/maps/StreetUpper.png",
        configObjects: {
            hero: {
              type: "Person",
              isPlayerControlled: true,
              x: utils.withGrid(30),
              y: utils.withGrid(10),
              src: "/images/characters/people/hero.png"
            },
        },
        cutsceneSpaces: {
          [utils.asGridCoords(29,9)]: [
            {
              events: [
                {
                  type: "changeMap",
                  map: "DemoRoom",
                  x: utils.withGrid(5),
                  y: utils.withGrid(10),
                  direction: "up"
                }
              ]
            }
          ]
        }
    }
}
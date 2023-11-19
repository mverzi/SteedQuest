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
        instance.mount(this);
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
      //Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this));
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
    StartingMap: {
      id: "StartingMap",
        lowerSrc: "/images/maps/StreetLower.png",
        upperSrc: "images/maps/StreetUpper.png",
        configObjects: {
            hero: {
              type: "Person",
              isPlayerControlled: true,
              x: utils.withGrid(),
              y: utils.withGrid(10),
              src: "/images/characters/people/hero.png",
            },
            npcA: {
              type: "Person",
              x: utils.withGrid(3),
              y: utils.withGrid(9),
              src: "/images/characters/people/npc1.png",
              behaviorLoop: [
                { type: "stand", direction: "left", time: 1800},
                { type: "stand", direction: "down", time: 1800 },
                { type: "stand", direction: "right", time: 1400 },
                { type: "stand", direction: "down", time: 1300 },
              ],
              talking: [
                {
                  required: ["HEALED_ELORA"],
                  events: [
                    { type: "textMessage", text: "You're strong, but you won't get very far with just one horse.", faceHero: "npcA" },
                    { type: "textMessage", text: "Have you seen an ancient pedestal yet? Upon it rests a mysterious egg. Nobody has been able to open them though...", faceHero: "npcA" },
                  ]
                },
                {
                  required: ["BATTLED_ELORA"],
                  events: [
                    { type: "textMessage", text: "You're stronger than you look! I will heal up Lucky for you.", faceHero: "npcA" },
                    { type: "healHorsesHp" },
                    { type: "addStoryFlag", flag: "HEALED_ELORA" },
                  ]
                },
                {
                  events: [
                    { type: "textMessage", text: "Welcome, traveler!", faceHero:"npcA" },
                    { type: "textMessage", text: "You've arrived just in time for our enchanted battles. Are you here to participate?", faceHero:"npcA" },
                    { type: "textMessage", text: "You must be! I see you already have your very own horse.", faceHero:"npcA" },
                    { type: "textMessage", text: "Well, I won't keep you too long, but considering you've got a horse of your own...", faceHero:"npcA" },
                    { type: "battle", enemyId: "elora" },
                    { type: "addStoryFlag", flag: "BATTLED_ELORA" },
                  ]
                }
              ]
            }
        },
        walls: {
          [utils.asGridCoords(-1,8)] : true,
          [utils.asGridCoords(-1,9)] : true,
          [utils.asGridCoords(-1,10)] : true,
          [utils.asGridCoords(-1,11)] : true,
          [utils.asGridCoords(0,12)] : true,
          [utils.asGridCoords(1,12)] : true,
          [utils.asGridCoords(2,12)] : true,
          [utils.asGridCoords(3,12)] : true,
          [utils.asGridCoords(4,12)] : true,
          [utils.asGridCoords(5,12)] : true,
          [utils.asGridCoords(6,12)] : true,
          [utils.asGridCoords(7,12)] : true,
          [utils.asGridCoords(8,12)] : true,
          [utils.asGridCoords(9,12)] : true,
          [utils.asGridCoords(10,12)] : true,
          [utils.asGridCoords(11,12)] : true,
          [utils.asGridCoords(12,12)] : true,
          [utils.asGridCoords(13,12)] : true,
          [utils.asGridCoords(14,12)] : true,
          [utils.asGridCoords(15,12)] : true,
          [utils.asGridCoords(16,12)] : true,
          [utils.asGridCoords(17,12)] : true,
          [utils.asGridCoords(18,12)] : true,
          [utils.asGridCoords(19,12)] : true,
          [utils.asGridCoords(0,6)] : true,
          [utils.asGridCoords(1,6)] : true,
          [utils.asGridCoords(2,6)] : true,
          [utils.asGridCoords(3,6)] : true,
          [utils.asGridCoords(4,6)] : true,
          [utils.asGridCoords(5,6)] : true,
          [utils.asGridCoords(6,6)] : true,
          [utils.asGridCoords(7,6)] : true,
          [utils.asGridCoords(8,6)] : true,
          [utils.asGridCoords(9,6)] : true,
          [utils.asGridCoords(10,6)] : true,
          [utils.asGridCoords(11,6)] : true,
          [utils.asGridCoords(12,6)] : true,
          [utils.asGridCoords(13,6)] : true,
          [utils.asGridCoords(14,6)] : true,
          [utils.asGridCoords(15,6)] : true,
          [utils.asGridCoords(16,6)] : true,
          [utils.asGridCoords(17,6)] : true,
          [utils.asGridCoords(18,6)] : true,
          [utils.asGridCoords(19,6)] : true,
          [utils.asGridCoords(20,8)] : true,
          [utils.asGridCoords(20,9)] : true,
          [utils.asGridCoords(20,11)] : true,
          [utils.asGridCoords(21,10)] : true,
        },
        cutsceneSpaces: {
          [utils.asGridCoords(20,10)]: [
            {
              //required: ["BATTLED_ELORA"],
              events: [
                { 
                  type: "changeMap", 
                  map: "RegionOne",
                  x: utils.withGrid(0),
                  y: utils.withGrid(10),
                  direction: "right" 
                }
              ]
            }
          ]
        }
    },
    RegionOne: {
      id: "RegionOne",
      lowerSrc: "/images/maps/Region1Lower.png",
      upperSrc: "/images/maps/Region1Upper.png",
      configObjects: {
        hero: {
          type: "Person",
          isPlayerControlled: true,
          x: utils.withGrid(0),
          y: utils.withGrid(10),
          src: "/images/characters/people/hero.png",
        },
        elf1: {
          type: "Person",
          x: utils.withGrid(6),
          y: utils.withGrid(7),
          src: "/images/characters/people/elf1.png",
          behaviorLoop: [
            { type: "stand", direction: "right", time: 2800 },
            { type: "stand", direction: "down", time: 2400 },
            { type: "stand", direction: "up", time: 1300 },
          ],
          talking: [
            {
              required: ["BATTLED_FINROD"],
              events: [
                { type: "textMessage", text: "You have good technique, but you still have a lot to learn.", faceHero: "elf1" },
                { type: "textMessage", text: "Fear not! There is no shortage of battles to fight in this region!", faceHero: "elf1" },
              ]
            },
            {
              required: ["USED_HORSE_SPAWNER_R1"],
              events: [
                { type: "textMessage", text: "I see...you were able to open the magical egg...interesting.", faceHero: "elf1" },
                { type: "textMessage", text: "Why don't we put that new horse of yours to the test?!", faceHero: "elf1" },
                { type: "battle", enemyId: "finrod" },
                { type: "addStoryFlag", flag: "BATTLED_FINROD" },
              ]
            },
            {
              events: [
                { type: "textMessage", text: "Hello, traveler. Have you come to try and open the magical egg? Nobody has had any luck yet.", faceHero:"elf1" },
              ]
            }
          ]
        },
        horseSpawner: {
          type: "HorseSpawner",
          x: utils.withGrid(7),
          y: utils.withGrid(7),
          storyFlag: "USED_HORSE_SPAWNER_R1",
          horses: ["n006", "n003"]
       }
    },
    walls: {
      [utils.asGridCoords(-1,0)] : true,
      [utils.asGridCoords(-1,1)] : true,
      [utils.asGridCoords(-1,2)] : true,
      [utils.asGridCoords(-1,3)] : true,
      [utils.asGridCoords(-1,4)] : true,
      [utils.asGridCoords(-1,5)] : true,
      [utils.asGridCoords(-1,6)] : true,
      [utils.asGridCoords(-1,7)] : true,
      [utils.asGridCoords(-1,8)] : true,
      [utils.asGridCoords(-1,9)] : true,
      [utils.asGridCoords(-1,10)] : true,
      [utils.asGridCoords(-1,11)] : true,
      [utils.asGridCoords(-1,12)] : true,
      [utils.asGridCoords(2,9)] : true,
      [utils.asGridCoords(3,4)] : true,
      [utils.asGridCoords(1,4)] : true,
      [utils.asGridCoords(2,4)] : true,
      [utils.asGridCoords(1,5)] : true,
      [utils.asGridCoords(2,5)] : true,
      [utils.asGridCoords(0,0)] : true,
      [utils.asGridCoords(1,0)] : true,
      [utils.asGridCoords(2,0)] : true,
      [utils.asGridCoords(0,1)] : true,
      [utils.asGridCoords(1,1)] : true,
      [utils.asGridCoords(0,2)] : true,
      [utils.asGridCoords(1,2)] : true,
      [utils.asGridCoords(8,0)] : true,
      [utils.asGridCoords(8,1)] : true,
      [utils.asGridCoords(8,2)] : true,
      [utils.asGridCoords(8,3)] : true,
      [utils.asGridCoords(8,4)] : true,
      [utils.asGridCoords(8,5)] : true,
      [utils.asGridCoords(8,6)] : true,
      [utils.asGridCoords(8,7)] : true,
      [utils.asGridCoords(8,8)] : true,
      [utils.asGridCoords(8,9)] : true,
      [utils.asGridCoords(8,10)] : true,
      [utils.asGridCoords(8,11)] : true,
      [utils.asGridCoords(7,-1)] : true,
      [utils.asGridCoords(6,-1)] : true,
      [utils.asGridCoords(5,-1)] : true,
      [utils.asGridCoords(3,-1)] : true,
      [utils.asGridCoords(0,12)] : true,
      [utils.asGridCoords(1,12)] : true,
      [utils.asGridCoords(2,12)] : true,
      [utils.asGridCoords(3,12)] : true,
      [utils.asGridCoords(4,12)] : true,
      [utils.asGridCoords(5,12)] : true,
      [utils.asGridCoords(6,12)] : true,
      [utils.asGridCoords(7,12)] : true,
    },
    cutsceneSpaces: {
      [utils.asGridCoords(0,10)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "StartingMap",
              x: utils.withGrid(20),
              y: utils.withGrid(10),
              direction: "left" 
            }
          ]
        }
      ],
      [utils.asGridCoords(7,10)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "RegionTwo",
              x: utils.withGrid(0),
              y: utils.withGrid(14),
              direction: "right" 
            }
          ]
        }
      ],
      [utils.asGridCoords(4,0)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "RegionThree",
              x: utils.withGrid(10),
              y: utils.withGrid(19),
              direction: "up" 
            }
          ]
        }
      ]
    }
  },
  RegionTwo: {
    id: "RegionTwo",
    lowerSrc: "/images/maps/Region2Lower.png",
    upperSrc: "/images/maps/Region2Upper.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(1),
        y: utils.withGrid(14),
        src: "/images/characters/people/hero.png",
      },
      nurse1: {
        type: "Person",
        x: utils.withGrid(18),
        y: utils.withGrid(15),
        src: "/images/characters/people/nurse1.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Hello traveler. Equine nurse Jake at your service. I will heal your horses right up.", faceHero: "nurse1"},
              { type: "healHorsesHp" },
              { type: "textMessage", text: "Come back anytime!"}
            ]
          }
        ]
      },
      trainer1: {
        type: "Person",
        x: utils.withGrid(9),
        y: utils.withGrid(11),
        src: "/images/characters/people/trainer1.png",
        behaviorLoop: [
            { type: "walk", direction: "down", time: 2800 },
            { type: "stand", direction: "down", time: 2400 },
            { type: "walk", direction: "right", time: 2800 },
            { type: "stand", direction: "right", time: 2400 },
            { type: "walk", direction: "up", time: 1300 },
            { type: "stand", direction: "up", time: 1300 },
            { type: "walk", direction: "left", time: 1300 },
            { type: "stand", direction: "left", time: 1300 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "Prepare yourself for a lesson in style and skill. My horse is the epitome of greatness. You'll be eating my dust!", faceHero: "trainer1" },
              { type: "battle", enemyId: "robert" }
            ]
          },
        ]
      }
    },
    walls: {

    },
    cutsceneSpaces: {
      [utils.asGridCoords(0,14)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "RegionOne",
              x: utils.withGrid(7),
              y: utils.withGrid(10),
              direction: "left" 
            }
          ]
        }
      ]
    }
  },
  RegionThree: {
    id: "RegionThree",
    lowerSrc: "/images/maps/Region3Lower.png",
    upperSrc: "/images/maps/Region3Upper.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(1),
        y: utils.withGrid(14),
        src: "/images/characters/people/hero.png",
      },
    },
    cutsceneSpaces: {
      [utils.asGridCoords(10,19)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "RegionOne",
              x: utils.withGrid(4),
              y: utils.withGrid(0),
              direction: "down" 
            }
          ]
        }
      ]
    }
  }
}
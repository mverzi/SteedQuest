class OverworldEvent {
    constructor({ map, event}) {
      this.map = map;
      this.event = event;
    }
  
    stand(resolve) {
      const who = this.map.gameObjects[ this.event.who ];
      who.startBehavior({
        map: this.map
      }, {
        type: "stand",
        direction: this.event.direction,
        time: this.event.time
      })
      
      //Set up a handler to complete when correct person is done walking, then resolve the event
      const completeHandler = e => {
        if (e.detail.whoId === this.event.who) {
          document.removeEventListener("PersonStandComplete", completeHandler);
          resolve();
        }
      }
      document.addEventListener("PersonStandComplete", completeHandler)
    }
  
    walk(resolve) {
      const who = this.map.gameObjects[ this.event.who ];
      who.startBehavior({
        map: this.map
      }, {
        type: "walk",
        direction: this.event.direction,
        retry: true
      })
  
      //Set up a handler to complete when correct person is done walking, then resolve the event
      const completeHandler = e => {
        if (e.detail.whoId === this.event.who) {
          document.removeEventListener("PersonWalkingComplete", completeHandler);
          resolve();
        }
      }
      document.addEventListener("PersonWalkingComplete", completeHandler)
  
    }

    textMessage(resolve) {
      if(this.event.faceHero){
        const obj = this.map.gameObjects[this.event.faceHero];
        obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
      }

      const message = new TextMessage({
        text: this.event.text,
        onComplete: () => resolve()
      })
      message.init( document.querySelector(".game-container") )
    }

    changeMap(resolve) {

      Object.values(this.map.gameObjects).forEach(obj => {
        obj.isMounted = false;
      })

      const sceneTransition = new SceneTransition();
      sceneTransition.init(document.querySelector(".game-container"), () => {
        this.map.overworld.startMap(window.OverworldMaps[this.event.map], {
          x: this.event.x,
          y: this.event.y,
          direction: this.event.direction
        })
        resolve();

        sceneTransition.fadeOut();
      });
    }

    battle(resolve) {
      const sceneTransition = new SceneTransition();
      sceneTransition.init(document.querySelector(".game-container"), () => {
        const battle = new Battle({
          enemy: Enemies[this.event.enemyId],
          onComplete: (didWin) => {
            sceneTransition.fadeOut(); 
            resolve(didWin ? "WON_BATTLE" : "LOST_BATTLE");
          }
        })
        battle.init(document.querySelector(".game-container"));
      });
    }

    pause(resolve) {
      this.map.isPaused = true;
        const menu = new PauseMenu({
          progress: this.map.overworld.progress,
          onComplete: () => {
            resolve();
            this.map.isPaused = false;
            this.map.overworld.startGameLoop();
          }
        })
        menu.init(document.querySelector(".game-container"));
    }

    addStoryFlag(resolve) {
      window.playerState.storyFlags[this.event.flag] = true;
      resolve();
    }

    removeStoryFlag(resolve){
      window.playerState.storyFlags[this.event.flag] = false;
      resolve();
    }

    craftingMenu(resolve) {
      const menu = new CraftingMenu({
        horses: this.event.horses,
        onComplete: () => {
          resolve();
        }
      })
      menu.init(document.querySelector(".game-container"));
    }

    healHorsesHp(resolve) {
      window.playerState.healHorsesHp(); 
      resolve();
  }

  addItemToInventory(resolve) {
    const itemToAdd = this.event.item;

    // Assuming you have a playerState object with an inventory array
    window.playerState.items.push({
      actionId: itemToAdd.actionId,
      instanceId: itemToAdd.instanceId,
    });

    resolve();
  }

  destroyGameObject(resolve) {
    console.log("Destroy game object called")
    const objectId = this.event.objectId;
    console.log("Item to remove ID: " + objectId)
    const objectToRemove = this.map.gameObjects[objectId];
    console.log("Item to remove: " + objectToRemove)

    if (objectToRemove) {
      // Remove the object from the game world
      delete this.map.gameObjects[objectId];

      // Optionally, you may want to remove any associated DOM elements or perform cleanup
      // For example, if the object has a sprite, you can remove its DOM element
      if (objectToRemove.sprite && objectToRemove.sprite.element) {
        objectToRemove.sprite.element.remove();
      }
    }

    resolve();
  }
  
    init() {
      return new Promise(resolve => {
        this[this.event.type](resolve)      
      })
    }
  
  }
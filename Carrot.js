class Carrot extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: "/images/items/carrot-bucket.png",
            animations: {
                "used-down" : [ [0,0] ],
                "unused-down" : [ [1,0] ],
            },
            currentAnimation: "used-down"
        });

        this.id = config.id;
        this.storyFlag = config.storyFlag;

        this.talking = [
            {
                required: [this.storyFlag],
                events: [
                    {type: "textMessage", text: "You have already taken this carrot!"}
                ]
            },
            {
                events: [
                    { type: "textMessage", text: "You collected a carrot!" },
                    { type: "addItemToInventory", item: { actionId: "item_recoverStatus", instanceId: "carrotItem" } }, //make carrot item 
                    { type: "addStoryFlag", flag: this.storyFlag }
                    //{ type: "destroyGameObject", objectId: this.id },
                ],
            },
        ];
    }
    update() {
        this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag] ? "used-down" : "unused-down"
    }
}

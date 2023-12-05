class Herbs extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: "/images/items/herbs-bucket.png",
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
                    {type: "textMessage", text: "You have already taken this herb!"}
                ]
            },
            {
                events: [
                    { type: "textMessage", text: "You found a herb!" },
                    { type: "addItemToInventory", item: { actionId: "item_recoverHp", instanceId: "herbsItem" } }, //make herb item 
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

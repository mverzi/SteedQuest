class HorseSpawner extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: "/images/characters/horse-spawner.png",
            animations: {
                "used-down" : [ [0,0] ],
                "unused-down" : [ [1,0] ],
            },
            currentAnimation: "used-down"
        });
        this.storyFlag = config.storyFlag;
        this.horses = config.horses;

        this.talking = [
            {
                required: [this.storyFlag],
                events: [
                    {type: "textMessage", text: "You have already taken this egg!"}
                ]
            },
            {
                events: [
                    {type: "textMessage", text: "The egg shakes as you approach it..."},
                    {type: "craftingMenu", horses: this.horses},
                    {type: "addStoryFlag", flag: this.storyFlag}
                ]
            }
        ]
    }

    update() {
        this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag] ? "used-down" : "unused-down"
    }

}
import { _decorator, Component, instantiate, Prefab } from 'cc'
import { GameX } from './GameX'
import { getScreenFPS } from './GameUtils'

const { ccclass, property } = _decorator

@ccclass('SnakeAIManager')
export class SnakeAIManager extends Component {

    @property({ type: Prefab })
    private SnakeAIHead: Prefab | null = null
    @property({ type: Prefab })
    private SnakeAI: Prefab | null = null

    private SnakeNum: number = 49

    private stageOne: boolean = true
    private stageTwo: boolean = true
    private stageThree: boolean = true
    private stageFour: boolean = true
    private stageFive: boolean = true
    private stageSix: boolean = true
    private stageSeven: boolean = true
    private stageEight: boolean = true

    async start() {
        GameX.SnakeAISpeed = GameX.SnakeAISpeed || 5
        this.createAISnakes(this.SnakeNum)
    }

    update(deltaTime: number) {
        // if(GameX.GameTime >= 40 && this.stageOne) {
        //     this.stageOne = false
        //     this.createAISnakes(12)
        // }
        // if(GameX.GameTime >= 80 && this.stageTwo) {
        //     this.stageTwo = false
        //     this.createAISnakes(12)
        // }
        // if(GameX.GameTime === 90 && this.stageThree) {
        //     this.stageThree = false
        //     this.createAISnakes(5)
        // }
        // if(GameX.GameTime === 120 && this.stageFour) {
        //     this.stageFour = false
        //     this.createAISnakes(5)
        // }
        // if(GameX.GameTime === 150 && this.stageFive) {
        //     this.stageFive = false
        //     this.createAISnakes(5)
        // }
        // if(GameX.GameTime === 180 && this.stageSix) {
        //     this.stageSix = false
        //     this.createAISnakes(5)
        // }
        // if(GameX.GameTime === 210 && this.stageSeven) {
        //     this.stageSeven = false
        //     this.createAISnakes(5)
        // }
        // if(GameX.GameTime === 240 && this.stageEight) {
        //     this.stageEight = false
        //     this.createAISnakes(4)
        // }
    }

    createAISnakes(SnakeNum: number) {
        for (let i = 0; i < SnakeNum; i++) {
            this.generateAISnake()
        }
    }

    generateAISnake() {
        const AIParent = instantiate(this.SnakeAI)
        const AISnake = instantiate(this.SnakeAIHead)
        this.node.addChild(AIParent)
        AIParent.addChild(AISnake)
    }

    destroyAISnakes() {
        const childrens = this.node.children
        const len = childrens.length
        for(let i = 0; i < len; i++) {
            childrens[i].destroy()
        }
    }

    recreateAISnakes() {
        this.destroyAISnakes()
        this.createAISnakes(this.SnakeNum)
    }
}


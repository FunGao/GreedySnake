import { _decorator, Component, instantiate, Node, Prefab } from 'cc'
import { GameX } from './GameX'

const { ccclass, property } = _decorator

@ccclass('FoodManager')
export class FoodManager extends Component {

    private FoodNum: number = 300

    @property({ type: Prefab })
    private FoodPrefab: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab1: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab2: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab3: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab4: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab5: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab6: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab7: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab8: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab9: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab10: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab11: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab12: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab13: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab14: Prefab | null = null
    @property({ type: Prefab })
    private FoodPrefab15: Prefab | null = null

    private RandomFood: number = 0
    private PrefabArrar: Array<Prefab> = []

    start() {
        this.PrefabArrar = [
            this.FoodPrefab,
            this.FoodPrefab1,
            this.FoodPrefab2,
            this.FoodPrefab3,
            this.FoodPrefab4,
            this.FoodPrefab5,
            this.FoodPrefab6,
            this.FoodPrefab7,
            this.FoodPrefab8,
            this.FoodPrefab9,
            this.FoodPrefab10,
            this.FoodPrefab11,
            this.FoodPrefab12,
            this.FoodPrefab13,
            this.FoodPrefab14,
            this.FoodPrefab15,
            this.FoodPrefab,
        ]

        this.createFoods(this.FoodNum)
    }

    update(deltaTime: number) {
        if(GameX.FrameFood > 0) {
            this.createFoods(GameX.FrameFood)
            GameX.FrameFood = 0
        }
    }

    createFoods(n: number = 1) {
        for(let i = 0; i < n; i++) {
            this.generateFood()
        }
    }

    generateFood() {
        this.RandomFood = Math.floor(Math.random() * 16)
        const food = instantiate(this.PrefabArrar[this.RandomFood])
        this.node.addChild(food)
    }

    destroyFoods() {
        this.node.children.forEach((child: Node) => child.destroy())
    }

    recreateFoods() {
        this.destroyFoods()
        this.createFoods(this.FoodNum)
    }
}


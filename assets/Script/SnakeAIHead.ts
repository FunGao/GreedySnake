import {
    _decorator,
    CircleCollider2D,
    Collider2D,
    Component,
    Contact2DType,
    instantiate,
    Node,
    Prefab,
    UIRenderer,
    UITransform,
    Vec2,
    Vec3
} from 'cc'
import { randomPosition } from './GameUtils'
import { GameX } from './GameX'

const { ccclass, property } = _decorator

@ccclass('SnakeAIHead')
export class SnakeAIHead extends Component {

    @property({ type: Prefab })
    private AIBodyPrefab: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab1: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab2: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab3: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab4: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab5: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab6: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab7: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab8: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab9: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab10: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab11: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab12: Prefab | null = null
    @property({ type: Prefab })
    private AIBodyPrefab13: Prefab | null = null

    @property({ type: Prefab })
    private CorpsePrefab: Prefab | null = null

    private bodyNum: number = 0
    private sectionSpace: number = 0
    private speed: number = 0
    private eatNum: number = 0
    
    private eatFoodFlag: boolean = false
    private deathFoodFlag: boolean = false
    private eatCorpseFlag: boolean = false

    private startTime: number = 0
    private sectionTime: number = 0
    private endTime: number = 0

    private direction: Vec3 | null = Vec3.ZERO
    private randomDirection: Vec3 | null = Vec3.ZERO

    private AISnakeArray: Array<Node> = []
    private AIMoveArray: Array<Vec3> = []

    private RandomBody: number = 0
    private prefabArrar: Array<Prefab> = []

    async start() {

        this.RandomBody = Math.floor(Math.random() * 14)
        this.prefabArrar = [
            this.AIBodyPrefab,
            this.AIBodyPrefab1,
            this.AIBodyPrefab2,
            this.AIBodyPrefab3,
            this.AIBodyPrefab4,
            this.AIBodyPrefab5,
            this.AIBodyPrefab6,
            this.AIBodyPrefab7, 
            this.AIBodyPrefab8,
            this.AIBodyPrefab9,
            this.AIBodyPrefab10,
            this.AIBodyPrefab11, 
            this.AIBodyPrefab12,
            this.AIBodyPrefab13, 
            this.AIBodyPrefab13, 
        ]

        this.initAISnake()
        this.initValue()
        this.initCollider()
        this.createBodys()

        this.schedule(this.frameFunction, 0.001)
    }

    update(deltaTime: number) {
        
    }

    frameFunction() {
        this.endTime = Date.now()
        if (this.endTime - this.sectionTime > (1000 / 60)) {
            this.sectionTime = Date.now()
            this.direction = this.direction.clone().lerp(this.randomDirection, 0.1).normalize()
        }
        if (this.endTime - this.startTime > 1000) {
            this.startTime = Date.now()
            this.randomDirection = new Vec3(Math.random() * 2 - 1, Math.random() * 2 - 1, 0).normalize()
            if (
                this.node.position.x > GameX.BackGroundWidth / 2.4 ||
                this.node.position.x < GameX.BackGroundWidth / -2.4 ||
                this.node.position.y > GameX.BackGroundHeight / 2.4 ||
                this.node.position.y < GameX.BackGroundHeight / -2.4
            ) {
                this.randomDirection = this.randomDirection.add(this.node.position.clone().multiply3f(-1, -1, -1)).normalize()
            }
        }
        if (GameX.SnakeAIMove && this.direction) {
            this.speed = this.sectionSpace / GameX.SnakeAISpeed
            this.rotateHead(this.direction)
            this.moveSnake()
        }
        if (this.eatFoodFlag) {
            this.eatFoodFlag = false
            this.eatNum++
            if (this.eatNum >= 2) {
                this.eatNum = 0
                this.generateBody()
            }
            GameX.FrameFood++
        }
        if (this.deathFoodFlag) {
            this.deathFoodFlag = false
            this.generateCorpse()
        }
        if (this.eatCorpseFlag) {
            this.eatCorpseFlag = false
            this.eatNum++
            if (this.eatNum >= 2) {
                this.eatNum = 0
                this.generateBody()
            }
        }
    }

    initAISnake() {
        this.node.setPosition(randomPosition())
        this.rotateHead(this.node.position)
    }

    initValue() {
        this.AISnakeArray = [this.node]
        this.bodyNum = Math.floor(Math.random() * 12) + 2
        this.sectionSpace = this.node.getComponent(UITransform).contentSize.width / 1.5
        this.speed = this.sectionSpace / GameX.SnakeAISpeed
        this.direction = this.node.position.clone().multiply3f(-1, -1, -1).normalize()
    }

    createBodys() {
        for (let i = 0; i < this.bodyNum; i++) {
            this.generateBody()
        }
    }

    generateBody() {
        const body = instantiate(this.prefabArrar[this.RandomBody])
        if (this.AISnakeArray.length === 1) {
            let direction = this.node.position
            body.setPosition(direction.clone().add(direction.clone().normalize().multiplyScalar(this.sectionSpace)))
        } else {
            let lastBody = this.AISnakeArray[this.AISnakeArray.length - 1]
            let lastButOneBody = this.AISnakeArray[this.AISnakeArray.length - 2]
            let direction = lastButOneBody.position.clone().subtract(lastBody.position).normalize()
            body.setPosition(lastBody.position.clone().subtract(direction.clone().multiplyScalar(this.sectionSpace)))
        }
        this.node.parent.addChild(body)
        this.AISnakeArray.push(body)
        body.setSiblingIndex(0)

        this.recordPosition()
    }

    generateCorpse() {
        let childrens = this.node.parent.children
        let childrens_ = this.node.parent.parent.parent.children
        for (let i = 0; i < childrens.length; i++) {
            for (let n = 0; n < 2; n++) {
                const corpse = instantiate(this.CorpsePrefab)
                corpse.setPosition(childrens[i].position.clone().add3f(
                    Math.random() * this.node.getComponent(UITransform).contentSize.x / 2,
                    Math.random() * this.node.getComponent(UITransform).contentSize.y / 2,
                    0
                ))
                childrens_[childrens_.length - 1].addChild(corpse)
            }
        }
        GameX.DeathNumber = 49 - this.node.parent.parent.children.length + 1
        // GameX.DeathNumber++
        this.node.parent.destroy()
    }

    rotateHead(direction: Vec3) {
        let angle = new Vec2(1, 0).signAngle(new Vec2(direction.x, direction.y)) * 180 / Math.PI
        this.node.angle = angle - 90
    }

    moveSnake() {
        let distance = this.direction.clone().multiplyScalar(this.speed)
        this.node.setPosition(this.node.position.clone().add(distance))
        this.AIMoveArray.unshift(this.node.position.clone())
        for (let i = 1; i < this.AISnakeArray.length; i++) {
            this.AISnakeArray[i].setPosition(this.AIMoveArray[GameX.SnakeAISpeed * i])
        }
        this.AIMoveArray.splice(-1, 1)
    }

    recordPosition() {
        let distance = 0
        let lastBody = this.AISnakeArray[this.AISnakeArray.length - 1]
        let lastButOneBody = this.AISnakeArray[this.AISnakeArray.length - 2]
        let direction = lastButOneBody.position.clone().subtract(lastBody.position).normalize()
        while (distance < this.sectionSpace) {
            distance += this.speed
            let position = lastButOneBody.position.clone().subtract(direction.clone().multiplyScalar(distance))
            this.AIMoveArray.push(position)
        }
    }

    initCollider() {
        let collider = this.node.getComponent(CircleCollider2D)
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    onBeginContact(self: Collider2D, other: Collider2D) {
        if (other.tag === 0) {
            other.node.destroy()
            this.eatFoodFlag = true
        }
        if (other.tag === 1 || other.tag === 2 || other.tag === 7) {
            this.deathFoodFlag = true
        }
        if (other.tag === 5) {
            other.node.destroy()
            this.eatCorpseFlag = true
        }
    }
}

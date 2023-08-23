import {
    _decorator,
    Camera,
    CircleCollider2D,
    Collider2D,
    Color,
    Component,
    Contact2DType,
    instantiate,
    Label,
    Node,
    Prefab,
    UIRenderer,
    UITransform,
    Vec2,
    Vec3,
} from 'cc'
import { randomPosition } from './GameUtils'
import { GameX } from './GameX'
import * as i18n from 'db://i18n/LanguageData'

const { ccclass, property } = _decorator

@ccclass('SnakeManager')
export class SnakeManager extends Component {

    @property({ type: Prefab })
    private SnakeHead: Prefab | null = null
    @property({ type: Prefab })
    private BodyPrefab: Prefab | null = null
    @property({ type: Prefab })
    private BodyPrefab1: Prefab | null = null
    @property({ type: Prefab })
    private BodyPrefab2: Prefab | null = null
    @property({ type: Prefab })
    private BodyPrefab3: Prefab | null = null
    @property({ type: Prefab })
    private BodyPrefab4: Prefab | null = null
    @property({ type: Prefab })
    private BodyPrefab5: Prefab | null = null
    @property({ type: Prefab })
    private BodyPrefab6: Prefab | null = null
    @property({ type: Prefab })
    private BodyPrefab7: Prefab | null = null
    @property({ type: Prefab })
    private BodyPrefab8: Prefab | null = null
    @property({ type: Prefab })
    private BodyPrefab9: Prefab | null = null
    @property({ type: Prefab })
    private BodyPrefab10: Prefab | null = null

    @property({ type: Prefab })
    private NoCollideBodyPrefab: Prefab | null = null
    @property({ type: Prefab })
    private CorpsePrefab: Prefab | null = null

    @property({ type: Node })
    private FoodManager: Node | null = null
    @property({ type: Node })
    private DeathMenu: Node | null = null
    @property({ type: Node })
    private LoginMenu: Node | null = null
    @property({ type: Node })
    private MenuBackGroung: Node | null = null
    @property({ type: Camera })
    private SnakeCamera: Camera | null = null

    @property({ type: Node })
    private SnakeLength: Node | null = null
    @property({ type: Node })
    private Killer: Node | null = null
    @property({ type: Node })
    private TopRank: Node | null = null

    @property({ type: Node })
    private CoinOne: Node | null = null
    @property({ type: Node })
    private CoinTwo: Node | null = null
    @property({ type: Node })
    private Rank: Node | null = null

    @property({ type: Node })
    private BorderTop: Node | null = null
    @property({ type: Node })
    private BorderBottom: Node | null = null
    @property({ type: Node })
    private BorderLeft: Node | null = null
    @property({ type: Node })
    private BorderRight: Node | null = null

    @property({ type: Node })
    private SnakeAIParent: Node | null = null

    private sectionSpace: number = 0
    private snakeArray: Array<Node> = []
    private moveArray: Array<Vec3> = []
    private eatNum: number = 0

    private bodyNum: number = 2
    private speed: number = 0

    private Snake: Node | null = null

    private eatFoodFlag: boolean = false
    private eatCorpseFlag: boolean = false
    private deathFlag: boolean = false
    private invincible: boolean = true

    private direction: Vec3 | null = Vec3.ZERO

    private scale: number = 0

    private RandomBody: number = 0
    private PrefabArrar: Array<Prefab> = []

    async start() {

        this.RandomBody = Math.floor(Math.random() * 10)
        this.PrefabArrar = [
            this.BodyPrefab,
            this.BodyPrefab1,
            this.BodyPrefab2,
            this.BodyPrefab3,
            this.BodyPrefab4,
            this.BodyPrefab5,
            this.BodyPrefab6,
            this.BodyPrefab7,
            this.BodyPrefab8,
            this.BodyPrefab9,
            this.BodyPrefab10,
            this.BodyPrefab10,
        ]

        this.createSnake()
        this.initValue()
        this.initCollider()
        this.createBodys()

        this.schedule(this.frameFunction, 0.001)
    }

    update(deltaTime: number) {

    }

    frameFunction() {
        if (!GameX.Death) {
            if (this.Snake.position) {
                this.moveCamera()
            }
            if (this.Snake.position) {
                if (!(
                    (this.Snake.position.x > GameX.BackGroundWidth / 2 /* && Math.abs(Vec3.angle(GameX.SnakeDirection, new Vec3(1, 0, 0))) < Math.PI / 2 */) ||
                    (this.Snake.position.x < GameX.BackGroundWidth / -2 /* && Math.abs(Vec3.angle(GameX.SnakeDirection, new Vec3(-1, 0, 0))) < Math.PI / 2 */) ||
                    (this.Snake.position.y > GameX.BackGroundHeight / 2 /* && Math.abs(Vec3.angle(GameX.SnakeDirection, new Vec3(0, 1, 0))) < Math.PI / 2 */) ||
                    (this.Snake.position.y < GameX.BackGroundHeight / -2 /* && Math.abs(Vec3.angle(GameX.SnakeDirection, new Vec3(0, -1, 0))) < Math.PI / 2 */)
                )) {
                    if (GameX.SnakeDirection) {
                        this.direction = this.direction.clone().lerp(GameX.SnakeDirection, 1.2 / GameX.SnakeSpeed).normalize()
                        this.speed = this.sectionSpace / GameX.SnakeSpeed
                        this.rotateHead(this.direction)
                        this.moveSnake()
                    }
                } else {
                    this.Snake.destroy()
                    this.deathFlag = true
                }
            }
            if (this.eatFoodFlag) {
                this.eatFoodFlag = false
                this.eatNum++
                if (this.eatNum >= 2) {
                    this.eatNum = 0
                    this.generateBody()
                    GameX.SnakeLength++
                }
                GameX.FrameFood++
            }
            if (this.eatCorpseFlag) {
                this.eatCorpseFlag = false
                this.eatNum++
                if (this.eatNum >= 2) {
                    this.eatNum = 0
                    this.generateBody()
                    GameX.SnakeLength++
                }
                GameX.Score++
            }
            if (this.deathFlag) {
                this.deathFlag = false
                GameX.SnakeDirection = null
                GameX.SnakeAIMove = false
                GameX.PauseTime = Date.now()
                GameX.Death = true
                this.MenuBackGroung.active = true
                this.generateCorpse()
                this.destroySnake()
                if (this.checkLogin()) {
                    this.CoinOne.getComponent(Label).string = String(GameX.revive_coin)
                    this.CoinTwo.getComponent(Label).string = String(GameX.revive_coin)
                    this.Rank.getComponent(Label).string = String(`${i18n.t('rank')}: ${(50 - GameX.DeathNumber) > 0 ? (50 - GameX.DeathNumber) : 1}/50`)
                    this.DeathMenu.active = true
                }
            }
            this.SnakeLength.getComponent(Label).string = String(GameX.SnakeLength)
            this.Killer.getComponent(Label).string = String(GameX.DeathNumber)
            this.TopRank.getComponent(Label).string = String(`${(50 - GameX.DeathNumber) > 0 ? (50 - GameX.DeathNumber) : 1}/50`)
        }
    }

    initValue() {
        GameX.SnakeSpeed = GameX.SnakeSpeed || 5
        this.snakeArray = [this.Snake]
        this.sectionSpace = this.Snake.getComponent(UITransform).contentSize.width / 1.6
        this.speed = this.sectionSpace / GameX.SnakeSpeed
        this.moveArray = []
        this.invincible = true
        GameX.SnakeDirection = null
    }

    createSnake() {
        let ScreenDiv = document.body
        let GameDiv = document.getElementById('GameDiv')
        this.scale = GameDiv.clientHeight > ScreenDiv.clientHeight || GameDiv.clientWidth > ScreenDiv.clientWidth
            ? ScreenDiv.clientWidth / ScreenDiv.clientHeight
            : GameDiv.clientWidth / GameDiv.clientHeight

        this.Snake = instantiate(this.SnakeHead)
        this.node.addChild(this.Snake)
        this.Snake.setPosition(randomPosition(1.2))
        this.BorderTop.setPosition(new Vec3(this.Snake.position.x, this.Snake.position.y + 340, 0))
        this.BorderBottom.setPosition(new Vec3(this.Snake.position.x, this.Snake.position.y - 340, 0))
        this.BorderLeft.setPosition(new Vec3(this.Snake.position.x - (340 * this.scale), this.Snake.position.y, 0))
        this.BorderRight.setPosition(new Vec3(this.Snake.position.x + (340 * this.scale), this.Snake.position.y, 0))
        this.rotateHead(this.Snake.position)
        this.MenuBackGroung.active = false
        GameX.Death = false
    }

    createBodys() {
        for (let i = 0; i < this.bodyNum; i++) {
            this.generateNoCollideBody()
        }
    }

    generateNoCollideBody() {
        const body = instantiate(this.NoCollideBodyPrefab)
        if (this.snakeArray.length === 1) {
            let direction = this.Snake.position
            body.setPosition(direction.clone().add(direction.clone().normalize().multiplyScalar(this.sectionSpace)))
        } else {
            let lastBody = this.snakeArray[this.snakeArray.length - 1]
            let lastButOneBody = this.snakeArray[this.snakeArray.length - 2]
            let direction = lastButOneBody.position.clone().subtract(lastBody.position).normalize()
            body.setPosition(lastBody.position.clone().subtract(direction.clone().multiplyScalar(this.sectionSpace)))
        }
        this.node.addChild(body)
        this.snakeArray.push(body)
        body.setSiblingIndex(0)
        if (this.invincible) body.getComponent(UIRenderer).color = new Color(255, 255, 255, 255 / 2)
        this.recordPosition()
    }

    generateBody() {
        const body = instantiate(this.PrefabArrar[this.RandomBody])
        if (this.snakeArray.length === 1) {
            let direction = this.Snake.position
            body.setPosition(direction.clone().add(direction.clone().normalize().multiplyScalar(this.sectionSpace)))
        } else {
            let lastBody = this.snakeArray[this.snakeArray.length - 1]
            let lastButOneBody = this.snakeArray[this.snakeArray.length - 2]
            let direction = lastButOneBody.position.clone().subtract(lastBody.position).normalize()
            body.setPosition(lastBody.position.clone().subtract(direction.clone().multiplyScalar(this.sectionSpace)))
        }
        this.node.addChild(body)
        this.snakeArray.push(body)
        body.setSiblingIndex(0)
        if (this.invincible) body.getComponent(UIRenderer).color = new Color(255, 255, 255, 255 / 2)
        this.recordPosition()
    }

    generateCorpse() {
        for (let i = 0; i < this.node.children.length; i++) {
            for (let n = 0; n < 2; n++) {
                const corpse = instantiate(this.CorpsePrefab)
                corpse.setPosition(this.node.children[i].position.clone().add3f(
                    Math.random() * 40 / 2,
                    Math.random() * 40 / 2,
                    0
                ))
                this.FoodManager.addChild(corpse)
            }
        }
    }

    destroySnake() {
        let childs = this.node.children
        let len = childs.length
        for (let i = 0; i < len; i++) {
            if (childs[i] && this.node !== childs[i]) {
                childs[i].destroy()
            }
        }
    }

    recordPosition() {
        let distance = 0
        let lastBody = this.snakeArray[this.snakeArray.length - 1]
        let lastButOneBody = this.snakeArray[this.snakeArray.length - 2]
        let direction = lastButOneBody.position.clone().subtract(lastBody.position).normalize()
        while (distance < this.sectionSpace) {
            distance += this.speed
            let position = lastButOneBody.position.clone().subtract(direction.clone().multiplyScalar(distance))
            this.moveArray.push(position)
        }
    }

    rotateHead(direction: Vec3) {
        let angle = new Vec2(1, 0).signAngle(new Vec2(direction.x, direction.y)) * 180 / Math.PI
        this.Snake.angle = angle - 90
    }

    moveSnake() {
        let distance = this.direction.clone().multiplyScalar(this.speed)
        this.Snake.setPosition(this.Snake.position.clone().add(distance))
        this.BorderTop.setPosition(new Vec3(this.Snake.position.x, this.Snake.position.y + 340, 0))
        this.BorderBottom.setPosition(new Vec3(this.Snake.position.x, this.Snake.position.y - 340, 0))
        this.BorderLeft.setPosition(new Vec3(this.Snake.position.x - (340 * GameX.GameUIScale), this.Snake.position.y, 0))
        this.BorderRight.setPosition(new Vec3(this.Snake.position.x + (340 * GameX.GameUIScale), this.Snake.position.y, 0))
        this.moveArray.unshift(this.Snake.position.clone())
        for (let i = 1; i < this.snakeArray.length; i++) {
            this.snakeArray[i].setPosition(this.moveArray[GameX.SnakeSpeed * i])
        }
        this.moveArray.splice(-1, 1)
    }

    moveCamera() {
        this.SnakeCamera.node.setPosition(this.Snake.position)
    }

    initCollider() {
        let collider = this.Snake.getComponent(CircleCollider2D)
        if (collider) collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    onBeginContact(Self: Collider2D, Other: Collider2D) {
        if (Other.tag === 0) {
            Other.node.destroy()
            this.eatFoodFlag = true
        }
        // @ts-ignore
        if ((!this.invincible) && [2, 3].includes(Other.tag)) {
            Self.node.destroy()
            this.deathFlag = true
        }
        if (Other.tag === 6) {
            Self.node.destroy()
            this.deathFlag = true
        }
        if (Other.tag === 5) {
            Other.node.destroy()
            this.eatCorpseFlag = true
        }
    }

    makeInvincible() {
        setTimeout(() => {
            this.invincible = false
            if (this.node && this.node.children) {
                this.node.children.forEach((child: Node) => {
                    let color = child.getComponent(UIRenderer).color
                    child.getComponent(UIRenderer).color = new Color(color.r, color.g, color.b)
                })
            }
        }, 3000)
    }

    checkLogin() {
        if (!GameX.Login) {
            this.LoginMenu.active = true
        }
        return GameX.Login
    }

    reborn() {
        this.createSnake()
        this.initValue()
        this.initCollider()
        this.createBodys()
        this.makeInvincible()
        GameX.SnakeDirection = new Vec3(Math.random() * 2 - 1, Math.random() * 2 - 1, 0)
        GameX.Death = false
    }
}

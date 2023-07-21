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
    profiler,
    UIRenderer,
    UITransform,
    Vec2,
    Vec3
} from 'cc'

const { ccclass, property } = _decorator

@ccclass('SnakeHead')
export class SnakeHead extends Component {

    @property({ type: Prefab })
    public BodyPrefab: Prefab | null = null
    @property({ type: Prefab })
    public FoodPrefab: Prefab | null = null
    @property({ type: Node })
    private GameGrade: Node | null = null
    @property({ type: Camera})
    private SnakeCamera: Camera | null = null
    @property({ type: Camera})
    private FoodCamera: Camera | null = null

    private width: number = 0
    private height: number = 0
    private sectionSpace: number = 0
    private snakeArray: Array<Node> = []
    private moveArray: Array<Vec3> = []
    private stepLength: number = 0
    private headStep: number = 0
    private speed: number = 0
    private callbackFlag: boolean = false

    private bodyNum: number = 4
    private foodNum: number = 100
    private time: number = 8
    private headZIndex: number = 5

    public static direction: Vec3 = null

    start() {
        profiler.hideStats()

        this.width = this.node.parent.getComponent(UITransform).contentSize.width
        this.height = this.node.parent.getComponent(UITransform).contentSize.height
        this.sectionSpace = this.node.getComponent(UITransform).contentSize.width / 1.4
        this.snakeArray.push(this.node)
        this.speed = this.sectionSpace / this.time

        for (let i = 0; i < this.bodyNum; i++) this.generateBody()
        for (let i = 0; i < this.foodNum; i++) this.generateFood()

        let collider = this.node.getComponent(CircleCollider2D)
        if (collider) collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    update(deltaTime: number) {
        if (SnakeHead.direction) {
            this.rotateHead(SnakeHead.direction)
            this.moveSnake()
            this.moveCamera(this.node.position)
        }
        if (this.callbackFlag) {
            this.callbackFlag = false
            this.generateFood()
        }
    }

    randomColor() {
        let red = Math.round(Math.random() * 255)
        let green = Math.round(Math.random() * 255)
        let blue = Math.round(Math.random() * 255)
        return new Color(red, green, blue)
    }

    randomPosition(n: number = 1) {
        let x = Math.round(Math.random() * this.width / n) - this.width / n / 2
        let y = Math.round(Math.random() * this.height / n) - this.height / n / 2
        return new Vec3(x, y, 0)
    }

    generateBody() {
        const body = instantiate(this.BodyPrefab)
        if (this.snakeArray.length === 1) {
            let direction = this.node.position
            body.setPosition(direction.clone().add(direction.clone().normalize().multiplyScalar(this.sectionSpace)))
        } else {
            let lastBody = this.snakeArray[this.snakeArray.length - 1]
            let lastButOneBody = this.snakeArray[this.snakeArray.length - 2]
            let direction = lastBody.position.clone().subtract(lastButOneBody.position).normalize()
            body.setPosition(lastBody.position.clone().add(direction.clone().multiplyScalar(this.sectionSpace)))
        }
        this.node.parent.addChild(body)
        this.snakeArray.push(body)
        body.setSiblingIndex(this.headZIndex)
        body.getComponent(UIRenderer).color = this.randomColor()
        
        this.recordPosition()
    }

    generateFood() {
        const food = instantiate(this.FoodPrefab)
        this.node.parent.addChild(food)
    }

    rotateHead(direction: Vec3) {
        let angle = new Vec2(1, 0).signAngle(new Vec2(direction.x, direction.y)) * 180 / Math.PI
        this.node.angle = angle - 90
    }

    moveSnake() {
        let distance = SnakeHead.direction.clone().multiply3f(this.speed, this.speed, this.speed)
        this.node.setPosition(this.node.position.add(distance))
        this.moveArray.push(this.node.position.clone())

        this.headStep++
        for (let i = 1; i < this.snakeArray.length; i++) {
            let num = Math.floor((this.moveArray.length - this.headStep) / (this.snakeArray.length - 1) * (this.snakeArray.length - 1 - i))
            this.snakeArray[i].setPosition(this.moveArray[num])
        }
        if (this.moveArray.length > this.stepLength) {
            this.moveArray.splice(0, 1)
            this.headStep--
        }
    }

    moveCamera(position: Vec3) {
        this.SnakeCamera.node.setPosition(position)
    }

    recordPosition() {
        let len = 0, index = 0
        let lastBody = this.snakeArray[this.snakeArray.length - 1]
        let lastButOneBody = this.snakeArray[this.snakeArray.length - 2]
        let direction = lastButOneBody.position.clone().subtract(lastBody.position).normalize()
        while (len < this.sectionSpace) {
            len += this.speed
            let position = lastBody.position.clone().add(direction.clone().multiply3f(len, len, len))
            this.moveArray.splice(index++, 0, position)
        }
        this.stepLength = this.moveArray.length
    }

    changeLayer() {
        for (let i = 0; i < this.snakeArray.length; i++) {
            this.snakeArray[i].setSiblingIndex(this.headZIndex + this.snakeArray.length - i - 1)
        }
    }

    onBeginContact(self: Collider2D, other: Collider2D) {
        other.node.removeFromParent()
        this.generateBody()
        this.GameGrade.getComponent(Label).string = String(Number(this.GameGrade.getComponent(Label).string) + 1)
        this.callbackFlag = true
    }

    reset() {
        let childs = this.node.parent.children
        let len = childs.length
        for(let i = this.headZIndex; i < len; i++) {
            if(childs[i] && this.node !== childs[i]) {
                childs[i].destroy()
            }
        }
        this.snakeArray = []
        this.moveArray = []
        this.stepLength = 0
        this.headStep = 0
        this.callbackFlag = false
        this.GameGrade.getComponent(Label).string = String(0)
        this.start()
    }
}

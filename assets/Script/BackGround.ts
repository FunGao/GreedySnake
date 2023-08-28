import {
    _decorator,
    Camera,
    Color,
    Component,
    instantiate,
    Node,
    Prefab,
    Size,
    UIRenderer,
    UITransform,
    Vec3
} from 'cc'
import { GameX } from './GameX'

const { ccclass, property } = _decorator

@ccclass('BackGround')
export class BackGround extends Component {

    @property({ type: Prefab })
    private BorderPrefab: Prefab | null = null
    @property({ type: Node })
    private ShrinkWarn: Node | null = null
    @property({ type: Node })
    private Back: Node | null = null
    @property({ type: Camera })
    private MapCamera: Camera | null = null

    @property({ type: Node })
    private BorderTop: Node | null = null
    @property({ type: Node })
    private BorderBottom: Node | null = null
    @property({ type: Node })
    private BorderLeft: Node | null = null
    @property({ type: Node })
    private BorderRight: Node | null = null

    private borderPrefabWidth: number = 0
    private borderPrefabHeight: number = 0

    private currentTime: number = 0
    private shrinkCount: number = 0
    private shrinkTime: number = 0
    private shrinkWidth: number = 600
    private finalWidth: number = 2200
    private shrinkRate: number = 20         /* 缩圈时间 */
    private count: number = 30
    private warnTime: number = 0
    private tip: boolean = true
    private accelerate: number = 0

    private borderContainer: Node | null = null

    private BackFlag: boolean = true
    private BackTip: boolean = true

    start() {
        let ScreenDiv = document.body
        let GameDiv = document.getElementById('GameDiv')
        let scale = GameDiv.clientHeight > ScreenDiv.clientHeight || GameDiv.clientWidth > ScreenDiv.clientWidth
            ? ScreenDiv.clientWidth / ScreenDiv.clientHeight
            : GameDiv.clientWidth / GameDiv.clientHeight

        this.initValue()

        this.BorderTop.getComponent(UITransform).setContentSize(680 * scale, GameX.BackGroundWidth / 800)
        this.BorderBottom.getComponent(UITransform).setContentSize(680 * scale, GameX.BackGroundWidth / 800)
        this.BorderLeft.getComponent(UITransform).setContentSize(GameX.BackGroundWidth / 800, 680)
        this.BorderRight.getComponent(UITransform).setContentSize(GameX.BackGroundWidth / 800, 680)

        this.createBorders()
    }

    update(deltaTime: number) {
        if (GameX.GameTime !== 0 &&
            GameX.PauseTime === 0 &&
            GameX.BackGroundWidth > this.finalWidth &&
            (
                GameX.GameTime % GameX.ShrinkRate === GameX.ShrinkRate - 1 ||
                GameX.GameTime % GameX.ShrinkRate === GameX.ShrinkRate - 2
                /* GameX.GameTime % GameX.ShrinkRate === GameX.ShrinkRate - 3 */
            )
        ) {
            if (this.BackFlag) {
                this.BackFlag = false
                this.Back.getComponent(UITransform).setContentSize(
                    GameX.BackGroundWidth - this.shrinkWidth,
                    GameX.BackGroundHeight - this.shrinkWidth / (GameX.CanvasWidth / GameX.CanvasHeight)
                )
                this.BackTip = false
                this.Back.getComponent(UIRenderer).color = new Color(0, 120, 0, 0)
                this.Back.active = true
                this.schedule(this.backFlash, 1 / 60, 240)
            }
            if (Date.now() - this.warnTime > 1 / 60) {
                this.warnTime = Date.now()
                if (!this.ShrinkWarn.active) this.ShrinkWarn.active = true
                if (this.ShrinkWarn.getComponent(UIRenderer).color.a > 0 && this.tip) {
                    let a = this.ShrinkWarn.getComponent(UIRenderer).color.a
                    this.ShrinkWarn.getComponent(UIRenderer).color = new Color(255, 255, 255, a > 7 ? a - 7 : 0)
                } else {
                    this.tip = false
                }
                if (this.ShrinkWarn.getComponent(UIRenderer).color.a < 255 && (!this.tip)) {
                    let a = this.ShrinkWarn.getComponent(UIRenderer).color.a
                    this.ShrinkWarn.getComponent(UIRenderer).color = new Color(255, 255, 255, a < 255 - 4 ? a + 4 : 255)
                } else {
                    this.tip = true
                }
            }
        } else {
            this.ShrinkWarn.active = false
            this.tip = false
            this.ShrinkWarn.getComponent(UIRenderer).color = new Color(255, 255, 255, 0)
        }
        if (GameX.PauseTime === 0 &&
            GameX.GameTime !== 0 &&
            GameX.GameTime % GameX.ShrinkRate === 0 &&
            GameX.GameTime !== this.currentTime &&
            GameX.BackGroundWidth > this.finalWidth
        ) {
            this.currentTime = GameX.GameTime
            this.shrinkCount = this.count
        }
        if (this.shrinkCount > 0) {
            if (Date.now() - this.shrinkTime > 1000 / 60) {
                this.shrinkTime = Date.now()
                this.node.getComponent(UITransform).setContentSize(new Size(
                    GameX.BackGroundWidth - this.shrinkWidth / this.count,
                    GameX.BackGroundHeight - this.shrinkWidth / this.count / (GameX.CanvasWidth / GameX.CanvasHeight)
                ))
                this.node.children.forEach((child: Node) => child.destroy())
                this.initValue()
                this.shrinkCount--
                if (this.shrinkCount <= 0) {
                    this.Back.active = false
                    this.BackFlag = true
                    this.createBorders()
                    if (this.accelerate === 0 ||
                        this.accelerate === 3 ||
                        this.accelerate === 6) {
                        GameX.SnakeSpeed--
                        GameX.SnakeAISpeed--
                    }
                    if (this.accelerate === 1 || this.accelerate === 4 || this.accelerate === 7) {
                        if (GameX.no_revive_pass_num >= 20) GameX.SnakeSpeed--
                        else GameX.SnakeSpeed -= 2
                    }
                    this.accelerate++

                    this.BorderTop.getComponent(UITransform).setContentSize(680 * GameX.GameUIScale, GameX.BackGroundWidth / 800)
                    this.BorderBottom.getComponent(UITransform).setContentSize(680 * GameX.GameUIScale, GameX.BackGroundWidth / 800)
                    this.BorderLeft.getComponent(UITransform).setContentSize(GameX.BackGroundWidth / 800, 680)
                    this.BorderRight.getComponent(UITransform).setContentSize(GameX.BackGroundWidth / 800, 680)
                }
            }
        }
    }

    initValue() {
        GameX.BackGroundWidth = this.node.getComponent(UITransform).width
        GameX.BackGroundHeight = this.node.getComponent(UITransform).height
        this.MapCamera.getComponent(Camera).orthoHeight = GameX.BackGroundHeight / 2
        this.borderPrefabWidth = instantiate(this.BorderPrefab).getComponent(UITransform).width
        this.borderPrefabHeight = instantiate(this.BorderPrefab).getComponent(UITransform).height
    }

    createBorders() {
        this.borderContainer = new Node()
        this.borderContainer.addComponent(UITransform).setContentSize(new Size(GameX.BackGroundWidth, GameX.BackGroundHeight))
        for (let i = 1; i < GameX.BackGroundWidth / this.borderPrefabWidth - 1; i++) this.generateTopBorder(i)
        for (let i = 1; i < GameX.BackGroundWidth / this.borderPrefabWidth - 1; i++) this.generateBottomBorder(i)
        for (let i = 1; i < GameX.BackGroundHeight / this.borderPrefabWidth - 1; i++) this.generateLeftBorder(i)
        for (let i = 1; i < GameX.BackGroundHeight / this.borderPrefabWidth - 1; i++) this.generateRightBorder(i)
        this.node.addChild(this.borderContainer)
    }

    generateTopBorder(i: number) {
        const border = instantiate(this.BorderPrefab)
        border.setPosition(new Vec3(
            this.borderPrefabWidth / 2 + this.borderPrefabWidth * i - GameX.BackGroundWidth / 2,
            GameX.BackGroundHeight / 2 - this.borderPrefabHeight / 2,
            0
        ))
        this.borderContainer.addChild(border)
    }

    generateBottomBorder(i: number) {
        const border = instantiate(this.BorderPrefab)
        border.angle = 180
        border.setPosition(new Vec3(
            this.borderPrefabWidth / 2 + this.borderPrefabWidth * i - GameX.BackGroundWidth / 2,
            this.borderPrefabHeight / 2 - GameX.BackGroundHeight / 2,
            0
        ))
        this.borderContainer.addChild(border)
    }

    generateLeftBorder(i: number) {
        const border = instantiate(this.BorderPrefab)
        border.angle = 90
        border.setPosition(new Vec3(
            this.borderPrefabHeight / 2 - GameX.BackGroundWidth / 2,
            this.borderPrefabWidth / 2 + this.borderPrefabWidth * i - GameX.BackGroundHeight / 2,
            0
        ))
        this.borderContainer.addChild(border)
    }

    generateRightBorder(i: number) {
        const border = instantiate(this.BorderPrefab)
        border.angle = -90
        border.setPosition(new Vec3(
            GameX.BackGroundWidth / 2 - this.borderPrefabHeight / 2,
            this.borderPrefabWidth / 2 + this.borderPrefabWidth * i - GameX.BackGroundHeight / 2,
            0
        ))
        this.borderContainer.addChild(border)
    }

    backFlash() {
        if (this.Back.getComponent(UIRenderer).color.a > 0 && this.BackTip) {
            let a = this.Back.getComponent(UIRenderer).color.a
            this.Back.getComponent(UIRenderer).color = new Color(0, 120, 0, a > 2.5 ? a - 2.5 : 0)
        } else {
            this.BackTip = false
        }
        if (this.Back.getComponent(UIRenderer).color.a < 100 && (!this.BackTip)) {
            let a = this.Back.getComponent(UIRenderer).color.a
            this.Back.getComponent(UIRenderer).color = new Color(0, 120, 0, a < 100 - 2.5 ? a + 2.5 : 100)
        } else {
            this.BackTip = true
        }
    }

    reset() {
        this.node.getComponent(UITransform).setContentSize(GameX.CanvasWidth, GameX.CanvasHeight)
        this.node.children.forEach((child: Node) => child.destroy())
        this.initValue()
        this.createBorders()
    }
}

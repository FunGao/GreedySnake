import { _decorator, Camera, Component, Node, Rect, UITransform } from 'cc'
import { GameX } from './GameX'

const { ccclass, property } = _decorator

let globalThis = null

@ccclass('UIManager')
export class UIManager extends Component {

    /**
     * 属性由 globalThis 访问
     */
    @property({ type: Node })
    private StartMenu: Node | null = null
    @property({ type: Node })
    private GameUI: Node | null = null
    @property({ type: Node })
    private Grade: Node | null = null
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

    @property({ type: Node })
    private StartBanner: Node | null = null

    private heightRatio: number = 0.3
    private scale: number = GameX.CanvasWidth / GameX.CanvasHeight

    start() {
        globalThis = this
        this.initMenuUI()
        this.initThrottling()
    }

    update(deltaTime: number) {

    }

    initMenuUI() {
        if (GameX.CurrentScene === 1) {
            let ScreenDiv = document.body
            let GameDiv = document.getElementById('GameDiv')
            let scale = GameDiv.clientHeight > ScreenDiv.clientHeight || GameDiv.clientWidth > ScreenDiv.clientWidth
                ? ScreenDiv.clientWidth / ScreenDiv.clientHeight
                : GameDiv.clientWidth / GameDiv.clientHeight
            GameX.GameUIScale = scale

            globalThis.GameUI.getComponent(UITransform).setContentSize(scale * 640, 640)
            globalThis.StartMenu.getComponent(UITransform).setContentSize(scale * 640, 640)
            globalThis.StartBanner.getComponent(UITransform).setContentSize(scale * 640 * 0.7, scale * 640 * 0.7 * 0.25)

            if (GameDiv.clientHeight > ScreenDiv.clientHeight || GameDiv.clientWidth > ScreenDiv.clientWidth) {
                let smallMapRitio = ScreenDiv.clientHeight * globalThis.heightRatio * globalThis.scale / GameDiv.clientWidth
                globalThis.MapCamera.getComponent(Camera).rect = new Rect(
                    (1 + ScreenDiv.clientWidth / GameDiv.clientWidth) / 2 - smallMapRitio - 0.002,
                    1 - globalThis.heightRatio - 0.002 * GameDiv.clientWidth / GameDiv.clientHeight,
                    smallMapRitio,
                    globalThis.heightRatio
                )
            } else {
                let smallMapRitio = GameDiv.clientHeight * globalThis.heightRatio * globalThis.scale / GameDiv.clientWidth
                globalThis.MapCamera.getComponent(Camera).rect = new Rect(
                    1 - smallMapRitio - 0.003,
                    1 - globalThis.heightRatio - 0.003 * GameDiv.clientWidth / GameDiv.clientHeight,
                    smallMapRitio,
                    globalThis.heightRatio
                )
            }

            globalThis.BorderTop.getComponent(UITransform).setContentSize(680 * scale, GameX.BackGroundWidth / 800)
            globalThis.BorderBottom.getComponent(UITransform).setContentSize(680 * scale, GameX.BackGroundWidth / 800)
        }
    }

    initThrottling() {
        window.addEventListener('resize', globalThis.throttling(globalThis.initMenuUI, 800))
        window.addEventListener("orientationchange", globalThis.initMenuUI, false)
    }

    throttling(func: Function, wait = 500) {
        let timeout: any
        return function () {
            let context = this
            let args = arguments
            if (!timeout) {
                timeout = setTimeout(function () {
                    timeout = null
                    func.apply(context, args)
                }, wait)
            }
        }
    }
}


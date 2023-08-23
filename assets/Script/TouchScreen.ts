import { _decorator, Component, EventTouch, Input, Node, UITransform, Vec3, view } from 'cc'
import { GameX } from './GameX'

const { ccclass, property } = _decorator

@ccclass('TouchScreen')
export class TouchScreen extends Component {

    @property({ type: Node })
    private Rocker: Node | null = null
    @property({ type: Node })
    private InnerButton: Node | null = null

    private scale: number = 0
    private nodeSize: number = 0
    private circleBorder: number = 2

    start() {
        this.Rocker.active = GameX.CurrentMoveMode === 0     
        this.nodeSize = this.Rocker.getComponent(UITransform).contentSize.width
    }

    update(deltaTime: number) {

    }

    setTouchActive(active: boolean) {
        if (active) {
            this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
            this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
            this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this)
            this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
        } else {
            this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this)
            this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
            this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this)
            this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
        }
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
    }

    onTouchStart(event: EventTouch) {
        this.scale = view.getVisibleSize().height / this.node.parent.getComponent(UITransform).contentSize.height
        let position = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(
            new Vec3(event.getUILocation().x, event.getUILocation().y, 0)
        ).divide3f(this.scale, this.scale, 1)
        if (GameX.CurrentMoveMode === 2) {
            GameX.SnakeDirection = position.normalize()
        } else if (GameX.CurrentMoveMode === 0) {
            this.Rocker.active = true
            this.Rocker.setPosition(position)
        }
    }

    onTouchMove(event: EventTouch) {
        let position = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(
            new Vec3(event.getUILocation().x, event.getUILocation().y, 0)
        ).divide3f(this.scale, this.scale, 1)
        if (GameX.CurrentMoveMode === 2) {
            GameX.SnakeDirection = position.normalize()
        } else if (GameX.CurrentMoveMode === 0) {
            let delta = event.getDelta()
            let location = new Vec3(position.x - this.Rocker.position.x, position.y - this.Rocker.position.y, 0)
            let innerDistance = Math.hypot(this.InnerButton.position.x, this.InnerButton.position.y)
            let mouseDistance = Math.hypot(location.x, location.y)
            let edge = this.nodeSize / this.circleBorder
            if (innerDistance < edge && mouseDistance < edge) {
                this.InnerButton.setPosition(this.InnerButton.position.add(
                    new Vec3(delta.x / this.scale / view.getScaleX(), delta.y / this.scale / view.getScaleY(), 0))
                )
            } else {
                this.InnerButton.setPosition(location.normalize().multiply3f(edge, edge, edge))
            }
            GameX.SnakeDirection = this.InnerButton.position.clone().normalize()
        }
    }

    onTouchEnd() {
        this.InnerButton.setPosition(Vec3.ZERO)
        this.Rocker.active = false
    }

    onTouchCancel() {

    }
}


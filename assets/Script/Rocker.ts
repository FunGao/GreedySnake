import { 
    _decorator,
    Component,
    EventTouch,
    Input,
    Node,
    UITransform,
    Vec3,
    view 
} from 'cc'
import { GameX } from './GameX'

const { ccclass, property } = _decorator

@ccclass('Rocker')
export class Rocker extends Component {

    @property({ type: Node })
    private InnerButton: Node | null = null

    private nodeSize: number = 0
    private scale: number = 0
    private circleBorder: number = 2
    private direction: Vec3 = null

    start() {
        this.nodeSize = this.node.getComponent(UITransform).contentSize.width
    }

    update(deltaTime: number) {
        let distance = Math.hypot(this.InnerButton.position.x, this.InnerButton.position.y)
        let edge = this.nodeSize / this.circleBorder
        if (distance > edge) {
            this.InnerButton.setPosition(this.InnerButton.position.normalize().multiplyScalar(edge))
        }
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
        this.InnerButton.setPosition(new Vec3(
            position.x - this.node.position.x,
            position.y - this.node.position.y,
            0
        ))

        this.direction = this.InnerButton.position.clone().normalize()
        GameX.SnakeDirection = this.direction
    }

    onTouchMove(event: EventTouch) {
        let delta = event.getDelta()
        let position = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(
            new Vec3(event.getUILocation().x, event.getUILocation().y, 0)
        ).divide3f(this.scale, this.scale, 1)
        let location = new Vec3(position.x - this.node.position.x, position.y - this.node.position.y, 0)
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

        this.direction = this.InnerButton.position.clone().normalize()
        GameX.SnakeDirection = this.direction
    }

    onTouchEnd() {
        this.InnerButton.setPosition(new Vec3(0, 0, 0))
    }

    onTouchCancel() {
        this.InnerButton.setPosition(new Vec3(0, 0, 0))
    }
}

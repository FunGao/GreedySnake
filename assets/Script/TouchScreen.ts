import { _decorator, Component, EventTouch, Input, UITransform, Vec3, view } from 'cc'
import { GameX } from './GameX'

const { ccclass, property } = _decorator

@ccclass('TouchScreen')
export class TouchScreen extends Component {

    private scale: number = 0
    
    start() {
        
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
        GameX.SnakeDirection = position.normalize()
    }

    onTouchMove(event: EventTouch) {
        let position = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(
            new Vec3(event.getUILocation().x, event.getUILocation().y, 0)
        ).divide3f(this.scale, this.scale, 1)
        GameX.SnakeDirection = position.normalize()
    }

    onTouchEnd() {
        
    }

    onTouchCancel() {

    }
}


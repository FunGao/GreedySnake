import { _decorator, Component, UIRenderer, UITransform, Vec3 } from 'cc'
import { randomColor } from './GameUtils'
import { GameX } from './GameX'

const { ccclass, property } = _decorator

@ccclass('Food')
export class Food extends Component {

    private width: number = 0
    private height: number = 0

    start() {
        this.width = this.node.getComponent(UITransform).contentSize.x * 5
        this.height = this.node.getComponent(UITransform).contentSize.y * 5

        this.node.setPosition(this.randomPosition())
    }

    update(deltaTime: number) {

    }

    randomPosition(n: number = 1) {
        let x = Math.round(Math.random() * (GameX.BackGroundWidth - this.width) / n) - (GameX.BackGroundWidth - this.width) / n / 2
        let y = Math.round(Math.random() * (GameX.BackGroundHeight - this.height) / n) - (GameX.BackGroundHeight - this.height) / n / 2
        return new Vec3(x, y, 0)
    }
}


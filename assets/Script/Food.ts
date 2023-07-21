import { _decorator, Color, Component, UIRenderer, UITransform, Vec3, view } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Food')
export class Food extends Component {

    private width: number = 0
    private height: number = 0

    start() {
        this.width = view.getDesignResolutionSize().width - this.node.getComponent(UITransform).contentSize.x * 2
        this.height = view.getDesignResolutionSize().height - this.node.getComponent(UITransform).contentSize.y * 2

        this.node.getComponent(UIRenderer).color = this.randomColor()
        this.node.setPosition(this.randomPosition())
    }

    update(deltaTime: number) {

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
}


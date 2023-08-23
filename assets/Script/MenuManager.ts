import { _decorator, Color, Component, Node, UIRenderer } from 'cc'

const { ccclass, property } = _decorator;

@ccclass('MenuManager')
export class MenuManager extends Component {

    @property({ type: Node })
    private StartTip: Node | null = null

    private tip: boolean = true

    start() {
        this.tipBreath()
    }

    update(deltaTime: number) {

    }

    tipBreath() {
        this.schedule(() => {
            if (this.StartTip.getComponent(UIRenderer).color.a > 0 && this.tip) {
                let a = this.StartTip.getComponent(UIRenderer).color.a
                this.StartTip.getComponent(UIRenderer).color = new Color(255, 255, 255, a > 5 ? a - 5 : 0)
            } else {
                this.tip = false
            }
    
            if (this.StartTip.getComponent(UIRenderer).color.a < 255 && (!this.tip)) {
                let a = this.StartTip.getComponent(UIRenderer).color.a
                this.StartTip.getComponent(UIRenderer).color = new Color(255, 255, 255, a < 255 - 3 ? a + 3 : 255)
            } else {
                this.tip = true
            }
        }, 1 / 60)
    }
}


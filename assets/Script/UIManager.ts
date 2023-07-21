import { _decorator, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    @property({ type: Node })
    private MenuBackGroung: Node | null = null
    @property({ type: Node })
    private UI: Node | null = null

    start() {
        let scale = document.getElementById('content').clientWidth / document.getElementById('content').clientHeight
        this.MenuBackGroung.getComponent(UITransform).setContentSize(scale * 640, 640)
        this.UI.getComponent(UITransform).setContentSize(scale * 640, 640)
    }

    update(deltaTime: number) {
        
    }
}


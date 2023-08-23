import { _decorator, Component, Node, Size, UITransform } from 'cc'

const { ccclass, property } = _decorator

@ccclass('ConfirmMenu')
export class ConfirmMenu extends Component {

    @property({ type: Node })
    private ConfirmLabel: Node | null = null
    @property({ type: Node })
    private ConfirmButton: Node | null = null

    private flag: boolean = true

    start() {

    }

    update(deltaTime: number) {
        const size = this.ConfirmLabel.getComponent(UITransform).contentSize
        this.ConfirmButton.getComponent(UITransform).setContentSize(new Size(size.width + 6, size.height))
    }
}


import { _decorator, Component, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('GameLoading')
export class GameLoading extends Component {

    @property({ type: Node })
    private Load: Node | null = null

    start() {
        this.schedule(() => {
            this.Load.angle -= 4
        }, 0.01)
    }

    update(deltaTime: number) {
        
    }
}


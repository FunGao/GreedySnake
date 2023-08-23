import { _decorator, Component, Node, profiler } from 'cc'
const { ccclass, property } = _decorator

@ccclass('GameEndBack')
export class GameEndBack extends Component {

    start() {
        profiler.hideStats()
    }

    update(deltaTime: number) {
        
    }
}


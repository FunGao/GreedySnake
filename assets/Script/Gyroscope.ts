import { _decorator, Component, Vec3, Node } from 'cc'
import { getPlatform, getSystem } from './GameUtils'
import { GameX } from './GameX'

const { ccclass, property } = _decorator

@ccclass('Gyroscope')
export class Gyroscope extends Component {

    @property({ type: Node })
    private PauseMenu: Node | null = null
    @property({ type: Node })
    private MenuBackGroung: Node | null = null

    private Switch: boolean = true
    private OrientationEventOpen: boolean = false

    start() {

    }

    update(deltaTime: number) {

    }

    onGyroscopeClick() {
        if (!GameX.SwitchMode) {
            this.openGyroscope()
        } else {
            this.closeGyroscope()
        }
    }

    closeGyroscope() {
        GameX.SwitchMode = false
    }

    openGyroscope() {
        const that = this
        GameX.SwitchMode = true
        if (window.DeviceOrientationEvent && getPlatform() === 'mobile') {
            if (!that.OrientationEventOpen) {
                if (getSystem() === 'ios') {
                    // @ts-ignore
                    window.DeviceOrientationEvent.requestPermission().then(function (state: any) {
                        if (state === 'granted') {
                            that.gyroscope(that)
                        }
                    })
                } else {
                    that.gyroscope(that)
                }
            } else {
                that.PauseMenu.active = false
                that.MenuBackGroung.active = false
                GameX.AllPauseTime += (Date.now() - GameX.PauseTime)
                GameX.PauseTime = 0
                GameX.SnakeAIMove = true
            }
        }
    }

    gyroscope(that: any) {
        that.OrientationEventOpen = true
        that.PauseMenu.active = false
        that.MenuBackGroung.active = false
        GameX.AllPauseTime += (Date.now() - GameX.PauseTime)
        GameX.PauseTime = 0
        GameX.SnakeAIMove = true
        window.addEventListener('deviceorientation', function (event) {
            if (GameX.SwitchMode) {
                that.handleOrientationEvent(event.alpha, event.beta, event.gamma)
            }
        }, true)
    }

    handleOrientationEvent(alpha: any, beta: any, gamma: any) {
        GameX.SnakeDirection = new Vec3(beta, gamma, 0).normalize()
    }
}

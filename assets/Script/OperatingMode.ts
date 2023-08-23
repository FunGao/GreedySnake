import { _decorator, Component, Label, Node } from 'cc'
import { Rocker } from './Rocker'
import { Gyroscope } from './Gyroscope'
import { TouchScreen } from './TouchScreen'
import { GameX } from './GameX'
import { getPlatform } from './GameUtils'
import * as i18n from 'db://i18n/LanguageData'

const { ccclass, property } = _decorator

@ccclass('OperatingMode')
export class OperatingMode extends Component {

    @property({ type: Rocker })
    private RockerControl: Rocker | null = null
    @property({ type: Gyroscope })
    private GyroscopeControl: Gyroscope | null = null
    @property({ type: TouchScreen })
    private TouchScreenControl: TouchScreen | null = null

    @property({ type: Node })
    private GameRocker: Node | null = null
    @property({ type: Node })
    private PauseMenu: Node | null = null
    @property({ type: Node })
    private MenuBackGroung: Node | null = null

    @property({ type: Node })
    private OperatePop: Node | null = null
    @property({ type: Label })
    private OperateLabel: Label | null = null

    private CurClick: number = 0

    start() {

    }

    update(deltaTime: number) {

    }

    onRockerClick() {
        if (GameX.EndOpen || GameX.OperateOpen) return
        GameX.OperateOpen = true
        this.CurClick = 0
        this.OperateLabel.string = i18n.t('snk_mode1')
        this.OperatePop.active = true
    }

    onGyroscopeClick() {
        if (GameX.EndOpen || GameX.OperateOpen) return
        if (!(window.DeviceOrientationEvent && getPlatform() === 'mobile')) {
            this.OperateLabel.string = i18n.t('snk_sry')
            this.CurClick = -1
        } else {
            this.OperateLabel.string = i18n.t('snk_mode2')
            this.CurClick = 1
        }
        GameX.OperateOpen = true
        this.OperatePop.active = true
    }

    onScreenClick() {
        if (GameX.EndOpen || GameX.OperateOpen) return
        GameX.OperateOpen = true
        this.CurClick = 2
        this.OperateLabel.string = i18n.t('snk_mode3')
        this.OperatePop.active = true
    }

    changeOK() {
        if (this.CurClick === 0) {
            GameX.SwitchMode = false
            GameX.CurrentMoveMode = 0
            this.TouchScreenControl.setTouchActive(false)
            this.RockerControl.setTouchActive(true)
            this.PauseMenu.active = false
            this.MenuBackGroung.active = false
            this.GameRocker.active = (GameX.CurrentMoveMode === 0)
            GameX.SnakeAIMove = true
            GameX.SnakeDirection = GameX.JustDirection
            GameX.AllPauseTime += (Date.now() - GameX.PauseTime)
            GameX.PauseTime = 0
            GameX.OperateOpen = false
            this.OperatePop.active = false
            return
        }
        if (this.CurClick === 1) {
            this.RockerControl.setTouchActive(false)
            this.TouchScreenControl.setTouchActive(false)
            GameX.CurrentMoveMode = 1
            this.GameRocker.active = (GameX.CurrentMoveMode === 0)
            this.GyroscopeControl.openGyroscope()
            GameX.OperateOpen = false
            this.OperatePop.active = false
            return
        }
        if (this.CurClick === 2) {
            GameX.CurrentMoveMode = 2
            GameX.SwitchMode = false
            this.RockerControl.setTouchActive(false)
            this.TouchScreenControl.setTouchActive(true)
            this.PauseMenu.active = false
            this.MenuBackGroung.active = false
            this.GameRocker.active = (GameX.CurrentMoveMode === 0)
            GameX.SnakeDirection = GameX.JustDirection
            GameX.SnakeAIMove = true
            GameX.AllPauseTime += (Date.now() - GameX.PauseTime)
            GameX.PauseTime = 0
            GameX.OperateOpen = false
            this.OperatePop.active = false
            return
        }
        GameX.OperateOpen = false
        this.OperatePop.active = false
    }
}

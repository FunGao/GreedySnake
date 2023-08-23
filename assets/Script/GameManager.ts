import { _decorator, Button, Component, director, Input, Label, Node, profiler, Vec3 } from 'cc'
import { SnakeManager } from './SnakeManager'
import { SnakeAIManager } from './SnakeAIManager'
import { FoodManager } from './FoodManager'
import { Rocker } from './Rocker'
import { TouchScreen } from './TouchScreen'
import { Gyroscope } from './Gyroscope'
import { GameX } from './GameX'
import { BackGround } from './BackGround'
import { API } from './GameAPI'
import { openStore, sharePage } from './GameUtils'
import { UserLocalData } from './UserLocalData'
import * as i18n from 'db://i18n/LanguageData'

const { ccclass, property } = _decorator

enum GameState {
    GAME_INIT,
    GAME_START,
    GAME_RESTART,
    GAME_PAUSE,
    GAME_CONTINUE,
    GAME_END,
}

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: Node })
    private StartMenu: Node | null = null
    @property({ type: Node })
    private PauseMenu: Node | null = null
    @property({ type: Node })
    private EndMenu: Node | null = null
    @property({ type: Node })
    private DeathMenu: Node | null = null
    @property({ type: Node })
    private LoginMenu: Node | null = null
    @property({ type: Node })
    private ConfirmMenu: Node | null = null
    @property({ type: Node })
    private WinMenu: Node | null = null
    @property({ type: Node })
    private ShareMenu: Node | null = null
    @property({ type: Node })
    private MenuBackGroung: Node | null = null
    @property({ type: Node })
    private GetCoinMenu: Node | null = null
    @property({ type: Node })
    private TechMenu: Node | null = null

    @property({ type: Node })
    private TechOne: Node | null = null
    @property({ type: Node })
    private TechTwo: Node | null = null
    @property({ type: Node })
    private TechThree: Node | null = null

    @property({ type: Node })
    private ConfirmButton: Node | null = null

    @property({ type: Label })
    private EndLabel: Label | null = null
    @property({ type: Node })
    private BeforStart: Node | null = null
    @property({ type: Node })
    private Three: Node | null = null
    @property({ type: Node })
    private Two: Node | null = null
    @property({ type: Node })
    private One: Node | null = null

    @property({ type: SnakeManager })
    private SneakControl: SnakeManager | null = null
    @property({ type: FoodManager })
    private FoodControl: FoodManager | null = null
    @property({ type: SnakeAIManager })
    private SnakeAIControl: SnakeAIManager | null = null
    @property({ type: Rocker })
    private RockerControl: Rocker | null = null
    @property({ type: TouchScreen })
    private TouchScreenControl: TouchScreen | null = null
    @property({ type: Gyroscope })
    private GyroscopeControl: Gyroscope | null = null
    @property({ type: BackGround })
    private BackGroundControl: BackGround | null = null

    @property({ type: Node })
    private Mask: Node | null = null
    @property({ type: Node })
    private Popup: Node | null = null

    @property({ type: Node })
    private CoinOne: Node | null = null
    @property({ type: Node })
    private CoinTwo: Node | null = null

    @property({ type: Node })
    private CopyURL: Node | null = null

    @property({ type: Node })
    private NoThanksButton: Node | null = null

    @property({ type: Label })
    private SnakeLength: Label | null = null

    @property({ type: Node })
    private SnakeAIParent: Node | null = null

    @property({ type: Node })
    private Before: Node | null = null
    @property({ type: Label })
    private Next: Label | null = null
    @property({ type: Node })
    private NextButton: Node | null = null
    @property({ type: Node })
    private ShareCloseButton: Node | null = null


    private maskFlag: boolean = false

    private winTime: number = 0
    private winflag: boolean = false
    private startFlag: boolean = false
    private shareOpenFlag: boolean = false
    private getCoinFlag: boolean = false
    private confirmFlag: boolean = false
    private copyFlag: boolean = false
    private beforeStartTime: number = 0

    private teachFlag: boolean = false
    private curTeach: number = 0

    start() {
        profiler.hideStats()
        this.initGame()
        this.setGameState(GameState.GAME_INIT)
    }

    update(deltaTime: number) {
        if (GameX.StartTime !== 0 && GameX.PauseTime === 0) {
            GameX.GameTime = Math.floor((Date.now() - GameX.StartTime - GameX.AllPauseTime) / 1000)
        }
        if (this.winflag) {
            let time = 3 - Math.floor((Date.now() - this.winTime) / 750) > 0 ? 3 - Math.floor((Date.now() - this.winTime) / 750) : 0
            this.WinMenu.children[0].getComponent(Label).string = `${i18n.t('snk_pass')} ${time}···`
        }
        if (GameX.DeathNumber >= 49 && !this.winflag) {
            this.winflag = true
            GameX.DeathNumber = 50
            GameX.sssc = 1
            this.closeMoveMode()
            this.winTime = Date.now()
            GameX.SnakeDirection = null
            GameX.SnakeAIMove = false
            GameX.PauseTime = Date.now()
            this.MenuBackGroung.active = true
            if (!GameX.Login) {
                this.EndLabel.string = i18n.t('snk_pass')
                this.EndMenu.active = true
            } else {
                if (GameX.CanPlay) {
                    this.WinMenu.active = true
                    setTimeout(async function () {
                        let endresponse: any = await API.reportOnGameEnd()
                        if (endresponse && endresponse.code === 0) {
                            director.loadScene('gamend')
                        }
                    }, 2000)
                } else {
                    this.showShareMenu()
                }
            }
        }

        if (this.startFlag) {
            if (Date.now() - this.beforeStartTime < 500) {
                this.Three.active = true
                this.Two.active = false
                this.One.active = false
            } else if (Date.now() - this.beforeStartTime > 500 && Date.now() - this.beforeStartTime < 1500) {
                this.Three.active = false
                this.Two.active = true
                this.One.active = false
            } else if (Date.now() - this.beforeStartTime > 1500 && Date.now() - this.beforeStartTime < 2500) {
                this.Three.active = false
                this.Two.active = false
                this.One.active = true
            } else if (Date.now() - this.beforeStartTime > 2500) {
                this.BeforStart.active = false
                this.startFlag = false

                this.openMoveMode()
                this.SneakControl.makeInvincible()
                GameX.SnakeAIMove = true
                GameX.StartTime = Date.now()
                GameX.PauseTime = 0
                GameX.AllPauseTime = 0
                GameX.GameTime = 0
                GameX.Score = 0

                // 改回去 /////////////
                GameX.DeathNumber = 0
                //////////////////////

                GameX.SnakeLength = 3
                GameX.SnakeDirection = new Vec3(Math.random() * 2 - 1, Math.random() * 2 - 1, 0)
                GameX.sssc = 0

                GameX.uuid = new Date().getTime() + Math.random() + GameX.uid
                API.reportOnGameStart()
            }
        }
    }

    setGameState(value: GameState) {
        switch (value) {
            case GameState.GAME_INIT:
                this.initGame()
                break
            case GameState.GAME_START:
                this.startGame()
                break
            case GameState.GAME_RESTART:
                this.reStartGame()
                break
            case GameState.GAME_PAUSE:
                this.pauseGame()
                break
            case GameState.GAME_CONTINUE:
                this.continueGame()
                break
            case GameState.GAME_END:
                this.endGame()
                break
            default:
                break
        }
    }

    openMoveMode() {
        switch (GameX.CurrentMoveMode) {
            case 0:
                this.RockerControl.setTouchActive(true)
                break
            case 1:
                this.GyroscopeControl.openGyroscope()
                break
            case 2:
                this.TouchScreenControl.setTouchActive(true)
                break
            default:
                break
        }
    }

    closeMoveMode() {
        switch (GameX.CurrentMoveMode) {
            case 0:
                this.RockerControl.setTouchActive(false)
                break
            case 1:
                this.GyroscopeControl.closeGyroscope()
                break
            case 2:
                this.TouchScreenControl.setTouchActive(false)
                break
            default:
                break
        }
    }

    initGame() {
        this.StartMenu.active = true
        this.MenuBackGroung.active = false
        this.PauseMenu.active = false
        this.EndMenu.active = false
        this.DeathMenu.active = false
        this.LoginMenu.active = false
        this.ConfirmMenu.active = false
        this.WinMenu.active = false
        GameX.SnakeAIMove = false
        GameX.CurrentScene = 1
        GameX.sssc = 0
        GameX.revive_count = 0
        GameX.EndOpen = false
        GameX.OperateOpen = false
        GameX.DeathNumber = 0
        GameX.SwitchMode = false

        this.StartMenu.on(Input.EventType.TOUCH_START, this.onStartButtonClick, this)
    }

    async startGame() {
        if (this.teachFlag) return
        if (!this.startFlag) {
            this.startFlag = true
            this.beforeStartTime = Date.now()

            this.StartMenu.active = false
            this.MenuBackGroung.active = false
            this.PauseMenu.active = false
            this.EndMenu.active = false
            this.DeathMenu.active = false
            this.LoginMenu.active = false
            this.ConfirmMenu.active = false
            this.WinMenu.active = false
        }
    }

    reStartGame() {
        this.BackGroundControl.reset()
        this.SneakControl.reborn()
        this.SnakeAIControl.recreateAISnakes()
        this.FoodControl.recreateFoods()
        this.openMoveMode()
        this.StartMenu.active = false
        this.EndMenu.active = false
        this.MenuBackGroung.active = false
        GameX.SnakeAIMove = true
        GameX.StartTime = Date.now()
        GameX.PauseTime = 0
        GameX.AllPauseTime = 0
        GameX.GameTime = 0
        GameX.Score = 0
        GameX.DeathNumber = 0
        GameX.SnakeLength = 3

    }

    pauseGame() {
        if (GameX.PauseTime === 0 && GameX.StartTime !== 0) {
            this.closeMoveMode()
            this.PauseMenu.active = true
            this.MenuBackGroung.active = true
            GameX.JustDirection = GameX.SnakeDirection
            GameX.SnakeDirection = null
            GameX.SnakeAIMove = false
            GameX.PauseTime = Date.now()
        }
    }

    continueGame() {
        if (GameX.EndOpen || GameX.OperateOpen) return
        this.openMoveMode()
        this.PauseMenu.active = false
        this.MenuBackGroung.active = false
        GameX.SnakeAIMove = true
        GameX.AllPauseTime += (Date.now() - GameX.PauseTime)
        GameX.PauseTime = 0
        GameX.SnakeDirection = GameX.JustDirection
    }

    async endGame() {
        if (!this.shareOpenFlag) {
            this.closeMoveMode()
            this.DeathMenu.active = false
            this.MenuBackGroung.active = true
            if (!GameX.Login) {
                this.EndMenu.active = true
                GameX.EndOpen = true
            } else {
                if (GameX.CanPlay) {
                    this.Mask.active = true
                    this.maskFlag = true
                    let endresponse: any = await API.reportOnGameEnd()
                    if (endresponse && endresponse.code === 0) {
                        this.PauseMenu.active = false
                        GameX.SnakeAIMove = false
                        GameX.StartTime = 0
                        GameX.GameTime = 0
                        GameX.PauseTime = 0
                        GameX.AllPauseTime = 0
                        director.loadScene('gamend')
                    } else {
                        this.Mask.active = false
                        this.maskFlag = false
                    }
                } else {
                    this.showShareMenu()
                }
            }
        }
    }

    onStartButtonClick() {
        if (!this.maskFlag) this.setGameState(GameState.GAME_START)
    }

    onReStartButtonClick() {
        if (!this.maskFlag) this.setGameState(GameState.GAME_RESTART)
    }

    onPauseButtonClick() {
        if (!this.maskFlag) this.setGameState(GameState.GAME_PAUSE)
    }

    onContinueButtonClick() {
        if (!this.maskFlag) this.setGameState(GameState.GAME_CONTINUE)
    }

    onEndButtonClick() {
        if (!this.maskFlag) this.setGameState(GameState.GAME_END)
    }

    private noThanksFlag: boolean = false

    async onNoThanksClick() {
        this.NoThanksButton.getComponent(Button).interactable = false
        if (this.noThanksFlag) {
            this.NoThanksButton.getComponent(Button).interactable = true
            return
        }
        this.noThanksFlag = true
        if (this.checkLogin() && !this.shareOpenFlag && !this.maskFlag && !this.getCoinFlag && !this.confirmFlag) {
            if (GameX.CanPlay) {
                this.Mask.active = true
                this.maskFlag = true
                this.ConfirmButton.getComponent(Button).interactable = false
                let endresponse: any = await API.reportOnGameEnd()
                this.noThanksFlag = false
                if (endresponse && endresponse.code === 0) {
                    director.loadScene('gamend')
                } else {
                    this.ConfirmButton.getComponent(Button).interactable = true
                    this.NoThanksButton.getComponent(Button).interactable = true
                    this.Mask.active = false
                    this.maskFlag = false
                }
            } else {
                this.NoThanksButton.getComponent(Button).interactable = true
                this.showShareMenu()
            }
        } else {
            this.NoThanksButton.getComponent(Button).interactable = true
        }
    }

    onUseReviveCoinClick() {
        if (!this.maskFlag && !this.getCoinFlag && !this.shareOpenFlag && !this.confirmFlag) {
            if (GameX.revive_coin <= 0) {
                this.GetCoinMenu.active = true
                this.getCoinFlag = true
            } else {
                this.ConfirmMenu.active = true
                this.confirmFlag = true
            }
        }
    }

    onConfirmClick() {
        if (!this.maskFlag) {
            this.ConfirmButton.getComponent(Button).interactable = false
            this.Mask.active = true
            this.maskFlag = true
            API.useReviveCoin().then((res: any) => {
                if (res.code === 0) {
                    GameX.revive_coin--
                    GameX.revive_count++
                    this.SneakControl.reborn()
                    this.ConfirmButton.getComponent(Button).interactable = true
                    this.ConfirmMenu.active = false
                    this.confirmFlag = false
                    this.MenuBackGroung.active = false
                    this.DeathMenu.active = false
                    GameX.SnakeLength = 3
                    this.SnakeLength.string = String(GameX.SnakeLength)
                    GameX.SnakeAIMove = true
                    GameX.AllPauseTime += (Date.now() - GameX.PauseTime)
                    GameX.PauseTime = 0
                }
                // @ts-ignore
            }).finally(() => {
                this.Mask.active = false
                this.maskFlag = false
            })
        }
    }


    checkLogin() {
        if (!GameX.Login) {
            this.LoginMenu.active = true
        }
        return GameX.Login
    }

    onCloseClick() {
        if (!this.maskFlag) director.loadScene('loading')
    }

    onEndClick() {
        if (!this.maskFlag) this.EndMenu.active = false
    }

    onConfirmClose() {
        if (!this.maskFlag) {
            this.confirmFlag = false
            this.ConfirmMenu.active = false
            this.ConfirmButton.getComponent(Button).interactable = true
        }
    }

    onShareOneClick() {
        if (!this.maskFlag && !this.copyFlag) {
            sharePage('facebook')
        }
    }

    onShareTwoClick() {
        if (!this.maskFlag && !this.copyFlag) {
            sharePage('twitter')
        }
    }

    onShareThreeClick() {
        if (!this.maskFlag && !this.copyFlag) {
            sharePage('copy')
            this.CopyURL.active = true
            this.copyFlag = true
        }
    }

    onStoreClick() {
        if (!this.maskFlag) {
            openStore()
        }
    }

    async onShareMenuClose() {
        this.ShareCloseButton.getComponent(Button).interactable = false
        if (this.copyFlag || this.maskFlag) {
            this.ShareCloseButton.getComponent(Button).interactable = true
            return
        }
        this.Mask.active = true
        this.maskFlag = true
        await API.getUserInfoByOpenid(UserLocalData.getData('openid'))
        if (GameX.EndGame && GameX.CanPlay) {
            GameX.EndGame = false
            let endresponse: any = await API.reportOnGameEnd()
            if (endresponse && endresponse.code === 0) {
                director.loadScene('gamend')
            } else {
                this.ShareCloseButton.getComponent(Button).interactable = true
            }
            return
        } else {
            this.ShareCloseButton.getComponent(Button).interactable = true
        }
        if (GameX.DeathNumber >= 49 && GameX.sssc === 1) {
            this.Mask.active = false
            this.WinMenu.active = true
            setTimeout(async function () {
                let endresponse: any = await API.reportOnGameEnd()
                if (endresponse && endresponse.code === 0) {
                    director.loadScene('gamend')
                }
            }, 2000)
        } else {
            this.ShareCloseButton.getComponent(Button).interactable = true
        }
        this.ShareMenu.active = false
        this.shareOpenFlag = false
        this.maskFlag = false
        this.Mask.active = false
    }

    showShareMenu() {
        this.ShareMenu.active = true
        this.shareOpenFlag = true
    }

    getCoin() {
        if (!this.maskFlag) {
            openStore()
        }
    }

    async iHaveCoin() {
        this.Mask.active = true
        this.maskFlag = true
        await API.getUserInfoByOpenid(UserLocalData.getData('openid'))
        this.CoinOne.getComponent(Label).string = String(GameX.revive_coin)
        this.CoinTwo.getComponent(Label).string = String(GameX.revive_coin)
        this.GetCoinMenu.active = false
        this.getCoinFlag = false
        this.Mask.active = false
        this.maskFlag = false
    }

    getCoinClose() {
        this.GetCoinMenu.active = false
        this.getCoinFlag = false
    }

    pauseStoreClick() {
        if (!GameX.EndOpen) {
            openStore()
        }
    }

    deathStoreClick() {
        if (!this.maskFlag && !this.getCoinFlag && !this.shareOpenFlag && !this.confirmFlag) {
            openStore()
        }
    }

    techMenuOpen() {
        if (this.copyFlag) return
        this.teachFlag = true
        this.curTeach = 1
        this.TechTwo.active = false
        this.TechThree.active = false
        this.TechMenu.active = true
    }

    techMenuClose() {
        this.TechMenu.active = false
        this.teachFlag = false
    }

    beforeTech() {
        if (this.curTeach === 2) {
            this.TechTwo.active = false
            this.Before.active = false
            this.NextButton.setPosition(new Vec3(0, -225, 0))
            this.curTeach--
            return
        }
        if (this.curTeach === 3) {
            this.TechThree.active = false
            this.Next.string = i18n.t('snk_next')
            this.curTeach--
            return
        }
    }

    nextTeach() {
        if (this.curTeach === 1) {
            this.Before.active = true
            this.TechTwo.active = true
            this.NextButton.setPosition(new Vec3(145, -225, 0))
            this.curTeach++
            return
        }
        if (this.curTeach === 2) {
            this.TechThree.active = true
            this.Next.string = i18n.t('snk_game_start')
            this.curTeach++
            return
        }
        if (this.curTeach === 3) {
            this.TechMenu.active = false
            this.teachFlag = false
            this.startGame()
        }
    }

    copyURLClose() {
        this.CopyURL.active = false
        this.copyFlag = false
    }
}

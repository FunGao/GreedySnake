import { _decorator, Component, Node, UITransform } from 'cc'
import { SnakeHead } from './SnakeHead'
import { Rocker } from './Rocker'
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
    private MenuBackGroung: Node | null = null
    @property({ type: SnakeHead })
    private SneakControl: SnakeHead | null = null
    @property({ type: Rocker })
    private RockerControl: Rocker | null = null
    

    start() {
        this.setGameState(GameState.GAME_INIT)
    }

    update(deltaTime: number) {

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

    initGame() {
        this.StartMenu.active = true
        this.MenuBackGroung.active = true
        this.PauseMenu.active = false
        this.EndMenu.active = false
    }

    startGame() {
        this.RockerControl.setTouchActive(true)
        this.StartMenu.active = false
        this.EndMenu.active = false
        this.MenuBackGroung.active = false 
    }

    reStartGame() {
        this.SneakControl.reset()
        this.RockerControl.setTouchActive(true)
        this.StartMenu.active = false
        this.EndMenu.active = false
        this.MenuBackGroung.active = false 
    }

    pauseGame() {
        this.RockerControl.setTouchActive(false)
        this.PauseMenu.active = true
        this.MenuBackGroung.active = true
    }

    continueGame() {
        this.RockerControl.setTouchActive(true)
        this.PauseMenu.active = false
        this.MenuBackGroung.active = false
    }

    endGame() {
        this.RockerControl.setTouchActive(false)
        this.PauseMenu.active = false
        this.EndMenu.active = true
        this.MenuBackGroung.active = true
    }

    onStartButtonClick() {
        this.setGameState(GameState.GAME_START)
    }

    onReStartButtonClick() {
        this.setGameState(GameState.GAME_RESTART)
    }

    onPauseButtonClick() {
        this.setGameState(GameState.GAME_PAUSE)
    }

    onContinueButtonClick() {
        this.setGameState(GameState.GAME_CONTINUE)
    }

    onEndButtonClick() {
        this.setGameState(GameState.GAME_END)
    }
}

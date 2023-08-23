import { _decorator, Button, Component, director, EditBox, Node } from 'cc';
import { API, sendLoadPoint } from './GameAPI';
import { UserLocalData } from './UserLocalData'
import { GameX } from './GameX'
import { openStore } from './GameUtils';

const { ccclass, property } = _decorator

@ccclass('EndGame')
export class EndGame extends Component {

    @property({ type: Node })
    private EndBox: Node | null = null
    @property({ type: Node })
    private EndButton: Node | null = null
    @property({ type: Node })
    private WinMenu: Node | null = null
    @property({ type: Node })
    private ShareMenu: Node | null = null
    @property({ type: Node })
    private Popup: Node | null = null
    @property({ type: Node })
    private Mask: Node | null = null

    private popFlag: boolean = false
    private shareOpenFlag: boolean = false

    private InputUID: string = ''

    start() {
        this.EndBox.on(EditBox.EventType.TEXT_CHANGED, this.textChange, this)
    }

    update(deltaTime: number) {

    }

    textChange(event: any) {
        if (isNaN(Number(event.string))) {
            let endBox = this.EndBox.getComponent(EditBox)
            endBox.string = this.InputUID
        } else {
            this.InputUID = event.string
        }
    }

    async onEndClick() {
        if (this.popFlag || this.shareOpenFlag || GameX.OperateOpen) return
        if (!this.InputUID) {
            this.Popup.active = true
            this.popFlag = true
            return
        }
        let LoginBtn = this.EndButton.getComponent(Button)
        LoginBtn.interactable = false
        try {
            this.Mask.active = true
            let response: any = await API.getUserInfoByUID(this.InputUID)
            if (response.code === 0) {
                await API.getUserInfoByOpenid(UserLocalData.getData('openid'))
                if(GameX.uid !== 0) sendLoadPoint('login_success', GameX.uid)
                if (GameX.CanPlay) {
                    let endresponse: any = await API.reportOnGameEnd()
                    if (endresponse && endresponse.code === 0) {
                        director.loadScene('gamend')
                    } else {
                        this.Mask.active = false
                    }
                } else {
                    GameX.EndGame = true
                    this.Mask.active = false
                    this.showShareMenu()
                }
            } else {
                this.Mask.active = false
                this.Popup.active = true
                this.popFlag = true
            }
            LoginBtn.interactable = true
        } catch (error) {
            LoginBtn.interactable = true
            this.Popup.active = true
            this.popFlag = true
        }
    }

    showShareMenu() {
        this.ShareMenu.active = true
        this.shareOpenFlag = true
    }

    closeShareMenu() {
        this.shareOpenFlag = false
    }

    onLoginFailClose() {
        this.popFlag = false
    }

    onEndCloseClick() {
        if (!this.shareOpenFlag) {
            GameX.EndOpen = false
            this.node.active = false
        }
    }

    endStore() {
        if (this.popFlag || this.shareOpenFlag) return
        openStore()
    }
}


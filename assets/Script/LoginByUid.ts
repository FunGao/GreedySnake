import { _decorator, Button, Component, director, EditBox, Label, Node } from 'cc'
import { API, sendLoadPoint } from './GameAPI'
import { UserLocalData } from './UserLocalData'
import { GameEventTarget } from './EventUtil'
import { GameX } from './GameX'
import { openStore } from './GameUtils'
import * as i18n from 'db://i18n/LanguageData'

const { ccclass, property } = _decorator

@ccclass('LoginByUid')
export class LoginByUid extends Component {

    @property({ type: Node })
    private EditBox: Node | null = null
    @property({ type: Node })
    private LoginButton: Node | null = null
    @property({ type: Node })
    private DeathMenu: Node | null = null

    @property({ type: Node })
    private CoinOne: Node | null = null
    @property({ type: Node })
    private CoinTwo: Node | null = null
    @property({ type: Node })
    private Rank: Node | null = null

    @property({ type: Node })
    private GetID: Node | null = null
    @property({ type: Node })
    private Popup: Node | null = null

    @property({ type: Node })
    private Mask: Node | null = null

    private InputUID: string = ''
    private getIDFlag: boolean = false
    private popFlag: boolean = false

    start() {
        this.EditBox.on(EditBox.EventType.TEXT_CHANGED, this.textChange, this)
    }

    update(deltaTime: number) {

    }

    textChange(event: any) {
        if (isNaN(Number(event.string))) {
            let editBox = this.EditBox.getComponent(EditBox)
            editBox.string = this.InputUID
        } else {
            this.InputUID = event.string
        }
    }

    async onLoginClick() {
        if (this.getIDFlag || this.popFlag) {
            return
        }
        if (!this.InputUID) {
            this.Popup.active = true
            this.popFlag = true
            return
        }
        let LoginBtn = this.LoginButton.getComponent(Button)
        LoginBtn.interactable = false
        try {
            this.Mask.active = true
            let response: any = await API.getUserInfoByUID(this.InputUID)
            if (response.code === 0) {
                await API.getUserInfoByOpenid(UserLocalData.getData('openid'))
                if(GameX.uid !== 0) sendLoadPoint('login_success', GameX.uid)
                this.node.active = false
                this.CoinOne.getComponent(Label).string = String(GameX.revive_coin)
                this.CoinTwo.getComponent(Label).string = String(GameX.revive_coin)
                this.Rank.getComponent(Label).string = String(`${i18n.t('rank')}: ${(50 - GameX.DeathNumber) > 0 ? (50 - GameX.DeathNumber) : 1}/50`)
                this.Mask.active = false
                this.DeathMenu.active = true
            } else {
                this.Mask.active = false
                this.Popup.active = true
                this.popFlag = true
            }
            LoginBtn.interactable = true
        } catch (error) {
            this.Popup.active = true
            this.popFlag = true
            LoginBtn.interactable = true
        }
    }

    onGetIDClick() {
        this.getIDFlag = true
        this.GetID.active = true
    }

    onCloseGetIDClick() {
        this.getIDFlag = false
        this.GetID.active = false
    }

    onCloseClick() {
        if (!this.getIDFlag) {
            director.loadScene('loading')
        }
    }

    onLoginFailCloseClick() {
        this.Popup.active = false
        this.popFlag = false
    }

    loginStore() {
        if (this.getIDFlag || this.popFlag) return
        openStore()
    }
}


import { _decorator, Component, director, Game, Node, profiler, UITransform } from 'cc'

import * as i18n from 'db://i18n/LanguageData'
import { init, updateSceneRenderers } from '../../extensions/i18n/assets/LanguageData'
import { API, sendLoadPoint } from './GameAPI'
import { getLangkey, getBrowserValue, sharePage, openStore, getPlatform } from './GameUtils'
import { GameX } from './GameX'
import { UserLocalData } from './UserLocalData'

const { ccclass, property } = _decorator

let loadingThis = null

@ccclass('Loading')
export class Loading extends Component {

    @property({ type: Node })
    private ShareMenu: Node | null = null
    @property({ type: Node })
    private Mask: Node | null = null
    @property({ type: Node })
    private CopyURL: Node | null = null

    @property({ type: Node })
    private SreenTip: Node | null = null
    @property({ type: Node })
    private Continue: Node | null = null
    @property({ type: Node })
    private Tip: Node | null = null

    private width: number = 0

    start() {
        loadingThis = this

        profiler.hideStats()
        const game = new Game()
        game.frameRate = 30
        this.init()

        this.newCheckOrientation()
        this.width = document.body.clientWidth

        this.Tip.getComponent(UITransform).setContentSize(this.width - 120, 50)
        window.addEventListener('orientationchange', this.listenerFun)
    }

    update(deltaTime: number) {

    }

    listenerFun() {
        loadingThis.Tip.getComponent(UITransform).setContentSize(loadingThis.width - 120, 50)
        loadingThis.newCheckOrientation()
    }

    // oldCheckOrientation() {
    //     if (window.orientation === 0) {
    //         this.Continue.active = false
    //     } else if (window.orientation === 90 || window.orientation === -90) {
    //         this.Continue.active = true
    //     }
    // }

    // checkOrientation() {
    //     if (window.matchMedia("(orientation: portrait)").matches) {
    //         this.Continue.active = false
    //     } else if (window.matchMedia("(orientation: landscape)").matches) {
    //         this.Continue.active = true
    //     }
    // }

    newCheckOrientation() {
        let ScreenDiv = document.body
        let GameDiv = document.getElementById('GameDiv')
        if (GameDiv.clientHeight > ScreenDiv.clientHeight || GameDiv.clientWidth > ScreenDiv.clientWidth) {
            this.Continue.active = ScreenDiv.clientWidth > ScreenDiv.clientHeight
        } else {
            this.Continue.active = GameDiv.clientWidth > GameDiv.clientHeight
        }
    }

    async init() {
        this.Mask.active = true
        GameX.CurrentScene = 0
        UserLocalData.init()
        let openidURL = getBrowserValue('openid') ? decodeURIComponent(getBrowserValue('openid')) : ''
        if (!openidURL) {
            let openidLocal = UserLocalData.getData('openid')
            if (openidLocal) {
                await API.getUserInfoByOpenid(openidLocal)
                if (GameX.uid !== 0) sendLoadPoint('load_done', GameX.uid)
            } else {
                GameX.CanPlay = true
            }
        } else {
            const URL = window.location.origin + window.location.pathname
            const SEARCH_QUERY = location.search.substring(1).split('&').filter(x => x.indexOf('openid') < 0).join('&')
            history.replaceState('', '', `${URL}${SEARCH_QUERY.length ? `?${SEARCH_QUERY}` : ''}`)
            UserLocalData.setData('openid', openidURL)
            await API.getUserInfoByOpenid(openidURL)
            if (GameX.uid !== 0) sendLoadPoint('load_done', GameX.uid)
        }

        // 浏览器置顶语种
        const broswerLang = navigator.language
        let broswerLF = ''
        if (broswerLang.toLowerCase() === 'zh-tw') broswerLF = 'zh-tw'
        else if (broswerLang.startsWith('zh')) broswerLF = 'zh-cn'
        else broswerLF = broswerLang.split('-')[0]
        // 设置语种
        let urlLang = getBrowserValue('lang') || getBrowserValue('l') || broswerLF || 'en'
        urlLang = urlLang.replace('-', '').toLocaleLowerCase()
        let lang = getLangkey(urlLang)
        init(lang)
        updateSceneRenderers()

        // 网页标题
        document.title = i18n.t('snk_title')

        // utm_campaign
        let utmCanpaign = getBrowserValue('utm_campaign') || 'mini_tcs'
        UserLocalData.setData('utmCanpaign', utmCanpaign)

        if (getPlatform() !== 'desktop' && GameX.FirstPlay) {
            this.Mask.active = false
            this.SreenTip.active = true
        } else {
            this.goGameScene()
        }
    }

    goGameScene() {
        window.removeEventListener('orientationchange', this.listenerFun)
        this.SreenTip.active = false
        if (GameX.CanPlay) {
            GameX.FrameStep = 3
            GameX.SnakeSpeed = 15
            GameX.SnakeAISpeed = 6

            if (GameX.no_used_revive_pass && GameX.total_pass_num > 10) {
                if (GameX.no_revive_pass_num / GameX.total_pass_num < 0.5) {
                    GameX.ShrinkRate = 15
                } else if(GameX.no_revive_pass_num / GameX.total_pass_num < 0.8) {
                    GameX.ShrinkRate = 10
                } else {
                    GameX.ShrinkRate = 6
                    GameX.FrameStep = 5
                    GameX.SnakeAISpeed = 5
                }
            } else {
                GameX.ShrinkRate = 15
            }

            if (GameX.uid == 129258673 || GameX.uid == 51618084 || GameX.uid == 133014859) {
                GameX.FrameStep = 15
            }

            this.Mask.active = true
            GameX.FirstPlay = false
            director.loadScene('game')
        } else {
            this.Mask.active = false
            this.ShareMenu.active = true
        }
    }

    onShareOneClick() {
        sharePage('facebook')
    }

    onShareTwoClick() {
        sharePage('twitter')
    }

    onShareThreeClick() {
        sharePage('copy')
        this.CopyURL.active = true
    }

    onStoreClick() {
        openStore()
    }

    copyURLClose() {
        this.CopyURL.active = false
    }

    onShareMenuClose() {
        this.ShareMenu.active = false
        this.Mask.active = true
        this.init()
    }
}


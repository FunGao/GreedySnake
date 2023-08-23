import { _decorator, Component, director, Label, Node, profiler, UITransform } from 'cc'
import { GameX } from './GameX'
import * as i18n from 'db://i18n/LanguageData'

const { ccclass, property } = _decorator

let globalThis = null

@ccclass('GameEndUIManager')
export class GameEndUIManager extends Component {

    /**
     * 属性由 globalThis 访问
     */
    @property({ type: Node })
    private TopBar: Node | null = null
    @property({ type: Node })
    private WinBanner: Node | null = null
    @property({ type: Node })
    private LoseBanner: Node | null = null
    @property({ type: Node })
    private WinBack: Node | null = null
    @property({ type: Node })
    private LoseBack: Node | null = null

    @property({ type: Node })
    private BarOneYes: Node | null = null
    @property({ type: Node })
    private BarTwoYes: Node | null = null
    @property({ type: Node })
    private DotYesOne: Node | null = null
    @property({ type: Node })
    private DotYesTwo: Node | null = null
    @property({ type: Node })
    private DotYesThree: Node | null = null

    @property({ type: Node })
    private LengthInfo: Node | null = null
    @property({ type: Node })
    private KillInfo: Node | null = null
    @property({ type: Node })
    private RankInfo: Node | null = null

    @property({ type: Node })
    private PlayAgainLabel: Node | null = null

    @property({ type: Label })
    private AwradLabel11: Label | null = null
    @property({ type: Label })
    private AwradLabel12: Label | null = null
    @property({ type: Label })
    private AwradLabel21: Label | null = null
    @property({ type: Label })
    private AwradLabel22: Label | null = null
    @property({ type: Label })
    private AwradLabel31: Label | null = null
    @property({ type: Label })
    private AwradLabel32: Label | null = null

    async start() {
        globalThis = this
        GameX.CurrentScene = 2

        profiler.hideStats()
        this.init()
        this.initUI()
        this.initThrottling()

        this.AwradLabel11.string = i18n.t('text_condition_2').replace('{0}', '2')
        this.AwradLabel12.string = i18n.t('snk_stages').replace('{}', '1')
        this.AwradLabel21.string = i18n.t('text_condition_2').replace('{0}', '3')
        this.AwradLabel22.string = i18n.t('snk_stages').replace('{}', '2')
        this.AwradLabel31.string = i18n.t('text_condition_2').replace('{0}', '5')
        this.AwradLabel32.string = i18n.t('snk_stages').replace('{}', '3')
    }

    update(deltaTime: number) {
        
    }

    init() {
        this.LengthInfo.getComponent(Label).string = `${i18n.t('snk_length')}: ${GameX.SnakeLength}`
        this.KillInfo.getComponent(Label).string = `${i18n.t('snk_kills')}: ${GameX.DeathNumber === 50 ? 49 : GameX.DeathNumber}`
        this.RankInfo.getComponent(Label).string = `${i18n.t('snk_personal_rank')}:${50 - GameX.DeathNumber}/50`
        if(GameX.DeathNumber >= 49 && GameX.sssc === 1) {
            this.LoseBanner.active = false
            this.LoseBack.active = false
        } else {
            this.WinBanner.active = false
            this.WinBack.active = false
        }
        if(GameX.total_pass_num >= 1 && GameX.score_data_times >= 2) {
            this.DotYesOne.active = true
            if(GameX.total_pass_num >= 2  && GameX.score_data_times >= 3) {
                this.DotYesTwo.active = true
                this.BarOneYes.active = true
                if(GameX.total_pass_num >= 3 && GameX.score_data_times >= 5) {
                    this.DotYesThree.active = true
                    this.BarTwoYes.active = true
                }
            }
        }

        if(!(GameX.share_condition || GameX.order_condition)) {
            this.PlayAgainLabel.getComponent(Label).string = 
            `${i18n.t('replay')}(${GameX.daily_score_remaining_times - 1 > 0 ? GameX.daily_score_remaining_times - 1 : 0})`
        }
    }

    initUI() {
        if (GameX.CurrentScene === 2) {
            let ScreenDiv = document.body
            let GameDiv = document.getElementById('GameDiv')
            let scale = GameDiv.clientHeight > ScreenDiv.clientHeight || GameDiv.clientWidth > ScreenDiv.clientWidth
                ? ScreenDiv.clientWidth / ScreenDiv.clientHeight
                : GameDiv.clientWidth / GameDiv.clientHeight
            globalThis.TopBar.getComponent(UITransform).setContentSize(scale * 640 - 40, 100)
            globalThis.node.getComponent(UITransform).setContentSize(scale * 640, 640)
        }
    }

    initThrottling() {
        window.addEventListener('resize', globalThis.throttling(globalThis.initUI, 800))
        window.addEventListener("orientationchange", globalThis.initUI, false)
    }

    throttling(func: Function, wait = 500) {
        let timeout: any
        return function () {
            let context = this
            let args = arguments
            if (!timeout) {
                timeout = setTimeout(function () {
                    timeout = null
                    func.apply(context, args)
                }, wait)
            }
        }
    }
}


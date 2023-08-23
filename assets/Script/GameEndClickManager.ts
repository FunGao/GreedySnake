import { _decorator, Component, director, instantiate, Label, Node, Prefab } from 'cc'
import { GameX } from './GameX'
import { API } from './GameAPI'
import { UserLocalData } from './UserLocalData'
import { openStore, sharePage, timeFormat } from './GameUtils'
import * as i18n from 'db://i18n/LanguageData'

const { ccclass, property } = _decorator

@ccclass('GameEndClickManager')
export class GameEndClickManager extends Component {

    @property({ type: Node })
    private Mask: Node | null = null

    @property({ type: Node })
    private Rank: Node | null = null
    @property({ type: Node })
    private RankList: Node | null = null
    @property({ type: Node })
    private RankMe: Node | null = null

    @property({ type: Node })
    private PersonRank: Node | null = null
    @property({ type: Node })
    private PersonRankList: Node | null = null
    @property({ type: Node })
    private PersonRankMe: Node | null = null

    @property({ type: Node })
    private AreaRankAward: Node = null
    @property({ type: Node })
    private PersonRankAward: Node = null

    @property({ type: Node })
    private AwardOneOpen: Node | null = null
    @property({ type: Node })
    private AwardTwoOpen: Node | null = null
    @property({ type: Node })
    private AwardThreeOpen: Node | null = null
    @property({ type: Node })
    private DailyAwardOpen: Node | null = null
    @property({ type: Node })
    private AwardOpen: Node | null = null
    @property({ type: Node })
    private AwardOpenTip: Node | null = null
    @property({ type: Node })
    private Rule: Node | null = null

    @property({ type: Node })
    private AwardStage1: Node | null = null
    @property({ type: Node })
    private AwardStage2: Node | null = null
    @property({ type: Node })
    private AwardStage3: Node | null = null
    @property({ type: Node })
    private AwardDaily: Node | null = null

    @property({ type: Node })
    private AwardLight1: Node | null = null
    @property({ type: Node })
    private AwardLight2: Node | null = null
    @property({ type: Node })
    private AwardLight3: Node | null = null
    @property({ type: Node })
    private AwardLightDaily: Node | null = null
    @property({ type: Node })
    private AwardLight12: Node | null = null
    @property({ type: Node })
    private AwardLight22: Node | null = null
    @property({ type: Node })
    private AwardLight32: Node | null = null
    @property({ type: Node })
    private AwardLightDaily2: Node | null = null

    @property({ type: Node })
    private CopyURL: Node | null = null

    @property({ type: Label })
    private DailyCountdown: Label = null
    @property({ type: Label })
    private RankCountdown: Label = null
    @property({ type: Label })
    private PersonRankCountdown: Label = null

    @property({ type: Label })
    private CouonTip: Label = null

    private flagOne: boolean = false
    private flagTwo: boolean = false
    private flagThree: boolean = false
    private flagDaily: boolean = false

    private AreaRankClickTime: number = 0
    private PersonRankClickTime: number = 0

    private canClickFlag: boolean = false

    private rankFlag: number = 0

    async start() {

        this.Mask.active = true
        this.canClickFlag = false

        if (!GameX.coupon_receive) {
            this.CouonTip.string = i18n.t('Redenvelope')
        } else {
            this.CouonTip.string = i18n.t('first_charge_double')
        }

        await this.initAwardStatus()
        this.canClickFlag = true
        await this.onAreaRankClick('init')
        await this.onPersonRankClick('init')
        this.Mask.active = false
    }

    update(deltaTime: number) {
    }

    async initAwardStatus() {
        const stageAwardStatus: any = await API.queryStageAwards()
        if (stageAwardStatus.data[0]) {
            this.flagOne = false
            this.AwardOneOpen.active = true
        } else {
            this.flagOne = true
            if (GameX.total_pass_num >= 1 && GameX.score_data_times >= 2) {
                this.AwardLight1.active = true
                this.AwardLight12.active = true
            }
        }
        if (stageAwardStatus.data[1]) {
            this.flagTwo = false
            this.AwardTwoOpen.active = true
        } else {
            this.flagTwo = true
            if (GameX.total_pass_num >= 2 && GameX.score_data_times >= 3) {
                this.AwardLight2.active = true
                this.AwardLight22.active = true
            }
        }
        if (stageAwardStatus.data[2]) {
            this.flagThree = false
            this.AwardThreeOpen.active = true
        } else {
            this.flagThree = true
            if (GameX.total_pass_num >= 3 && GameX.score_data_times >= 5) {
                this.AwardLight3.active = true
                this.AwardLight32.active = true
            }
        }

        const dailyAwardStatus: any = await API.getDailyAwardStatus()
        if (dailyAwardStatus.data[0]) {
            this.flagDaily = false
            this.DailyAwardOpen.active = true
        } else {
            this.flagDaily = true
            this.AwardLightDaily.active = true
            this.AwardLightDaily2.active = true
        }
    }

    async onAreaRankClick(type = 'refresh') {
        if (this.canClickFlag) {
            this.rankFlag = 0
            if (Date.now() - this.AreaRankClickTime > 45 * 1000) {
                this.Mask.active = true
                let response: any = await API.getRankData(0)
                if (response.code === 0) {
                    this.AreaRankClickTime = Date.now()
                    let data = response.data
                    GameX.is_activity_ends = data.countdown <= 0
                    GameX.rank_data.countdown = (new Date().getTime() / 1000) + data.countdown
                    GameX.rank_data.ranking_list = [...data.ranking_list]
                    GameX.rank_data.use_rank = { ...data.use_rank }
                    if (type !== 'init') {
                        this.InitList()
                        this.Rank.active = true
                        this.canClickFlag = false
                    }
                }
                this.Mask.active = false
                if (type === 'init') {
                    this.countdown()
                    this.unschedule(() => this.countdown())
                    this.schedule(() => this.countdown(), 1)
                }
            } else {
                this.InitList()
                this.Rank.active = true
                this.canClickFlag = false
            }
        }
    }

    async onPersonRankClick(type = 'refresh') {
        if (this.canClickFlag) {
            this.rankFlag = 1
            if (Date.now() - this.PersonRankClickTime > 45 * 1000) {
                this.Mask.active = true
                let response: any = await API.getRankData(1)
                if (response.code === 0) {
                    this.PersonRankClickTime = Date.now()
                    let data = response.data
                    GameX.is_activity_ends = data.countdown <= 0
                    GameX.rank_data.countdown = (new Date().getTime() / 1000) + data.countdown
                    GameX.person_rank_data.ranking_list = [...data.ranking_list]
                    GameX.person_rank_data.use_rank = { ...data.use_rank }
                    if (type !== 'init') {
                        this.InitPersonList()
                        this.PersonRank.active = true
                        this.canClickFlag = false
                    }
                }
                this.Mask.active = false
            } else {
                this.InitPersonList()
                this.PersonRank.active = true
                this.canClickFlag = false
            }
        }
    }

    onPlayAgainClick() {
        if (this.canClickFlag) {
            director.loadScene('loading')
        }
    }

    onShareOneClick() {
        if (this.canClickFlag) {
            sharePage('facebook')
        }
    }

    onShareTwoClick() {
        if (this.canClickFlag) {
            sharePage('twitter')
        }
    }

    onShareThreeClick() {
        if (this.canClickFlag) {
            sharePage('copy')
            this.canClickFlag = false
            this.CopyURL.active = true
        }
    }

    CopyURLClose() {
        this.canClickFlag = true
        this.CopyURL.active = false
    }

    async onAwardOneClick() {
        if (this.canClickFlag) {
            if (GameX.Login && this.flagOne) {
                if (GameX.total_pass_num >= 1 && GameX.score_data_times >= 2) {
                    this.Mask.active = true
                    this.canClickFlag = false
                    let data: any = await API.receiveStageAwards(0)
                    if (data.code === 0) {
                        this.flagOne = false
                        this.AwardOpenTip.getComponent(Label).string = i18n.t('snk_congratulate')
                        this.AwardOneOpen.active = true
                        this.AwardLight1.active = false
                        this.AwardLight12.active = false
                    }
                    this.Mask.active = false
                } else {
                    this.AwardOpenTip.getComponent(Label).string = i18n.t('text_award_desc')
                }
            } else {
                this.AwardOpenTip.getComponent(Label).string = i18n.t('snk_claimed')
            }
            this.AwardStage1.active = true
            this.AwardOpen.active = true
            this.canClickFlag = false
        }
    }

    async onAwardTwoClick() {
        if (this.canClickFlag) {
            if (GameX.Login && this.flagTwo) {
                if (GameX.total_pass_num >= 2 && GameX.score_data_times >= 3) {
                    this.Mask.active = true
                    this.canClickFlag = false
                    let data: any = await API.receiveStageAwards(1)
                    if (data.code === 0) {
                        this.flagTwo = false
                        this.AwardOpenTip.getComponent(Label).string = i18n.t('snk_congratulate')
                        this.AwardTwoOpen.active = true
                        this.AwardLight2.active = false
                        this.AwardLight22.active = false
                    }
                    this.Mask.active = false
                } else {
                    this.AwardOpenTip.getComponent(Label).string = i18n.t('text_award_desc')
                }
            } else {
                this.AwardOpenTip.getComponent(Label).string = i18n.t('snk_claimed')
            }
            this.AwardStage2.active = true
            this.AwardOpen.active = true
            this.canClickFlag = false
        }
    }

    async onAwardThreeClick() {
        if (this.canClickFlag) {
            if (GameX.Login && this.flagThree) {
                if (GameX.total_pass_num >= 3 && GameX.score_data_times >= 5) {
                    this.Mask.active = true
                    this.canClickFlag = false
                    let data: any = await API.receiveStageAwards(2)
                    if (data.code === 0) {
                        this.flagThree = false
                        this.AwardOpenTip.getComponent(Label).string = i18n.t('snk_congratulate')
                        this.AwardThreeOpen.active = true
                        this.AwardLight3.active = false
                        this.AwardLight32.active = false
                    }
                    this.Mask.active = false
                } else {
                    this.AwardOpenTip.getComponent(Label).string = i18n.t('text_award_desc')
                }
            } else {
                this.AwardOpenTip.getComponent(Label).string = i18n.t('snk_claimed')
            }
            this.AwardStage3.active = true
            this.AwardOpen.active = true
            this.canClickFlag = false
        }
    }

    async onDailyAwardClick() {
        if (this.canClickFlag) {
            if (GameX.Login && this.flagDaily) {
                this.Mask.active = true
                this.canClickFlag = false
                const data: any = await API.getDailyAward()
                if (data.code === 0) {
                    this.flagDaily = false
                    this.DailyAwardOpen.active = true
                    this.AwardLightDaily.active = false
                    this.AwardLightDaily2.active = false
                    this.AwardOpenTip.getComponent(Label).string = i18n.t('snk_daily_rewards')
                }
                this.Mask.active = false
            } else {
                this.AwardOpenTip.getComponent(Label).string = i18n.t('snk_claimed')
            }
            this.AwardDaily.active = true
            this.AwardOpen.active = true
            this.canClickFlag = false
        }
    }

    onDoubleDiamondClick() {
        if (this.canClickFlag) {
            openStore()
        }
    }

    onCloseRankClick() {
        this.Rank.active = false
        this.canClickFlag = true
    }

    onClosePersonRankClick() {
        this.PersonRank.active = false
        this.canClickFlag = true
    }

    onCloseAwardLookClick() {
        this.AwardOpen.active = false
        this.canClickFlag = true
        this.AwardStage1.active = false
        this.AwardStage2.active = false
        this.AwardStage3.active = false
        this.AwardDaily.active = false
    }

    onWhatClick() {
        this.Rule.active = true
    }

    onWhatCloseClick() {
        this.Rule.active = false
    }

    onRankAwardClick() {
        if (this.rankFlag === 0) {
            this.AreaRankAward.active = true
        }
        if (this.rankFlag === 1) {
            this.PersonRankAward.active = true
        }
    }
    onRankAwardCloseClick() {
        this.AreaRankAward.active = false
        this.PersonRankAward.active = false
    }

    InitList() {
        const RANK_LIST = GameX.rank_data.ranking_list
        const RANK_ME = GameX.rank_data.use_rank
        for (let l = 0; l < 10; l++) {
            this.RankList.children[l].children[1].children[0].getComponent(Label).string = RANK_LIST[l] ? `${RANK_LIST[l].server_id}` : '-'
            this.RankList.children[l].children[2].children[0].getComponent(Label).string = RANK_LIST[l] ? `${RANK_LIST[l].name}` : '-'
            this.RankList.children[l].children[3].children[0].getComponent(Label).string = RANK_LIST[l] ? `${RANK_LIST[l].score}` : '-'
        }
        this.RankMe.children[0].children[0].getComponent(Label).string = RANK_ME.rank ? `${RANK_ME.rank}` : '-'
        this.RankMe.children[1].children[0].getComponent(Label).string = RANK_ME.server_id ? `${RANK_ME.server_id}` : '-'
        this.RankMe.children[2].children[0].getComponent(Label).string = RANK_ME.name ? `${RANK_ME.name}` : '-'
        this.RankMe.children[3].children[0].getComponent(Label).string = RANK_ME.score ? `${RANK_ME.score}` : '0'
    }

    InitPersonList() {
        const RANK_LIST = GameX.person_rank_data.ranking_list
        const RANK_ME = GameX.person_rank_data.use_rank
        for (let l = 0; l < 100; l++) {
            if(l >= 3) this.PersonRankList.children[l].children[0].children[0].getComponent(Label).string = String(l + 1)
            this.PersonRankList.children[l].children[1].children[0].getComponent(Label).string = RANK_LIST[l] ? `${RANK_LIST[l].server_id}` : '-'
            this.PersonRankList.children[l].children[2].children[0].getComponent(Label).string = RANK_LIST[l] ? `${RANK_LIST[l].name}` : '-'
            this.PersonRankList.children[l].children[3].children[0].getComponent(Label).string = RANK_LIST[l] ? `${RANK_LIST[l].score}` : '-'
        }
        this.PersonRankMe.children[0].children[0].getComponent(Label).string = RANK_ME.rank ? `${RANK_ME.rank}` : '-'
        this.PersonRankMe.children[1].children[0].getComponent(Label).string = RANK_ME.server_id ? `${RANK_ME.server_id}` : '-'
        this.PersonRankMe.children[2].children[0].getComponent(Label).string = RANK_ME.name ? `${RANK_ME.name}` : '-'
        this.PersonRankMe.children[3].children[0].getComponent(Label).string = RANK_ME.score ? `${RANK_ME.score}` : '0'
    }

    gameEndStore() {
        if (this.canClickFlag) {
            openStore()
        }
    }

    countdown() {
        if (GameX.is_activity_ends) {
            this.DailyCountdown.string = ''
            GameX.is_received_daily_awards = true
            this.flagDaily = false
            this.DailyAwardOpen.active = true
            return
        }
        // 每日奖励倒计时
        let dailyCountdown = parseInt(`${(Number(GameX.countdown_to_tomorrow) - (new Date().getTime() / 1000))}`)
        dailyCountdown = dailyCountdown > 0 ? dailyCountdown : 0;
        if (dailyCountdown >= 0) {
            this.DailyCountdown.string = `${timeFormat(dailyCountdown)}`
            if (dailyCountdown === 0) {
                GameX.is_received_daily_awards = false
                this.flagDaily = true
                this.DailyAwardOpen.active = false
            }
        }
        // 排行榜倒计时
        let rankCountdown = parseInt(`${(Number(GameX.rank_data.countdown) - (new Date().getTime() / 1000))}`)
        rankCountdown = rankCountdown > 0 ? rankCountdown : 0
        if (rankCountdown >= 0) {
            this.RankCountdown.string = `${i18n.t('countdown')} ${timeFormat(rankCountdown)}`
            this.PersonRankCountdown.string = `${i18n.t('countdown')} ${timeFormat(rankCountdown)}`
            if (rankCountdown === 0) {
                GameX.is_activity_ends = true
            }
        }
    }
}


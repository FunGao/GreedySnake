import { Vec3, view } from 'cc'

export class GameX {

    /* 游戏环境 - test | pord */
    public static Env: string = (window.location.origin.indexOf('dev') > -1 || window.location.origin.indexOf('localhost') > -1 || window.location.origin.indexOf(':745') > -1) ? 'test' : 'pord'

    /* 宿主游戏 */
    public static Game: string = 'ss'

    /* 游戏状态 */
    public static Death: boolean = false

    public static EndGame: boolean = false
    public static EndOpen: boolean = false
    public static OperateOpen: boolean = false

    /* 暂停前的方向 */
    public static JustDirection: Vec3 | null = Vec3.ZERO

    /* 当前场景 */
    public static CurrentScene: number = 0

    /* 第一次玩 */
    public static FirstPlay: boolean = true

    /* 缩圈时间 */
    public static ShrinkRate: number = 20

    /* 结算数据 */
    public static DeathNumber: number = 0
    public static SnakeLength: number = 3
    public static Score: number = 0

    /* 屏幕刷新率 */
    public static FPS: number = 60

    public static SwitchMode: boolean = false

    /* 画布宽高 */
    public static CanvasWidth = view.getDesignResolutionSize().width
    public static CanvasHeight = view.getDesignResolutionSize().height

    /* 背景宽高 */
    public static BackGroundWidth: number = 0
    public static BackGroundHeight: number = 0

    /* 游戏时间 */
    public static GameTime: number = 0
    public static StartTime: number = 0
    public static PauseTime: number = 0
    public static AllPauseTime: number = 0

    /* 游戏宽高与比例 */
    public static GameUIWidth: number = 0
    public static GameUIHeight: number = 0
    public static GameUIScale: number = 0

    /* 速度控制 */
    public static SnakeSpeed: number = 0
    public static SnakeAISpeed: number = 0
    public static SpeedBase: number = 8
    public static SnakeReallySpeed: number = 0
    public static SnakeAIReallySpeed: number = 0

    /* 移动方向 */
    public static SnakeDirection: Vec3 | null = null

    /* 是否移动 */
    public static SnakeAIMove: boolean = false

    /* 操控方式 */
    public static CurrentMoveMode: number = 0

    /* 同一帧被吃的 Food */
    public static FrameFood: number = 0

    /* BaseURL */
    public static BaseUrl = {
        ame: GameX.Env === 'test' ? 'https://ame-test.funplus.com' : 'https://ame-ss.funplus.com',
        store: GameX.Env === 'test' ? 'http://35.166.237.230:10099' : 'https://ss-pay.funplus.com',
        account: GameX.Env === 'test' ? 'https://store-account-stage.funplus.com' : 'https://store-account.funplus.com',
    }


    public static Login: boolean = false                    /* 是否登录 */
    public static CanPlay: boolean = false                  /* 是否可玩 */
    public static is_activity_ends: boolean = false         /* 活动结束 */
    public static date: string | null = null                /* 接口日期 */
    public static times: number = 0                         /* 游戏次数 */
    public static user_max_score: number = 0                /* 最高得分 */
    public static revive_coin: number = 0                   /* 复活币数量 */
    public static daily_score_remaining_times: number = 0   /* 得分剩余使用次数 */
    public static order_condition: boolean = false          /* 是否达成订单条件 */
    public static share_condition: boolean = false          /* 是否达成分享条件 */
    public static coupon_receive: boolean = false           /* 是否领取优惠卷 */
    public static countdown_to_tomorrow: number = 0         /* UTC 0点倒计时 */
    public static is_received_daily_awards: boolean = true  /* 是否领取每日奖励 */
    public static total_pass_num: number = 0                /* 通关次数 */
    public static score_data_times: number = 0              /* 游戏次数 */
    public static no_used_revive_pass: boolean = false      /* 是否不用币通关 */
    public static no_revive_pass_num: number = 0            /* 不用币通关次数 */

    public static sceneFrom: string = '' // 从哪个场景进入到结束场景，结束场景以此判断是否直接展示次数到达上限弹窗

    public static uid: number = 0
    // 当局游戏数据
    // UUID - 时间戳
    public static uuid = 0
    public static uuid_count = 0
    // 分数
    public static sssc = 0
    // 暂停
    public static pause = true
    public static shijian = 0

    public static last_timer = 0
    public static last_time_list = []
    public static is_key_pressing = false

    // 复活次数
    public static revive_count = 0
    public static revive_sc = 0

    public static current_gameover = 0
    // 角色移动
    public static role_move_status = 'idle'
    // 角色初始位置
    public static role_init_position = new Vec3(0, 150, 0)
    // 当局分数击败多少玩家
    public static range_defeats = '50%'

    // 战区排行榜数据
    public static rank_data = {
        countdown: 0,
        user_max_score: 0,
        ranking_list: [],
        use_rank: {
            name: '-',
            rank: 1,
            score: 0,
            server_id: 0
        }
    }

    // 个人排行榜数据
    public static person_rank_data = {
        countdown: 0,
        user_max_score: 0,
        ranking_list: [],
        use_rank: {
            name: '-',
            rank: 1,
            score: 0,
            server_id: 0
        }
    }

    // 阶段奖励数据
    public static stage_awawrds = []

    public static is_show_log = false
}

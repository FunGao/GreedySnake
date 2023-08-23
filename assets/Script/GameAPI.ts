import { sys } from "cc"
// @ts-ignore
import CryptoJS from 'crypto-js'
import { GameX } from "./GameX"
import { UserLocalData } from "./UserLocalData"
import { GameEventTarget } from "./EventUtil"

const AME_PARAMS_MAP = {
    ss: {
        p1: 49,
        game: 'ss',
        game_id: 30001,                         /* SS: 30001, GOG:2064, ST:2202, MC:2200 */
        apiIDInit: 1322,                        /* 初始化接口 */
        apiIDGameStart: 1316,                   /* 游戏开始上报 */
        apiIDGameEnd: 1318,                     /* 游戏结束上报 */
        apiIDCoupon: 1317,                      /* 送 95 折券 */
        apiIDDaily: 1323,                       /* 每日奖励 */
        apiIDShare: 1321,                       /* 分享 */
        apiIDRank: [1319, 1320],                /* 查询排行榜 */
        apiIDStageAward: [1324, 1325, 1326],    /* 阶段奖励 */
        apiUseReviveCoin: 1328,                 /* 消耗复活币 */
        aesKey: 'S9G1LIG8RFd/MXOtH8a2zw==',          /* AES 密钥 */
        signKey: '25442bad2927650f27d35e9f33f69941', /* 签名密钥 */
    }
}

export const AME_PARAMS = AME_PARAMS_MAP[GameX.Game]
export const STAGE_AWARDS_KEYS = AME_PARAMS.apiIDStageAward
export const GameServerEnv = sys.localStorage.getItem('api-game-server-env') || 'dev3'

class GameAPI {
    /* 通过 OpenID 获取用户信息 */
    getUserInfoByOpenid(OpenID: string) {
        return new Promise((resolve, reject) => {
            fetch(`${GameX.BaseUrl.ame}/do?p0=web&p1=${AME_PARAMS.p1}&p2=${AME_PARAMS.apiIDInit}&game=${AME_PARAMS.game}&gameServerEnv=${GameServerEnv}&openid=${encodeURIComponent(OpenID)}`).then((response: Response) => {
                return response.text()
            }).then((response) => {
                const data = JSON.parse(response)
                if (data.code === 0) {
                    GameX.Login = true
                    GameX.CanPlay = data.data.share_condition || data.data.order_condition || data.data.daily_score_remaining_times > 0
                    GameX.date = data.data.date
                    GameX.share_condition = data.data.share_condition
                    GameX.order_condition = data.data.order_condition
                    GameX.coupon_receive = data.data.coupon_receive
                    GameX.daily_score_remaining_times = data.data.daily_score_remaining_times
                    GameX.times = data.data.times
                    GameX.user_max_score = data.data.user_max_score
                    GameX.revive_coin = data.data.revive_coin
                    GameX.countdown_to_tomorrow = (new Date().getTime() / 1000) + data.data.countdown_to_tomorrow
                    GameX.total_pass_num = data.data.total_pass_num
                    GameX.score_data_times = data.data.score_data_times
                    GameX.no_used_revive_pass = data.data.no_used_revive_pass
                    GameX.no_revive_pass_num = data.data.no_revive_pass_num
                    GameX.uid = data.data.uid
                    UserLocalData.setData('name', data.data.name)
                } else {
                    GameX.Login = false
                    GameX.CanPlay = true
                    UserLocalData.setData('openid', '')
                    UserLocalData.setData('name', '')
                }
                resolve(data)
            })
        })
    }

    /* 通过 UID 获取用户信息 */
    getUserInfoByUID(UID: string) {
        return new Promise((resolve, reject) => {
            let params: any = { 
                uid: parseInt(UID), 
                game_id: AME_PARAMS.game_id, 
                game_project: `${AME_PARAMS.game}_global`, 
                source: 'web', 
                country: 'HK', 
                currency: 'USD' 
            }
            if (GameServerEnv) {
                params.gameServerEnv = GameServerEnv
            }
            fetch(`${GameX.BaseUrl.account}/api/account/store/user`, { method: 'POST', body: JSON.stringify(params), headers: { 'Content-Type': 'application/json' } }).then((response: Response) => {
                return response.text()
            }).then((response) => {
                const data = JSON.parse(response)
                if (data.code === 0) {
                    UserLocalData.setData('openid', data.data.openid)
                    UserLocalData.setData('name', data.data.name)
                }
                resolve(data)
            })
        })
    }

    /* 游戏开始 */
    reportOnGameStart() {
        fetch(`${GameX.BaseUrl.ame}/do?p0=web&p1=${AME_PARAMS.p1}&p2=${AME_PARAMS.apiIDGameStart}&p3=api&game=${AME_PARAMS.game}&gameServerEnv=${GameServerEnv}&game_uuid=${GameX.uuid}`).then((response: Response) => {
            return response.text()
        })
    }

    /* 游戏结束 */
    reportOnGameEnd() {
        let sign = CryptoJS.MD5(decodeURIComponent(UserLocalData.getData('openid')) + GameX.sssc + AME_PARAMS.signKey).toString()
        let keyHex = CryptoJS.enc.Utf8.parse(AME_PARAMS.aesKey)
        let ivHex = keyHex.clone()
        ivHex.sigBytes = 16
        ivHex.words.splice(4)
        const paramsMerge = `${GameX.sssc.toString()}|${sign}|${GameX.uuid}|${transDeath(GameX.DeathNumber)}|${GameX.DeathNumber.toString()}|${GameX.revive_count}`
        let messageHex = CryptoJS.enc.Utf8.parse(paramsMerge)
        let encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
            'iv': ivHex,
            'mode': CryptoJS.mode.CBC,
            'padding': CryptoJS.pad.Pkcs7
        })
        let secret = encodeURIComponent(encrypted.toString())

        return new Promise((resolve, reject) => {
            fetch(`${GameX.BaseUrl.ame}/do?p0=web&p1=${AME_PARAMS.p1}&p2=${AME_PARAMS.apiIDGameEnd}&game=${AME_PARAMS.game}&gameServerEnv=${GameServerEnv}&openid=${encodeURIComponent(UserLocalData.getData('openid'))}&fl4JVLnPWkQDTqiHfWt=${secret}&c814afcdd754a=${randomCafd()}`).then((response: Response) => {
                return response.text()
            }).then((response) => {
                const data = JSON.parse(response)
                if (data.code === 0) {
                    GameX.range_defeats = data.data.range_defeats
                    GameX.coupon_receive = data.data.coupon_receive
                    if (GameX.DeathNumber >= 49 && GameX.sssc === 1) {
                        GameX.total_pass_num++
                    }
                    GameX.score_data_times++
                    if (!data.data.coupon_receive) {
                        this.sendCoupon()
                    }
                }
                resolve(data)
            })
        })
    }

    /* 消耗复活币 */
    useReviveCoin() {
        return new Promise((resolve, reject) => {
            fetch(`${GameX.BaseUrl.ame}/do?p0=web&p1=${AME_PARAMS.p1}&p2=${AME_PARAMS.apiUseReviveCoin}&game=${AME_PARAMS.game}&gameServerEnv=${GameServerEnv}&openid=${encodeURIComponent(UserLocalData.getData('openid'))}&game_uuid=${GameX.uuid}`).then((response: Response) => {
                return response.text()
            }).then((response) => {
                resolve(JSON.parse(response))
            })
        })
    }

    /* 送券 */
    sendCoupon() {
        fetch(`${GameX.BaseUrl.ame}/do?p0=web&p1=${AME_PARAMS.p1}&p2=${AME_PARAMS.apiIDCoupon}&game=${AME_PARAMS.game}&gameServerEnv=${GameServerEnv}&openid=${encodeURIComponent(UserLocalData.getData('openid'))}`).then((response: Response) => {
            return response.text()
        })
    }

    /* 查询每日奖励 */
    getDailyAwardStatus() {
        return new Promise((resolve, reject) => {
            fetch(`${GameX.BaseUrl.ame}/hold?p0=web&p1=${AME_PARAMS.p1}&p2=${AME_PARAMS.apiIDDaily}&game=${AME_PARAMS.game}&gameServerEnv=${GameServerEnv}&openid=${encodeURIComponent(UserLocalData.getData('openid'))}`).then((response: Response) => {
                return response.text()
            }).then((response) => {
                resolve(JSON.parse(response))
            })
        })
    }

    /* 领取每日奖励 */
    getDailyAward() {
        return new Promise((resolve, reject) => {
            fetch(`${GameX.BaseUrl.ame}/do?p0=web&p1=${AME_PARAMS.p1}&p2=${AME_PARAMS.apiIDDaily}&game=${AME_PARAMS.game}&gameServerEnv=${GameServerEnv}&openid=${encodeURIComponent(UserLocalData.getData('openid'))}`).then((response: Response) => {
                return response.text()
            }).then((response) => {
                resolve(JSON.parse(response))
            })
        })
    }

    /* 查询排行榜 */
    getRankData(value: number = 0) {
        return new Promise((resolve, reject) => {
            fetch(`${GameX.BaseUrl.ame}/do?p0=web&p1=${AME_PARAMS.p1}&p2=${AME_PARAMS.apiIDRank[value]}&game=${AME_PARAMS.game}&gameServerEnv=${GameServerEnv}&openid=${encodeURIComponent(UserLocalData.getData('openid'))}`).then((response: Response) => {
                return response.text()
            }).then((response) => {
                resolve(JSON.parse(response))
            })
        })
    }

    /* 更新玩家游戏数据 查询阶段奖励领取状态 */
    queryStageAwards() {
        if (!GameX.is_activity_ends) {
            GameX.times += 1
            GameX.user_max_score = GameX.sssc > GameX.user_max_score ? GameX.sssc : GameX.user_max_score
        }
        return new Promise((resolve, reject) => {
            fetch(`${GameX.BaseUrl.ame}/hold?p0=web&p1=${AME_PARAMS.p1}&p2=${STAGE_AWARDS_KEYS.join(',')}&game=${AME_PARAMS.game}&gameServerEnv=${GameServerEnv}&openid=${encodeURIComponent(UserLocalData.getData('openid'))}`).then((response: Response) => {
                return response.text()
            }).then((response) => {
                resolve(JSON.parse(response))
                // const data = JSON.parse(response)
                // GameX.stage_awawrds = [...data.data]
            })
        })
    }

    /* 领取阶段奖励 */
    receiveStageAwards(level: number) {
        return new Promise((resolve, reject) => {
            fetch(`${GameX.BaseUrl.ame}/do?p0=web&p1=${AME_PARAMS.p1}&p2=${STAGE_AWARDS_KEYS[level]}&game=${AME_PARAMS.game}&gameServerEnv=${GameServerEnv}&openid=${encodeURIComponent(UserLocalData.getData('openid'))}`).then((response: Response) => {
                return response.text()
            }).then((response) => {
                resolve(JSON.parse(response))
            })
        })
    }

    /* 分享游戏 */
    doShareGames() {
        fetch(`${GameX.BaseUrl.ame}/do?p0=web&p1=${AME_PARAMS.p1}&p2=${AME_PARAMS.apiIDShare}&game=${AME_PARAMS.game}&gameServerEnv=${GameServerEnv}&openid=${encodeURIComponent(UserLocalData.getData('openid'))}`).then((response: Response) => {
            return response.text()
        })
    }
}

export const API = new GameAPI()

const transUUID = (p_uuid) => {
    let uuid = p_uuid
    let f_uuid = 9527
    let sign = 2
    uuid = GameX.sssc
    f_uuid = GameX.uuid_count
    for (let i = 0; i <= uuid; i++) {
        let key = Math.floor((i % 100) / 10) + 1
        if (key % sign === 0) {
            key += 3
        }
        f_uuid += key
    }
    return f_uuid
}

const transDeath = (num: number) => {
    let deathNumber = num
    let f = 0
    for (let i = 0; i <= deathNumber; i++) {
        let key = Math.floor((i % 100) / 10) + 1
        if (key % 2 === 0) {
            key += 3
        }
        f += key
    }
    return f
}

const randomCafd = () => {
    let keyHex = CryptoJS.enc.Utf8.parse(AME_PARAMS.aesKey)
    let ivHex = keyHex.clone()
    ivHex.sigBytes = 16
    ivHex.words.splice(4)
    const cafdTrans = transDbgeRandom(GameX.DeathNumber.toString(), 5, 7)
    let messageHex = CryptoJS.enc.Utf8.parse(cafdTrans)
    let encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
        'iv': ivHex,
        'mode': CryptoJS.mode.CBC,
        'padding': CryptoJS.pad.Pkcs7
    })
    let neo = encodeURIComponent(encrypted.toString())
    return neo
}

const transDbgeRandom = (str: string, len1: number, len2: number) => {
    let src = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
    let path = `${src.substring(0, len1)}${str}${src.substring(len1, (len1 + len2))}`
    return path
}

// const axios = require('axios')

function randomString(len: number) {
    len = len || 18
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789'
    const maxPos = chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
        pwd = pwd + chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd + new Date().getTime()
}

function logSend(logInfo: any) {
    let browserMark = localStorage.getItem('browserMark') || ''
    if (!browserMark) {
        browserMark = randomString(18)
        localStorage.setItem('browserMark', browserMark)
    }
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo') || '{}')
    let params = {
        app_id: "ss.global.prod",
        data_version: "3.0",
        event: "h5_activity",
        appoint_event: "h5_activity",
        event_ts: new Date().getTime(),
        fpid: userInfo.fpid,
        uid: userInfo.uid,
        game_id: 30001,
        game_project: "ss_global",
        detail: {
            activity_name: "minigame_tcs",
            gamecode: "SS",
            gameid: 30001,
            tracking_id: "",
            browser_id: browserMark,
            fpid: userInfo.fpid,
            uid: userInfo.uid,
            ...logInfo
        }
    }

    // 打点地址
    // release:http://47.100.233.173:8989/
    // master:http://35.166.237.230:8989/
    // online: https://ss-store-api.funplus.com/
    const logurl = 'https://ss-store-api.funplus.com/api/appoint_event_bilog'
    fetch(logurl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
}

export function sendLoadPoint(event: any, ID: any) {
    let logParams = { event: event, uid: '', fpid: '' }
    if (ID) {
        // let params = {
        //     openid: openid,
        //     game_id: 30001,
        //     game_project: 'ss_global',
        //     source: 'web',
        //     country: 'HK',
        //     currency: 'USD'
        // }
        // TODO
        // axios.post('https://store-account-stage.funplus.com/api/account/store/user', params)
        let params: any = { 
            uid: parseInt(ID), 
            game_id: AME_PARAMS.game_id, 
            game_project: `${AME_PARAMS.game}_global`, 
            source: 'web', 
            country: 'HK', 
            currency: 'USD' 
        }
        if (GameServerEnv) {
            params.gameServerEnv = GameServerEnv
        }
        fetch(`${GameX.BaseUrl.account}/api/account/store/user`, { method: 'POST', body: JSON.stringify(params), headers: { 'Content-Type': 'application/json' } }).then((response: Response) => {
            return response.text()
        }).then((response) => {
            const res = JSON.parse(response)
            window.localStorage.setItem('userInfo', JSON.stringify(res.data))
            logParams.uid = res.data.uid
            logParams.fpid = res.data.fpid
        }).catch(function (error) {
        }).finally(function () {
            logSend(logParams)
        })
    } else {
        logSend(logParams)
    }
}

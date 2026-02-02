const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    downloadContentFromMessage,
    makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const axios = require("axios");
const { Boom } = require("@hapi/boom");
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startMarian() {
    console.log("🚀 Initializing MARIAN NEXTGEN - Cloud Engine...");
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
        console.log("\n💀 LOGIN MARIAN NEXTGEN 💀");
        let phoneNumber = await question('ENTER YOUR PHONE (Example: 60xxx): ');
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        const code = await marian.requestPairingCode(phoneNumber);
        console.log(`\n[!] KODE PAIRING KAMU: ${code}\n`);
    }

    marian.ev.on('creds.update', saveCreds);

    marian.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                startMarian();
            }
        } else if (connection === 'open') {
            console.log("\n[✓] MARIAN ONLINE DI CLOUD SHELL!");
        }
    });

    marian.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;
            const from = mek.key.remoteJid;
            const type = Object.keys(mek.message)[0];
            const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type === 'imageMessage') ? mek.message.imageMessage.caption : '';
            const prefix = '.';
            const command = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
            const args = body.trim().split(/ +/).slice(1);

            switch (command) {
                case 'menu':
                    let menu = `💀 *MARIAN NEXTGEN - CLOUD* 💀\n\n- .ping\n- .vcardbug\n- .remini\n- .sticker\n- .tiktok\n\n_Server: Google Cloud_`;
                    await marian.sendMessage(from, { text: menu }, { quoted: mek });
                    break;

                case 'ping':
                    await marian.sendMessage(from, { text: 'Bot Active ⚡' }, { quoted: mek });
                    break;

                case 'vcardbug':
                    for (let i = 0; i < 5; i++) {
                        let v = 'BEGIN:VCARD\nVERSION:3.0\nFN:☠️\nTEL;waid=123:0\nEND:VCARD';
                        await marian.sendMessage(from, { contacts: { displayName: '☠️', contacts: [{ vcard: v }] } });
                    }
                    break;

                case 'remini':
                case 'hd':
                    const quoted = mek.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || mek.message.imageMessage;
                    if (!quoted) return marian.sendMessage(from, { text: 'Reply foto dengan .hd' });
                    await marian.sendMessage(from, { text: '⏳ Processing HD...' });
                    const stream = await downloadContentFromMessage(quoted, 'image');
                    let buffer = Buffer.from([]);
                    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
                    try {
                        const res = await axios.post('https://photo-enhance-api.p.rapidapi.com/api/scale', {
                            image_base64: buffer.toString('base64'), type: 'clean', scale_factor: 2
                        }, { headers: { 'x-rapidapi-key': '84617c7af3mshed295d94cd8c14dp13b82djsnfe1358a254b1' } });
                        if (res.data.output_url) await marian.sendMessage(from, { image: { url: res.data.output_url }, caption: '✅ HD Sukses!' });
                    } catch (e) { await marian.sendMessage(from, { text: '❌ Error API' }); }
                    break;

                case 'sticker':
                case 's':
                    const qS = mek.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || mek.message.imageMessage;
                    if (!qS) return marian.sendMessage(from, { text: 'Reply foto dengan .s' });
                    const sS = await downloadContentFromMessage(qS, 'image');
                    let bS = Buffer.from([]);
                    for await (const chunk of sS) bS = Buffer.concat([bS, chunk]);
                    await marian.sendMessage(from, { sticker: bS }, { quoted: mek });
                    break;
            }
        } catch (err) { console.log(err); }
    });
}
startMarian();

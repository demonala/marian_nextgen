const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    downloadContentFromMessage 
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const axios = require("axios");
const fs = require('fs');

async function startMarian() {
    const { state, saveCreds } = await useMultiFileAuthState('sessions');
    const marian = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    marian.ev.on('creds.update', saveCreds);

    marian.ev.on('messages.upsert', async chatUpdate => {
        const mek = chatUpdate.messages[0];
        if (!mek.message) return;
        const from = mek.key.remoteJid;
        const type = Object.keys(mek.message)[0];
        const pushname = mek.pushName || "User";
        const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type === 'imageMessage') ? mek.message.imageMessage.caption : '';
        const prefix = '.';
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(" ");

        if (isCmd) {
            switch (command) {
                case 'menu':
                case 'help':
                    let menu = `💀 *MARIAN NEXTGEN - FULL FEATURE* 💀\n\n` +
                               `*⚡ MAIN:* .ping, .owner, .runtime\n` +
                               `*📸 TOOLS:* .s (sticker), .hd / .remini\n` +
                               `*📥 DOWNLOAD:* .tiktok [link]\n` +
                               `*🤖 AI:* .ai [tanya apa saja]\n` +
                               `*👥 GROUP:* .hidetag, .kick, .add\n` +
                               `*💀 ATTACK:* .vcardbug, .systemcrash\n\n` +
                               `_Status: Online (Google Cloud)_`;
                    await marian.sendMessage(from, { text: menu }, { quoted: mek });
                    break;

                // --- TOOLS SECTION ---
                case 's':
                case 'sticker':
                    const quotedS = mek.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || mek.message.imageMessage;
                    if (!quotedS) return marian.sendMessage(from, { text: 'Kirim/Reply gambar dengan caption .s' });
                    const streamS = await downloadContentFromMessage(quotedS, 'image');
                    let bufferS = Buffer.from([]);
                    for await (const chunk of streamS) bufferS = Buffer.concat([bufferS, chunk]);
                    await marian.sendMessage(from, { sticker: bufferS }, { quoted: mek });
                    break;

                case 'hd':
                case 'remini':
                    const quotedH = mek.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || mek.message.imageMessage;
                    if (!quotedH) return marian.sendMessage(from, { text: 'Reply gambar dengan caption .hd' });
                    await marian.sendMessage(from, { text: '⏳ Memproses High Definition...' });
                    const streamH = await downloadContentFromMessage(quotedH, 'image');
                    let bufferH = Buffer.from([]);
                    for await (const chunk of streamH) bufferH = Buffer.concat([bufferH, chunk]);
                    try {
                        const res = await axios.post('https://photo-enhance-api.p.rapidapi.com/api/scale', {
                            image_base64: bufferH.toString('base64'), type: 'clean', scale_factor: 2
                        }, { headers: { 'x-rapidapi-key': '84617c7af3mshed295d94cd8c14dp13b82djsnfe1358a254b1' } });
                        if (res.data.output_url) await marian.sendMessage(from, { image: { url: res.data.output_url }, caption: '✅ HD Sukses!' });
                    } catch (e) { await marian.sendMessage(from, { text: '❌ Error API' }); }
                    break;

                // --- DOWNLOADER SECTION ---
                case 'tiktok':
                    if (!q) return marian.sendMessage(from, { text: 'Mana linknya?' });
                    await marian.sendMessage(from, { text: '⏳ Mengambil video...' });
                    try {
                        const tt = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${q}`);
                        await marian.sendMessage(from, { video: { url: tt.data.video.noWatermark }, caption: '✅ Sukses!' });
                    } catch (e) { await marian.sendMessage(from, { text: '❌ Gagal download.' }); }
                    break;

                // --- AI SECTION ---
                case 'ai':
                    if (!q) return marian.sendMessage(from, { text: 'Mau tanya apa?' });
                    try {
                        const aiRes = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(q)}&lc=id`);
                        await marian.sendMessage(from, { text: aiRes.data.success }, { quoted: mek });
                    } catch (e) { await marian.sendMessage(from, { text: 'AI lagi pusing...' }); }
                    break;

                // --- ATTACK SECTION ---
                case 'vcardbug':
                    for (let i = 0; i < 5; i++) {
                        let v = 'BEGIN:VCARD\nVERSION:3.0\nFN:☠️ MARIAN\nTEL;waid=123:0\nEND:VCARD';
                        await marian.sendMessage(from, { contacts: { displayName: '☠️', contacts: [{ vcard: v }] } });
                    }
                    break;

                case 'ping':
                    await marian.sendMessage(from, { text: 'Bot Active ⚡' });
                    break;
            }
        }
    });
}
startMarian();

# Dragon Bot 🐉

WhatsApp dragon RPG built with JavaScript and Baileys.

Development happens on the `main` branch. We will implement the project in phases, testing each stage before moving to the next.

## WhatsApp image processing

Deploy `api/image.js` to the existing Vercel project. Set the same random secret (at least 32 bytes) as `IMAGE_API_KEY` in Vercel Production and on the bot host, then redeploy both. Do not commit it. The worker defaults to `https://whatsappbot-steel.vercel.app/api/image`; override `IMAGE_API_URL` only for a trusted HTTPS deployment.

Caption a photo, or reply to one, with `_image compress`, `_image thumbnail`, or `_image grayscale` (substitute your configured prefix). The command sends that photo to the API and returns a JPEG in the same chat. Photos are processed in memory, not stored by the API. `POST /api/image?mode=thumbnail` accepts raw JPEG, PNG, or WebP bytes with the matching `Content-Type` and `Authorization: Bearer <secret>`. Maximum input: 4 MiB and 24 megapixels. Thumbnails fit within 320 pixels; other modes fit within 1600 pixels. Aspect ratio is preserved.

## Phase 1

- WhatsApp connection and authentication
- Modular command handling
- Player registration and profiles
- Dragon starter selection
- Basic economy

## Later phases

Combat and progression, multiplayer, world events, and endgame systems.

**Security:** Never commit WhatsApp session credentials or private player data.

## Run on Android with Termux (phone-number pairing)

This setup uses WhatsApp's **Link with phone number** flow. It does not require scanning a QR code.

Install Termux from F-Droid or its official GitHub releases, then run:

```sh
pkg update && pkg upgrade
pkg install git nodejs-lts
git clone https://github.com/phantom541/WhatsApp_bot.git
cd WhatsApp_bot
npm install
bash start.sh
```

The launcher asks for:
- Your WhatsApp number in international format, digits only (Botswana numbers begin with `267`).
- Your Creator number. Press Enter to use the same number.

When the pairing code appears, open WhatsApp on the account you entered:
**Settings > Linked devices > Link a device > Link with phone number instead**.
Enter the code shown in Termux. Never share the pairing code with anyone.

The first successful link saves the session in `auth/`. On later starts, run:

```sh
cd ~/WhatsApp_bot
bash start.sh
```

The launcher asks for the numbers again, but the saved session is reused and a new code is not requested while the credentials remain registered. Keep the `auth/` and `data/` folders. Do not delete them to troubleshoot a connection.

### Keep Termux running

```sh
termux-wake-lock
bash start.sh
```

Keep Termux open and allow it to run in the background. Android battery optimization may stop it. Use `termux-wake-unlock` when you are finished.

### Troubleshooting

- If `npm install` fails on a native dependency, install build tools with `pkg install python make clang`, then retry `npm install`.
- If pairing fails, check that the number includes the country code and is entered without spaces or a plus sign. Generate a fresh code by restarting the launcher.
- If WhatsApp reports that the device was logged out, the saved session is preserved. Follow the phone-number pairing flow again; do not delete `auth/` automatically.
- `BOT_OWNER_NUMBERS` controls Creator access. Only enter numbers you control.
- Keep `auth/`, `data/`, and any `.env` files private. Never upload or send your `auth/` folder.
- Termux is suitable for temporary hosting, but Android may stop background processes. It is not guaranteed to run continuously.

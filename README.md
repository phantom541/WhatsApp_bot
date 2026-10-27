# Dragon Bot 🐉

WhatsApp dragon RPG built with JavaScript and Baileys.

Development happens on the `main` branch. We will implement the project in phases, testing each stage before moving to the next.

## Phase 1

- WhatsApp connection and authentication
- Modular command handling
- Player registration and profiles
- Dragon starter selection
- Basic economy

## Later phases

Combat and progression, multiplayer, world events, and endgame systems.

**Security:** Never commit WhatsApp session credentials or private player data.

## Temporary Android hosting with Termux

Install Termux from F-Droid or its official GitHub releases. Use Node.js 20 or newer.

```sh
pkg update && pkg upgrade
pkg install git nodejs
git clone https://github.com/phantom541/WhatsApp_bot.git
cd WhatsApp_bot
npm install
```

### Pair using the phone number (recommended for one-phone setup)

In Termux, enter your own WhatsApp account number in international format (digits only, no plus sign). This number is **only for pairing** and is not automatically assigned Creator status.

```sh
export PAIRING_PHONE=267XXXXXXXX
export BOT_OWNER_NUMBERS=267XXXXXXXX
npm start
```

When Termux prints a pairing code, open WhatsApp **Linked devices > Link a device > Link with phone number instead** and enter it. The menu wording can vary by WhatsApp version. The phone number is not stored in the repository.

If you prefer QR authentication, omit `PAIRING_PHONE` and run `npm start`. Scanning a QR displayed on the same phone may require another screen.

After the first successful pairing, credentials are saved under `auth/`. For later launches:

```sh
cd ~/WhatsApp_bot
export BOT_OWNER_NUMBERS=267XXXXXXXX
npm start
```

Keep Termux running in the foreground while using the bot. Android battery optimization may stop the process. You can use `termux-wake-lock` if supported, and `termux-wake-unlock` afterward. Press Ctrl+C to stop.

### Troubleshooting

- If `npm install` fails compiling a dependency, try `pkg install python make clang` and run `npm install` again. Some native dependencies may not support your Android architecture.
- If the pairing code fails, confirm the number is correct and retry with a fresh code. Do not share pairing codes.
- If WhatsApp says you are logged out, re-pair. Do not delete `auth/` unless you intentionally want to reset the session.
- `BOT_OWNER_NUMBERS` defines the bot's Creator accounts. Only include numbers you control.
- Keep `auth/`, `data/`, and any `.env` files private and backed up securely.
- This is a temporary setup; Termux is not guaranteed to keep the bot running continuously.


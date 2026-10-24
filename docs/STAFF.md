# Dragon Bot staff and permissions

## Required private setup
Set BOT_OWNER_NUMBERS to the creator's international phone number (digits only) in the hosting environment. Restart the bot after changing environment variables. Do not add phone numbers or auth files to public GitHub.

WhatsApp sender phone information is sometimes missing from Baileys LID messages. A role lookup fails closed when no verified phone number can be found.

## Bot roles (not WhatsApp group admins)
- Player: random regions, ordinary game commands.
- Moderator: _ban NUMBER reason, _unban NUMBER, _botmode on|off|status, _staffspawn dragon-name, _grant NUMBER amount, _grant me amount, _grantitem NUMBER item quantity, _staffheal NUMBER, _inspectrider NUMBER, _stafflog, and _travel forest|random.
- Owner: every moderator permission, plus _staff add mod NUMBER, _staff remove mod NUMBER, _staffdragon NUMBER dragon-name, _resetcooldown NUMBER.
- Creator: every owner permission, plus _staff add owner NUMBER, _staff remove owner NUMBER, and _setcoins NUMBER amount.

## Safety rules
Bans block game commands and only apply to registered numbers. Mods cannot ban higher roles; the configured creator is protected. The bot off switch pauses game commands, but staff recovery commands remain accessible. All coin/item/dragon grants use atomic database writes; moderation and economy actions record an audit log of the latest 200 events.
Each _grant operation is capped at 1,000,000 coins, and _grantitem is capped at 20 items. Creator _setcoins has a 100,000,000 cap. Grants are in-game currency only.

## Other progression commands
_daily gives role-scaled coins.
_quests and _claimquest track the daily hunt, catch and victory goals.
_profile shows player ID (WhatsApp name plus a short phone suffix) and masked phone.

## Extra controls and test instructions
- _spawn skrill is a bot-moderator-only shortcut for _staffspawn skrill.
- Bot owners can use _staffdragon NUMBER species-name, _resetcooldown NUMBER, and all moderator tools.
- The creator can use _forgedragon NUMBER LEVEL RARITY species-name, _setdragonlevel NUMBER INDEX LEVEL, and _setcoins NUMBER BALANCE.
- Creator staff reassignment can directly promote moderators to owners or move owners to moderators. The configured creator cannot be removed through chat.
- Bot bans also apply to moderator/owner accounts if imposed by a higher role, and lower ranks cannot overturn those bans.
- Run npm test on the hosting machine to execute the moderation integration suite; this was added to package.json.

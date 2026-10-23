# Architecture

- `index.js`: Baileys socket and events
- `handlers/commands.js`: command router
- `commands/`: isolated commands
- `lib/database.js`: serialized JSON persistence
- `config.js`: environment settings

Runtime `auth/` and `data/database.json` contain private data and must never be committed. JSON storage is suitable for early development; migrate to SQLite as features grow.

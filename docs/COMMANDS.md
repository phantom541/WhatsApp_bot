# Commands

Default prefix: `_` (change using `BOT_PREFIX`).

- `_ping` checks connectivity.
- `_menu` shows commands.
- `_register` creates a profile with 100 starter coins.
- `_profile` shows player progress.
- `_classes` lists all seven dragon classes.
- `_classes strike` displays known species in a class.
- `_starthunt` starts selection and lists seven classes with their species.
- `_starthunt --skrill` previews a dragon without claiming it. Multiword names work, e.g. `_starthunt --night-fury`.
- `_starterdrgon --skrill-choose` confirms the previously previewed dragon. For multiword names, use e.g. `_starterdrgon --night-fury-choose`.
- `_starter` displays guidance for the new selection process; it cannot claim a dragon.
- `_dragons` lists your collection.
- `_dragon 1` inspects the first dragon.

Only one free starter can be claimed. Starters are marked `isStarter: true`, `tradable: false`, and cannot be traded. Future trading code must use `isDragonTradable` from `lib/dragons.js` and must also protect existing legacy starters. Hunting and battles require a starter dragon. Spawning is not implemented yet.

- `_hunt` finds a random wild dragon encounter (60-second hunt cooldown).
- `_battle` attacks the current wild encounter. Wild dragons retaliate; victory grants coins and XP and can level up your dragon.
- `_flee` leaves your current encounter.
- `_rest` restores dragon HP outside combat (5-minute rest cooldown).

This is an initial combat prototype; capture, items, PvP, and balancing remain future work.

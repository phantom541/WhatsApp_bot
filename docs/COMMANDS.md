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

## Combat and capture update
- `_hunt` finds a wild encounter.
- `_catch <dragon-name>` attempts to capture the encountered species. Higher-level dragons are harder to catch; successful catches award victory-equivalent XP and auto-place the dragon in party (six slots) or den.
- `_catch` without a name enters the battle menu.
- `_battle` lists actions; `_battle fight` lists four equipped moves; `_battle item` points to the bag.
- `_battlefight 2` uses move slot two and advances combat.
- `_swap 2` switches to party slot two, ending the turn.
- `_flee` forfeits without XP.
- `_recruit party` or `_recruit den` collects a defeated wild dragon.
- `_bag` shows inventory; item use is not implemented yet.
- `_moves 1` shows the first dragon's moves and available replacements.
- `_replacemove 1 2 Dragon Breath` replaces the second move permanently using a credit earned every ten levels, including level 100.

XP scales with enemy level. Defeat grants a smaller XP award. Each dragon has sixteen possible moves, four equipped at a time, and cannot relearn a discarded move. Level cap is 100. Starter dragons remain non-tradable. Combat and capture mechanics require live testing and balancing.

## Capture equipment
- `_mart 3` shows seven capture supplies.
- `_buy strongnet 1` purchases a supply.
- `_hunt` finds an encounter.
- `_prepare strongnet` consumes one Strong Net and adds 22 percentage points to the next catch attempt for that encounter.
- `_catch skrill` attempts to catch the encountered Skrill; the prepared bonus is used once even on failure.
- Capture bonuses: Basic Net +10, Strong Net +22, Master Net +40, Bait +8, Rare Bait +15, Sleep Dust +18, Calming Herb +12. Chance caps at 95%.
- Only one prepared supply can be active per encounter. Catching without supplies still works. These supplies currently affect capture probability, not wild spawn rarity.

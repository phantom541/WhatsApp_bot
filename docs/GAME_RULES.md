# Game rules

Players register once and receive 100 coins at level 1. Starter selection is a three-stage process:

1. `_starthunt` displays all seven classes and available starter species.
2. `_starthunt --dragon-name` previews the chosen species, showing its class, ability, and provisional combat statistics.
3. `_starterdrgon --dragon-name-choose` confirms the exact dragon last previewed and awards it once.

Names can be written with hyphens or spaces for preview, and with hyphens for confirmation. Any species in the seven class lists can currently be selected. Each species uses its class's provisional battle stats.

A player may claim only one free starter. Starter dragons are permanently marked `isStarter: true` and `tradable: false`, with their ID stored as `starterDragonId` on the player. Trading must reject these dragons even if a player attempts to rename them or manipulate trade commands. The helper `isDragonTradable` exists for future trading implementation, but trading is not yet built.

Without a dragon, players cannot battle, spawn, or hunt; they are directed to `_starthunt`. Existing players with dragons retain them. Legacy starters acquired before these flags were introduced should be identified using player starter history / `starterDragonId` when trading is built.

This is an unofficial fan project inspired by How to Train Your Dragon.

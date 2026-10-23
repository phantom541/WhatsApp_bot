# Game rules: initial draft

Players register once and receive 100 coins at level 1. Each player can claim one free starter dragon from seven classes: Strike, Stoker, Boulder, Mystery, Tidal, Sharp, and Tracker. Starter species are Skrill, Monstrous Nightmare, Gronckle, Hideous Zippleback, Thunderdrum, Razorwhip, and Deadly Nadder, respectively.

Other species are listed in the class encyclopedia but are not yet collectible. Dragon battles, additional captures, trading, and evolution are future features. All stats are provisional gameplay values.

Dragon classes and species names are inspired by How to Train Your Dragon; this is an unofficial fan project.

## Starter requirement

A registered player must run `_starthunt` before claiming a starter with `_starter <class>`. Players without a dragon cannot hunt, battle, or spawn dragons. They are directed to `_starthunt`. This is enforced by a reusable eligibility guard for future gameplay commands. Existing players with dragons keep their collection.

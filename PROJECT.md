# Blood Fang

This project ships two things:

1. **Engine** — a standalone, reusable rules engine for grid-based card battle games. No UI, no networking. Pure game logic as a library that anyone can build on.

2. **Game** — a complete, playable card game with original theme/art/names that consumes the engine. This is the thing people actually play.

The engine enforces clean architecture. The game proves it works and gives the community something to rally around.

## Project Goals

- Reusable rules engine as a standalone library
- Complete playable game with original creative identity built on top
- Human vs human play (local and networked)
- Extensible card database — mechanics separated from identity (names/art/lore)
- Open-source and community-driven
- Long-term viability (no legal exposure to Square Enix)

---

## Legal Position

**Game mechanics are not copyrightable** under U.S. law (Baker v. Selden, 1879; DaVinci Editrice v. Ziko Games, 2014). The grid layout, pawn system, scoring rules, and card ability mechanics are all free to reimplement. What IS protected: art, names, lore, and trademarks.

**Our approach:** same mechanics, entirely original creative expression. This is the proven "Legend of the Three Kingdoms" strategy — that game cloned Bang!'s rules near-identically with a different theme and survived a copyright lawsuit.

### What we must NOT use

- The name "Queen's Blood," "Final Fantasy," or any Square Enix trademarks
- Any card art, character names, or lore text from the original
- Any ripped or closely imitated visual assets

### What we CAN freely use

- All game mechanics: 3x5 grid, pawn placement, range patterns, card ranks/power, lane scoring, ability trigger system
- The structural card design: rank, power, range pattern, ability — with our own names and art
- Every ability type and trigger condition — reimplemented under original card names

### Risk context

- Square Enix is historically aggressive with enforcement (Chrono Trigger fan projects, NieR fan archive in 2024, one Queen's Blood TTS mod removed from Steam)
- Square Enix is considering Queen's Blood as a standalone commercial product for FF7 Part 3+
- Non-commercial/open-source status reduces practical risk but is not a legal shield
- Our mitigation: no SE trademarks, no SE assets, original creative identity, clear disclaimer

---

## Existing Projects & Prior Art

### Existing Queen's Blood implementations (prior art)

| Project | Status | Features | Notes |
|---|---|---|---|
| [queensbloodonline.com](https://queensbloodonline.com) | Active, playable | Online PvP, all 145 cards, matchmaking | Closed source. Most complete implementation. |
| [xRiku/react-queens-blood](https://github.com/xRiku/react-queens-blood) | Active (10 stars) | 2P multiplayer, board/deck/pawns, turn logic | Most complete OSS. No card abilities yet. |
| [trevor-tan03/queens-blood](https://github.com/trevor-tan03/queens-blood) | Active, live deployment | Mulligan, drag-and-drop, lane scoring | Has excellent card data files. |
| [briangan/queens_blood_by_fan](https://github.com/briangan/queens_blood_by_fan) | Active (183 commits) | Auth, real-time MP, drag-and-drop | Best structured card/ability data (seeds.rb). |
| TTS Mod (Steam #3189392607) | Playable (552 subscribers) | All cards, rank pawns, counters | A second TTS mod was removed by Steam. |

**No complete, polished, open-source implementation exists.** All OSS projects are early-stage with missing abilities and incomplete card data.

### Card data sources (for reference during development)

Two structured data sources together cover all 145 cards + 21 token cards:

| Source | Cards | Range Data | Ability Data | Format |
|---|---|---|---|---|
| [briangan seeds.rb](https://github.com/briangan/queens_blood_by_fan/blob/master/db/seeds.rb) | 145/145 | 139/145 (x,y coords, Pawn/Affected type) | 124/145 (structured: trigger, target, action, value) | Ruby |
| [trevor-tan03 expected_ranges.json](https://github.com/trevor-tan03/queens-blood/blob/main/scripts/expected_ranges.json) | 166 (incl tokens) | 166/166 (5x5 grid: O/R/OR notation) | N/A | JSON |
| [trevor-tan03 SQLite DB](https://github.com/trevor-tan03/queens-blood/blob/main/backend/QB_card_info.db) | 145+ tokens | Via Ranges table | Parsed trigger/action/target/value | SQLite |
| [Game8 website](https://game8.co/games/Final-Fantasy-VII-Rebirth/archives/Queens-Blood) | 145/145 | Images only | Full text descriptions | HTML |

**Key detail:** trevor-tan03's data captures three range cell types: `O` (orange/pawn only), `R` (red/ability only), `OR` (both pawn AND ability) — the third type is missed by other sources.

**Strategy:** Use briangan's seeds.rb as primary (best ability data), cross-reference with trevor-tan03's range data (best grid data), validate against Game8. All card names/lore will be replaced with original creative identity before public release.

---

## Complete Game Mechanics (Verified)

### The Board

- **3 rows x 5 columns** = 15 tiles
- At game start: P1 controls column 1 (3 tiles, each with 1 pawn). P2 controls column 5 (3 tiles, each with 1 pawn). All other tiles are empty (0 pawns).
- A tile's **rank = its pawn count** (0, 1, 2, or 3). Rank 0 means uncontrolled.
- Each pawn belongs to a specific player. A tile is "controlled by" whoever owns the pawns on it.

### Cards

145 unique cards total: 85 Standard, 60 Legendary.

Each card has:
- **Rank** (1, 2, or 3) — minimum pawn count required on the target tile to play. Replacement cards show a down-arrow instead.
- **Power** — point value contributed to the lane. Can be modified by abilities during play.
- **Range pattern** — a grid (5 rows tall, variable columns wide) showing effects relative to the card's placement position:
  - White cell = card's own position
  - Orange cell = place a pawn here (adds 1 pawn for the placing player)
  - Red cell = ability target only (no pawn placed)
  - Orange-Red cell = both place a pawn AND ability target
- **Ability** (optional) — special effect with a specific trigger condition

### Pawn Placement Rules

- Orange and orange-red cells in the range pattern place pawns on the corresponding board tiles
- If the target tile is **empty or owned by you**: add 1 pawn (yours), up to the cap of 3
- If the target tile is **owned by the opponent**: pawns are **captured/converted** to your color (no extra pawn added, rank stays the same)
- If already at **rank 3**: excess pawn placement is ignored
- Effects that fall **off the board edge** are ignored

### Deck & Hand Rules

- **Deck size:** exactly 15 cards (no duplicates — each card is a unique singleton)
- **Starting hand:** 5 cards drawn randomly
- **Mulligan:** before play begins, you may return any number of cards and redraw once. The second hand is final.
- **Draw phase:** at the start of each turn (except the first turn of the game), the active player draws 1 card from their deck.
- Players typically play **7-10 cards** per match from their 15-card deck.
- Additional cards can enter the hand mid-game via card abilities (token cards).

### Turn Flow

1. P1 always goes first (in the original game; engine should support configurable first player)
2. **Draw phase:** draw 1 card from deck (skipped on the very first turn of the game)
3. **Action:** play one card to a valid tile, or **pass**
4. If playing:
   a. Select a card from hand
   b. Select a tile you control with pawn count >= card's rank
   c. Card is placed on the tile; its power counts toward that lane
   d. Range pattern resolves — pawns placed/captured on affected tiles
   e. Card ability triggers (if applicable)
5. Turn passes to opponent
6. **Passing is not permanent** — if your opponent plays after you pass, you get another turn
7. Game ends when **both players pass consecutively** (or all tiles are filled)

### Scoring & Winning

1. Each of the 3 rows is scored independently
2. Sum the power of each player's cards in that row
3. The player with the **higher total wins the lane** and keeps their score. The loser's score for that lane **becomes 0**.
4. If a lane is **tied**, neither player scores (both become 0)
5. After all 3 lanes are evaluated, **sum remaining scores across all lanes**
6. The player with the higher grand total wins
7. If the grand total is tied, the match is a **draw**

This means you can win only 1 lane and still win the match if your score in that lane exceeds the opponent's combined scores from their winning lanes.

### Card Destruction

- When a card's power is **reduced to 0** (via enfeeblement), it is **destroyed and removed from the board**
- Some abilities explicitly **destroy** cards on affected tiles
- Destruction frees the tile and can trigger "when destroyed" abilities
- Tile state after destruction: not fully documented (see Remaining Unknowns)

### Replacement Cards (Special Type)

- Display a **down-arrow** instead of a rank number
- Cannot be placed on empty tiles — **must replace one of your own cards**
- Destroy the existing allied card and take its position
- Typically have powerful effects that leverage the destroyed card's power value

### Card Ability Taxonomy

#### Trigger Conditions

| Trigger | Description |
|---|---|
| When played | Fires once on placement |
| While in play | Persistent modifier; removed if card is destroyed |
| When destroyed | Fires when this card is removed from the board |
| When allied cards are destroyed | Fires each time a friendly card is destroyed |
| When enemy cards are destroyed | Fires each time an opponent card is destroyed |
| When any card is destroyed | Fires on any card destruction |
| When first enfeebled | Fires the first time this card's power is reduced |
| When first enhanced | Fires the first time this card's power is increased |
| When power reaches N | Fires when this card's power hits a threshold |
| Scaling (continuous) | Continuously recalculates based on board state |
| End-of-game modifier | Alters scoring rules |

#### Effect Types

| Effect | Description |
|---|---|
| Enhancement (buff) | Raise power of cards on affected tiles (+1 to +5) |
| Enfeeblement (debuff) | Lower power of cards on affected tiles (-1 to -5) |
| Destruction | Destroy cards on affected tiles |
| Self-power scaling | Raise this card's own power based on conditions |
| Lane score bonus | Bonus points if you win the lane (+5, +10) |
| Add card to hand | Generate a token card into your hand mid-game |
| Spawn cards | Place token cards directly onto empty board positions you control |
| Replacement | Destroy an allied card and take its place |
| Position rank manipulation | Raise tile ranks by 2 (instead of normal 1) |
| Score redistribution | Winner also gets loser's lane score |
| Dual-target buff/debuff | Affects BOTH allied and enemy cards |

#### Token Cards (Generated Mid-Game)

Not part of the 145-card collection. Created only by abilities. ~21 token card variants exist, including rank-specific variants (e.g., Elemental at rank 1/2/3).

### Ability Resolution (Partially Documented)

- "When played" effects resolve immediately after pawn placement
- "While in play" effects are continuous modifiers; removed when the card is destroyed (buffs/debuffs revert)
- "When destroyed" triggers at moment of destruction
- Scaling abilities recalculate continuously based on board state
- **Chain reactions:** enfeeblement reducing power to 0 destroys the card, which can trigger further abilities — exact cascade ordering is not formally documented

---

## Remaining Unknowns

These could not be definitively confirmed through research:

1. **Tile state after card destruction** — do pawns remain, reset, or disappear?
2. **Exact range pattern grid dimensions** — confirmed 5 rows tall, but column count may vary per card
3. **Cascade resolution order** — when destruction triggers chain further destructions, the exact sequencing is undocumented
4. **Score bonus stacking** — can multiple score bonus cards in the same lane stack?

---

## Why Two Products

The MTG open-source ecosystem (Forge, XMage, Magarena) shows that multiple projects thrive when they serve different needs. But the source game is small (145 cards, 15-tile board) — the game itself can't sustain an ecosystem of competing engines.

What it *can* sustain:

- **The engine** appeals to developers and tinkerers — people who want to build their own UI, write a bot, run simulations, or create a variant game. It's the foundation layer. Low-glamour, high-utility.
- **The game** appeals to players — people who want to play now, with a polished experience. It's also the proof that the engine works and the on-ramp for contributors who start with card data or art and later dig into engine internals.

Every existing clone (queensbloodonline.com, GitHub projects, TTS mods) is a monolith that mixes game logic with UI. Our engine is standalone and reusable. Our game (Blood Fang) has its own original names and art.

### Contribution paths

| Interest | Where to contribute |
|---|---|
| Game rules, ability logic, edge cases | Engine |
| Card balance, new cards, custom formats | Engine (card definitions) |
| Original card names, lore, flavor text | Game (creative layer) |
| Art, visual design, UI/UX | Game (client) |
| Networking, matchmaking | Game (server) |
| Bots, solvers, analysis tools | Engine consumers (their own projects) |

## Key Design Considerations

1. **Card identity must be separate from card mechanics.** The engine models cards as (rank, power, range pattern, ability). The game layer adds (name, art, lore, flavor text). This boundary is the engine/game API contract.

2. **The ability chain cascade system is the hardest technical problem.** An enfeeblement can reduce power to 0, triggering destruction, which triggers "when destroyed" abilities, which may enfeeble other cards, causing further destruction. This needs a well-designed event/resolution stack.

3. **Start with a subset of cards.** Implement ~20-30 cards covering all ability trigger/effect types first. Validate the engine against edge cases before expanding to 145.

4. **The draw phase changes strategy significantly.** With 1 draw per turn, players see ~10 of 15 cards per game. Deck synergies are more reliable, high-cost cards are more viable, and passing costs you a draw.

---

## Scope (Preliminary)

### Phase 1 — Core Engine (library)

- Board state representation (3x5 grid, pawns, ownership)
- Card data model (rank, power, range pattern, ability) — mechanics only
- Turn logic and validation (placement rules, draw phase, passing, game end)
- Pawn placement and capture
- Scoring and win condition evaluation
- Card destruction via enfeeblement
- Mulligan phase
- Published as a standalone package with public API

### Phase 2 — Ability System (library)

- Complete ability system (all trigger types and effect types)
- Replacement card mechanics
- Token card spawning / hand generation
- Chain reaction resolution
- Starter card set (~20-30 cards, mechanics only, covering all ability types)
- Comprehensive test suite for card interactions

### Phase 3 — The Game (React + Vite)

- Original theme, card names, lore, and (placeholder) art
- Full card database (~145 cards with original creative identity)
- Human vs human (local)
- Web UI built with React + Vite (`packages/client`)
- Deck builder (15 cards from collection, no duplicates)

### Phase 4 — Networked Play (Colyseus)

- Server-authoritative game state via Colyseus (`packages/server`)
- Networked multiplayer with automatic state sync
- Matchmaking / lobby via Colyseus rooms

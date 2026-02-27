import type {
  Board,
  CardDefinition,
  CardInstance,
  GameAction,
  GameConfig,
  GameEvent,
  GameState,
  PlayerId,
  PlayerState,
  Position,
  RangeCell,
  Tile,
} from './types.js';
import {
  BOARD_COLS,
  BOARD_ROWS,
  CARD_RANKS,
  DECK_SIZE,
  GAME_EVENT_TYPES,
  GamePhase,
  INITIAL_HAND_SIZE,
  LOG_ACTION_TYPES,
  MAX_PAWN_COUNT,
  RANGE_CELL_TYPES,
  opponent,
} from './types.js';
import { createBoard, getTile, isBoardFull, isValidPosition, setTile } from './board.js';
import { resolveAbilities } from './abilities.js';
import { internalDestroyCard } from './effects.js';
import { fisherYatesShuffle } from './utils.js';

// ── Internal Helpers ───────────────────────────────────────────────────

function getDefinition(state: GameState, defId: string): CardDefinition {
  const def = state.cardDefinitions[defId];
  if (!def) throw new Error(`Card definition not found: ${defId}`);
  return def;
}

function getInstance(state: GameState, instanceId: string): CardInstance {
  const inst = state.cardInstances[instanceId];
  if (!inst) throw new Error(`Card instance not found: ${instanceId}`);
  return inst;
}

function requireTile(board: Board, pos: Position): Tile {
  const tile = getTile(board, pos);
  if (!tile) throw new Error(`Invalid position: (${pos.row}, ${pos.col})`);
  return tile;
}

function updatePlayer(
  state: GameState,
  player: PlayerId,
  updates: Partial<PlayerState>,
): readonly [PlayerState, PlayerState] {
  const players: [PlayerState, PlayerState] = [state.players[0], state.players[1]];
  players[player] = { ...players[player], ...updates };
  return players;
}

function appendLog(log: readonly GameAction[], action: GameAction): readonly GameAction[] {
  return [...log, action];
}

// ── resolveRangePattern (exported for testing) ─────────────────────────

export function resolveRangePattern(
  rangePattern: readonly RangeCell[],
  cardPosition: Position,
  player: PlayerId,
): Position[] {
  const positions: Position[] = [];
  for (const cell of rangePattern) {
    if (cell.type === RANGE_CELL_TYPES.ABILITY) continue; // No-op in Phase 1

    const row = cardPosition.row + cell.row;
    // Mirror column for P1: negate column offset
    const col = player === 0 ? cardPosition.col + cell.col : cardPosition.col - cell.col;

    const pos = { row, col };
    if (isValidPosition(pos)) {
      positions.push(pos);
    }
  }
  return positions;
}

// ── advanceTurn (internal) ─────────────────────────────────────────────

function advanceTurn(state: GameState): GameState {
  const nextPlayer = opponent(state.currentPlayerIndex);
  const nextTurn = state.turnNumber + 1;

  let players = state.players;
  let log = state.log;

  // Draw 1 card for the next player (skip on turn 1)
  if (nextTurn > 1) {
    const playerState = players[nextPlayer];
    if (playerState.deck.length > 0) {
      const cardId = playerState.deck[0]!;
      const newDeck = playerState.deck.slice(1);
      const newHand = [...playerState.hand, cardId];
      const updated = updatePlayer({ ...state, players }, nextPlayer, {
        deck: newDeck,
        hand: newHand,
      });
      players = updated;
      log = appendLog(log, { type: LOG_ACTION_TYPES.DRAW_CARD, player: nextPlayer, cardId });
    }
  }

  return {
    ...state,
    players,
    currentPlayerIndex: nextPlayer,
    turnNumber: nextTurn,
    log,
  };
}

// ── createGame ─────────────────────────────────────────────────────────

export function createGame(
  p0Deck: readonly string[],
  p1Deck: readonly string[],
  definitions: Readonly<Record<string, CardDefinition>>,
  config?: GameConfig,
  rng?: () => number,
): GameState {
  const actualRng = rng ?? Math.random;
  const handSize = config?.initialHandSize ?? INITIAL_HAND_SIZE;
  const firstPlayer: PlayerId = config?.firstPlayer ?? 0;

  // Validate decks
  for (const [i, deck] of [p0Deck, p1Deck].entries()) {
    if (deck.length !== DECK_SIZE) {
      throw new Error(`Player ${i} deck must have exactly ${DECK_SIZE} cards, got ${deck.length}`);
    }
    const unique = new Set(deck);
    if (unique.size !== deck.length) {
      throw new Error(`Player ${i} deck contains duplicate cards`);
    }
    for (const cardId of deck) {
      if (!definitions[cardId]) {
        throw new Error(`Card definition not found: ${cardId}`);
      }
    }
  }

  // Shuffle decks
  const shuffled0 = fisherYatesShuffle(p0Deck, actualRng);
  const shuffled1 = fisherYatesShuffle(p1Deck, actualRng);

  // Draw initial hands
  const hand0 = shuffled0.slice(0, handSize);
  const deck0 = shuffled0.slice(handSize);
  const hand1 = shuffled1.slice(0, handSize);
  const deck1 = shuffled1.slice(handSize);

  // Build log
  let log: readonly GameAction[] = [];
  for (const cardId of hand0) {
    log = appendLog(log, { type: LOG_ACTION_TYPES.DRAW_CARD, player: 0, cardId });
  }
  for (const cardId of hand1) {
    log = appendLog(log, { type: LOG_ACTION_TYPES.DRAW_CARD, player: 1, cardId });
  }

  return {
    board: createBoard(),
    players: [
      { deck: deck0, hand: hand0, mulliganUsed: false },
      { deck: deck1, hand: hand1, mulliganUsed: false },
    ],
    currentPlayerIndex: firstPlayer,
    turnNumber: 0,
    phase: GamePhase.Mulligan,
    consecutivePasses: 0,
    continuousModifiers: [],
    cardInstances: {},
    log,
    nextInstanceId: 1,
    cardDefinitions: definitions,
  };
}

// ── mulligan ───────────────────────────────────────────────────────────

export function mulligan(
  state: GameState,
  player: PlayerId,
  returnCardIds: readonly string[],
  rng?: () => number,
): GameState {
  if (state.phase !== GamePhase.Mulligan) {
    throw new Error('Mulligan is only available during mulligan phase');
  }
  const playerState = state.players[player];
  if (playerState.mulliganUsed) {
    throw new Error(`Player ${player} has already used their mulligan`);
  }

  // Validate all returned cards are in hand
  for (const cardId of returnCardIds) {
    if (!playerState.hand.includes(cardId)) {
      throw new Error(`Card ${cardId} is not in player ${player}'s hand`);
    }
  }

  const actualRng = rng ?? Math.random;
  const returnCount = returnCardIds.length;

  // Remove returned cards from hand
  const remainingHand = playerState.hand.filter((id) => !returnCardIds.includes(id));
  // Put returned cards back into deck and shuffle
  const newDeckBeforeShuffle = [...playerState.deck, ...returnCardIds];
  const shuffledDeck = fisherYatesShuffle(newDeckBeforeShuffle, actualRng);

  // Draw same number of cards
  const drawnCards = shuffledDeck.slice(0, returnCount);
  const finalDeck = shuffledDeck.slice(returnCount);
  const finalHand = [...remainingHand, ...drawnCards];

  let log = state.log;
  log = appendLog(log, {
    type: LOG_ACTION_TYPES.MULLIGAN,
    player,
    returnedCount: returnCount,
    drawnCount: drawnCards.length,
  });

  const players = updatePlayer(state, player, {
    deck: finalDeck,
    hand: finalHand,
    mulliganUsed: true,
  });

  // Check if both players are done
  const bothDone = players[0].mulliganUsed && players[1].mulliganUsed;

  let result: GameState = {
    ...state,
    players,
    log,
    phase: bothDone ? GamePhase.Playing : GamePhase.Mulligan,
    turnNumber: bothDone ? 1 : 0,
  };

  // When transitioning to playing, draw for first player if turn > 1
  // Turn 1 = first turn, skip draw
  if (bothDone) {
    // No draw on turn 1
    result = { ...result, currentPlayerIndex: state.currentPlayerIndex };
  }

  return result;
}

// ── canPlayCard ────────────────────────────────────────────────────────

export function canPlayCard(state: GameState, cardId: string, position: Position): boolean {
  if (state.phase !== GamePhase.Playing) return false;

  const player = state.currentPlayerIndex;
  const playerState = state.players[player];

  // Card must be in hand
  if (!playerState.hand.includes(cardId)) return false;

  // Position must be valid
  if (!isValidPosition(position)) return false;

  const tile = requireTile(state.board, position);
  const def = getDefinition(state, cardId);

  if (def.rank === CARD_RANKS.REPLACEMENT) {
    // Replacement cards must target a tile with an allied card
    if (tile.owner !== player) return false;
    if (tile.cardInstanceId === null) return false;
    // Verify the card on the tile belongs to this player
    const existingInstance = state.cardInstances[tile.cardInstanceId];
    if (!existingInstance || existingInstance.owner !== player) return false;
    return true;
  }

  // Regular cards
  // Tile must be owned by current player
  if (tile.owner !== player) return false;
  // Tile pawnCount >= card rank
  if (tile.pawnCount < def.rank) return false;
  // Tile must not have a card already
  if (tile.cardInstanceId !== null) return false;

  return true;
}

// ── getValidMoves ──────────────────────────────────────────────────────

export function getValidMoves(state: GameState): { cardId: string; positions: Position[] }[] {
  if (state.phase !== GamePhase.Playing) return [];

  const player = state.currentPlayerIndex;
  const playerState = state.players[player];
  const moves: { cardId: string; positions: Position[] }[] = [];

  for (const cardId of playerState.hand) {
    const positions: Position[] = [];
    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        if (canPlayCard(state, cardId, { row, col })) {
          positions.push({ row, col });
        }
      }
    }
    if (positions.length > 0) {
      moves.push({ cardId, positions });
    }
  }

  return moves;
}

// ── destroyCard (public — triggers ability cascade) ───────────────────

export function destroyCard(state: GameState, instanceId: string): GameState {
  const instance = getInstance(state, instanceId);
  const owner = instance.owner;

  // Snapshot before destruction (for whenDestroyed triggers)
  const destroyedCards: Record<string, CardInstance> = { [instanceId]: instance };

  // Internal destroy (no cascade)
  let newState = internalDestroyCard(state, instanceId);

  // Trigger cascade with destroyed card snapshot
  const events: GameEvent[] = [{ type: GAME_EVENT_TYPES.CARD_DESTROYED, instanceId, owner }];
  newState = resolveAbilities(newState, events, 0, destroyedCards);

  return newState;
}

// ── getEffectivePower ──────────────────────────────────────────────────

export function getEffectivePower(state: GameState, instanceId: string): number {
  const instance = getInstance(state, instanceId);
  const modifierSum = state.continuousModifiers
    .filter((m) => m.targetInstanceId === instanceId)
    .reduce((sum, m) => sum + m.value, 0);
  return instance.basePower + instance.bonusPower + modifierSum;
}

// ── playCard ───────────────────────────────────────────────────────────

export function playCard(state: GameState, cardId: string, position: Position): GameState {
  if (!canPlayCard(state, cardId, position)) {
    throw new Error(`Cannot play card ${cardId} at (${position.row}, ${position.col})`);
  }

  const player = state.currentPlayerIndex;
  const def = getDefinition(state, cardId);
  const instanceId = String(state.nextInstanceId);

  let replacementDestroyed: { id: string; owner: PlayerId } | null = null;

  // Handle replacement card: destroy existing card first
  if (def.rank === CARD_RANKS.REPLACEMENT) {
    const tile = requireTile(state.board, position);
    const existingId = tile.cardInstanceId;
    if (existingId) {
      const existingInstance = getInstance(state, existingId);
      replacementDestroyed = { id: existingId, owner: existingInstance.owner };
      // Capture the replaced card's effective power for dynamicValue resolution
      const replacedPower = getEffectivePower(state, existingId);
      state = internalDestroyCard(state, existingId);
      state = { ...state, replacedCardPower: replacedPower };
    }
  }

  // Remove card from hand
  const playerState = state.players[player];
  const newHand = playerState.hand.filter((id) => id !== cardId);

  // Create card instance
  const instance: CardInstance = {
    instanceId,
    definitionId: def.id,
    owner: player,
    position,
    basePower: def.power,
    bonusPower: 0,
  };
  let cardInstances = { ...state.cardInstances, [instanceId]: instance };

  // Place on board
  const currentTile = requireTile(state.board, position);
  let board = setTile(state.board, position, {
    ...currentTile,
    cardInstanceId: instanceId,
  });

  // Log placement
  let log = appendLog(state.log, {
    type: LOG_ACTION_TYPES.PLACE_CARD,
    player,
    cardId,
    instanceId,
    position,
  });

  // Resolve range pattern — pawn placement
  const pawnPositions = resolveRangePattern(def.rangePattern, position, player);
  for (const pawnPos of pawnPositions) {
    const tile = requireTile(board, pawnPos);

    if (tile.owner === null || tile.owner === player) {
      // Unowned or allied: add 1 pawn, cap at MAX
      if (tile.pawnCount < MAX_PAWN_COUNT) {
        board = setTile(board, pawnPos, {
          owner: player,
          pawnCount: tile.pawnCount + 1,
          cardInstanceId: tile.cardInstanceId,
        });
        log = appendLog(log, { type: LOG_ACTION_TYPES.PLACE_PAWN, player, position: pawnPos });
      }
    } else {
      // Opponent tile: capture — flip owner, pawnCount stays
      board = setTile(board, pawnPos, {
        owner: player,
        pawnCount: tile.pawnCount,
        cardInstanceId: tile.cardInstanceId,
      });
      log = appendLog(log, { type: LOG_ACTION_TYPES.CAPTURE_PAWN, player, position: pawnPos });
    }
  }

  // Build intermediate state
  const players = updatePlayer({ ...state, players: state.players }, player, { hand: newHand });

  let newState: GameState = {
    ...state,
    board,
    players,
    cardInstances,
    log,
    nextInstanceId: state.nextInstanceId + 1,
    consecutivePasses: 0,
  };

  // Emit events for ability resolution
  const events: GameEvent[] = [];
  if (replacementDestroyed) {
    events.push({
      type: GAME_EVENT_TYPES.CARD_DESTROYED,
      instanceId: replacementDestroyed.id,
      owner: replacementDestroyed.owner,
    });
  }
  events.push({ type: GAME_EVENT_TYPES.CARD_PLAYED, instanceId, owner: player });

  // Resolve ability cascade
  newState = resolveAbilities(newState, events);

  // Clean up temporary replacedCardPower after ability resolution
  if (newState.replacedCardPower !== undefined) {
    newState = { ...newState, replacedCardPower: undefined };
  }

  // Check board full end condition
  if (isBoardFull(newState.board)) {
    newState = {
      ...newState,
      phase: GamePhase.Ended,
    };
    return newState;
  }

  // Advance turn
  return advanceTurn(newState);
}

// ── pass ───────────────────────────────────────────────────────────────

export function pass(state: GameState): GameState {
  if (state.phase !== GamePhase.Playing) {
    throw new Error('Can only pass during playing phase');
  }

  const player = state.currentPlayerIndex;
  let log = appendLog(state.log, { type: LOG_ACTION_TYPES.PASS, player });

  const newConsecutivePasses = state.consecutivePasses + 1;

  if (newConsecutivePasses >= 2) {
    // Game ends
    return {
      ...state,
      log,
      consecutivePasses: newConsecutivePasses,
      phase: GamePhase.Ended,
    };
  }

  // Advance turn
  return advanceTurn({
    ...state,
    log,
    consecutivePasses: newConsecutivePasses,
  });
}

import type { AbilityDefinition, CardDefinition } from '@bloodfang/engine';

export interface CardIdentity {
  name: string;
  description: string;
  artPlaceholder: string;
}

const CARD_NAMES: Record<string, string> = {
  // Rank 1
  'hoplite-guard': 'Hoplite Guard',
  'spartan-sentinel': 'Spartan Sentinel',
  'fire-hurler': 'Fire Hurler',
  'bronze-sweeper': 'Bronze Sweeper',
  'siren-queen': 'Siren Queen',
  'venomous-asp': 'Venomous Asp',
  'swift-hare': 'Swift Hare',
  'arcadian-wolf': 'Arcadian Wolf',
  'cave-sprite': 'Cave Sprite',
  'dryad-seedling': 'Dryad Seedling',
  'war-elephant': 'War Elephant',
  'golden-bramble': 'Golden Bramble',
  'crystal-karkinos': 'Crystal Karkinos',
  'feathered-drake': 'Feathered Drake',
  'roc-of-olympus': 'Roc of Olympus',
  'centaur-charger': 'Centaur Charger',
  'harpy-screamer': 'Harpy Screamer',
  'amorphous-ooze': 'Amorphous Ooze',
  'myrmex-crawler': 'Myrmex Crawler',
  'ancient-drakon': 'Ancient Drakon',
  'cyclops-brute': 'Cyclops Brute',
  'chariot-of-ares': 'Chariot of Ares',
  'pegasus-scout': 'Pegasus Scout',
  'zephyr-spirit': 'Zephyr Spirit',
  'ember-salamander': 'Ember Salamander',
  'copper-automaton': 'Copper Automaton',

  // Rank 2
  'psyche-leech': 'Psyche Leech',
  'all-seeing-eye': 'All-Seeing Eye',
  'war-chariot': 'War Chariot',
  'pyroclast-soldier': 'Pyroclast Soldier',
  'athenas-owl': "Athena's Owl",
  'thalassic-fiend': 'Thalassic Fiend',
  'nautilus-guardian': 'Nautilus Guardian',
  'royal-spear': 'Royal Spear',
  'king-of-shades': 'King of Shades',
  'sand-gorgon': 'Sand Gorgon',
  'resilient-polyp': 'Resilient Polyp',
  'serpent-of-lerna': 'Serpent of Lerna',
  'petrifying-rooster': 'Petrifying Rooster',
  'heat-golem': 'Heat Golem',
  'volcanic-imp': 'Volcanic Imp',
  'minotaur-thug': 'Minotaur Thug',
  'stygian-claw': 'Stygian Claw',
  'earthen-wyrm': 'Earthen Wyrm',
  'desert-naga': 'Desert Naga',
  'triple-chimera': 'Triple Chimera',
  'hermes-trickster': 'Hermes Trickster',
  'twin-serpent': 'Twin Serpent',
  'narcissus-trap': 'Narcissus Trap',
  'iron-giant': 'Iron Giant',
  'mantis-chimera': 'Mantis Chimera',
  'titan-frog': 'Titan Frog',
  'cursed-stag': 'Cursed Stag',
  'great-horned-beast': 'Great Horned Beast',
  'toxic-hydra': 'Toxic Hydra',
  'mother-nymph': 'Mother Nymph',
  'protean-mass': 'Protean Mass',
  'carrion-harpy': 'Carrion Harpy',
  'golden-griffin': 'Golden Griffin',
  'stone-basilisk': 'Stone Basilisk',
  'scorpion-of-artemis': 'Scorpion of Artemis',
  'chaos-wyvern': 'Chaos Wyvern',
  'desert-triton': 'Desert Triton',
  'cave-lurker': 'Cave Lurker',
  'marble-colossus': 'Marble Colossus',
  'janus-mask': 'Janus Mask',
  'wraith-of-tartarus': 'Wraith of Tartarus',
  'phantom-vulture': 'Phantom Vulture',
  'gorgo-serpent': 'Gorgo Serpent',
  'elder-drakon': 'Elder Drakon',
  'twin-headed-oracle': 'Twin-Headed Oracle',
  'nyx-wing': 'Nyx Wing',
  'cerberus-hound': 'Cerberus Hound',
  'ghastly-shade': 'Ghastly Shade',
  'minos-judge': 'Minos Judge',
  'harmony-duality': 'Harmony Duality',
  'chaotic-shade': 'Chaotic Shade',
  'elite-myrmidon': 'Elite Myrmidon',
  'iron-myrmidon': 'Iron Myrmidon',
  'frost-reaver': 'Frost Reaver',
  'nemean-guardian': 'Nemean Guardian',
  'hundred-eyed-argus': 'Hundred-Eyed Argus',
  'phantom-wraith': 'Phantom Wraith',
  'bronze-fortress': 'Bronze Fortress',
  'ancient-adamantine': 'Ancient Adamantine',

  // Rank 3
  'achilles-reborn': 'Achilles Reborn',
  'atlas-gunner': 'Atlas Gunner',
  'amazon-striker': 'Amazon Striker',
  'oracle-of-delphi': 'Oracle of Delphi',
  'flame-of-prometheus': 'Flame of Prometheus',
  'shadow-artemis': 'Shadow Artemis',
  'fortune-sphinx': 'Fortune Sphinx',
  'daedalus-pilot': 'Daedalus Pilot',
  'lycaon-cursed': 'Lycaon Cursed',
  pyriphlegethon: 'Pyriphlegethon',
  'boreas-queen': 'Boreas Queen',
  'zeus-thunderlord': 'Zeus Thunderlord',
  'gaia-titan': 'Gaia Titan',
  'taurus-primeval': 'Taurus Primeval',
  'ares-allfather': 'Ares Allfather',
  'eternal-phoenix': 'Eternal Phoenix',
  'ocean-leviathan': 'Ocean Leviathan',
  'divine-colossus': 'Divine Colossus',
  'king-of-dragons': 'King of Dragons',
  'drakon-ascendant': 'Drakon Ascendant',
  'warrior-of-many-arms': 'Warrior of Many Arms',
  'gryphon-and-sprite': 'Gryphon & Sprite',
  'plump-gryphon': 'Plump Gryphon',
  'golden-gryphon': 'Golden Gryphon',
  'sprite-trio': 'Sprite Trio',
  'pandoras-jar': "Pandora's Jar",
  'aegis-keeper': 'Aegis Keeper',
  'world-serpent': 'World Serpent',
  'orichalcum-golem': 'Orichalcum Golem',
  'kraken-terror': 'Kraken Terror',
  'tentacle-horror': 'Tentacle Horror',
  'winged-fury': 'Winged Fury',
  'grand-cockatrice': 'Grand Cockatrice',

  // Replacement
  'tragic-hero': 'Tragic Hero',
  'frog-hunter': 'Frog Hunter',
  'labyrinth-experiment': 'Labyrinth Experiment',
  'crimson-chariot': 'Crimson Chariot',
  'shade-commander': 'Shade Commander',
  'forgotten-chimera': 'Forgotten Chimera',
  'tyrant-and-beast': 'Tyrant & Beast',
  'scarlet-drakon': 'Scarlet Drakon',
  'gates-of-erebus': 'Gates of Erebus',
  'swift-blade': 'Swift Blade',
  'iron-fist': 'Iron Fist',
  'silent-dagger': 'Silent Dagger',
  'shadow-commander': 'Shadow Commander',
  'golden-tyrant': 'Golden Tyrant',
  'war-rider': 'War Rider',
  'sacred-band': 'Sacred Band',
  'gryphon-rider': 'Gryphon Rider',
  'star-voyager': 'Star Voyager',
  'house-of-hades': 'House of Hades',
  'wheel-of-fortune': 'Wheel of Fortune',
  'tragic-muse': 'Tragic Muse',
  'festival-guard': 'Festival Guard',
  'arena-master': 'Arena Master',
  'dionysus-reveler': 'Dionysus Reveler',
  'fallen-seraph': 'Fallen Seraph',
  'circe-enchantress': 'Circe Enchantress',
  'nyx-sovereign': 'Nyx Sovereign',

  // Tokens
  'nymph-sprout': 'Nymph Sprout',
  'battle-sprite': 'Battle Sprite',
  'sprite-mage': 'Sprite Mage',
  'sprite-bard': 'Sprite Bard',
  'little-shade': 'Little Shade',
  'junior-nymph': 'Junior Nymph',
  'baby-nymph': 'Baby Nymph',
  'daedalus-glider': 'Daedalus Glider',
  'lycaon-beast': 'Lycaon Beast',
  'heat-fragment': 'Heat Fragment',
  'reformed-protean': 'Reformed Protean',
  'thorny-imp': 'Thorny Imp',
  'elemental-spark': 'Elemental Spark',
  'elemental-flame': 'Elemental Flame',
  'elemental-storm': 'Elemental Storm',
  'zealot-initiate': 'Zealot Initiate',
  'zealot-warrior': 'Zealot Warrior',
  'zealot-champion': 'Zealot Champion',
  'frost-crystal-minor': 'Frost Crystal',
  'frost-crystal-major': 'Frost Crystal',
  'frost-crystal-grand': 'Frost Crystal',
};

const RANK_EMOJIS: Record<string, string> = {
  '1': '\u2694\uFE0F',
  '2': '\u{1F6E1}\uFE0F',
  '3': '\u{1F451}',
  replacement: '\u{1F504}',
};

export function getCardName(definitionId: string): string {
  return CARD_NAMES[definitionId] ?? kebabToTitle(definitionId);
}

function kebabToTitle(id: string): string {
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getArtPlaceholder(def: CardDefinition): string {
  return RANK_EMOJIS[String(def.rank)] ?? '\u2694\uFE0F';
}

export function getAbilityDescription(def: CardDefinition): string {
  if (!def.ability) return '';
  return describeAbility(def.ability);
}

function describeAbility(ability: AbilityDefinition): string {
  const trigger = describeTrigger(ability.trigger);
  const effect = describeEffect(ability.effect);
  return `${trigger}: ${effect}`;
}

function describeTrigger(trigger: string): string {
  const triggers: Record<string, string> = {
    whenPlayed: 'When played',
    whileInPlay: 'While in play',
    whenDestroyed: 'When destroyed',
    whenAlliedDestroyed: 'When an ally is destroyed',
    whenEnemyDestroyed: 'When an enemy is destroyed',
    whenAnyDestroyed: 'When any card is destroyed',
    whenAlliedPlayed: 'When an ally is played',
    whenEnemyPlayed: 'When an enemy is played',
    whenFirstEnfeebled: 'When first enfeebled',
    whenFirstEnhanced: 'When first enhanced',
    whenPowerReachesN: 'When power reaches threshold',
    scaling: 'Scaling',
    endOfGame: 'End of game',
  };
  return triggers[trigger] ?? trigger;
}

function describeEffect(effect: {
  readonly type: string;
  readonly value?: number;
  readonly target?: { readonly type: string };
  readonly condition?: { readonly type: string };
  readonly valuePerUnit?: number;
  readonly tokenDefinitionId?: string;
  readonly count?: number;
  readonly bonusPawns?: number;
  readonly alliedValue?: number;
  readonly enemyValue?: number;
  readonly dynamicValue?: string;
}): string {
  switch (effect.type) {
    case 'enhance': {
      const val = effect.dynamicValue ? "replaced card's power" : `+${effect.value}`;
      return `${val} power to ${describeTarget(effect.target)}`;
    }
    case 'enfeeble': {
      const val = effect.dynamicValue ? "replaced card's power" : `${effect.value}`;
      return `-${val} power to ${describeTarget(effect.target)}`;
    }
    case 'destroy':
      return `Destroy ${describeTarget(effect.target)}`;
    case 'selfPowerScaling':
      return `+${effect.valuePerUnit} power per ${describeCondition(effect.condition)}`;
    case 'laneScoreBonus':
      return `+${effect.value} to lane score`;
    case 'addCardToHand': {
      const tokenName = getCardName(effect.tokenDefinitionId ?? '');
      return `Add ${effect.count} ${tokenName} to hand`;
    }
    case 'spawnCard': {
      const tokenName = getCardName(effect.tokenDefinitionId ?? '');
      return `Spawn ${tokenName} at ${describeTarget(effect.target)}`;
    }
    case 'positionRankManip':
      return `+${effect.bonusPawns} pawns to ${describeTarget(effect.target)}`;
    case 'scoreRedistribution':
      return 'Winner takes all points in lane';
    case 'dualTargetBuff':
      return `+${effect.alliedValue} to allies, +${effect.enemyValue} to enemies in ${describeTarget(effect.target)}`;
    default:
      return effect.type;
  }
}

function describeTarget(target?: { readonly type: string }): string {
  if (!target) return 'targets';
  const targets: Record<string, string> = {
    rangePattern: 'cards in range',
    self: 'self',
    allAllied: 'all allies',
    allEnemy: 'all enemies',
    allInLane: 'all cards in lane',
    allAlliedInLane: 'allies in lane',
    allEnemyInLane: 'enemies in lane',
    allAlliedEnhanced: 'enhanced allies',
    allEnemyEnhanced: 'enhanced enemies',
    allEnhanced: 'all enhanced cards',
    allAlliedEnfeebled: 'enfeebled allies',
    allEnemyEnfeebled: 'enfeebled enemies',
    allEnfeebled: 'all enfeebled cards',
  };
  return targets[target.type] ?? target.type;
}

function describeCondition(condition?: { readonly type: string }): string {
  if (!condition) return 'unit';
  const conditions: Record<string, string> = {
    alliedCardsInLane: 'allied card in lane',
    enemyCardsInLane: 'enemy card in lane',
    alliedCardsOnBoard: 'allied card on board',
    enemyCardsOnBoard: 'enemy card on board',
    allCardsOnBoard: 'card on board',
    controlledTilesInLane: 'controlled tile in lane',
  };
  return conditions[condition.type] ?? condition.type;
}

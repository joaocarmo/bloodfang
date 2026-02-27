import { t, msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import type { MessageDescriptor } from '@lingui/core';
import type { AbilityDefinition, CardDefinition } from '@bloodfang/engine';

export interface CardIdentity {
  name: string;
  description: string;
  artPlaceholder: string;
}

const CARD_NAMES: Record<string, MessageDescriptor> = {
  // Rank 1
  'hoplite-guard': msg`Hoplite Guard`,
  'spartan-sentinel': msg`Spartan Sentinel`,
  'fire-hurler': msg`Fire Hurler`,
  'bronze-sweeper': msg`Bronze Sweeper`,
  'siren-queen': msg`Siren Queen`,
  'venomous-asp': msg`Venomous Asp`,
  'swift-hare': msg`Swift Hare`,
  'arcadian-wolf': msg`Arcadian Wolf`,
  'cave-sprite': msg`Cave Sprite`,
  'dryad-seedling': msg`Dryad Seedling`,
  'war-elephant': msg`War Elephant`,
  'golden-bramble': msg`Golden Bramble`,
  'crystal-karkinos': msg`Crystal Karkinos`,
  'feathered-drake': msg`Feathered Drake`,
  'roc-of-olympus': msg`Roc of Olympus`,
  'centaur-charger': msg`Centaur Charger`,
  'harpy-screamer': msg`Harpy Screamer`,
  'amorphous-ooze': msg`Amorphous Ooze`,
  'myrmex-crawler': msg`Myrmex Crawler`,
  'ancient-drakon': msg`Ancient Drakon`,
  'cyclops-brute': msg`Cyclops Brute`,
  'chariot-of-ares': msg`Chariot of Ares`,
  'pegasus-scout': msg`Pegasus Scout`,
  'zephyr-spirit': msg`Zephyr Spirit`,
  'ember-salamander': msg`Ember Salamander`,
  'copper-automaton': msg`Copper Automaton`,

  // Rank 2
  'psyche-leech': msg`Psyche Leech`,
  'all-seeing-eye': msg`All-Seeing Eye`,
  'war-chariot': msg`War Chariot`,
  'pyroclast-soldier': msg`Pyroclast Soldier`,
  'athenas-owl': msg`Athena's Owl`,
  'thalassic-fiend': msg`Thalassic Fiend`,
  'nautilus-guardian': msg`Nautilus Guardian`,
  'royal-spear': msg`Royal Spear`,
  'king-of-shades': msg`King of Shades`,
  'sand-gorgon': msg`Sand Gorgon`,
  'resilient-polyp': msg`Resilient Polyp`,
  'serpent-of-lerna': msg`Serpent of Lerna`,
  'petrifying-rooster': msg`Petrifying Rooster`,
  'heat-golem': msg`Heat Golem`,
  'volcanic-imp': msg`Volcanic Imp`,
  'minotaur-thug': msg`Minotaur Thug`,
  'stygian-claw': msg`Stygian Claw`,
  'earthen-wyrm': msg`Earthen Wyrm`,
  'desert-naga': msg`Desert Naga`,
  'triple-chimera': msg`Triple Chimera`,
  'hermes-trickster': msg`Hermes Trickster`,
  'twin-serpent': msg`Twin Serpent`,
  'narcissus-trap': msg`Narcissus Trap`,
  'iron-giant': msg`Iron Giant`,
  'mantis-chimera': msg`Mantis Chimera`,
  'titan-frog': msg`Titan Frog`,
  'cursed-stag': msg`Cursed Stag`,
  'great-horned-beast': msg`Great Horned Beast`,
  'toxic-hydra': msg`Toxic Hydra`,
  'mother-nymph': msg`Mother Nymph`,
  'protean-mass': msg`Protean Mass`,
  'carrion-harpy': msg`Carrion Harpy`,
  'golden-griffin': msg`Golden Griffin`,
  'stone-basilisk': msg`Stone Basilisk`,
  'scorpion-of-artemis': msg`Scorpion of Artemis`,
  'chaos-wyvern': msg`Chaos Wyvern`,
  'desert-triton': msg`Desert Triton`,
  'cave-lurker': msg`Cave Lurker`,
  'marble-colossus': msg`Marble Colossus`,
  'janus-mask': msg`Janus Mask`,
  'wraith-of-tartarus': msg`Wraith of Tartarus`,
  'phantom-vulture': msg`Phantom Vulture`,
  'gorgo-serpent': msg`Gorgo Serpent`,
  'elder-drakon': msg`Elder Drakon`,
  'twin-headed-oracle': msg`Twin-Headed Oracle`,
  'nyx-wing': msg`Nyx Wing`,
  'cerberus-hound': msg`Cerberus Hound`,
  'ghastly-shade': msg`Ghastly Shade`,
  'minos-judge': msg`Minos Judge`,
  'harmony-duality': msg`Harmony Duality`,
  'chaotic-shade': msg`Chaotic Shade`,
  'elite-myrmidon': msg`Elite Myrmidon`,
  'iron-myrmidon': msg`Iron Myrmidon`,
  'frost-reaver': msg`Frost Reaver`,
  'nemean-guardian': msg`Nemean Guardian`,
  'hundred-eyed-argus': msg`Hundred-Eyed Argus`,
  'phantom-wraith': msg`Phantom Wraith`,
  'bronze-fortress': msg`Bronze Fortress`,
  'ancient-adamantine': msg`Ancient Adamantine`,

  // Rank 3
  'achilles-reborn': msg`Achilles Reborn`,
  'atlas-gunner': msg`Atlas Gunner`,
  'amazon-striker': msg`Amazon Striker`,
  'oracle-of-delphi': msg`Oracle of Delphi`,
  'flame-of-prometheus': msg`Flame of Prometheus`,
  'shadow-artemis': msg`Shadow Artemis`,
  'fortune-sphinx': msg`Fortune Sphinx`,
  'daedalus-pilot': msg`Daedalus Pilot`,
  'lycaon-cursed': msg`Lycaon Cursed`,
  pyriphlegethon: msg`Pyriphlegethon`,
  'boreas-queen': msg`Boreas Queen`,
  'zeus-thunderlord': msg`Zeus Thunderlord`,
  'gaia-titan': msg`Gaia Titan`,
  'taurus-primeval': msg`Taurus Primeval`,
  'ares-allfather': msg`Ares Allfather`,
  'eternal-phoenix': msg`Eternal Phoenix`,
  'ocean-leviathan': msg`Ocean Leviathan`,
  'divine-colossus': msg`Divine Colossus`,
  'king-of-dragons': msg`King of Dragons`,
  'drakon-ascendant': msg`Drakon Ascendant`,
  'warrior-of-many-arms': msg`Warrior of Many Arms`,
  'gryphon-and-sprite': msg`Gryphon & Sprite`,
  'plump-gryphon': msg`Plump Gryphon`,
  'golden-gryphon': msg`Golden Gryphon`,
  'sprite-trio': msg`Sprite Trio`,
  'pandoras-jar': msg`Pandora's Jar`,
  'aegis-keeper': msg`Aegis Keeper`,
  'world-serpent': msg`World Serpent`,
  'orichalcum-golem': msg`Orichalcum Golem`,
  'kraken-terror': msg`Kraken Terror`,
  'tentacle-horror': msg`Tentacle Horror`,
  'winged-fury': msg`Winged Fury`,
  'grand-cockatrice': msg`Grand Cockatrice`,

  // Replacement
  'tragic-hero': msg`Tragic Hero`,
  'frog-hunter': msg`Frog Hunter`,
  'labyrinth-experiment': msg`Labyrinth Experiment`,
  'crimson-chariot': msg`Crimson Chariot`,
  'shade-commander': msg`Shade Commander`,
  'forgotten-chimera': msg`Forgotten Chimera`,
  'tyrant-and-beast': msg`Tyrant & Beast`,
  'scarlet-drakon': msg`Scarlet Drakon`,
  'gates-of-erebus': msg`Gates of Erebus`,
  'swift-blade': msg`Swift Blade`,
  'iron-fist': msg`Iron Fist`,
  'silent-dagger': msg`Silent Dagger`,
  'shadow-commander': msg`Shadow Commander`,
  'golden-tyrant': msg`Golden Tyrant`,
  'war-rider': msg`War Rider`,
  'sacred-band': msg`Sacred Band`,
  'gryphon-rider': msg`Gryphon Rider`,
  'star-voyager': msg`Star Voyager`,
  'house-of-hades': msg`House of Hades`,
  'wheel-of-fortune': msg`Wheel of Fortune`,
  'tragic-muse': msg`Tragic Muse`,
  'festival-guard': msg`Festival Guard`,
  'arena-master': msg`Arena Master`,
  'dionysus-reveler': msg`Dionysus Reveler`,
  'fallen-seraph': msg`Fallen Seraph`,
  'circe-enchantress': msg`Circe Enchantress`,
  'nyx-sovereign': msg`Nyx Sovereign`,

  // Tokens
  'nymph-sprout': msg`Nymph Sprout`,
  'battle-sprite': msg`Battle Sprite`,
  'sprite-mage': msg`Sprite Mage`,
  'sprite-bard': msg`Sprite Bard`,
  'little-shade': msg`Little Shade`,
  'junior-nymph': msg`Junior Nymph`,
  'baby-nymph': msg`Baby Nymph`,
  'daedalus-glider': msg`Daedalus Glider`,
  'lycaon-beast': msg`Lycaon Beast`,
  'heat-fragment': msg`Heat Fragment`,
  'reformed-protean': msg`Reformed Protean`,
  'thorny-imp': msg`Thorny Imp`,
  'elemental-spark': msg`Elemental Spark`,
  'elemental-flame': msg`Elemental Flame`,
  'elemental-storm': msg`Elemental Storm`,
  'zealot-initiate': msg`Zealot Initiate`,
  'zealot-warrior': msg`Zealot Warrior`,
  'zealot-champion': msg`Zealot Champion`,
  'frost-crystal-minor': msg`Frost Crystal`,
  'frost-crystal-major': msg`Frost Crystal`,
  'frost-crystal-grand': msg`Frost Crystal`,
};

const RANK_EMOJIS: Record<string, string> = {
  '1': '\u2694\uFE0F',
  '2': '\uD83D\uDEE1\uFE0F',
  '3': '\uD83D\uDC51',
  replacement: '\uD83D\uDD04',
};

export function getCardName(definitionId: string): string {
  const desc = CARD_NAMES[definitionId];
  return desc ? i18n.t(desc) : kebabToTitle(definitionId);
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
  return t`${trigger}: ${effect}`;
}

const TRIGGERS: Record<string, MessageDescriptor> = {
  whenPlayed: msg`When played`,
  whileInPlay: msg`While in play`,
  whenDestroyed: msg`When destroyed`,
  whenAlliedDestroyed: msg`When an ally is destroyed`,
  whenEnemyDestroyed: msg`When an enemy is destroyed`,
  whenAnyDestroyed: msg`When any card is destroyed`,
  whenAlliedPlayed: msg`When an ally is played`,
  whenEnemyPlayed: msg`When an enemy is played`,
  whenFirstEnfeebled: msg`When first enfeebled`,
  whenFirstEnhanced: msg`When first enhanced`,
  whenPowerReachesN: msg`When power reaches threshold`,
  scaling: msg`Scaling`,
  endOfGame: msg`End of game`,
};

function describeTrigger(trigger: string): string {
  const desc = TRIGGERS[trigger];
  return desc ? i18n.t(desc) : trigger;
}

const TARGETS: Record<string, MessageDescriptor> = {
  rangePattern: msg`cards in range`,
  self: msg`self`,
  allAllied: msg`all allies`,
  allEnemy: msg`all enemies`,
  allInLane: msg`all cards in lane`,
  allAlliedInLane: msg`allies in lane`,
  allEnemyInLane: msg`enemies in lane`,
  allAlliedEnhanced: msg`enhanced allies`,
  allEnemyEnhanced: msg`enhanced enemies`,
  allEnhanced: msg`all enhanced cards`,
  allAlliedEnfeebled: msg`enfeebled allies`,
  allEnemyEnfeebled: msg`enfeebled enemies`,
  allEnfeebled: msg`all enfeebled cards`,
};

function describeTarget(target?: { readonly type: string }): string {
  if (!target) return t`targets`;
  const desc = TARGETS[target.type];
  return desc ? i18n.t(desc) : target.type;
}

const CONDITIONS: Record<string, MessageDescriptor> = {
  alliedCardsInLane: msg`allied card in lane`,
  enemyCardsInLane: msg`enemy card in lane`,
  alliedCardsOnBoard: msg`allied card on board`,
  enemyCardsOnBoard: msg`enemy card on board`,
  allCardsOnBoard: msg`card on board`,
  controlledTilesInLane: msg`controlled tile in lane`,
};

function describeCondition(condition?: { readonly type: string }): string {
  if (!condition) return t`unit`;
  const desc = CONDITIONS[condition.type];
  return desc ? i18n.t(desc) : condition.type;
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
      const target = describeTarget(effect.target);
      if (effect.dynamicValue) return t`+replaced card's power to ${target}`;
      const val = effect.value ?? 0;
      return t`+${val} power to ${target}`;
    }
    case 'enfeeble': {
      const target = describeTarget(effect.target);
      if (effect.dynamicValue) return t`-replaced card's power to ${target}`;
      const val = effect.value ?? 0;
      return t`-${val} power to ${target}`;
    }
    case 'destroy':
      return t`Destroy ${describeTarget(effect.target)}`;
    case 'selfPowerScaling': {
      const vpu = effect.valuePerUnit ?? 0;
      return t`+${vpu} power per ${describeCondition(effect.condition)}`;
    }
    case 'laneScoreBonus': {
      const val = effect.value ?? 0;
      return t`+${val} to lane score`;
    }
    case 'addCardToHand': {
      const tokenName = getCardName(effect.tokenDefinitionId ?? '');
      const count = effect.count ?? 0;
      return t`Add ${count} ${tokenName} to hand`;
    }
    case 'spawnCard': {
      const tokenName = getCardName(effect.tokenDefinitionId ?? '');
      return t`Spawn ${tokenName} at ${describeTarget(effect.target)}`;
    }
    case 'positionRankManip': {
      const pawns = effect.bonusPawns ?? 0;
      return t`+${pawns} pawns to ${describeTarget(effect.target)}`;
    }
    case 'scoreRedistribution':
      return t`Winner takes all points in lane`;
    case 'dualTargetBuff': {
      const allied = effect.alliedValue ?? 0;
      const enemy = effect.enemyValue ?? 0;
      const enemyStr = enemy >= 0 ? `+${enemy}` : `${enemy}`;
      const target = describeTarget(effect.target);
      return t`+${allied} to allies, ${enemyStr} to enemies (${target})`;
    }
    default:
      return effect.type;
  }
}

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

const CARD_FLAVOR_TEXT: Record<string, MessageDescriptor> = {
  // Rank 1
  'hoplite-guard': msg`"Hold the line. Not for glory, but because the man beside you would do the same."`,
  'spartan-sentinel': msg`Born in iron. Forged in discipline. Broken by nothing.`,
  'fire-hurler': msg`"Aim? I aim at everything. The fire sorts out the rest."`,
  'bronze-sweeper': msg`Its blade traces a perfect arc. Everything within that arc ceases to exist.`,
  'siren-queen': msg`Her song doesn't lure sailors to the rocks. It makes them forget that rocks exist at all.`,
  'venomous-asp': msg`Cleopatra chose the asp not for its venom, but for its silence.`,
  'swift-hare': msg`"You cannot catch what was never where you looked."`,
  'arcadian-wolf': msg`In Arcadia, the wolves don't howl. They have nothing left to mourn.`,
  'cave-sprite': msg`It giggles in the dark. That's how you know you've gone too deep.`,
  'dryad-seedling': msg`Every ancient grove began with a single stubborn seed refusing to die.`,
  'war-elephant': msg`Alexander wept not because there were no worlds left to conquer, but because the elephants would not cross another river.`,
  'golden-bramble': msg`Beauty and cruelty share the same roots.`,
  'crystal-karkinos': msg`Its shell refracts starlight into a thousand tiny rainbows. Its claws do not.`,
  'feathered-drake': msg`Not quite dragon, not quite bird. Entirely lethal.`,
  'roc-of-olympus': msg`When its shadow passes over a village, the villagers pray — not for safety, but for the honor of being noticed.`,
  'centaur-charger': msg`"We do not ride into battle. We ARE the charge."`,
  'harpy-screamer': msg`The scream arrives before the harpy does. The lucky ones are already running.`,
  'amorphous-ooze': msg`It doesn't consume. It simply makes everything part of itself.`,
  'myrmex-crawler': msg`One is a curiosity. A hundred is an invasion. A thousand is a geological event.`,
  'ancient-drakon': msg`Old enough to remember when the gods were young and afraid.`,
  'cyclops-brute': msg`"I see just fine. I only need to see you once."`,
  'chariot-of-ares': msg`The wheels leave furrows in the earth that never grow back.`,
  'pegasus-scout': msg`It flies above the clouds not to hide, but because the ground bores it.`,
  'zephyr-spirit': msg`You cannot cage the west wind. Many have tried. The cages are still there; the wind is not.`,
  'ember-salamander': msg`It sleeps in the hearth. Disturb the coals and you'll meet its teeth.`,
  'copper-automaton': msg`Hephaestus built it without a soul, then couldn't explain why it wept.`,

  // Rank 2
  'psyche-leech': msg`It feeds not on blood but on certainty, leaving its victims unsure of their own names.`,
  'all-seeing-eye': msg`"I have looked upon every truth. I recommend ignorance."`,
  'war-chariot': msg`The horses are trained not to flinch. The riders are trained not to look back.`,
  'pyroclast-soldier': msg`Born in eruption. Dies in eruption. The part in between is someone else's problem.`,
  'athenas-owl': msg`"Wisdom is knowing which battles to fight. I am here to remind you this is not one of them."`,
  'thalassic-fiend': msg`The deep has teeth, and they are always hungry.`,
  'nautilus-guardian': msg`It has guarded the same reef for three thousand years. It does not know why. It does not need to.`,
  'royal-spear': msg`Forged for a king who never threw it. Thrown by a soldier who never missed.`,
  'king-of-shades': msg`He rules the dead not through fear, but through the simple truth that no one leaves.`,
  'sand-gorgon': msg`The desert is full of statues with terrified expressions. Travelers assume they're art.`,
  'resilient-polyp': msg`Cut it apart and each piece remembers being whole.`,
  'serpent-of-lerna': msg`"Kill one head, two more shall rise." The math alone should terrify you.`,
  'petrifying-rooster': msg`It crows at dawn. By noon, the garden has new statuary.`,
  'heat-golem': msg`The smiths who built it are long dead. Their fire is not.`,
  'volcanic-imp': msg`"I didn't start the fire. I just made sure it couldn't stop."`,
  'minotaur-thug': msg`The labyrinth was built to contain him. He stays because he likes it.`,
  'stygian-claw': msg`Forged from a river that remembers every oath ever broken.`,
  'earthen-wyrm': msg`The earthquake was not the wyrm arriving. It was the wyrm yawning.`,
  'desert-naga': msg`"The sands shift. I remain."`,
  'triple-chimera': msg`Three heads, three hungers, one terrible purpose.`,
  'hermes-trickster': msg`"I didn't steal it. I liberated it from the burden of ownership."`,
  'twin-serpent': msg`They share one mind but never agree. Their prey benefits from neither opinion.`,
  'narcissus-trap': msg`The pool shows you what you love most. You'll never want to look away.`,
  'iron-giant': msg`When it walks, the earth complains. When it stops, the silence is worse.`,
  'mantis-chimera': msg`Patient as prayer. Sudden as blasphemy.`,
  'titan-frog': msg`The marshfolk worship it. The marshfolk are wise.`,
  'cursed-stag': msg`To hunt it is to become the hunted. Artemis does not forgive trespass.`,
  'great-horned-beast': msg`The mountain didn't move. Something behind the mountain did.`,
  'toxic-hydra': msg`Its blood poisons rivers. Its breath wilts forests. Its temper is worse.`,
  'mother-nymph': msg`She tends a garden of daughters, each one wilder than the last.`,
  'protean-mass': msg`It doesn't have a shape. It has all of them, and it's choosing.`,
  'carrion-harpy': msg`"Nothing is wasted. Everything feeds something."`,
  'golden-griffin': msg`Half eagle, half lion, wholly convinced of its divine right to everything.`,
  'stone-basilisk': msg`The last thing its victims see is their own reflection in its eyes, already turning gray.`,
  'scorpion-of-artemis': msg`Sent by the huntress to remind Orion that pride has a sting.`,
  'chaos-wyvern': msg`It obeys no master, follows no pattern, and respects no boundary.`,
  'desert-triton': msg`Far from the sea but never far from the storm.`,
  'cave-lurker': msg`It has lived in the dark so long it has forgotten the sun. The sun has not forgotten it.`,
  'marble-colossus': msg`The sculptor carved it as a monument to peace. It disagreed.`,
  'janus-mask': msg`One face sees what was. The other sees what will be. Both are weeping.`,
  'wraith-of-tartarus': msg`It escaped the pit once. Once was enough to learn the way.`,
  'phantom-vulture': msg`It circles above battlefields that haven't happened yet.`,
  'gorgo-serpent': msg`Medusa's lesser sister, but "lesser" is a generous word.`,
  'elder-drakon': msg`It remembers the taste of titans.`,
  'twin-headed-oracle': msg`"The future is certain." "The future is impossible." Both heads are always right.`,
  'nyx-wing': msg`Born from the space between stars, where even gods fear to look.`,
  'cerberus-hound': msg`Three heads, one purpose: nothing gets out.`,
  'ghastly-shade': msg`It wears the face of someone you once trusted.`,
  'minos-judge': msg`"I do not judge the dead. I judge what they did while living."`,
  'harmony-duality': msg`Where light meets shadow, balance is not found — it is forged.`,
  'chaotic-shade': msg`Order is a story the living tell themselves. This is the truth beneath.`,
  'elite-myrmidon': msg`"We were ants once. We remember what it means to carry a hundred times our weight."`,
  'iron-myrmidon': msg`Flesh replaced with bronze. Mercy replaced with nothing.`,
  'frost-reaver': msg`Winter doesn't come. It is sent.`,
  'nemean-guardian': msg`Its hide turned aside Heracles' arrows. What chance does yours have?`,
  'hundred-eyed-argus': msg`Sleep is a luxury. Vigilance is a curse. Argus has learned to love the curse.`,
  'phantom-wraith': msg`"I died here. Now so will everything else."`,
  'bronze-fortress': msg`They built it to last a thousand years. It has outlasted three thousand and shows no sign of stopping.`,
  'ancient-adamantine': msg`The metal that predates iron, that predates bronze, that predates the memory of mountains.`,

  // Rank 3
  'achilles-reborn': msg`"My heel? I fixed that."`,
  'atlas-gunner': msg`He held up the sky until he realized it made a better weapon.`,
  'amazon-striker': msg`"We don't fight like men. We fight like something men should fear."`,
  'oracle-of-delphi': msg`"You came here for answers. You won't like them, but you came anyway."`,
  'flame-of-prometheus': msg`The fire that was stolen from the gods burns differently — it burns with purpose.`,
  'shadow-artemis': msg`The huntress needs no moonlight. The dark is her quiver.`,
  'fortune-sphinx': msg`"Answer my riddle and pass. Fail, and become part of the question."`,
  'daedalus-pilot': msg`"Father made the wings. I learned what he never could — how to fall."`,
  'lycaon-cursed': msg`Zeus turned him into a wolf as punishment. The wolf considers it a promotion.`,
  pyriphlegethon: msg`The river of fire does not flow. It hunts.`,
  'boreas-queen': msg`"The north wind is not cruel. It simply does not care."`,
  'zeus-thunderlord': msg`When he speaks, the sky answers. When he is silent, the world holds its breath.`,
  'gaia-titan': msg`She does not protect the earth. She IS the earth, and she is waking up.`,
  'taurus-primeval': msg`Before the labyrinth, before Minos, before Crete — there was only the bull.`,
  'ares-allfather': msg`"Peace is the dream of the weak. War is the only honest conversation."`,
  'eternal-phoenix': msg`"Death is not an ending. It's a warm-up."`,
  'ocean-leviathan': msg`Poseidon built it from a nightmare he couldn't shake. The ocean has trembled ever since.`,
  'divine-colossus': msg`It straddles the harbor not as guardian, but as warning: some doors should stay closed.`,
  'king-of-dragons': msg`Every drakon bows. Not from loyalty — from memory.`,
  'drakon-ascendant': msg`It shed its scales and grew something worse: ambition.`,
  'warrior-of-many-arms': msg`Six arms. Six weapons. One overwhelming argument.`,
  'gryphon-and-sprite': msg`An unlikely alliance: one provides the wisdom, the other the wingspan.`,
  'plump-gryphon': msg`"I'm not fat. I'm aerodynamically generous."`,
  'golden-gryphon': msg`Its feathers are worth kingdoms. Its loyalty is worth more.`,
  'sprite-trio': msg`Alone, a nuisance. Together, a catastrophe.`,
  'pandoras-jar': msg`Hope was the last thing inside. Some say that's cruelty, not kindness.`,
  'aegis-keeper': msg`The shield of Zeus was never meant for defense. It was meant for ending arguments.`,
  'world-serpent': msg`It encircles the world not to contain it, but to hold it together.`,
  'orichalcum-golem': msg`Forged from the metal of Atlantis — the only thing that survived the sinking.`,
  'kraken-terror': msg`"Release the —" Actually, it released itself.`,
  'tentacle-horror': msg`What lives below the kraken? Sailors who ask don't come back to tell.`,
  'winged-fury': msg`Vengeance made flesh, feather, and fury. The guilty hear her wings in their sleep.`,
  'grand-cockatrice': msg`Its gaze petrifies. Its breath poisons. Its mere presence is an insult to nature.`,

  // Replacement
  'tragic-hero': msg`Every story needs a hero who falls. His story needs it twice.`,
  'frog-hunter': msg`"Kiss it? I'm going to EAT it."`,
  'labyrinth-experiment': msg`Daedalus' greatest failure — or his greatest success, depending on who you ask.`,
  'crimson-chariot': msg`Painted red not for intimidation, but to hide the stains.`,
  'shade-commander': msg`"The dead follow orders better than the living. They've learned what disobedience costs."`,
  'forgotten-chimera': msg`Even monsters can be abandoned. This one remembers.`,
  'tyrant-and-beast': msg`The leash is a formality. Both know who is really in charge.`,
  'scarlet-drakon': msg`Red scales, red eyes, red ruin wherever it roams.`,
  'gates-of-erebus': msg`"Abandon hope" was merely a suggestion. The gate makes it mandatory.`,
  'swift-blade': msg`You'll feel the wound before you see the sword.`,
  'iron-fist': msg`Diplomacy is the art of saying "nice doggy" until you can find a rock. This is the rock.`,
  'silent-dagger': msg`"The loudest victories make no sound at all."`,
  'shadow-commander': msg`"Lead from the dark. Strike from the dark. Return to the dark."`,
  'golden-tyrant': msg`He gilds his throne with the crowns of lesser kings.`,
  'war-rider': msg`"The horse knows the way to battle. I just hold on."`,
  'sacred-band': msg`One hundred fifty pairs. Each fights not for country, but for the soul beside them.`,
  'gryphon-rider': msg`"The gryphon chose me. I'm still not sure if that's an honor or a threat."`,
  'star-voyager': msg`It sails not on water but on the space between constellations.`,
  'house-of-hades': msg`"All roads lead here eventually. I've simply removed the 'eventually.'"`,
  'wheel-of-fortune': msg`"Round and round it goes. Where it stops, nobody chose."`,
  'tragic-muse': msg`She inspires the greatest art by inflicting the greatest suffering.`,
  'festival-guard': msg`"I was hired for the party. Nobody said anything about the apocalypse."`,
  'arena-master': msg`"Two enter, one leaves. Unless I'm having a good day — then none leave."`,
  'dionysus-reveler': msg`"Wine is truth. And truth, my friend, is absolutely hammered right now."`,
  'fallen-seraph': msg`It fell not from grace, but from boredom with perfection.`,
  'circe-enchantress': msg`"I don't turn men into swine. I reveal the swine they already are."`,
  'nyx-sovereign': msg`Night does not fall. Night rules, and it always has.`,

  // Tokens
  'nymph-sprout': msg`Small enough to cup in your hands. Wild enough to regret it.`,
  'battle-sprite': msg`A fistful of fury and an attitude three times its size.`,
  'sprite-mage': msg`It learned magic the hard way — by exploding, repeatedly.`,
  'sprite-bard': msg`Its songs are tiny, its courage enormous, and its pitch questionable.`,
  'little-shade': msg`A shadow that forgot which body it belonged to.`,
  'junior-nymph': msg`Already tending her first flower. Already planning her first revenge.`,
  'baby-nymph': msg`Born yesterday. Angry about it.`,
  'daedalus-glider': msg`Not quite flight. Not quite falling. Somewhere beautifully in between.`,
  'lycaon-beast': msg`The wolf remembers being a man. The man wishes he didn't.`,
  'heat-fragment': msg`A cinder that refused to cool, dreaming of the fire it once was.`,
  'reformed-protean': msg`It chose this shape. Ask it tomorrow and the answer will be different.`,
  'thorny-imp': msg`Hugging it is technically possible. Technically.`,
  'elemental-spark': msg`The first flicker before the storm — tiny, fragile, and full of potential.`,
  'elemental-flame': msg`It grew from a spark into a promise. The promise: everything burns.`,
  'elemental-storm': msg`What began as a whisper in the clouds now roars with the voice of the sky itself.`,
  'zealot-initiate': msg`"I believe." Two words. Infinite consequences.`,
  'zealot-warrior': msg`Faith sharpened into a blade and driven through doubt's heart.`,
  'zealot-champion': msg`"I am the answer to every prayer you were afraid to speak."`,
  'frost-crystal-minor': msg`A single note of winter's song, frozen in crystal clarity.`,
  'frost-crystal-major': msg`The cold gathers, the shards multiply, and the air itself begins to remember ice.`,
  'frost-crystal-grand': msg`An entire blizzard, compressed into silence and light.`,
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

export function getFlavorText(definitionId: string): string | undefined {
  const desc = CARD_FLAVOR_TEXT[definitionId];
  return desc ? i18n.t(desc) : undefined;
}

export function getArtPlaceholder(def: CardDefinition): string {
  return RANK_EMOJIS[String(def.rank)] ?? '\u2694\uFE0F';
}

export function getCardInitials(definitionId: string): string {
  const name = getCardName(definitionId);
  const words = name.split(/[\s&]+/).filter(Boolean);
  const initials = words.map((w) => w.charAt(0).toUpperCase()).join('');
  return initials || '?';
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

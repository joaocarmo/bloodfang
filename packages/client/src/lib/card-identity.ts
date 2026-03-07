import { t, msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import type { MessageDescriptor } from '@lingui/core';
import { CardId } from '@bloodfang/engine';
import type { AbilityDefinition, CardDefinition } from '@bloodfang/engine';

export interface CardIdentity {
  name: string;
  description: string;
  artPlaceholder: string;
}

const CARD_NAMES: Partial<Record<CardId, MessageDescriptor>> = {
  // Rank 1
  [CardId.HopliteGuard]: msg`Hoplite Guard`,
  [CardId.SpartanSentinel]: msg`Spartan Sentinel`,
  [CardId.FireHurler]: msg`Fire Hurler`,
  [CardId.BronzeSweeper]: msg`Bronze Sweeper`,
  [CardId.SirenQueen]: msg`Siren Queen`,
  [CardId.VenomousAsp]: msg`Venomous Asp`,
  [CardId.SwiftHare]: msg`Swift Hare`,
  [CardId.ArcadianWolf]: msg`Arcadian Wolf`,
  [CardId.CaveSprite]: msg`Cave Sprite`,
  [CardId.DryadSeedling]: msg`Dryad Seedling`,
  [CardId.WarElephant]: msg`War Elephant`,
  [CardId.GoldenBramble]: msg`Golden Bramble`,
  [CardId.CrystalKarkinos]: msg`Crystal Karkinos`,
  [CardId.FeatheredDrake]: msg`Feathered Drake`,
  [CardId.RocOfOlympus]: msg`Roc of Olympus`,
  [CardId.CentaurCharger]: msg`Centaur Charger`,
  [CardId.HarpyScreamer]: msg`Harpy Screamer`,
  [CardId.AmorphousOoze]: msg`Amorphous Ooze`,
  [CardId.MyrmexCrawler]: msg`Myrmex Crawler`,
  [CardId.AncientDrakon]: msg`Ancient Drakon`,
  [CardId.CyclopsBrute]: msg`Cyclops Brute`,
  [CardId.ChariotOfAres]: msg`Chariot of Ares`,
  [CardId.PegasusScout]: msg`Pegasus Scout`,
  [CardId.ZephyrSpirit]: msg`Zephyr Spirit`,
  [CardId.EmberSalamander]: msg`Ember Salamander`,
  [CardId.CopperAutomaton]: msg`Copper Automaton`,

  // Rank 2
  [CardId.PsycheLeech]: msg`Psyche Leech`,
  [CardId.AllSeeingEye]: msg`All-Seeing Eye`,
  [CardId.WarChariot]: msg`War Chariot`,
  [CardId.PyroclastSoldier]: msg`Pyroclast Soldier`,
  [CardId.AthenasOwl]: msg`Athena's Owl`,
  [CardId.ThalassicFiend]: msg`Thalassic Fiend`,
  [CardId.NautilusGuardian]: msg`Nautilus Guardian`,
  [CardId.RoyalSpear]: msg`Royal Spear`,
  [CardId.KingOfShades]: msg`King of Shades`,
  [CardId.SandGorgon]: msg`Sand Gorgon`,
  [CardId.ResilientPolyp]: msg`Resilient Polyp`,
  [CardId.SerpentOfLerna]: msg`Serpent of Lerna`,
  [CardId.PetrifyingRooster]: msg`Petrifying Rooster`,
  [CardId.HeatGolem]: msg`Heat Golem`,
  [CardId.VolcanicImp]: msg`Volcanic Imp`,
  [CardId.MinotaurThug]: msg`Minotaur Thug`,
  [CardId.StygianClaw]: msg`Stygian Claw`,
  [CardId.EarthenWyrm]: msg`Earthen Wyrm`,
  [CardId.DesertNaga]: msg`Desert Naga`,
  [CardId.TripleChimera]: msg`Triple Chimera`,
  [CardId.HermesTrickster]: msg`Hermes Trickster`,
  [CardId.TwinSerpent]: msg`Twin Serpent`,
  [CardId.NarcissusTrap]: msg`Narcissus Trap`,
  [CardId.IronGiant]: msg`Iron Giant`,
  [CardId.MantisChimera]: msg`Mantis Chimera`,
  [CardId.TitanFrog]: msg`Titan Frog`,
  [CardId.CursedStag]: msg`Cursed Stag`,
  [CardId.GreatHornedBeast]: msg`Great Horned Beast`,
  [CardId.ToxicHydra]: msg`Toxic Hydra`,
  [CardId.MotherNymph]: msg`Mother Nymph`,
  [CardId.ProteanMass]: msg`Protean Mass`,
  [CardId.CarrionHarpy]: msg`Carrion Harpy`,
  [CardId.GoldenGriffin]: msg`Golden Griffin`,
  [CardId.StoneBasilisk]: msg`Stone Basilisk`,
  [CardId.ScorpionOfArtemis]: msg`Scorpion of Artemis`,
  [CardId.ChaosWyvern]: msg`Chaos Wyvern`,
  [CardId.DesertTriton]: msg`Desert Triton`,
  [CardId.CaveLurker]: msg`Cave Lurker`,
  [CardId.MarbleColossus]: msg`Marble Colossus`,
  [CardId.JanusMask]: msg`Janus Mask`,
  [CardId.WraithOfTartarus]: msg`Wraith of Tartarus`,
  [CardId.PhantomVulture]: msg`Phantom Vulture`,
  [CardId.GorgoSerpent]: msg`Gorgo Serpent`,
  [CardId.ElderDrakon]: msg`Elder Drakon`,
  [CardId.TwinHeadedOracle]: msg`Twin-Headed Oracle`,
  [CardId.NyxWing]: msg`Nyx Wing`,
  [CardId.CerberusHound]: msg`Cerberus Hound`,
  [CardId.GhastlyShade]: msg`Ghastly Shade`,
  [CardId.MinosJudge]: msg`Minos Judge`,
  [CardId.HarmonyDuality]: msg`Harmony Duality`,
  [CardId.ChaoticShade]: msg`Chaotic Shade`,
  [CardId.EliteMyrmidon]: msg`Elite Myrmidon`,
  [CardId.IronMyrmidon]: msg`Iron Myrmidon`,
  [CardId.FrostReaver]: msg`Frost Reaver`,
  [CardId.NemeanGuardian]: msg`Nemean Guardian`,
  [CardId.HundredEyedArgus]: msg`Hundred-Eyed Argus`,
  [CardId.PhantomWraith]: msg`Phantom Wraith`,
  [CardId.BronzeFortress]: msg`Bronze Fortress`,
  [CardId.AncientAdamantine]: msg`Ancient Adamantine`,

  // Rank 3
  [CardId.AchillesReborn]: msg`Achilles Reborn`,
  [CardId.AtlasGunner]: msg`Atlas Gunner`,
  [CardId.AmazonStriker]: msg`Amazon Striker`,
  [CardId.OracleOfDelphi]: msg`Oracle of Delphi`,
  [CardId.FlameOfPrometheus]: msg`Flame of Prometheus`,
  [CardId.ShadowArtemis]: msg`Shadow Artemis`,
  [CardId.FortuneSphinx]: msg`Fortune Sphinx`,
  [CardId.DaedalusPilot]: msg`Daedalus Pilot`,
  [CardId.LycaonCursed]: msg`Lycaon Cursed`,
  pyriphlegethon: msg`Pyriphlegethon`,
  [CardId.BoreasQueen]: msg`Boreas Queen`,
  [CardId.ZeusThunderlord]: msg`Zeus Thunderlord`,
  [CardId.GaiaTitan]: msg`Gaia Titan`,
  [CardId.TaurusPrimeval]: msg`Taurus Primeval`,
  [CardId.AresAllfather]: msg`Ares Allfather`,
  [CardId.EternalPhoenix]: msg`Eternal Phoenix`,
  [CardId.OceanLeviathan]: msg`Ocean Leviathan`,
  [CardId.DivineColossus]: msg`Divine Colossus`,
  [CardId.KingOfDragons]: msg`King of Dragons`,
  [CardId.DrakonAscendant]: msg`Drakon Ascendant`,
  [CardId.WarriorOfManyArms]: msg`Warrior of Many Arms`,
  [CardId.GryphonAndSprite]: msg`Gryphon & Sprite`,
  [CardId.PlumpGryphon]: msg`Plump Gryphon`,
  [CardId.GoldenGryphon]: msg`Golden Gryphon`,
  [CardId.SpriteTrio]: msg`Sprite Trio`,
  [CardId.PandorasJar]: msg`Pandora's Jar`,
  [CardId.AegisKeeper]: msg`Aegis Keeper`,
  [CardId.WorldSerpent]: msg`World Serpent`,
  [CardId.OrichalcumGolem]: msg`Orichalcum Golem`,
  [CardId.KrakenTerror]: msg`Kraken Terror`,
  [CardId.TentacleHorror]: msg`Tentacle Horror`,
  [CardId.WingedFury]: msg`Winged Fury`,
  [CardId.GrandCockatrice]: msg`Grand Cockatrice`,

  // Replacement
  [CardId.TragicHero]: msg`Tragic Hero`,
  [CardId.FrogHunter]: msg`Frog Hunter`,
  [CardId.LabyrinthExperiment]: msg`Labyrinth Experiment`,
  [CardId.CrimsonChariot]: msg`Crimson Chariot`,
  [CardId.ShadeCommander]: msg`Shade Commander`,
  [CardId.ForgottenChimera]: msg`Forgotten Chimera`,
  [CardId.TyrantAndBeast]: msg`Tyrant & Beast`,
  [CardId.ScarletDrakon]: msg`Scarlet Drakon`,
  [CardId.GatesOfErebus]: msg`Gates of Erebus`,
  [CardId.SwiftBlade]: msg`Swift Blade`,
  [CardId.IronFist]: msg`Iron Fist`,
  [CardId.SilentDagger]: msg`Silent Dagger`,
  [CardId.ShadowCommander]: msg`Shadow Commander`,
  [CardId.GoldenTyrant]: msg`Golden Tyrant`,
  [CardId.WarRider]: msg`War Rider`,
  [CardId.SacredBand]: msg`Sacred Band`,
  [CardId.GryphonRider]: msg`Gryphon Rider`,
  [CardId.StarVoyager]: msg`Star Voyager`,
  [CardId.HouseOfHades]: msg`House of Hades`,
  [CardId.WheelOfFortune]: msg`Wheel of Fortune`,
  [CardId.TragicMuse]: msg`Tragic Muse`,
  [CardId.FestivalGuard]: msg`Festival Guard`,
  [CardId.ArenaMaster]: msg`Arena Master`,
  [CardId.DionysusReveler]: msg`Dionysus Reveler`,
  [CardId.FallenSeraph]: msg`Fallen Seraph`,
  [CardId.CirceEnchantress]: msg`Circe Enchantress`,
  [CardId.NyxSovereign]: msg`Nyx Sovereign`,

  // Tokens
  [CardId.NymphSprout]: msg`Nymph Sprout`,
  [CardId.BattleSprite]: msg`Battle Sprite`,
  [CardId.SpriteMage]: msg`Sprite Mage`,
  [CardId.SpriteBard]: msg`Sprite Bard`,
  [CardId.LittleShade]: msg`Little Shade`,
  [CardId.JuniorNymph]: msg`Junior Nymph`,
  [CardId.BabyNymph]: msg`Baby Nymph`,
  [CardId.DaedalusGlider]: msg`Daedalus Glider`,
  [CardId.LycaonBeast]: msg`Lycaon Beast`,
  [CardId.HeatFragment]: msg`Heat Fragment`,
  [CardId.ReformedProtean]: msg`Reformed Protean`,
  [CardId.ThornyImp]: msg`Thorny Imp`,
  [CardId.ElementalSpark]: msg`Elemental Spark`,
  [CardId.ElementalFlame]: msg`Elemental Flame`,
  [CardId.ElementalStorm]: msg`Elemental Storm`,
  [CardId.ZealotInitiate]: msg`Zealot Initiate`,
  [CardId.ZealotWarrior]: msg`Zealot Warrior`,
  [CardId.ZealotChampion]: msg`Zealot Champion`,
  [CardId.FrostCrystalMinor]: msg`Frost Crystal`,
  [CardId.FrostCrystalMajor]: msg`Frost Crystal`,
  [CardId.FrostCrystalGrand]: msg`Frost Crystal`,
};

const CARD_FLAVOR_TEXT: Partial<Record<CardId, MessageDescriptor>> = {
  // Rank 1
  [CardId.HopliteGuard]: msg`"Hold the line. Not for glory, but because the man beside you would do the same."`,
  [CardId.SpartanSentinel]: msg`Born in iron. Forged in discipline. Broken by nothing.`,
  [CardId.FireHurler]: msg`"Aim? I aim at everything. The fire sorts out the rest."`,
  [CardId.BronzeSweeper]: msg`Its blade traces a perfect arc. Everything within that arc ceases to exist.`,
  [CardId.SirenQueen]: msg`Her song doesn't lure sailors to the rocks. It makes them forget that rocks exist at all.`,
  [CardId.VenomousAsp]: msg`Cleopatra chose the asp not for its venom, but for its silence.`,
  [CardId.SwiftHare]: msg`"You cannot catch what was never where you looked."`,
  [CardId.ArcadianWolf]: msg`In Arcadia, the wolves don't howl. They have nothing left to mourn.`,
  [CardId.CaveSprite]: msg`It giggles in the dark. That's how you know you've gone too deep.`,
  [CardId.DryadSeedling]: msg`Every ancient grove began with a single stubborn seed refusing to die.`,
  [CardId.WarElephant]: msg`Alexander wept not because there were no worlds left to conquer, but because the elephants would not cross another river.`,
  [CardId.GoldenBramble]: msg`Beauty and cruelty share the same roots.`,
  [CardId.CrystalKarkinos]: msg`Its shell refracts starlight into a thousand tiny rainbows. Its claws do not.`,
  [CardId.FeatheredDrake]: msg`Not quite dragon, not quite bird. Entirely lethal.`,
  [CardId.RocOfOlympus]: msg`When its shadow passes over a village, the villagers pray — not for safety, but for the honor of being noticed.`,
  [CardId.CentaurCharger]: msg`"We do not ride into battle. We ARE the charge."`,
  [CardId.HarpyScreamer]: msg`The scream arrives before the harpy does. The lucky ones are already running.`,
  [CardId.AmorphousOoze]: msg`It doesn't consume. It simply makes everything part of itself.`,
  [CardId.MyrmexCrawler]: msg`One is a curiosity. A hundred is an invasion. A thousand is a geological event.`,
  [CardId.AncientDrakon]: msg`Old enough to remember when the gods were young and afraid.`,
  [CardId.CyclopsBrute]: msg`"I see just fine. I only need to see you once."`,
  [CardId.ChariotOfAres]: msg`The wheels leave furrows in the earth that never grow back.`,
  [CardId.PegasusScout]: msg`It flies above the clouds not to hide, but because the ground bores it.`,
  [CardId.ZephyrSpirit]: msg`You cannot cage the west wind. Many have tried. The cages are still there; the wind is not.`,
  [CardId.EmberSalamander]: msg`It sleeps in the hearth. Disturb the coals and you'll meet its teeth.`,
  [CardId.CopperAutomaton]: msg`Hephaestus built it without a soul, then couldn't explain why it wept.`,

  // Rank 2
  [CardId.PsycheLeech]: msg`It feeds not on blood but on certainty, leaving its victims unsure of their own names.`,
  [CardId.AllSeeingEye]: msg`"I have looked upon every truth. I recommend ignorance."`,
  [CardId.WarChariot]: msg`The horses are trained not to flinch. The riders are trained not to look back.`,
  [CardId.PyroclastSoldier]: msg`Born in eruption. Dies in eruption. The part in between is someone else's problem.`,
  [CardId.AthenasOwl]: msg`"Wisdom is knowing which battles to fight. I am here to remind you this is not one of them."`,
  [CardId.ThalassicFiend]: msg`The deep has teeth, and they are always hungry.`,
  [CardId.NautilusGuardian]: msg`It has guarded the same reef for three thousand years. It does not know why. It does not need to.`,
  [CardId.RoyalSpear]: msg`Forged for a king who never threw it. Thrown by a soldier who never missed.`,
  [CardId.KingOfShades]: msg`He rules the dead not through fear, but through the simple truth that no one leaves.`,
  [CardId.SandGorgon]: msg`The desert is full of statues with terrified expressions. Travelers assume they're art.`,
  [CardId.ResilientPolyp]: msg`Cut it apart and each piece remembers being whole.`,
  [CardId.SerpentOfLerna]: msg`"Kill one head, two more shall rise." The math alone should terrify you.`,
  [CardId.PetrifyingRooster]: msg`It crows at dawn. By noon, the garden has new statuary.`,
  [CardId.HeatGolem]: msg`The smiths who built it are long dead. Their fire is not.`,
  [CardId.VolcanicImp]: msg`"I didn't start the fire. I just made sure it couldn't stop."`,
  [CardId.MinotaurThug]: msg`The labyrinth was built to contain him. He stays because he likes it.`,
  [CardId.StygianClaw]: msg`Forged from a river that remembers every oath ever broken.`,
  [CardId.EarthenWyrm]: msg`The earthquake was not the wyrm arriving. It was the wyrm yawning.`,
  [CardId.DesertNaga]: msg`"The sands shift. I remain."`,
  [CardId.TripleChimera]: msg`Three heads, three hungers, one terrible purpose.`,
  [CardId.HermesTrickster]: msg`"I didn't steal it. I liberated it from the burden of ownership."`,
  [CardId.TwinSerpent]: msg`They share one mind but never agree. Their prey benefits from neither opinion.`,
  [CardId.NarcissusTrap]: msg`The pool shows you what you love most. You'll never want to look away.`,
  [CardId.IronGiant]: msg`When it walks, the earth complains. When it stops, the silence is worse.`,
  [CardId.MantisChimera]: msg`Patient as prayer. Sudden as blasphemy.`,
  [CardId.TitanFrog]: msg`The marshfolk worship it. The marshfolk are wise.`,
  [CardId.CursedStag]: msg`To hunt it is to become the hunted. Artemis does not forgive trespass.`,
  [CardId.GreatHornedBeast]: msg`The mountain didn't move. Something behind the mountain did.`,
  [CardId.ToxicHydra]: msg`Its blood poisons rivers. Its breath wilts forests. Its temper is worse.`,
  [CardId.MotherNymph]: msg`She tends a garden of daughters, each one wilder than the last.`,
  [CardId.ProteanMass]: msg`It doesn't have a shape. It has all of them, and it's choosing.`,
  [CardId.CarrionHarpy]: msg`"Nothing is wasted. Everything feeds something."`,
  [CardId.GoldenGriffin]: msg`Half eagle, half lion, wholly convinced of its divine right to everything.`,
  [CardId.StoneBasilisk]: msg`The last thing its victims see is their own reflection in its eyes, already turning gray.`,
  [CardId.ScorpionOfArtemis]: msg`Sent by the huntress to remind Orion that pride has a sting.`,
  [CardId.ChaosWyvern]: msg`It obeys no master, follows no pattern, and respects no boundary.`,
  [CardId.DesertTriton]: msg`Far from the sea but never far from the storm.`,
  [CardId.CaveLurker]: msg`It has lived in the dark so long it has forgotten the sun. The sun has not forgotten it.`,
  [CardId.MarbleColossus]: msg`The sculptor carved it as a monument to peace. It disagreed.`,
  [CardId.JanusMask]: msg`One face sees what was. The other sees what will be. Both are weeping.`,
  [CardId.WraithOfTartarus]: msg`It escaped the pit once. Once was enough to learn the way.`,
  [CardId.PhantomVulture]: msg`It circles above battlefields that haven't happened yet.`,
  [CardId.GorgoSerpent]: msg`Medusa's lesser sister, but "lesser" is a generous word.`,
  [CardId.ElderDrakon]: msg`It remembers the taste of titans.`,
  [CardId.TwinHeadedOracle]: msg`"The future is certain." "The future is impossible." Both heads are always right.`,
  [CardId.NyxWing]: msg`Born from the space between stars, where even gods fear to look.`,
  [CardId.CerberusHound]: msg`Three heads, one purpose: nothing gets out.`,
  [CardId.GhastlyShade]: msg`It wears the face of someone you once trusted.`,
  [CardId.MinosJudge]: msg`"I do not judge the dead. I judge what they did while living."`,
  [CardId.HarmonyDuality]: msg`Where light meets shadow, balance is not found — it is forged.`,
  [CardId.ChaoticShade]: msg`Order is a story the living tell themselves. This is the truth beneath.`,
  [CardId.EliteMyrmidon]: msg`"We were ants once. We remember what it means to carry a hundred times our weight."`,
  [CardId.IronMyrmidon]: msg`Flesh replaced with bronze. Mercy replaced with nothing.`,
  [CardId.FrostReaver]: msg`Winter doesn't come. It is sent.`,
  [CardId.NemeanGuardian]: msg`Its hide turned aside Heracles' arrows. What chance does yours have?`,
  [CardId.HundredEyedArgus]: msg`Sleep is a luxury. Vigilance is a curse. Argus has learned to love the curse.`,
  [CardId.PhantomWraith]: msg`"I died here. Now so will everything else."`,
  [CardId.BronzeFortress]: msg`They built it to last a thousand years. It has outlasted three thousand and shows no sign of stopping.`,
  [CardId.AncientAdamantine]: msg`The metal that predates iron, that predates bronze, that predates the memory of mountains.`,

  // Rank 3
  [CardId.AchillesReborn]: msg`"My heel? I fixed that."`,
  [CardId.AtlasGunner]: msg`He held up the sky until he realized it made a better weapon.`,
  [CardId.AmazonStriker]: msg`"We don't fight like men. We fight like something men should fear."`,
  [CardId.OracleOfDelphi]: msg`"You came here for answers. You won't like them, but you came anyway."`,
  [CardId.FlameOfPrometheus]: msg`The fire that was stolen from the gods burns differently — it burns with purpose.`,
  [CardId.ShadowArtemis]: msg`The huntress needs no moonlight. The dark is her quiver.`,
  [CardId.FortuneSphinx]: msg`"Answer my riddle and pass. Fail, and become part of the question."`,
  [CardId.DaedalusPilot]: msg`"Father made the wings. I learned what he never could — how to fall."`,
  [CardId.LycaonCursed]: msg`Zeus turned him into a wolf as punishment. The wolf considers it a promotion.`,
  pyriphlegethon: msg`The river of fire does not flow. It hunts.`,
  [CardId.BoreasQueen]: msg`"The north wind is not cruel. It simply does not care."`,
  [CardId.ZeusThunderlord]: msg`When he speaks, the sky answers. When he is silent, the world holds its breath.`,
  [CardId.GaiaTitan]: msg`She does not protect the earth. She IS the earth, and she is waking up.`,
  [CardId.TaurusPrimeval]: msg`Before the labyrinth, before Minos, before Crete — there was only the bull.`,
  [CardId.AresAllfather]: msg`"Peace is the dream of the weak. War is the only honest conversation."`,
  [CardId.EternalPhoenix]: msg`"Death is not an ending. It's a warm-up."`,
  [CardId.OceanLeviathan]: msg`Poseidon built it from a nightmare he couldn't shake. The ocean has trembled ever since.`,
  [CardId.DivineColossus]: msg`It straddles the harbor not as guardian, but as warning: some doors should stay closed.`,
  [CardId.KingOfDragons]: msg`Every drakon bows. Not from loyalty — from memory.`,
  [CardId.DrakonAscendant]: msg`It shed its scales and grew something worse: ambition.`,
  [CardId.WarriorOfManyArms]: msg`Six arms. Six weapons. One overwhelming argument.`,
  [CardId.GryphonAndSprite]: msg`An unlikely alliance: one provides the wisdom, the other the wingspan.`,
  [CardId.PlumpGryphon]: msg`"I'm not fat. I'm aerodynamically generous."`,
  [CardId.GoldenGryphon]: msg`Its feathers are worth kingdoms. Its loyalty is worth more.`,
  [CardId.SpriteTrio]: msg`Alone, a nuisance. Together, a catastrophe.`,
  [CardId.PandorasJar]: msg`Hope was the last thing inside. Some say that's cruelty, not kindness.`,
  [CardId.AegisKeeper]: msg`The shield of Zeus was never meant for defense. It was meant for ending arguments.`,
  [CardId.WorldSerpent]: msg`It encircles the world not to contain it, but to hold it together.`,
  [CardId.OrichalcumGolem]: msg`Forged from the metal of Atlantis — the only thing that survived the sinking.`,
  [CardId.KrakenTerror]: msg`"Release the —" Actually, it released itself.`,
  [CardId.TentacleHorror]: msg`What lives below the kraken? Sailors who ask don't come back to tell.`,
  [CardId.WingedFury]: msg`Vengeance made flesh, feather, and fury. The guilty hear her wings in their sleep.`,
  [CardId.GrandCockatrice]: msg`Its gaze petrifies. Its breath poisons. Its mere presence is an insult to nature.`,

  // Replacement
  [CardId.TragicHero]: msg`Every story needs a hero who falls. His story needs it twice.`,
  [CardId.FrogHunter]: msg`"Kiss it? I'm going to EAT it."`,
  [CardId.LabyrinthExperiment]: msg`Daedalus' greatest failure — or his greatest success, depending on who you ask.`,
  [CardId.CrimsonChariot]: msg`Painted red not for intimidation, but to hide the stains.`,
  [CardId.ShadeCommander]: msg`"The dead follow orders better than the living. They've learned what disobedience costs."`,
  [CardId.ForgottenChimera]: msg`Even monsters can be abandoned. This one remembers.`,
  [CardId.TyrantAndBeast]: msg`The leash is a formality. Both know who is really in charge.`,
  [CardId.ScarletDrakon]: msg`Red scales, red eyes, red ruin wherever it roams.`,
  [CardId.GatesOfErebus]: msg`"Abandon hope" was merely a suggestion. The gate makes it mandatory.`,
  [CardId.SwiftBlade]: msg`You'll feel the wound before you see the sword.`,
  [CardId.IronFist]: msg`Diplomacy is the art of saying "nice doggy" until you can find a rock. This is the rock.`,
  [CardId.SilentDagger]: msg`"The loudest victories make no sound at all."`,
  [CardId.ShadowCommander]: msg`"Lead from the dark. Strike from the dark. Return to the dark."`,
  [CardId.GoldenTyrant]: msg`He gilds his throne with the crowns of lesser kings.`,
  [CardId.WarRider]: msg`"The horse knows the way to battle. I just hold on."`,
  [CardId.SacredBand]: msg`One hundred fifty pairs. Each fights not for country, but for the soul beside them.`,
  [CardId.GryphonRider]: msg`"The gryphon chose me. I'm still not sure if that's an honor or a threat."`,
  [CardId.StarVoyager]: msg`It sails not on water but on the space between constellations.`,
  [CardId.HouseOfHades]: msg`"All roads lead here eventually. I've simply removed the 'eventually.'"`,
  [CardId.WheelOfFortune]: msg`"Round and round it goes. Where it stops, nobody chose."`,
  [CardId.TragicMuse]: msg`She inspires the greatest art by inflicting the greatest suffering.`,
  [CardId.FestivalGuard]: msg`"I was hired for the party. Nobody said anything about the apocalypse."`,
  [CardId.ArenaMaster]: msg`"Two enter, one leaves. Unless I'm having a good day — then none leave."`,
  [CardId.DionysusReveler]: msg`"Wine is truth. And truth, my friend, is absolutely hammered right now."`,
  [CardId.FallenSeraph]: msg`It fell not from grace, but from boredom with perfection.`,
  [CardId.CirceEnchantress]: msg`"I don't turn men into swine. I reveal the swine they already are."`,
  [CardId.NyxSovereign]: msg`Night does not fall. Night rules, and it always has.`,

  // Tokens
  [CardId.NymphSprout]: msg`Small enough to cup in your hands. Wild enough to regret it.`,
  [CardId.BattleSprite]: msg`A fistful of fury and an attitude three times its size.`,
  [CardId.SpriteMage]: msg`It learned magic the hard way — by exploding, repeatedly.`,
  [CardId.SpriteBard]: msg`Its songs are tiny, its courage enormous, and its pitch questionable.`,
  [CardId.LittleShade]: msg`A shadow that forgot which body it belonged to.`,
  [CardId.JuniorNymph]: msg`Already tending her first flower. Already planning her first revenge.`,
  [CardId.BabyNymph]: msg`Born yesterday. Angry about it.`,
  [CardId.DaedalusGlider]: msg`Not quite flight. Not quite falling. Somewhere beautifully in between.`,
  [CardId.LycaonBeast]: msg`The wolf remembers being a man. The man wishes he didn't.`,
  [CardId.HeatFragment]: msg`A cinder that refused to cool, dreaming of the fire it once was.`,
  [CardId.ReformedProtean]: msg`It chose this shape. Ask it tomorrow and the answer will be different.`,
  [CardId.ThornyImp]: msg`Hugging it is technically possible. Technically.`,
  [CardId.ElementalSpark]: msg`The first flicker before the storm — tiny, fragile, and full of potential.`,
  [CardId.ElementalFlame]: msg`It grew from a spark into a promise. The promise: everything burns.`,
  [CardId.ElementalStorm]: msg`What began as a whisper in the clouds now roars with the voice of the sky itself.`,
  [CardId.ZealotInitiate]: msg`"I believe." Two words. Infinite consequences.`,
  [CardId.ZealotWarrior]: msg`Faith sharpened into a blade and driven through doubt's heart.`,
  [CardId.ZealotChampion]: msg`"I am the answer to every prayer you were afraid to speak."`,
  [CardId.FrostCrystalMinor]: msg`A single note of winter's song, frozen in crystal clarity.`,
  [CardId.FrostCrystalMajor]: msg`The cold gathers, the shards multiply, and the air itself begins to remember ice.`,
  [CardId.FrostCrystalGrand]: msg`An entire blizzard, compressed into silence and light.`,
};

const RANK_EMOJIS: Record<string, string> = {
  '1': '\u2694\uFE0F',
  '2': '\uD83D\uDEE1\uFE0F',
  '3': '\uD83D\uDC51',
  replacement: '\uD83D\uDD04',
};

export function getCardName(definitionId: string): string {
  const desc = CARD_NAMES[definitionId as CardId];
  return desc ? i18n.t(desc) : kebabToTitle(definitionId);
}

function kebabToTitle(id: string): string {
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getFlavorText(definitionId: string): string | undefined {
  const desc = CARD_FLAVOR_TEXT[definitionId as CardId];
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

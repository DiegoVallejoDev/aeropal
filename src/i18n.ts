import type { Lang } from "./types";

export interface Dict {
  tagline: string;
  heroTitle: string;
  heroSub: string;
  menuLabel: string;
  yourRecipes: string;
  newRecipe: string;
  begin: string;
  edit: string;
  delete: string;
  confirmDelete: string;
  statCoffee: string;
  statWater: string;
  statRatio: string;
  statTime: string;
  statTemp: string;
  stepOf: (current: number, total: number) => string;
  pause: string;
  resume: string;
  skip: string;
  back: string;
  exit: string;
  confirmExit: string;
  doneTitle: string;
  doneSub: string;
  newBrew: string;
  brewedIn: string;
  autoAdvancing: string;
  pausedLabel: string;
  soundOn: string;
  soundOff: string;
  langTo: string;
  editor: {
    createTitle: string;
    editTitle: string;
    name: string;
    namePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    coffee: string;
    water: string;
    temperature: string;
    steps: string;
    stepsEmpty: string;
    addInstruction: string;
    addTimer: string;
    addAutomatic: string;
    addCompletion: string;
    stepText: string;
    stepTip: string;
    stepTipPlaceholder: string;
    buttonText: string;
    duration: string;
    delay: string;
    autoAdvance: string;
    subtitle: string;
    icon: string;
    iconPlaceholder: string;
    moveUp: string;
    moveDown: string;
    removeStep: string;
    cancel: string;
    save: string;
    nameRequired: string;
    defaultStepsNote: string;
  };
  steps: {
    heatWater: (temp: number) => string;
    heatWaterTip: string;
    waterReady: string;
    addCoffee: (grams: number) => string;
    addCoffeeTip: string;
    coffeeAdded: string;
    position: string;
    positionTip: string;
    positionButton: string;
    bloom: (ml: number) => string;
    bloomTip: string;
    addWater: (ml: number) => string;
    addWaterTip: string;
    waterAdded: string;
    flip: string;
    flipTip: string;
    flipped: string;
    steep: string;
    steepTip: string;
    press: string;
    pressTip: (seconds: number) => string;
    complete: string;
    completeSub: string;
  };
  recipes: Record<string, { name: string; tagline: string }>;
}

const en: Dict = {
  tagline: "AeroPress companion",
  heroTitle: "Every second counts.",
  heroSub: "Guided recipes for a better cup.",
  menuLabel: "The menu",
  yourRecipes: "Your recipes",
  newRecipe: "New recipe",
  begin: "Begin",
  edit: "Edit",
  delete: "Delete",
  confirmDelete: "Delete this recipe?",
  statCoffee: "coffee",
  statWater: "water",
  statRatio: "ratio",
  statTime: "time",
  statTemp: "temp",
  stepOf: (current, total) =>
    `Step ${String(current).padStart(2, "0")} — ${String(total).padStart(2, "0")}`,
  pause: "Pause",
  resume: "Resume",
  skip: "Skip",
  back: "Back",
  exit: "Exit",
  confirmExit: "Leave this brew and return to the menu?",
  doneTitle: "Enjoy.",
  doneSub: "Your AeroPress is ready.",
  newBrew: "New brew",
  brewedIn: "brewed in",
  autoAdvancing: "Continuing",
  pausedLabel: "Paused",
  soundOn: "Sound on",
  soundOff: "Sound off",
  langTo: "Español",
  editor: {
    createTitle: "New recipe",
    editTitle: "Edit recipe",
    name: "Name",
    namePlaceholder: "e.g. Weekend pour",
    description: "Description",
    descriptionPlaceholder: "A short note on the character of this brew",
    coffee: "Coffee (g)",
    water: "Water (ml)",
    temperature: "Temp (°C)",
    steps: "Steps",
    stepsEmpty: "No custom steps yet. Leave empty to use the standard method.",
    addInstruction: "Instruction",
    addTimer: "Timer",
    addAutomatic: "Pause",
    addCompletion: "Finish",
    stepText: "Instruction",
    stepTip: "Tip",
    stepTipPlaceholder: "Optional",
    buttonText: "Button label",
    duration: "Seconds",
    delay: "Delay (ms)",
    autoAdvance: "Continue automatically",
    subtitle: "Subtitle",
    icon: "Icon",
    iconPlaceholder: "e.g. ☕",
    moveUp: "Move up",
    moveDown: "Move down",
    removeStep: "Remove step",
    cancel: "Cancel",
    save: "Save recipe",
    nameRequired: "Give the recipe a name first.",
    defaultStepsNote:
      "With no steps of its own, this recipe follows the standard AeroPress method.",
  },
  steps: {
    heatWater: (temp) =>
      `Heat water to ${temp}°C and rinse the paper filter`,
    heatWaterTip: "A rinsed filter keeps the cup clean",
    waterReady: "Water ready",
    addCoffee: (grams) =>
      `Add ${grams}g of medium-fine coffee to the chamber`,
    addCoffeeTip: "About the texture of coarse sea salt",
    coffeeAdded: "Coffee in",
    position: "Set the AeroPress on your mug, inverted",
    positionTip: "Inverted brewing prevents early dripping",
    positionButton: "In position",
    bloom: (ml) => `Pour ${ml}ml of water, stir gently three times`,
    bloomTip: "The bloom releases trapped CO₂",
    addWater: (ml) => `Add the remaining ${ml}ml of water`,
    addWaterTip: "Pour slowly, in circles",
    waterAdded: "Water added",
    flip: "Screw on the cap and flip onto your mug",
    flipTip: "Move quickly to keep every drop",
    flipped: "Flipped",
    steep: "Let it steep",
    steepTip: "Patience makes the extraction",
    press: "Press down slowly, with even weight",
    pressTip: (seconds) => `Aim for about ${seconds} seconds`,
    complete: "Enjoy.",
    completeSub: "Your AeroPress is ready.",
  },
  recipes: {
    classic: { name: "Classic", tagline: "Balanced and smooth" },
    strong: { name: "Strong", tagline: "Bold, with a longer steep" },
    light: { name: "Light", tagline: "Bright and quick" },
    iced: { name: "Iced", tagline: "Concentrated, over ice" },
  },
};

const es: Dict = {
  tagline: "compañero AeroPress",
  heroTitle: "Cada segundo cuenta.",
  heroSub: "Recetas guiadas para una mejor taza.",
  menuLabel: "La carta",
  yourRecipes: "Tus recetas",
  newRecipe: "Nueva receta",
  begin: "Comenzar",
  edit: "Editar",
  delete: "Eliminar",
  confirmDelete: "¿Eliminar esta receta?",
  statCoffee: "café",
  statWater: "agua",
  statRatio: "ratio",
  statTime: "tiempo",
  statTemp: "temp",
  stepOf: (current, total) =>
    `Paso ${String(current).padStart(2, "0")} — ${String(total).padStart(2, "0")}`,
  pause: "Pausar",
  resume: "Seguir",
  skip: "Saltar",
  back: "Atrás",
  exit: "Salir",
  confirmExit: "¿Salir de esta preparación y volver a la carta?",
  doneTitle: "Disfruta.",
  doneSub: "Tu AeroPress está listo.",
  newBrew: "Nueva preparación",
  brewedIn: "lista en",
  autoAdvancing: "Continuando",
  pausedLabel: "En pausa",
  soundOn: "Sonido activado",
  soundOff: "Sonido desactivado",
  langTo: "English",
  editor: {
    createTitle: "Nueva receta",
    editTitle: "Editar receta",
    name: "Nombre",
    namePlaceholder: "ej. Vertido de domingo",
    description: "Descripción",
    descriptionPlaceholder: "Una nota breve sobre el carácter de esta taza",
    coffee: "Café (g)",
    water: "Agua (ml)",
    temperature: "Temp (°C)",
    steps: "Pasos",
    stepsEmpty:
      "Aún sin pasos propios. Déjalo vacío para usar el método estándar.",
    addInstruction: "Instrucción",
    addTimer: "Temporizador",
    addAutomatic: "Pausa",
    addCompletion: "Final",
    stepText: "Instrucción",
    stepTip: "Consejo",
    stepTipPlaceholder: "Opcional",
    buttonText: "Texto del botón",
    duration: "Segundos",
    delay: "Espera (ms)",
    autoAdvance: "Continuar automáticamente",
    subtitle: "Subtítulo",
    icon: "Ícono",
    iconPlaceholder: "ej. ☕",
    moveUp: "Subir",
    moveDown: "Bajar",
    removeStep: "Quitar paso",
    cancel: "Cancelar",
    save: "Guardar receta",
    nameRequired: "Ponle un nombre a la receta primero.",
    defaultStepsNote:
      "Sin pasos propios, esta receta sigue el método AeroPress estándar.",
  },
  steps: {
    heatWater: (temp) =>
      `Calienta agua a ${temp}°C y enjuaga el filtro de papel`,
    heatWaterTip: "Un filtro enjuagado mantiene la taza limpia",
    waterReady: "Agua lista",
    addCoffee: (grams) =>
      `Añade ${grams}g de café de molienda media-fina`,
    addCoffeeTip: "Como sal de grano gruesa",
    coffeeAdded: "Café listo",
    position: "Coloca el AeroPress sobre tu taza, invertido",
    positionTip: "El método invertido evita goteos tempranos",
    positionButton: "En posición",
    bloom: (ml) => `Vierte ${ml}ml de agua y revuelve tres veces, suave`,
    bloomTip: "La floración libera el CO₂ atrapado",
    addWater: (ml) => `Añade los ${ml}ml restantes de agua`,
    addWaterTip: "Vierte despacio, en círculos",
    waterAdded: "Agua lista",
    flip: "Enrosca la tapa y voltea sobre tu taza",
    flipTip: "Hazlo rápido para no perder ni una gota",
    flipped: "Volteado",
    steep: "Deja reposar",
    steepTip: "La paciencia hace la extracción",
    press: "Presiona despacio, con peso parejo",
    pressTip: (seconds) => `Tómate unos ${seconds} segundos`,
    complete: "Disfruta.",
    completeSub: "Tu AeroPress está listo.",
  },
  recipes: {
    classic: { name: "Clásico", tagline: "Balanceado y suave" },
    strong: { name: "Fuerte", tagline: "Audaz, de reposo largo" },
    light: { name: "Ligero", tagline: "Brillante y rápido" },
    iced: { name: "Helado", tagline: "Concentrado, sobre hielo" },
  },
};

export const dict: Record<Lang, Dict> = { en, es };

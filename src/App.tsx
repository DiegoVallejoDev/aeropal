/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  useEffect,
  useRef,
  type SetStateAction,
  useCallback,
} from "react";
import "./App.css";
//import aeropressSvg from './aeropress.svg';
import { LottieAnimation } from "./LottieAnimation";

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState("classic");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isBrewingStarted, setIsBrewingStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [hasStartedTimerForStep, setHasStartedTimerForStep] = useState(false);
  const timerRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const recipes = {
    classic: {
      coffee: 17,
      bloom: 50,
      totalWater: 250,
      steepTime: 60,
      pressTime: 25,
    },
    strong: {
      coffee: 20,
      bloom: 60,
      totalWater: 250,
      steepTime: 90,
      pressTime: 30,
    },
    light: {
      coffee: 15,
      bloom: 45,
      totalWater: 250,
      steepTime: 45,
      pressTime: 20,
    },
    iced: {
      coffee: 22,
      bloom: 70,
      totalWater: 200,
      steepTime: 75,
      pressTime: 25,
    },
  };

  type Translations = {
    [key: string]: {
      subtitle: string;
      stepOf: string;
      recipeTitle: string;
      startBrewing: string;
      soundToggle: string;
      recipes: {
        classic: { name: string; details: string };
        strong: { name: string; details: string };
        light: { name: string; details: string };
        iced: { name: string; details: string };
      };
      getSteps: (recipe: keyof typeof recipes) => any[];
    };
  };

  const translations: Translations = {
    en: {
      subtitle: "aeropress companion",
      stepOf: "step {current} of {total}",
      recipeTitle: "Select Recipe",
      startBrewing: "Start Brewing",
      soundToggle: "Toggle Sound",
      recipes: {
        classic: {
          name: "Classic",
          details: "Balanced & smooth\n17g coffee, 1:15 ratio",
        },
        strong: {
          name: "Strong",
          details: "Bold & rich\n20g coffee, extended steep",
        },
        light: {
          name: "Light",
          details: "Bright & clean\n15g coffee, quick brew",
        },
        iced: { name: "Iced", details: "Concentrated\n22g coffee, over ice" },
      },
      getSteps: function (recipe: keyof typeof recipes) {
        const r = recipes[recipe as keyof typeof recipes];
        return [
          {
            type: "instruction",
            text: "Heat water to 200°F (93°C) and rinse your AeroPress filter",
            button: "Water Ready",
            tip: "Optimal brewing temperature for best extraction",
          },
          {
            type: "instruction",
            text: `Add ${r.coffee}g of medium-fine ground coffee to the AeroPress`,
            button: "Coffee Added",
            tip: "Grind should feel like coarse sea salt",
          },
          {
            type: "instruction",
            text: "Place AeroPress on your mug in the inverted position",
            button: "Ready to Bloom",
            tip: "Inverted method prevents early dripping",
          },
          {
            type: "timer",
            text: `Pour ${r.bloom}ml hot water, stir gently 3 times`,
            duration: 30,
            tip: "Bloom releases CO₂ for better extraction",
          },
          {
            type: "instruction",
            text: `Add remaining ${r.totalWater - r.bloom}ml of water`,
            button: "Water Added",
            tip: "Pour in slow, circular motions",
          },
          {
            type: "instruction",
            text: "Attach filter cap and flip onto your mug",
            button: "Flipped & Ready",
            tip: "Work quickly to minimize dripping",
          },
          {
            type: "timer",
            text: "Let the coffee steep and develop full flavor",
            duration: r.steepTime,
            tip: "Patience creates perfect extraction",
          },
          {
            type: "timer",
            text: "Press down slowly with steady, even pressure",
            duration: r.pressTime,
            tip: `Press should take ${r.pressTime} seconds`,
          },
          {
            type: "completion",
            text: "Perfect brew complete!",
            subtitle: "Enjoy your expertly crafted AeroPress coffee",
            button: "New Brew",
            icon: "☕",
          },
        ];
      },
    },
    es: {
      subtitle: "compañero aeropress",
      stepOf: "paso {current} de {total}",
      recipeTitle: "Seleccionar Receta",
      startBrewing: "Comenzar",
      soundToggle: "Alternar Sonido",
      recipes: {
        classic: {
          name: "Clásico",
          details: "Balanceado y suave\n17g café, ratio 1:15",
        },
        strong: {
          name: "Fuerte",
          details: "Audaz y rico\n20g café, reposo extendido",
        },
        light: {
          name: "Ligero",
          details: "Brillante y limpio\n15g café, preparación rápida",
        },
        iced: { name: "Helado", details: "Concentrado\n22g café, sobre hielo" },
      },
      getSteps: function (recipe: keyof typeof recipes) {
        const r = recipes[recipe as keyof typeof recipes];
        return [
          {
            type: "instruction",
            text: "Calienta agua a 93°C y enjuaga el filtro AeroPress",
            button: "Agua Lista",
            tip: "Temperatura óptima para mejor extracción",
          },
          {
            type: "instruction",
            text: `Añade ${r.coffee}g de café molido medio-fino al AeroPress`,
            button: "Café Añadido",
            tip: "El molido debe sentirse como sal marina gruesa",
          },
          {
            type: "instruction",
            text: "Coloca AeroPress en tu taza en posición invertida",
            button: "Listo para Floración",
            tip: "Método invertido previene goteo temprano",
          },
          {
            type: "timer",
            text: `Vierte ${r.bloom}ml de agua caliente, revuelve 3 veces suavemente`,
            duration: 30,
            tip: "La floración libera CO₂ para mejor extracción",
          },
          {
            type: "instruction",
            text: `Añade los ${r.totalWater - r.bloom}ml restantes de agua`,
            button: "Agua Añadida",
            tip: "Vierte en movimientos circulares lentos",
          },
          {
            type: "instruction",
            text: "Conecta la tapa del filtro y voltea sobre tu taza",
            button: "Volteado y Listo",
            tip: "Trabaja rápido para minimizar goteo",
          },
          {
            type: "timer",
            text: "Deja que el café repose y desarrolle sabor completo",
            duration: r.steepTime,
            tip: "La paciencia crea extracción perfecta",
          },
          {
            type: "timer",
            text: "Presiona lenta y uniformemente",
            duration: r.pressTime,
            tip: `La presión debe tomar ${r.pressTime} segundos`,
          },
          {
            type: "completion",
            text: "¡Preparación perfecta completa!",
            subtitle: "Disfruta tu café AeroPress expertamente preparado",
            button: "Nueva Preparación",
            icon: "☕",
          },
        ];
      },
    },
  };

  const playBeep = useCallback(
    (frequency = 800, duration = 200) => {
      if (!soundEnabled) return;
      try {
        const audioContext = new (window.AudioContext ||
          (window as IWindow).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration / 1000
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      } catch {
        console.log("Audio not supported");
      }
    },
    [soundEnabled]
  );

  const clearAllTimers = () => {
    if (timerRef.current) {
      if (timerRef.current !== null) {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
        }
      }
      timerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTimer = useCallback(
    (duration: SetStateAction<number>) => {
      clearAllTimers();

      setTimeLeft(duration);
      setIsTimerActive(true);
      setHasStartedTimerForStep(true);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current !== null) {
              clearInterval(timerRef.current);
            }
            timerRef.current = null;
            setIsTimerActive(false);
            playBeep(900, 600);

            // Advance to nex step after a small delay
            timeoutRef.current = setTimeout(() => {
              setCurrentStep((s) => s + 1);
              timeoutRef.current = null;
            }, 1000);
            return 0;
          }

          // Beep las 3 secs
          if (prev <= 3) {
            playBeep(1100, 200);
          }

          return prev - 1;
        });
      }, 1000);
    },
    [playBeep]
  );

  // unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [soundEnabled]);

  const nextStep = () => {
    // stop timers
    clearAllTimers();
    setIsTimerActive(false);
    setCurrentStep((prev) => prev + 1);
  };

  const resetApp = () => {
    clearAllTimers();

    setCurrentStep(0);
    setIsBrewingStarted(false);
    setIsTimerActive(false);
    setTimeLeft(0);
    setHasStartedTimerForStep(false);
  };

  // Reset timer state when step changes
  useEffect(() => {
    setHasStartedTimerForStep(false);
    setTimeLeft(0);
    setIsTimerActive(false);
  }, [currentStep]);

  const t = translations[currentLanguage];
  const steps = t.getSteps(selectedRecipe as keyof typeof recipes);
  const currentStepData = steps[currentStep] || steps[0];
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (
      currentStepData?.type === "timer" &&
      !isTimerActive &&
      isBrewingStarted &&
      !hasStartedTimerForStep
    ) {
      startTimer(currentStepData.duration);
    }
  }, [
    currentStep,
    currentStepData,
    isBrewingStarted,
    timeLeft,
    isTimerActive,
    hasStartedTimerForStep,
    startTimer,
  ]);

  const TimerComponent = ({
    duration,
    timeLeft,
  }: {
    duration: number;
    timeLeft: number;
  }) => {
    const progressPercent =
      timeLeft > 0 ? ((duration - timeLeft) / duration) * 100 : 0;
    const circumference = 2 * Math.PI * 100;
    const strokeDashoffset =
      circumference - (progressPercent / 100) * circumference;

    return (
      <div className="timer-wrapper">
        <div className="lottie-animation-space">
          {/* Aquí irán las animaciones Lottie */}
          <div className="lottie">
            <LottieAnimation />
          </div>
        </div>

        <div className="timer-circle-container">
          <svg className="timer-svg" width="240" height="240">
            <circle
              cx="120"
              cy="120"
              r="100"
              fill="none"
              stroke="var(--light-brown)"
              strokeWidth="8"
            />
            <circle
              cx="120"
              cy="120"
              r="100"
              fill="none"
              stroke="var(--soft-red)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 120 120)"
              className="timer-progress-circle"
            />
          </svg>
          <div className="timer-display">
            <span className="timer-number">{timeLeft}</span>
            <span className="timer-label">sec</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="app-container">
        <div className="header-controls">
          <button
            className="control-btn"
            onClick={() =>
              setCurrentLanguage(currentLanguage === "en" ? "es" : "en")
            }
          >
            {currentLanguage === "en" ? "ES" : "EN"}
          </button>

          <button
            className="control-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={t.soundToggle}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
        </div>

        <div className="header">
          <div className="logo">aeroPal</div>
          <div className="subtitle">{t.subtitle}</div>
        </div>

        {!isBrewingStarted ? (
          <div className="recipe-selection">
            <div className="recipe-title">{t.recipeTitle}</div>

            <div className="recipe-grid">
              {Object.entries(recipes).map(([key]) => (
                <button
                  key={key}
                  className={`recipe-card ${selectedRecipe === key ? "selected" : ""
                    }`}
                  onClick={() => setSelectedRecipe(key)}
                >
                  <div className="recipe-name">
                    {t.recipes[key as keyof typeof recipes].name}
                  </div>
                  <div className="recipe-details">
                    {t.recipes[key as keyof typeof recipes].details}
                  </div>
                </button>
              ))}
            </div>

            <button
              className="start-btn"
              onClick={() => setIsBrewingStarted(true)}
            >
              {t.startBrewing}
            </button>
          </div>
        ) : (
          currentStepData && (
            <div className="brewing-content">
              <div className="step-counter">
                {t.stepOf
                  .replace("{current}", (currentStep + 1).toString())
                  .replace("{total}", steps.length.toString())}
              </div>

              <div className="step-text">{currentStepData.text}</div>

              {currentStepData.type === "timer" ? (
                <>
                  <TimerComponent
                    duration={currentStepData.duration}
                    timeLeft={timeLeft}
                  />
                  {currentStepData.tip && (
                    <div className="step-tip">{currentStepData.tip}</div>
                  )}
                </>
              ) : currentStepData.type === "completion" ? (
                <div className="completion-content">
                  <div className="completion-icon">{currentStepData.icon}</div>
                  <div className="completion-title">{currentStepData.text}</div>
                  <div className="completion-subtitle">
                    {currentStepData.subtitle}
                  </div>
                  <button className="action-btn" onClick={resetApp}>
                    {currentStepData.button}
                  </button>
                </div>
              ) : (
                <>
                  <button className="action-btn" onClick={nextStep}>
                    {currentStepData.button}
                  </button>
                  {currentStepData.tip && (
                    <div className="step-tip">{currentStepData.tip}</div>
                  )}
                </>
              )}
            </div>
          )
        )}

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${isBrewingStarted ? progress : 0}%` }}
          />
        </div>
      </div>
    </>
  );
};

export default App;

// IWindow mock interface for window instances
interface IWindow {
  [key: string]: any;
}

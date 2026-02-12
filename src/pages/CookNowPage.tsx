import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonIcon, IonText, IonProgressBar, IonButtons, IonBackButton,
  IonCard, IonCardContent, IonChip, IonLabel
} from '@ionic/react';
import { 
  playOutline, pauseOutline, chevronForwardOutline, 
  refreshOutline, shareSocialOutline, trophyOutline,
  checkmarkCircle, timerOutline
} from 'ionicons/icons';
import { useLocation, useHistory } from 'react-router-dom';
import confetti from 'canvas-confetti';

interface CookingStep {
  action: string;
  timer: number; // in seconds
}

interface Recipe {
  name: string;
  steps: CookingStep[];
}

const CookNowPage: React.FC = () => {
  const location = useLocation<{ recipe: Recipe }>();
  const history = useHistory();
  const recipe = location.state?.recipe;
  
  // State Management
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const steps = recipe?.steps || [];
  const currentStep = steps[stepIndex];

  // 1. Text-to-Speech Logic
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // 2. Handle Step Changes
  useEffect(() => {
    if (currentStep && !isFinished) {
      speak(currentStep.action);
      setTimeLeft(currentStep.timer);
      // Auto-start timer if the step has a duration
      setIsTimerRunning(currentStep.timer > 0);
    }
  }, [stepIndex, isFinished]);

  // 3. Timer Countdown Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      speak("Time is up! You can move to the next step.");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // 4. Celebration Logic
  const handleNextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      triggerConfetti();
      speak("Congratulations! Your masterpiece is ready. It looks delicious!");
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random() - 0.2, y: Math.random() - 0.3 } });
      confetti({ ...defaults, particleCount, origin: { x: Math.random() + 0.2, y: Math.random() - 0.3 } });
    }, 250);
  };

  // 5. Social Sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I just cooked ${recipe?.name}!`,
          text: `Just finished making ${recipe?.name} with my AI Chef. It was so easy!`,
          url: window.location.origin
        });
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      alert("Sharing not supported on this browser. Time for a photo!");
    }
  };

  // --- CELEBRATION VIEW ---
  if (isFinished) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <IonIcon icon={trophyOutline} color="warning" style={{ fontSize: '80px' }} />
            <IonText color="dark">
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Chef de Cuisine!</h1>
            </IonText>
            <p style={{ fontSize: '1.2rem' }}>You finished cooking <strong>{recipe?.name}</strong>.</p>
            
            <IonCard style={{ borderRadius: '20px', marginTop: '30px' }}>
              <IonCardContent>
                <IonButton expand="block" color="primary" onClick={handleShare}>
                  <IonIcon icon={shareSocialOutline} slot="start" />
                  Share My Creation
                </IonButton>
                <IonButton expand="block" fill="clear" onClick={() => history.push('/')}>
                  Cook Something Else
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // --- COOKING STEP VIEW ---
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/recipe-results" />
          </IonButtons>
          <IonTitle>AI Sous Chef</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="ion-text-center">
          <IonChip color="primary" outline>
            <IonLabel>Step {stepIndex + 1} of {steps.length}</IonLabel>
          </IonChip>
          
          <div style={{ minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '600', lineHeight: '1.3' }}>
              {currentStep?.action}
            </h1>
          </div>

          {currentStep?.timer > 0 && (
            <div style={{ margin: '40px 0' }}>
              <div style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
              <IonProgressBar 
                value={timeLeft / currentStep.timer} 
                color={timeLeft === 0 ? "success" : "primary"}
                style={{ height: '12px', borderRadius: '10px', marginTop: '10px' }}
              />
              <div style={{ marginTop: '20px' }}>
                <IonButton 
                  fill="outline" 
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  color={isTimerRunning ? "medium" : "success"}
                >
                  <IonIcon icon={isTimerRunning ? pauseOutline : playOutline} slot="start" />
                  {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
                </IonButton>
                <IonButton fill="clear" onClick={() => setTimeLeft(currentStep.timer)}>
                  <IonIcon icon={refreshOutline} />
                </IonButton>
              </div>
            </div>
          )}

          <div style={{ marginTop: '60px' }}>
            <IonButton expand="block" size="large" onClick={handleNextStep}>
              {stepIndex === steps.length - 1 ? 'Finish Recipe' : 'Next Step'}
              <IonIcon icon={stepIndex === steps.length - 1 ? checkmarkCircle : chevronForwardOutline} slot="end" />
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CookNowPage;
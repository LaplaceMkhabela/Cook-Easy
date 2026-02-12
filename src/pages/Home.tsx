import React, { useEffect, useRef } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonText, 
  IonButton, 
  createAnimation 
} from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLIonButtonElement>(null);

  useEffect(() => {
    if (textRef.current && buttonRef.current) {
      // Create a coordinated entrance animation
      const animation = createAnimation()
        .addElement([textRef.current, buttonRef.current])
        .duration(1000)
        .easing('cubic-bezier(0.32, 0.72, 0, 1)')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(30px)', 'translateY(0px)');

      animation.play();
    }
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false}>
        <div className="app-container">
          
          {/* Top: Image Section */}
          <div className="image-hero">
            <img 
              src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=1000" 
              alt="Food Plate" 
            />
          </div>

          {/* Bottom: Orange Content Section */}
          <div className="info-card">
            {/* The SVG curve that creates the "wave" look */}
            <div className="wave-divider">
              <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                <path 
                  d="M0.00,49.98 C150.00,150.00 349.20,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" 
                  fill="#f26500"
                ></path>
              </svg>
            </div>

            <div className="content-inner" ref={textRef}>
              <IonText color="light">
                <p className="label">Let's Make</p>
                <h1 className="title">DELICIOUS FOOD</h1>
                <p className="label"></p>
              </IonText>

              <div className="dotted-divider">
                <p className="slogan">Transform how you cook</p>
              </div>

              <IonButton 
                ref={buttonRef}
                className="action-button" 
                mode="ios"
                routerLink='menu'
              >
                Get Started
              </IonButton>
            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
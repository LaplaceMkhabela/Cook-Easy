import React from 'react';
import {
  IonPage, IonContent, IonIcon, IonRow, IonCol, IonGrid,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonBadge
} from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { cameraOutline, addOutline, bulbOutline, star } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { Purchases } from '@revenuecat/purchases-capacitor';
import './MenuPage.css';

const MenuPage: React.FC = () => {
  const history = useHistory();

  const handleProtectedNavigation = async (path: string) => {
    // BYPASS FOR BROWSER TESTING
    if (!Capacitor.isNativePlatform()) {
      console.log("Web mode: Bypassing subscription check for development.");
      history.push(path);
      return;
    }

    try {
      const { customerInfo } = await Purchases.getCustomerInfo();
      // Using your specific Entitlement ID
      if (customerInfo.entitlements.active['Cook Easy'] !== undefined) {
        history.push(path);
      } else {
        history.push('/paywall');
      }
    } catch (error) {
      history.push('/paywall');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="chicken-caprese-page">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="main-title">Cook Easy</h1>
            <p className="subtitle">DELICIOUS FOOD FOR YOU</p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="features-section">
          <IonGrid>
            <IonRow>
              {/* FREE SERVICE: Upload Recipe */}
              <IonCol size="12" sizeMd="6" sizeLg="4">
                <IonCard className="feature-card upload-card" routerLink="/upload-recipe" button>
                  <IonBadge color="success" className="service-badge">FREE</IonBadge>
                  <div className="card-icon"><IonIcon icon={addOutline} /></div>
                  <IonCardHeader>
                    <IonCardTitle>Upload Recipe</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Share your favorite recipes with the community and save them locally.
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* PAID SERVICE: Video to Grocery */}
              <IonCol size="12" sizeMd="6" sizeLg="4">
                <IonCard 
                  className="feature-card video-card" 
                  button 
                  onClick={() => handleProtectedNavigation('/video-to-grocery')}
                >
                  <IonBadge color="warning" className="service-badge">
                    <IonIcon icon={star} /> PRO
                  </IonBadge>
                  <div className="card-icon"><IonIcon icon={cameraOutline} /></div>
                  <IonCardHeader>
                    <IonCardTitle>Video to Grocery</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Convert cooking videos into shopping lists instantly using AI.
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* PAID SERVICE: AI Suggestions */}
              <IonCol size="12" sizeMd="6" sizeLg="4">
                <IonCard 
                  className="feature-card ai-card" 
                  button 
                  onClick={() => handleProtectedNavigation('/ai-suggestions')}
                >
                  <IonBadge color="warning" className="service-badge">
                    <IonIcon icon={star} /> PRO
                  </IonBadge>
                  <div className="card-icon"><IonIcon icon={bulbOutline} /></div>
                  <IonCardHeader>
                    <IonCardTitle>AI Suggestions</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Get personalized recipe recommendations based on your pantry.
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MenuPage;
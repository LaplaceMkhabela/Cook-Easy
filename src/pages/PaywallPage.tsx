import React, { useEffect, useState } from 'react';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButton, IonCard, IonCardContent, IonText, IonIcon, 
  IonList, IonItem, IonLabel, IonButtons, IonBackButton, IonSpinner, IonBadge
} from '@ionic/react';
import { sparklesOutline, checkmarkCircleOutline, arrowBackOutline, flashOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { Purchases, PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { useHistory } from 'react-router-dom';

const PaywallPage: React.FC = () => {
  const history = useHistory();
  const [offering, setOffering] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        setOffering(offerings.current);
      }
    } catch (e) {
      console.error("Error loading offerings", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
      // Use your specific entitlement ID from the RevenueCat dashboard
      if (customerInfo.entitlements.active['premium_access'] !== undefined) {
        history.replace('/menu');
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        alert("Purchase failed: " + e.message);
      }
    }
  };

  const restorePurchases = async () => {
    try {
      // FIX: Destructure customerInfo from the result
      const { customerInfo } = await Purchases.restorePurchases();
      
      if (customerInfo.entitlements.active['premium_access'] !== undefined) {
        alert("Purchase restored!");
        history.replace('/menu');
      } else {
        alert("No active subscription found to restore.");
      }
    } catch (e) {
      alert("Restore failed.");
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#0f1115', '--color': 'white' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/menu" icon={arrowBackOutline} />
          </IonButtons>
          <IonTitle>Studio Kitchen Pro</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#0f1115' }}>
        <div style={{ padding: '40px 20px', textAlign: 'center', background: 'linear-gradient(180deg, #1a1d23 0%, #0f1115 100%)' }}>
          <div style={{ 
            width: '80px', height: '80px', background: 'rgba(255, 196, 9, 0.1)', 
            borderRadius: '24px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 20px' 
          }}>
            <IonIcon icon={sparklesOutline} style={{ fontSize: '40px', color: '#ffc409' }} />
          </div>
          <IonText color="light">
            <h1 style={{ fontWeight: '800', fontSize: '2rem', margin: '0' }}>Unlock Pro Tools</h1>
            <p style={{ color: '#8a8d93', marginTop: '10px' }}>Elevate your cooking experience</p>
          </IonText>
        </div>

        <IonList lines="none" style={{ background: 'transparent', padding: '0 20px' }}>
          {[
            { label: 'AI Sous Chef (Voice Control)', icon: flashOutline },
            { label: 'Smart Video to Grocery List', icon: checkmarkCircleOutline },
            { label: 'No Ads & Priority AI Support', icon: shieldCheckmarkOutline }
          ].map((feature, i) => (
            <IonItem key={i} style={{ '--background': 'rgba(255,255,255,0.03)', marginBottom: '10px', borderRadius: '12px' }}>
              <IonIcon icon={feature.icon} slot="start" color="warning" />
              <IonLabel style={{ color: 'white' }}>{feature.label}</IonLabel>
            </IonItem>
          ))}
        </IonList>

        <div style={{ padding: '20px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center' }}><IonSpinner color="warning" /></div>
          ) : (
            offering?.availablePackages.map((pkg: PurchasesPackage) => (
              <IonCard key={pkg.identifier} style={{ 
                borderRadius: '20px', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,196,9,0.3)',
                margin: '0 0 20px 0'
              }}>
                <IonCardContent style={{ textAlign: 'center' }}>
                  <IonBadge color="warning" mode="ios" style={{ marginBottom: '10px' }}>BEST VALUE</IonBadge>
                  <IonText color="light">
                    <h2 style={{ fontWeight: '700', fontSize: '1.4rem' }}>{pkg.product.title}</h2>
                  </IonText>
                  <h3 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', margin: '15px 0' }}>
                    {pkg.product.priceString}
                  </h3>
                  <IonButton 
                    expand="block" 
                    color="warning" 
                    onClick={() => handlePurchase(pkg)} 
                    style={{ fontWeight: '700', height: '50px', '--border-radius': '12px' }}
                  >
                    Start Your Pro Journey
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))
          )}

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <IonButton fill="clear" onClick={restorePurchases} size="small" color="medium">
              Restore Purchases
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PaywallPage;
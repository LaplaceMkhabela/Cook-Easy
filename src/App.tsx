import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React, { useEffect } from 'react';
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor'; // Added LOG_LEVEL
import { Capacitor } from '@capacitor/core';

// Pages
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import VideoToGroceryPage from './pages/VideoToGroceryPage';
import UploadRecipePage from './pages/UploadRecipePage';
import AISuggestionsPage from './pages/AISuggestionsPage';
import GroceryDisplayPage from './pages/GroceryDisplayPage';
import RecipeResultsPage from './pages/RecipeResultsPage';
import CookNowPage from './pages/CookNowPage';
import DealsPage from './pages/DealsPage';
import PaywallPage from './pages/PaywallPage';

/* Ionic CSS imports (kept existing) */
import '@ionic/react/css/core.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  
  useEffect(() => {
    const initRevenueCat = async () => {
      // 1. Check if we are on a real device
      if (Capacitor.isNativePlatform()) {
        try {
          // 2. Enable Debug Logs - CRITICAL for development!
          // You will see these in Xcode (Console) or Android Studio (Logcat)
          await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

          // 3. Configure with your specific platform keys
          // Replace these strings with the "Public SDK Key" from RevenueCat Settings
          const apiKey = Capacitor.getPlatform() === 'ios' 
            ? 'appl_YOUR_APPLE_SDK_KEY' 
            : 'goog_YOUR_GOOGLE_SDK_KEY';

          await Purchases.configure({ apiKey });
          
          console.log("✅ RevenueCat: Initialized successfully");
        } catch (error) {
          console.error("❌ RevenueCat: Failed to initialize", error);
        }
      } else {
        console.log("ℹ️ RevenueCat: Running in browser. Billing features are simulated.");
      }
    };

    initRevenueCat();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home" component={Home} />
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          
          <Route exact path="/menu" component={MenuPage} />
          <Route exact path="/video-to-grocery" component={VideoToGroceryPage}/>
          <Route exact path="/upload-recipe" component={UploadRecipePage} />
          <Route exact path="/ai-suggestions" component={AISuggestionsPage} />
          <Route exact path="/grocery-display" component={GroceryDisplayPage} />
          <Route exact path="/recipe-results" component={RecipeResultsPage} />
          <Route exact path="/cook-now" component={CookNowPage} />
          <Route exact path="/deals" component={DealsPage} />
          <Route exact path="/paywall" component={PaywallPage} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

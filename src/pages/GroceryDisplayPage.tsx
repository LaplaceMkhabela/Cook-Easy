import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonList, IonItem, IonLabel, IonChip, IonBadge, IonGrid,
  IonRow, IonCol, IonFab, IonFabButton, IonToast, IonText
} from '@ionic/react';
import {
  arrowBackOutline, cartOutline, shareOutline, downloadOutline,
  addOutline, checkmarkCircleOutline, storefrontOutline, cashOutline,
} from 'ionicons/icons';
import './GroceryDisplayPage.css';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  category: string;
  estimatedPrice: number;
  brand?: string;
}

interface LocationState {
  ingredients: Ingredient[];
  recipeName: string;
}

const GroceryDisplayPage: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const { ingredients, recipeName } = location.state || { ingredients: [], recipeName: 'Grocery List' };
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const totalCost = ingredients.reduce((sum, ing) => sum + (ing.estimatedPrice || 0), 0);

  const ingredientsByCategory = ingredients.reduce((acc, ingredient: Ingredient) => {
    const category = ingredient.category || 'uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const handleShareList = () => {
    const text = `Grocery List for ${recipeName}:\n` + ingredients.map(ing => `- ${ing.quantity} ${ing.unit} ${ing.name}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage('Copied to clipboard!');
      setShowToast(true);
    });
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = { produce: 'success', dairy: 'primary', meat: 'danger', pantry: 'warning' };
    return colors[cat.toLowerCase()] || 'medium';
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="grocery-toolbar">
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()} className="back-btn-round">
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{recipeName}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="grocery-display-content">
        <div className="grocery-hero">
          <div className="total-glass-card">
            <p>Estimated Total</p>
            <h1>${totalCost.toFixed(2)}</h1>
            <IonBadge color="success">{ingredients.length} Items</IonBadge>
          </div>
          
          <div className="action-row">
            <IonButton fill="clear" onClick={handleShareList} className="action-circle">
              <IonIcon icon={shareOutline} />
            </IonButton>
            <IonButton fill="clear" className="action-circle">
              <IonIcon icon={downloadOutline} />
            </IonButton>
            <IonButton fill="solid" color="success" className="shop-btn">
              <IonIcon icon={storefrontOutline}  slot="start" />
              Shop Online
            </IonButton>
          </div>
        </div>

        <div className="list-container">
          {Object.entries(ingredientsByCategory).map(([category, items]) => (
            <div key={category} className="category-group">
              <div className="category-header">
                <IonText color={getCategoryColor(category)}>
                  <h2 className="ion-text-uppercase">{category}</h2>
                </IonText>
                <div className="category-line"></div>
              </div>

              <IonList lines="none" className="modern-list">
                {items.map((ingredient: Ingredient, index: number) => (
                  <IonItem key={index} className="modern-item">
                    <div className="check-box">
                      <IonIcon icon={checkmarkCircleOutline} />
                    </div>
                    <IonLabel>
                      <h3>{ingredient.name}</h3>
                      <p>{ingredient.quantity} {ingredient.unit}</p>
                    </IonLabel>
                    <IonText slot="end" color="primary" className="item-price">
                      ${ingredient.estimatedPrice.toFixed(2)}
                    </IonText>
                  </IonItem>
                ))}
              </IonList>
            </div>
          ))}
        </div>

        <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message={toastMessage} duration={2000} position="bottom" />
      </IonContent>
    </IonPage>
  );
};

export default GroceryDisplayPage;
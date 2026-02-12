import React, { useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonButton, IonIcon, IonInput, IonChip, IonLabel, IonProgressBar, 
  IonSpinner, IonText, IonNote
} from '@ionic/react';
import { arrowBackOutline, addOutline, sparklesOutline, closeCircle, restaurantOutline, leafOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './AISuggestionsPage.css';

const AISuggestionsPage: React.FC = () => {
  const history = useHistory();
  const [currentIng, setCurrentIng] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addIngredient = () => {
    if (currentIng.trim() && !ingredients.includes(currentIng.trim())) {
      setIngredients([...ingredients, currentIng.trim()]);
      setCurrentIng('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const getAISuggestions = async () => {
    if (ingredients.length === 0) return;
    setIsProcessing(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer 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`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are a professional chef. Analyze the pantry and return a JSON object with a 'recipes' key. Return ONLY JSON.`
            },
            {
              role: "user",
              content: `I have: ${ingredients.join(", ")}. Suggest 3 recipes with detailed timed steps.`
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      history.push({
        pathname: '/recipe-results',
        state: { recipes: result.recipes, sourceIngredients: ingredients }
      });
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="ai-toolbar">
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()} className="back-btn-round">
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>AI Personal Chef</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ai-suggestions-content">
        <div className="ai-hero">
          <div className="chef-icon-wrap">
            <IonIcon icon={restaurantOutline} className="hero-main-icon" />
          </div>
          <h1>Empty your Pantry</h1>
          <p>List what you have, and I'll create the menu.</p>
        </div>

        <div className="pantry-input-container">
          <div className="modern-pantry-input">
            <IonInput
              placeholder="Add ingredient (e.g. Garlic)"
              value={currentIng}
              onIonInput={(e) => setCurrentIng(e.detail.value!)}
              onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
              className="pantry-input-field"
            />
            <IonButton fill="clear" onClick={addIngredient} className="add-ing-btn">
              <IonIcon icon={addOutline} slot="icon-only" />
            </IonButton>
          </div>

          <div className="ingredient-cloud">
            {ingredients.length === 0 && (
              <IonNote className="empty-note">Your pantry is currently empty...</IonNote>
            )}
            {ingredients.map((ing, index) => (
              <IonChip key={index} className="pantry-chip">
                <IonIcon icon={leafOutline} color="success" />
                <IonLabel>{ing}</IonLabel>
                <IonIcon icon={closeCircle} onClick={() => removeIngredient(index)} className="close-chip" />
              </IonChip>
            ))}
          </div>

          <IonButton
            expand="block"
            className="magic-generate-btn"
            disabled={ingredients.length === 0 || isProcessing}
            onClick={getAISuggestions}
          >
            {isProcessing ? (
              <IonSpinner name="dots" color="light" />
            ) : (
              <>
                <IonIcon icon={sparklesOutline} slot="start" />
                Mix Magic
              </>
            )}
          </IonButton>
        </div>

        {isProcessing && (
          <div className="ai-thinking-overlay">
            <div className="thinking-content">
              <IonSpinner name="crescent" color="primary" />
              <h3>Chef is cooking ideas...</h3>
              <IonProgressBar type="indeterminate" className="thinking-progress" />
              <p>Combining your {ingredients.length} ingredients</p>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AISuggestionsPage;
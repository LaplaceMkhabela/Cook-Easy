import React, { useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, 
  IonButton, IonIcon, IonProgressBar, IonSpinner, IonNote, IonInput, IonText
} from '@ionic/react';
import { arrowBackOutline, linkOutline, sparklesOutline, flashOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './VideoToGroceryPage.css';

const VideoToGroceryPage: React.FC = () => {
  const history = useHistory();
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAnalyzeLink = async () => {
    if (!videoUrl) return;
    setIsProcessing(true);
    setProgress(20);

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
              content: "You are a recipe assistant. Extract a JSON list of ingredients from the provided video URL. Return ONLY a JSON object with a key 'ingredients' containing an array of objects with keys: name, quantity, unit, category, and estimatedPrice (number)."
            },
            {
              role: "user",
              content: `Extract ingredients from this video: ${videoUrl}`
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      setProgress(70);
      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      const ingredientsList = result.ingredients || [];

      setProgress(100);
      history.push({
        pathname: '/grocery-display',
        state: { ingredients: ingredientsList, recipeName: "Analyzed Recipe" }
      });

    } catch (error) {
      console.error("Error calling Groq:", error);
      alert("Failed to process video. Please try a different link.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="video-toolbar">
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()} className="back-btn-round">
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>AI Video Converter</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="video-grocery-content">
        <div className="video-hero">
          <IonIcon icon={flashOutline} className="hero-sparkle" />
          <h1>Magical Grocery Lists</h1>
          <p>Paste a video link and let our AI do the shopping for you.</p>
        </div>

        <div className="input-glass-container">
          <div className="modern-input-wrapper">
            <IonIcon icon={linkOutline} className="input-icon" />
            <IonInput 
              value={videoUrl} 
              placeholder="Paste YouTube or TikTok link..." 
              onIonInput={(e) => setVideoUrl(e.detail.value!)}
              className="custom-ion-input"
            />
          </div>

          <IonButton 
            expand="block" 
            className="generate-btn"
            onClick={handleAnalyzeLink} 
            disabled={isProcessing || !videoUrl}
          >
            {isProcessing ? (
              <IonSpinner name="dots" color="light" />
            ) : (
              <>
                <IonIcon icon={sparklesOutline} slot="start" />
                Generate List
              </>
            )}
          </IonButton>
        </div>

        {isProcessing && (
          <div className="processing-overlay">
            <div className="loading-box">
              <IonSpinner name="crescent" color="primary" />
              <IonText color="light">
                <h3>Analyzing Content...</h3>
              </IonText>
              <div className="progress-wrapper">
                <IonProgressBar value={progress / 100} type="determinate" className="custom-progress" />
              </div>
              <IonNote color="medium">Llama-3-70B is identifying ingredients</IonNote>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default VideoToGroceryPage;
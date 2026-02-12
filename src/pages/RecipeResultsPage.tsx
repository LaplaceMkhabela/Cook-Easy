import React from 'react';
import {
    IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonButton, IonIcon, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonCardContent, IonBadge, IonList, IonChip, IonLabel, IonNote, IonGrid, IonRow, IonCol
} from '@ionic/react';
import { arrowBackOutline, cartOutline, playOutline, timeOutline, restaurantOutline, flameOutline, chevronForwardOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import './UploadRecipePage.css';

interface Recipe {
    name: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    prepTime: string;
    missingIngredients: string[];
}

interface LocationState {
    recipes: Recipe[];
    sourceIngredients: string[];
}

const RecipeResultsPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation<LocationState>();

    // Extract data from history state (with fallback)
    const { recipes, sourceIngredients } = location.state || { recipes: [], sourceIngredients: [] };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => history.goBack()}>
                            <IonIcon icon={arrowBackOutline} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>AI Suggestions</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                {/* Summary of what we used */}
                <div className="ion-padding-bottom">
                    <IonNote>Based on: {sourceIngredients.join(', ')}</IonNote>
                </div>

                {recipes.length > 0 ? (
                    <IonGrid>
                        <IonRow>
                            {recipes.map((recipe, index) => (
                                <IonCol size="12" sizeMd="6" key={index}>
                                    <IonCard style={{ margin: '0 0 16px 0' }}>
                                        <IonCardHeader>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <IonBadge color={
                          recipe.difficulty === 'Easy' ? 'success' : 
                          recipe.difficulty === 'Medium' ? 'warning' : 'danger'
                        }>{recipe.difficulty}</IonBadge>
                                                <IonNote><IonIcon icon={timeOutline} /> {recipe.prepTime}</IonNote>
                                            </div>
                                            <IonCardTitle>{recipe.name}</IonCardTitle>
                                        </IonCardHeader>

                                        <IonCardContent>
                                            <p>{recipe.description}</p>

                                            {/* New Missing Ingredients Section */}
                                            {recipe.missingIngredients && (
                                                <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(var(--ion-color-warning-rgb), 0.1)', borderRadius: '8px' }}>
                                                    <h6 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: 'var(--ion-color-warning-shade)' }}>
                                                        🛒 Missing Items:
                                                    </h6>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                                        {recipe.missingIngredients.map((item, i) => (
                                                            <IonChip key={i} outline color="warning" style={{ height: '24px', fontSize: '0.8rem' }}>
                                                                <IonLabel>{item}</IonLabel>
                                                            </IonChip>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <IonGrid class="ion-no-padding">
                                                <IonRow >
                                                    <IonCol size='6'>
                                                        <IonButton
                                                            expand="block"
                                                            color="secondary"
                                                            onClick={() => history.push('/deals', { items: recipe.missingIngredients })}
                                                        >
                                                            <IonIcon icon={cartOutline} slot="start" />
                                                            Shop
                                                        </IonButton>
                                                    </IonCol>
                                                  <IonCol size='6'>
                                                    <IonButton
                                                            expand="block"
                                                            color="success"
                                                            onClick={() => history.push('/cook-now', { recipe })}
                                                        >
                                                            <IonIcon icon={playOutline} slot="start" />
                                                            Cook
                                                        </IonButton>
                                                  </IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>
                ) : (
                    <div className="ion-text-center" style={{ marginTop: '50px' }}>
                        <IonIcon icon={flameOutline} style={{ fontSize: '64px', color: '#ccc' }} />
                        <h3>No recipes found</h3>
                        <p>Try adding more ingredients to your list.</p>
                        <IonButton fill="clear" onClick={() => history.goBack()}>Go Back</IonButton>
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default RecipeResultsPage;
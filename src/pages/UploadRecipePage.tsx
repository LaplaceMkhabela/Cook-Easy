import React, { useState, useRef, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonBackButton, IonSegment, IonSegmentButton, IonLabel, IonList, 
  IonItem, IonInput, IonTextarea, IonButton, IonIcon, IonCard, 
  IonCardContent, IonAlert, IonNote, IonRow, IonCol, IonGrid, IonBadge,
  IonModal, IonActionSheet
} from '@ionic/react';
import { 
  documentOutline, cameraOutline, saveOutline, addCircleOutline, 
  trashOutline, bookOutline, closeOutline, receiptOutline, createOutline,
  eyeOutline
} from 'ionicons/icons';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import './UploadRecipePage.css';

interface Ingredient {
  name: string;
  size: string;
}

const UploadRecipePage: React.FC = () => {
  const [view, setView] = useState<'upload' | 'saved'>('upload');
  const [showResult, setShowResult] = useState<{show: boolean, status: 'success' | 'failure' | 'deleted'}>({show: false, status: 'success'});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [recipeName, setRecipeName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngName, setCurrentIngName] = useState('');
  const [currentIngSize, setCurrentIngSize] = useState('');
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);

  // View/Edit State
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  useEffect(() => { loadRecipes(); }, []);

  const loadRecipes = async () => {
    const { value } = await Preferences.get({ key: 'my_recipes' });
    if (value) setSavedRecipes(JSON.parse(value));
  };

  const addIngredient = () => {
    if (currentIngName && currentIngSize) {
      setIngredients([...ingredients, { name: currentIngName, size: currentIngSize }]);
      setCurrentIngName(''); setCurrentIngSize('');
    }
  };

  const removeIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleSaveManual = async () => {
    if (!recipeName.trim()) {
      setShowResult({ show: true, status: 'failure' });
      return;
    }

    let updated;
    if (isEditing && selectedRecipe) {
      // Update existing
      updated = savedRecipes.map(r => r.id === selectedRecipe.id ? 
        { ...r, name: recipeName, ingredients, instructions } : r
      );
      setIsEditing(false);
      setSelectedRecipe(null);
    } else {
      // Create new
      const newRecipe = {
        id: Date.now(),
        name: recipeName,
        type: 'manual',
        ingredients,
        instructions,
        date: new Date().toISOString()
      };
      updated = [...savedRecipes, newRecipe];
    }

    await Preferences.set({ key: 'my_recipes', value: JSON.stringify(updated) });
    setSavedRecipes(updated);
    setShowResult({ show: true, status: 'success' });
    resetForm();
  };

  const resetForm = () => {
    setRecipeName(''); setIngredients([]); setInstructions('');
    setIsEditing(false);
  };

  const handleDelete = async (id: number) => {
    const updated = savedRecipes.filter(r => r.id !== id);
    await Preferences.set({ key: 'my_recipes', value: JSON.stringify(updated) });
    setSavedRecipes(updated);
    setSelectedRecipe(null);
    setShowResult({ show: true, status: 'deleted' });
  };

  const startEdit = (recipe: any) => {
    setRecipeName(recipe.name);
    setIngredients(recipe.ingredients || []);
    setInstructions(recipe.instructions || '');
    setIsEditing(true);
    setView('upload');
    setSelectedRecipe(recipe);
  };

  // HANDLER: PDF & Camera (Native)
  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const fileName = `recipe_${Date.now()}.pdf`;
      await Filesystem.writeFile({ path: fileName, data: reader.result as string, directory: Directory.Data });
      saveMetadata(file.name, fileName, 'pdf');
    };
    reader.readAsDataURL(file);
  };

  const handleCamera = async () => {
    const image = await Camera.getPhoto({ quality: 90, resultType: CameraResultType.Base64, source: CameraSource.Camera });
    const fileName = `scan_${Date.now()}.jpg`;
    await Filesystem.writeFile({ path: fileName, data: image.base64String!, directory: Directory.Data });
    saveMetadata('Scan ' + new Date().toLocaleDateString(), fileName, 'image');
  };

  const saveMetadata = async (name: string, file: string, type: string) => {
    const updated = [...savedRecipes, { id: Date.now(), name, file, type }];
    await Preferences.set({ key: 'my_recipes', value: JSON.stringify(updated) });
    setSavedRecipes(updated);
    setShowResult({ show: true, status: 'success' });
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="ai-toolbar">
          <IonButtons slot="start"><IonBackButton defaultHref="/menu" /></IonButtons>
          <IonTitle style={{ fontWeight: '800' }}>Studio Kitchen</IonTitle>
        </IonToolbar>
        <IonToolbar className="ai-toolbar">
          <div style={{ padding: '0 16px 10px' }}>
            <IonSegment mode="ios" value={view} onIonChange={e => { setView(e.detail.value as any); if(e.detail.value === 'upload' && !isEditing) resetForm(); }}>
              <IonSegmentButton value="upload"><IonLabel>{isEditing ? 'Edit' : 'Create'}</IonLabel></IonSegmentButton>
              <IonSegmentButton value="saved"><IonLabel>Cookbook</IonLabel></IonSegmentButton>
            </IonSegment>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {view === 'upload' ? (
          <>
            {!isEditing && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'center' }}>
                <div onClick={() => fileInputRef.current?.click()} className="quick-action-card">
                  <IonButton style={{ flex: 1 }}>
                    <IonIcon icon={documentOutline} slot="start" />
                    Upload PDF
                  </IonButton>
                  <input type="file" hidden ref={fileInputRef} accept="application/pdf" onChange={handleFileUpload} />
                </div>
                <div onClick={handleCamera} className="quick-action-card">
                  <IonButton style={{ flex: 1 }}>
                    <IonIcon icon={cameraOutline} slot="start" />
                    Scan Doc
                  </IonButton>
                </div>
              </div>
            )}

            <IonCard className="form-card">
              <IonCardContent>
                <IonItem lines="none" className="modern-input">
                  <IonLabel position="stacked">Recipe Title</IonLabel>
                  <IonInput value={recipeName} onIonInput={e => setRecipeName(e.detail.value!)} placeholder="Name your dish" />
                </IonItem>

                <div className="ingredients-section" style={{ marginTop: '20px' }}>
                  <IonNote style={{ marginLeft: '12px' }}>INGREDIENTS</IonNote>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="6"><IonInput className="modern-input-sub" placeholder="Item" value={currentIngName} onIonInput={e => setCurrentIngName(e.detail.value!)} /></IonCol>
                      <IonCol size="4"><IonInput className="modern-input-sub" placeholder="Size" value={currentIngSize} onIonInput={e => setCurrentIngSize(e.detail.value!)} /></IonCol>
                      <IonCol size="2"><IonButton fill="clear" onClick={addIngredient}><IonIcon icon={addCircleOutline} slot="icon-only" /></IonButton></IonCol>
                    </IonRow>
                  </IonGrid>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {ingredients.map((ing, i) => (
                      <IonBadge key={i} color="light" onClick={() => removeIngredient(i)}>
                        {ing.name} ({ing.size}) <IonIcon icon={closeOutline} />
                      </IonBadge>
                    ))}
                  </div>
                </div>

                <IonItem lines="none" className="modern-input" style={{ marginTop: '20px' }}>
                  <IonLabel position="stacked">Instructions</IonLabel>
                  <IonTextarea rows={4} value={instructions} onIonInput={e => setInstructions(e.detail.value!)} />
                </IonItem>

                <IonButton expand="block" mode="ios" onClick={handleSaveManual} className="main-save-btn">
                  <IonIcon icon={saveOutline} slot="start" /> {isEditing ? 'Update Recipe' : 'Save Recipe'}
                </IonButton>
                {isEditing && <IonButton expand="block" fill="clear" onClick={resetForm}>Cancel Edit</IonButton>}
              </IonCardContent>
            </IonCard>
          </>
        ) : (
          <IonList lines="none">
            {savedRecipes.map(r => (
              <IonCard key={r.id} className="recipe-list-card" onClick={() => { setSelectedRecipe(r); setShowActionSheet(true); }}>
                <IonItem lines="none" button detail={false}>
                  <div slot="start" className="recipe-thumb"><IonIcon icon={r.type === 'manual' ? bookOutline : receiptOutline} /></div>
                  <IonLabel><h2>{r.name}</h2><p>{r.type === 'manual' ? 'Manual Entry' : 'Document'}</p></IonLabel>
                  <IonIcon icon={eyeOutline} slot="end" color="medium" />
                </IonItem>
              </IonCard>
            ))}
          </IonList>
        )}

        {/* Recipe Viewer Modal */}
        <IonModal isOpen={!!selectedRecipe && !showActionSheet && !isEditing} onDidDismiss={() => setSelectedRecipe(null)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{selectedRecipe?.name}</IonTitle>
              <IonButtons slot="end"><IonButton onClick={() => setSelectedRecipe(null)}>Close</IonButton></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding bg">
            {selectedRecipe?.type === 'manual' ? (
              <>
                <h3>Ingredients</h3>
                <ul>{selectedRecipe.ingredients.map((ing: any, i: number) => <li key={i}>{ing.name} - {ing.size}</li>)}</ul>
                <h3>Instructions</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedRecipe.instructions}</p>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <IonIcon icon={documentOutline} style={{ fontSize: '64px' }} />
                <p>This is a stored {selectedRecipe?.type?.toUpperCase()} file.</p>
                <IonNote>Filename: {selectedRecipe?.file}</IonNote>
              </div>
            )}
            <IonButton expand="block" color="danger" fill="clear" onClick={() => handleDelete(selectedRecipe.id)}>
              <IonIcon icon={trashOutline} slot="start" /> Delete Recipe
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Action Sheet for Options */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header="Recipe Options"
          buttons={[
            { text: 'View Details', icon: eyeOutline, handler: () => { setShowActionSheet(false); } },
            { 
              text: 'Edit', 
              icon: createOutline, 
              disabled: selectedRecipe?.type !== 'manual',
              handler: () => { startEdit(selectedRecipe); } 
            },
            { text: 'Delete', role: 'destructive', icon: trashOutline, handler: () => { handleDelete(selectedRecipe.id); } },
            { text: 'Cancel', role: 'cancel' }
          ]}
        />

        <IonAlert 
          isOpen={showResult.show} 
          onDidDismiss={() => setShowResult({ ...showResult, show: false })} 
          header={showResult.status === 'success' ? 'Success' : showResult.status === 'deleted' ? 'Deleted' : 'Error'} 
          message={showResult.status === 'success' ? 'Changes saved!' : showResult.status === 'deleted' ? 'Recipe removed.' : 'Please enter a title.'} 
          buttons={['OK']} 
        />
      </IonContent>
    </IonPage>
  );
};

export default UploadRecipePage;
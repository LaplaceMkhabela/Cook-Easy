// pages/PromotionsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonBadge,
  IonLabel,
  IonList,
  IonItem,
  IonThumbnail,
  IonNote,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
} from '@ionic/react';
import {
  arrowBackOutline,
  cartOutline,
  starOutline,
  flameOutline,
  leafOutline,
  timeOutline,
  storefrontOutline,
  locationOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './DealsPage.css';

// Local interface replaces the groqService import
interface Ingredient {
  name: string;
  category: string;
  estimatedPrice: number;
}

interface Promotion {
  id: string;
  ingredientName: string;
  store: string;
  brand: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  validUntil: string;
  location: string;
  distance: number;
  rating: number;
  isSponsored: boolean;
  category: string;
  imageUrl: string;
}

const DealsPage: React.FC = () => {
  const history = useHistory();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load ingredients from localStorage
    const storedIngredients = localStorage.getItem('recipeIngredients');
    if (storedIngredients) {
      const parsedIngredients: Ingredient[] = JSON.parse(storedIngredients);
      setIngredients(parsedIngredients);
      
      // Generate mock promotions based on ingredients
      generatePromotions(parsedIngredients);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    filterPromotions();
  }, [searchQuery, selectedStore, promotions]);

  const generatePromotions = (ingredientsList: Ingredient[]) => {
    const stores = ['Walmart', 'Whole Foods', 'Kroger', 'Target', 'Trader Joe\'s', 'Costco'];
    const brands: Record<string, string[]> = {
      'produce': ['Organic Valley', 'Fresh Farms', 'Nature\'s Promise'],
      'dairy': ['Horizon Organic', 'Organic Valley', 'Tillamook'],
      'meat': ['Perdue', 'Tyson', 'Applegate'],
      'spices': ['McCormick', 'Badia', 'Simply Organic'],
      'pantry': ['Great Value', '365 Everyday Value', 'Kirkland Signature']
    };

    const mockPromotions: Promotion[] = [];

    ingredientsList.forEach((ingredient, index) => {
      const ingredientBrands = brands[ingredient.category] || ['Generic'];
      const store = stores[Math.floor(Math.random() * stores.length)];
      const brand = ingredientBrands[Math.floor(Math.random() * ingredientBrands.length)];
      
      const originalPrice = ingredient.estimatedPrice || 5.00;
      const discountPercentage = Math.floor(Math.random() * 30) + 10; 
      const discountedPrice = originalPrice * (1 - discountPercentage / 100);
      
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + Math.floor(Math.random() * 14) + 1);

      mockPromotions.push({
        id: `promo-${index}`,
        ingredientName: ingredient.name,
        store,
        brand,
        originalPrice,
        discountedPrice,
        discountPercentage,
        validUntil: validUntil.toISOString().split('T')[0],
        location: `${Math.floor(Math.random() * 20) + 1} miles away`,
        distance: Math.floor(Math.random() * 20) + 1,
        rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
        isSponsored: Math.random() > 0.7,
        category: ingredient.category,
        imageUrl: `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200&h=200` 
      });
    });

    setPromotions(mockPromotions);
    setFilteredPromotions(mockPromotions);
  };

  const filterPromotions = () => {
    let filtered = [...promotions];

    if (selectedStore !== 'all') {
      filtered = filtered.filter(promo => promo.store === selectedStore);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(promo => 
        promo.ingredientName.toLowerCase().includes(query) ||
        promo.store.toLowerCase().includes(query) ||
        promo.brand.toLowerCase().includes(query)
      );
    }

    setFilteredPromotions(filtered);
  };

  const calculateTotalSavings = () => {
    return promotions.reduce((total, promo) => {
      return total + (promo.originalPrice - promo.discountedPrice);
    }, 0).toFixed(2);
  };

  const getStores = () => {
    return Array.from(new Set(promotions.map(p => p.store)));
  };

  const handleAddToCart = (promotion: Promotion) => {
    alert(`Added ${promotion.ingredientName} (${promotion.brand}) to cart!`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Promotions</IonTitle>
          <IonButtons slot="end">
            <IonBadge color="danger" className="savings-badge" style={{ marginRight: '10px' }}>
              Save ${calculateTotalSavings()}
            </IonBadge>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="promotions-content">
        {isLoading ? (
          <div className="loading-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" />
            <p>Loading promotions...</p>
          </div>
        ) : (
          <>
            <IonCard className="stats-card">
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol size="4" className="stat-col" style={{ textAlign: 'center' }}>
                      <IonIcon icon={cartOutline} color="primary" />
                      <h3 style={{ margin: '5px 0' }}>{ingredients.length}</h3>
                      <p style={{ fontSize: '0.8rem', margin: 0 }}>Ingredients</p>
                    </IonCol>
                    <IonCol size="4" className="stat-col" style={{ textAlign: 'center' }}>
                      <IonIcon icon={storefrontOutline} color="secondary" />
                      <h3 style={{ margin: '5px 0' }}>{getStores().length}</h3>
                      <p style={{ fontSize: '0.8rem', margin: 0 }}>Stores</p>
                    </IonCol>
                    <IonCol size="4" className="stat-col" style={{ textAlign: 'center' }}>
                      <IonIcon icon={starOutline} color="warning" />
                      <h3 style={{ margin: '5px 0' }}>${calculateTotalSavings()}</h3>
                      <p style={{ fontSize: '0.8rem', margin: 0 }}>Savings</p>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>

            <div className="filter-section">
              <IonSearchbar
                value={searchQuery}
                onIonInput={e => setSearchQuery(e.detail.value || '')}
                placeholder="Search promotions..."
                className="promo-search"
              />

              <div className="store-filter">
                <IonSegment
                  value={selectedStore}
                  onIonChange={e => setSelectedStore(e.detail.value as string)}
                  scrollable
                >
                  <IonSegmentButton value="all">
                    <IonLabel>All Stores</IonLabel>
                  </IonSegmentButton>
                  {getStores().map(store => (
                    <IonSegmentButton key={store} value={store}>
                      <IonLabel>{store}</IonLabel>
                    </IonSegmentButton>
                  ))}
                </IonSegment>
              </div>
            </div>

            {filteredPromotions.length === 0 ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
                <IonIcon icon={storefrontOutline} style={{ fontSize: '48px', color: '#ccc' }} />
                <h3>No promotions found</h3>
                <p>Try changing your filters or search term</p>
              </div>
            ) : (
              <div className="promotions-list">
                {filteredPromotions.map(promotion => (
                  <IonCard key={promotion.id} className="promotion-card">
                    <IonCardContent>
                      <IonGrid>
                        <IonRow>
                          <IonCol size="4">
                            <IonThumbnail className="promo-thumbnail" style={{ width: '100%', height: '80px' }}>
                              <img src={promotion.imageUrl} alt={promotion.ingredientName} style={{ borderRadius: '8px' }} />
                            </IonThumbnail>
                            {promotion.isSponsored && (
                                <IonBadge color="warning" style={{ fontSize: '10px', marginTop: '5px' }}>Sponsored</IonBadge>
                            )}
                          </IonCol>
                          <IonCol size="8">
                            <div className="promo-header">
                              <h3 style={{ marginTop: 0 }}>{promotion.ingredientName}</h3>
                              <IonChip color="primary" outline style={{ height: '20px', fontSize: '10px' }}>
                                <IonLabel>{promotion.category}</IonLabel>
                              </IonChip>
                            </div>
                            
                            <p className="promo-brand" style={{ color: '#666' }}>{promotion.brand}</p>
                            
                            <div className="price-section" style={{ margin: '8px 0' }}>
                              <span className="original-price" style={{ textDecoration: 'line-through', color: '#999', marginRight: '8px' }}>
                                ${promotion.originalPrice.toFixed(2)}
                              </span>
                              <span className="discounted-price" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--ion-color-danger)' }}>
                                ${promotion.discountedPrice.toFixed(2)}
                              </span>
                            </div>
                            
                            <div className="promo-details" style={{ fontSize: '0.85rem' }}>
                              <p><IonIcon icon={storefrontOutline} /> {promotion.store} • <IonIcon icon={locationOutline} /> {promotion.location}</p>
                            </div>
                            
                            <IonButton 
                              expand="block" 
                              size="small"
                              onClick={() => handleAddToCart(promotion)}
                            >
                              <IonIcon icon={cartOutline} slot="start" />
                              Add to Cart
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DealsPage;
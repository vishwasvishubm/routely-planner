import { useState } from 'react';
import { Sparkles, MapPin, Utensils, Camera, Star, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Mock data for Kerala AI suggestions
const mockSuggestions = {
  attractions: [
    {
      id: '1',
      name: 'Alleppey Backwaters',
      category: 'Natural Beauty',
      rating: 4.9,
      price: '$$',
      duration: '4-6 hours',
      description: 'Serene backwater cruise through palm-fringed canals and traditional villages',
      image: '🛶',
    },
    {
      id: '2',
      name: 'Munnar Tea Gardens',
      category: 'Hill Station',
      rating: 4.8,
      price: '$',
      duration: '3-4 hours',
      description: 'Rolling hills covered with lush tea plantations and misty mountains',
      image: '🌿',
    },
    {
      id: '3',
      name: 'Fort Kochi',
      category: 'Historical',
      rating: 4.7,
      price: 'Free',
      duration: '2-3 hours',
      description: 'Colonial architecture, Chinese fishing nets, and vibrant art galleries',
      image: '🏰',
    },
    {
      id: '4',
      name: 'Varkala Beach',
      category: 'Beach',
      rating: 4.6,
      price: 'Free',
      duration: '4-5 hours',
      description: 'Dramatic clifftop beach with mineral springs and sunset views',
      image: '🏖️',
    },
  ],
  restaurants: [
    {
      id: '5',
      name: 'Thaff Restaurant',
      category: 'Traditional Kerala',
      rating: 4.8,
      price: '$$',
      duration: '1-2 hours',
      description: 'Authentic Kerala Sadhya served on banana leaves with 20+ dishes',
      image: '🍛',
    },
    {
      id: '6',
      name: 'Oceanos Restaurant',
      category: 'Seafood',
      rating: 4.7,
      price: '$$$',
      duration: '1-2 hours',
      description: 'Fresh catch from Arabian Sea with Kerala spices and coconut',
      image: '🦐',
    },
    {
      id: '7',
      name: 'Sree Krishna Inn',
      category: 'Local Cuisine',
      rating: 4.5,
      price: '$',
      duration: '45 min',
      description: 'Famous for Kerala breakfast - appam, puttu, and fish curry',
      image: '🥥',
    },
  ],
  hidden: [
    {
      id: '8',
      name: 'Kumbakonam Spice Market',
      category: 'Local Experience',
      rating: 4.6,
      price: '$',
      duration: '1-2 hours',
      description: 'Aromatic spice market with cardamom, pepper, and cinnamon direct from farms',
      image: '🌶️',
    },
    {
      id: '9',
      name: 'Backwater Village Homestay',
      category: 'Cultural',
      rating: 4.7,
      price: '$$',
      duration: 'Full day',
      description: 'Stay with local families, learn toddy tapping and coconut farming',
      image: '🏠',
    },
    {
      id: '10',
      name: 'Cherai Beach Dolphins',
      category: 'Wildlife',
      rating: 4.4,
      price: '$',
      duration: '2-3 hours',
      description: 'Early morning dolphin spotting cruise at secluded Cherai Beach',
      image: '🐬',
    },
  ],
};

type SuggestionCategory = 'attractions' | 'restaurants' | 'hidden';

export default function AISuggestions() {
  const [activeCategory, setActiveCategory] = useState<SuggestionCategory>('attractions');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'attractions' as const, label: 'Attractions', icon: Camera, count: mockSuggestions.attractions.length },
    { key: 'restaurants' as const, label: 'Restaurants', icon: Utensils, count: mockSuggestions.restaurants.length },
    { key: 'hidden' as const, label: 'Hidden Gems', icon: Sparkles, count: mockSuggestions.hidden.length },
  ];

  const currentSuggestions = mockSuggestions[activeCategory].filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriceColor = (price: string) => {
    switch (price) {
      case 'Free': return 'text-success';
      case '$': return 'text-success';
      case '$$': return 'text-warning';
      case '$$$': return 'text-accent';
      case '$$$$': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Kerala Travel Suggestions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover amazing destinations, authentic cuisine, and hidden gems across God's Own Country
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <Input
          placeholder="Search suggestions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.key}
              variant={activeCategory === category.key ? "default" : "outline"}
              onClick={() => setActiveCategory(category.key)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span>{category.label}</span>
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentSuggestions.map((suggestion) => (
          <Card key={suggestion.id} className="card-travel group hover:scale-[1.02] cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{suggestion.image}</div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                      {suggestion.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-current text-warning" />
                        <span>{suggestion.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {suggestion.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{suggestion.duration}</span>
                </div>
                <div className={`flex items-center space-x-1 font-medium ${getPriceColor(suggestion.price)}`}>
                  <DollarSign className="w-4 h-4" />
                  <span>{suggestion.price}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="flex-1">
                  Add to Itinerary
                </Button>
                <Button size="sm" variant="outline">
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {currentSuggestions.length === 0 && searchQuery && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No suggestions found</h3>
          <p className="text-muted-foreground mb-6">
            Try a different search term or browse all suggestions.
          </p>
          <Button variant="outline" onClick={() => setSearchQuery('')}>
            Clear Search
          </Button>
        </div>
      )}

      {/* Coming Soon Notice */}
      <Card className="bg-primary/5 border-primary/20 max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">
            Kerala-Focused AI Recommendations Coming Soon!
          </h3>
          <p className="text-sm text-muted-foreground">
            These are sample Kerala suggestions. Soon, our AI will analyze your preferences, 
            travel history, and current location to provide personalized recommendations 
            for the best Kerala experiences tailored just for you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
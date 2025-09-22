import { useState } from 'react';
import { Sparkles, MapPin, Utensils, Camera, Star, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Mock data for AI suggestions
const mockSuggestions = {
  attractions: [
    {
      id: '1',
      name: 'Tokyo Skytree',
      category: 'Landmark',
      rating: 4.8,
      price: '$$',
      duration: '2-3 hours',
      description: 'Iconic tower with panoramic city views and shopping complex',
      image: '🗼',
    },
    {
      id: '2',
      name: 'Senso-ji Temple',
      category: 'Cultural',
      rating: 4.7,
      price: 'Free',
      duration: '1-2 hours',
      description: 'Ancient Buddhist temple with traditional shopping street',
      image: '⛩️',
    },
    {
      id: '3',
      name: 'Shibuya Crossing',
      category: 'Experience',
      rating: 4.6,
      price: 'Free',
      duration: '30 min',
      description: 'World\'s busiest pedestrian crossing and vibrant district',
      image: '🚶‍♂️',
    },
  ],
  restaurants: [
    {
      id: '4',
      name: 'Sukiyabashi Jiro',
      category: 'Sushi',
      rating: 4.9,
      price: '$$$$',
      duration: '1-2 hours',
      description: 'World-renowned sushi restaurant with michelin stars',
      image: '🍣',
    },
    {
      id: '5',
      name: 'Ramen Yashichi',
      category: 'Ramen',
      rating: 4.5,
      price: '$',
      duration: '30-45 min',
      description: 'Authentic tonkotsu ramen in cozy local setting',
      image: '🍜',
    },
    {
      id: '6',
      name: 'Tempura Daikokuya',
      category: 'Tempura',
      rating: 4.6,
      price: '$$$',
      duration: '1 hour',
      description: 'Traditional tempura restaurant since 1887',
      image: '🍤',
    },
  ],
  hidden: [
    {
      id: '7',
      name: 'Omoide Yokocho',
      category: 'Nightlife',
      rating: 4.4,
      price: '$$',
      duration: '2-3 hours',
      description: 'Narrow alley with tiny yakitori stalls and bars',
      image: '🏮',
    },
    {
      id: '8',
      name: 'Kichijoji Cat Cafe',
      category: 'Unique',
      rating: 4.3,
      price: '$$',
      duration: '1 hour',
      description: 'Cozy cafe where you can relax with friendly cats',
      image: '🐱',
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
          <h1 className="text-3xl font-bold">AI Travel Suggestions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover amazing places, restaurants, and hidden gems powered by AI recommendations
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
            AI-Powered Personalization Coming Soon!
          </h3>
          <p className="text-sm text-muted-foreground">
            These are sample suggestions. Soon, our AI will analyze your preferences, 
            travel history, and current location to provide personalized recommendations 
            tailored just for you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
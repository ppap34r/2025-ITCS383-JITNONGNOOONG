import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useApp } from '../../contexts/AppContext';
import { restaurants, cuisineTypes } from '../../data/mockData';
import { ShoppingCart, Search, MapPin, Clock, Star, LogOut } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const restaurantImages: Record<string, string> = {
  'thai-street-food': 'https://images.unsplash.com/photo-1568882041008-c0954e91caba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NzI3NjkxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'japanese-sushi': 'https://images.unsplash.com/photo-1717988732486-285ea23a6f88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpfGVufDF8fHx8MTc3Mjc2OTE2NHww&ixlib=rb-4.1.0&q=80&w=1080',
  'italian-pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGl6emF8ZW58MXx8fHwxNzcyNzY5MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'thai-restaurant': 'https://images.unsplash.com/photo-1675150277436-9c7348972c11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzI3NjkxNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'japanese-ramen': 'https://images.unsplash.com/photo-1638866281450-3933540af86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHJhbWVufGVufDF8fHx8MTc3Mjc2OTE2NXww&ixlib=rb-4.1.0&q=80&w=1080',
  'american-burger': 'https://images.unsplash.com/photo-1728836485840-93054eef0f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGJ1cmdlcnxlbnwxfHx8fDE3NzI3NjkxNjV8MA&ixlib=rb-4.1.0&q=80&w=1080'
};

export default function RestaurantList() {
  const navigate = useNavigate();
  const { user, cart, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [distanceFilter, setDistanceFilter] = useState('all');

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = cuisineFilter === 'All' || restaurant.cuisine === cuisineFilter;
    const matchesDistance = distanceFilter === 'all' || 
      (distanceFilter === '1' && restaurant.distance <= 1) ||
      (distanceFilter === '2' && restaurant.distance <= 2) ||
      (distanceFilter === '5' && restaurant.distance <= 5);
    
    return matchesSearch && matchesCuisine && matchesDistance && restaurant.isActive;
  });

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl">🍔 FoodExpress</h1>
              <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/customer/orders')}
              >
                My Orders
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/customer/checkout')}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
              <Button 
                variant="ghost"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Cuisine Type" />
              </SelectTrigger>
              <SelectContent>
                {cuisineTypes.map(cuisine => (
                  <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={distanceFilter} onValueChange={setDistanceFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Distances</SelectItem>
                <SelectItem value="1">Within 1 km</SelectItem>
                <SelectItem value="2">Within 2 km</SelectItem>
                <SelectItem value="5">Within 5 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-600 mb-4">
          {filteredRestaurants.length} restaurants found
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <Card 
              key={restaurant.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/customer/restaurant/${restaurant.id}`)}
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <ImageWithFallback
                  src={restaurantImages[restaurant.image]}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2">
                  {restaurant.cuisine}
                </Badge>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-2">{restaurant.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.distance} km away</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <p className="text-xs">Min. order: ฿{restaurant.minOrder}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No restaurants found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
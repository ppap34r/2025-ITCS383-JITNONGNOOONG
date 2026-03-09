import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useApp } from '../../contexts/AppContext';
import { restaurants, menuItems } from '../../data/mockData';
import { ArrowLeft, Star, MapPin, Clock, Plus, Minus, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { toast } from 'sonner';

const menuItemImages: Record<string, string> = {
  'pad-thai': 'https://images.unsplash.com/photo-1637806930600-37fa8892069d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWQlMjB0aGFpfGVufDF8fHx8MTc3MjczNTQxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'tom-yum': 'https://images.unsplash.com/photo-1628430043175-0e8820df47c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b20lMjB5dW0lMjBzb3VwfGVufDF8fHx8MTc3Mjc2OTE5OHww&ixlib=rb-4.1.0&q=80&w=1080',
  'green-curry': 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGN1cnJ5fGVufDF8fHx8MTc3Mjc2OTE5OHww&ixlib=rb-4.1.0&q=80&w=1080',
  'mango-sticky-rice': 'https://images.unsplash.com/photo-1711161988375-da7eff032e45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHN0aWNreSUyMHJpY2V8ZW58MXx8fHwxNzcyNzY5MTk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'salmon-sashimi': 'https://images.unsplash.com/photo-1675870792392-116a80bd7ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBzYXNoaW1pfGVufDF8fHx8MTc3MjY4NDgwNXww&ixlib=rb-4.1.0&q=80&w=1080',
  'california-roll': 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxpZm9ybmlhJTIwc3VzaGklMjByb2xsfGVufDF8fHx8MTc3MjczMTkyMXww&ixlib=rb-4.1.0&q=80&w=1080',
  'spicy-tuna-roll': 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxpZm9ybmlhJTIwc3VzaGklMjByb2xsfGVufDF8fHx8MTc3MjczMTkyMXww&ixlib=rb-4.1.0&q=80&w=1080',
  'miso-soup': 'https://images.unsplash.com/photo-1628430043175-0e8820df47c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b20lMjB5dW0lMjBzb3VwfGVufDF8fHx8MTc3Mjc2OTE5OHww&ixlib=rb-4.1.0&q=80&w=1080',
  'margherita-pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGl6emF8ZW58MXx8fHwxNzcyNzY5MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'pepperoni-pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGl6emF8ZW58MXx8fHwxNzcyNzY5MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'caesar-salad': 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGN1cnJ5fGVufDF8fHx8MTc3Mjc2OTE5OHww&ixlib=rb-4.1.0&q=80&w=1080',
  'classic-burger': 'https://images.unsplash.com/photo-1728836485840-93054eef0f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGJ1cmdlcnxlbnwxfHx8fDE3NzI3NjkxNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'bbq-burger': 'https://images.unsplash.com/photo-1728836485840-93054eef0f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGJ1cmdlcnxlbnwxfHx8fDE3NzI3NjkxNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'french-fries': 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGN1cnJ5fGVufDF8fHx8MTc3Mjc2OTE5OHww&ixlib=rb-4.1.0&q=80&w=1080',
  'tonkotsu-ramen': 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW1lbnxlbnwxfHx8fDE3NDA5OTczMzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'miso-ramen': 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxyYW1lbnxlbnwxfHx8fDE3NDA5OTczMzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'tantan-ramen': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxyYW1lbnxlbnwxfHx8fDE3NDA5OTczMzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'gyoza': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW96YXxlbnwxfHx8fDE3NDA5OTczNjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'karaage': 'https://images.unsplash.com/photo-1607532941433-304659e8198a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXJhYWdlfGVufDF8fHx8MTc0MDk5NzM3MHww&ixlib=rb-4.1.0&q=80&w=1080'
};

const restaurantImages: Record<string, string> = {
  'thai-street-food': 'https://images.unsplash.com/photo-1568882041008-c0954e91caba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NzI3NjkxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'japanese-sushi': 'https://images.unsplash.com/photo-1717988732486-285ea23a6f88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpfGVufDF8fHx8MTc3Mjc2OTE2NHww&ixlib=rb-4.1.0&q=80&w=1080',
  'italian-pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGl6emF8ZW58MXx8fHwxNzcyNzY5MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'american-burger': 'https://images.unsplash.com/photo-1728836485840-93054eef0f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGJ1cmdlcnxlbnwxfHx8fDE3NzI3NjkxNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'japanese-ramen': 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW1lbnxlbnwxfHx8fDE3NDA5OTczMzF8MA&ixlib=rb-4.1.0&q=80&w=1080'
};

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart } = useApp();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const restaurant = restaurants.find(r => r.id === id);
  const menu = menuItems.filter(item => item.restaurantId === id);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Restaurant not found</p>
          <Button onClick={() => navigate('/customer/restaurants')} className="mt-4">
            Back to Restaurants
          </Button>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(menu.map(item => item.category)));

  const handleAddToCart = () => {
    if (selectedItem) {
      addToCart({
        id: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        quantity: quantity,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name
      });
      toast.success(`${selectedItem.name} added to cart`);
      setSelectedItem(null);
      setQuantity(1);
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/customer/restaurants')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={() => navigate('/customer/checkout')}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cartItemCount})
            </Button>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={restaurantImages[restaurant.image]}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span>{restaurant.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.distance} km</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <Badge>{restaurant.cuisine}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-600 mb-6">Minimum order: ฿{restaurant.minOrder}</p>
        
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-xl mb-4">{category}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menu
                .filter(item => item.category === category)
                .map(item => (
                  <Card 
                    key={item.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedItem(item);
                      setQuantity(1);
                    }}
                  >
                    <div className="flex gap-4 p-4">
                      <ImageWithFallback
                        src={menuItemImages[item.image]}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <p className="font-semibold text-blue-600">฿{item.price}</p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add to Cart Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ImageWithFallback
              src={selectedItem ? menuItemImages[selectedItem.image] : ''}
              alt={selectedItem?.name || ''}
              className="w-full h-48 object-cover rounded"
            />
            <p className="text-gray-600">{selectedItem?.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg">Price: ฿{selectedItem?.price}</span>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="font-semibold">Total: ฿{(selectedItem?.price || 0) * quantity}</span>
              <Button onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

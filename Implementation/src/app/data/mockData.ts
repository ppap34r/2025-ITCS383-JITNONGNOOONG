export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  distance: number;
  rating: number;
  image: string;
  minOrder: number;
  deliveryTime: string;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const restaurants: Restaurant[] = [
  {
    id: 'REST001',
    name: 'Bangkok Street Food',
    cuisine: 'Thai',
    distance: 0.8,
    rating: 4.5,
    image: 'thai-street-food',
    minOrder: 50,
    deliveryTime: '20-30 min',
    isActive: true
  },
  {
    id: 'REST002',
    name: 'Sushi Master',
    cuisine: 'Japanese',
    distance: 1.2,
    rating: 4.8,
    image: 'japanese-sushi',
    minOrder: 100,
    deliveryTime: '30-40 min',
    isActive: true
  },
  {
    id: 'REST003',
    name: 'Pizza Paradise',
    cuisine: 'Western',
    distance: 2.5,
    rating: 4.3,
    image: 'italian-pizza',
    minOrder: 150,
    deliveryTime: '25-35 min',
    isActive: true
  },
  {
    id: 'REST004',
    name: 'Green Garden',
    cuisine: 'Thai',
    distance: 1.8,
    rating: 4.6,
    image: 'thai-restaurant',
    minOrder: 80,
    deliveryTime: '20-30 min',
    isActive: false
  },
  {
    id: 'REST005',
    name: 'Ramen House',
    cuisine: 'Japanese',
    distance: 3.0,
    rating: 4.7,
    image: 'japanese-ramen',
    minOrder: 120,
    deliveryTime: '35-45 min',
    isActive: true
  },
  {
    id: 'REST006',
    name: 'Burger Bistro',
    cuisine: 'Western',
    distance: 0.5,
    rating: 4.4,
    image: 'american-burger',
    minOrder: 100,
    deliveryTime: '15-25 min',
    isActive: true
  }
];

export const menuItems: MenuItem[] = [
  // Bangkok Street Food
  {
    id: 'ITEM001',
    restaurantId: 'REST001',
    name: 'Pad Thai',
    description: 'Stir-fried rice noodles with shrimp, tofu, and peanuts',
    price: 120,
    image: 'pad-thai',
    category: 'Main Course'
  },
  {
    id: 'ITEM002',
    restaurantId: 'REST001',
    name: 'Tom Yum Goong',
    description: 'Spicy and sour soup with prawns',
    price: 150,
    image: 'tom-yum',
    category: 'Soup'
  },
  {
    id: 'ITEM003',
    restaurantId: 'REST001',
    name: 'Green Curry',
    description: 'Thai green curry with chicken and vegetables',
    price: 140,
    image: 'green-curry',
    category: 'Main Course'
  },
  {
    id: 'ITEM004',
    restaurantId: 'REST001',
    name: 'Mango Sticky Rice',
    description: 'Sweet sticky rice with fresh mango',
    price: 80,
    image: 'mango-sticky-rice',
    category: 'Dessert'
  },
  // Sushi Master
  {
    id: 'ITEM005',
    restaurantId: 'REST002',
    name: 'Salmon Sashimi',
    description: 'Fresh salmon slices (8 pieces)',
    price: 350,
    image: 'salmon-sashimi',
    category: 'Sashimi'
  },
  {
    id: 'ITEM006',
    restaurantId: 'REST002',
    name: 'California Roll',
    description: 'Crab, avocado, and cucumber roll',
    price: 180,
    image: 'california-roll',
    category: 'Sushi'
  },
  {
    id: 'ITEM007',
    restaurantId: 'REST002',
    name: 'Spicy Tuna Roll',
    description: 'Tuna with spicy mayo',
    price: 200,
    image: 'spicy-tuna-roll',
    category: 'Sushi'
  },
  {
    id: 'ITEM008',
    restaurantId: 'REST002',
    name: 'Miso Soup',
    description: 'Traditional Japanese soup',
    price: 60,
    image: 'miso-soup',
    category: 'Soup'
  },
  // Pizza Paradise
  {
    id: 'ITEM009',
    restaurantId: 'REST003',
    name: 'Margherita Pizza',
    description: 'Classic tomato, mozzarella, and basil',
    price: 280,
    image: 'margherita-pizza',
    category: 'Pizza'
  },
  {
    id: 'ITEM010',
    restaurantId: 'REST003',
    name: 'Pepperoni Pizza',
    description: 'Loaded with pepperoni and cheese',
    price: 320,
    image: 'pepperoni-pizza',
    category: 'Pizza'
  },
  {
    id: 'ITEM011',
    restaurantId: 'REST003',
    name: 'Caesar Salad',
    description: 'Romaine lettuce with Caesar dressing',
    price: 150,
    image: 'caesar-salad',
    category: 'Salad'
  },
  // Burger Bistro
  {
    id: 'ITEM012',
    restaurantId: 'REST006',
    name: 'Classic Burger',
    description: 'Beef patty with lettuce, tomato, and cheese',
    price: 180,
    image: 'classic-burger',
    category: 'Burger'
  },
  {
    id: 'ITEM013',
    restaurantId: 'REST006',
    name: 'BBQ Bacon Burger',
    description: 'Beef patty with BBQ sauce and bacon',
    price: 220,
    image: 'bbq-burger',
    category: 'Burger'
  },
  {
    id: 'ITEM014',
    restaurantId: 'REST006',
    name: 'French Fries',
    description: 'Crispy golden fries',
    price: 60,
    image: 'french-fries',
    category: 'Sides'
  },
  // Ramen House
  {
    id: 'ITEM015',
    restaurantId: 'REST005',
    name: 'Tonkotsu Ramen',
    description: 'Rich pork bone broth with noodles, chashu, and soft-boiled egg',
    price: 180,
    image: 'tonkotsu-ramen',
    category: 'Ramen'
  },
  {
    id: 'ITEM016',
    restaurantId: 'REST005',
    name: 'Miso Ramen',
    description: 'Miso-based broth with vegetables and tender pork',
    price: 170,
    image: 'miso-ramen',
    category: 'Ramen'
  },
  {
    id: 'ITEM017',
    restaurantId: 'REST005',
    name: 'Spicy Tan Tan Ramen',
    description: 'Sesame and chili oil based spicy ramen',
    price: 190,
    image: 'tantan-ramen',
    category: 'Ramen'
  },
  {
    id: 'ITEM018',
    restaurantId: 'REST005',
    name: 'Gyoza',
    description: 'Pan-fried dumplings (6 pieces)',
    price: 90,
    image: 'gyoza',
    category: 'Appetizer'
  },
  {
    id: 'ITEM019',
    restaurantId: 'REST005',
    name: 'Karaage',
    description: 'Japanese fried chicken',
    price: 120,
    image: 'karaage',
    category: 'Appetizer'
  }
];

export const cuisineTypes = ['All', 'Thai', 'Japanese', 'Western'];

export const adminStats = {
  dailyRevenue: 125430,
  monthlyRevenue: 3456789,
  activeCustomers: 15234,
  activeRestaurants: 456,
  activeRiders: 234,
  todayOrders: 892,
  commissionRate: 0.1
};

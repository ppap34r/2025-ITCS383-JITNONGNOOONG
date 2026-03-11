import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User, Store, Bike, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'customer',
      title: 'Customer',
      description: 'Order delicious food from your favorite restaurants',
      icon: User,
      color: 'bg-blue-500',
      path: '/customer/login'
    },
    {
      id: 'restaurant',
      title: 'Restaurant',
      description: 'Manage your menu, orders, and promotions',
      icon: Store,
      color: 'bg-green-500',
      path: '/restaurant/dashboard'
    },
    {
      id: 'rider',
      title: 'Rider',
      description: 'Accept deliveries and earn money',
      icon: Bike,
      color: 'bg-orange-500',
      path: '/rider/dashboard'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage platform operations and users',
      icon: ShieldCheck,
      color: 'bg-purple-500',
      path: '/admin/dashboard'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4">🍔 FoodExpress</h1>
          <p className="text-xl text-gray-600">Your Complete Food Delivery Platform</p>
          <p className="text-sm text-gray-500 mt-2">Select your role to continue</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card 
                key={role.id}
                className="hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(role.path)}
              >
                <CardHeader>
                  <div className={`${role.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-center">{role.title}</CardTitle>
                  <CardDescription className="text-center">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(role.path);
                    }}
                  >
                    Enter as {role.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p className="mb-2">Platform Features:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span>✅ Multi-factor Authentication</span>
            <span>✅ Real-time Order Tracking</span>
            <span>✅ Multiple Payment Methods</span>
            <span>✅ Rating System</span>
            <span>✅ Revenue Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}

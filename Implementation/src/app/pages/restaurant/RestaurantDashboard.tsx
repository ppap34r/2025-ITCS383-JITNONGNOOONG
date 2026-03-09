import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useApp } from '../../contexts/AppContext';
import { Package, UtensilsCrossed, Tag, ArrowLeft, TrendingUp } from 'lucide-react';

export default function RestaurantDashboard() {
  const navigate = useNavigate();
  const { orders } = useApp();

  // Mock restaurant data
  const restaurantId = 'REST001';
  const restaurantOrders = orders.filter(o => o.restaurantId === restaurantId);
  
  const todayRevenue = restaurantOrders
    .filter(o => o.createdAt.toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.total, 0);
  
  const pendingOrders = restaurantOrders.filter(o => 
    ['pending', 'preparing'].includes(o.status)
  ).length;

  const completedToday = restaurantOrders.filter(o => 
    o.status === 'completed' && 
    o.createdAt.toDateString() === new Date().toDateString()
  ).length;

  const menuItems = {
    REST001: 4,
    REST002: 4,
    REST003: 3
  }[restaurantId] || 0;

  const cards = [
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => navigate('/restaurant/orders')
    },
    {
      title: "Today's Revenue",
      value: `฿${todayRevenue.toFixed(0)}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Menu Items',
      value: menuItems,
      icon: UtensilsCrossed,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => navigate('/restaurant/menu')
    },
    {
      title: 'Completed Today',
      value: completedToday,
      icon: Tag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">🍔 Restaurant Portal</h1>
              <p className="text-sm text-gray-500">Bangkok Street Food</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/login')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Card 
                key={idx} 
                className={card.action ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
                onClick={card.action}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{card.title}</p>
                      <p className="text-3xl mt-2">{card.value}</p>
                    </div>
                    <div className={`${card.bgColor} p-3 rounded-full`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                className="h-24 text-lg"
                onClick={() => navigate('/restaurant/orders')}
              >
                <Package className="w-6 h-6 mr-2" />
                View Orders
              </Button>
              <Button 
                className="h-24 text-lg"
                variant="outline"
                onClick={() => navigate('/restaurant/menu')}
              >
                <UtensilsCrossed className="w-6 h-6 mr-2" />
                Manage Menu
              </Button>
              <Button 
                className="h-24 text-lg"
                variant="outline"
                onClick={() => navigate('/restaurant/promotions')}
              >
                <Tag className="w-6 h-6 mr-2" />
                Create Promotion
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {restaurantOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {restaurantOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">฿{order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 capitalize">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
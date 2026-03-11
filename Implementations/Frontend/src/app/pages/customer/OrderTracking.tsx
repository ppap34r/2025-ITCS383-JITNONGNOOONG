import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { useApp } from '../../contexts/AppContext';
import { ArrowLeft, Package, ChefHat, Bike, CheckCircle, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  pending: { label: 'Order Placed', icon: Package, color: 'bg-blue-500', progress: 25 },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'bg-orange-500', progress: 50 },
  ready: { label: 'Ready for Pickup', icon: Package, color: 'bg-purple-500', progress: 60 },
  delivering: { label: 'On the Way', icon: Bike, color: 'bg-green-500', progress: 75 },
  completed: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-600', progress: 100 },
  cancelled: { label: 'Cancelled', icon: Package, color: 'bg-red-500', progress: 0 }
};

export default function OrderTracking() {
  const navigate = useNavigate();
  const { orders, user } = useApp();

  const myOrders = orders.filter(order => order.customerId === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/customer/restaurants')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Restaurants
            </Button>
            <h1 className="text-xl">My Orders</h1>
            <div className="w-24" /> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {myOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Button onClick={() => navigate('/customer/restaurants')}>
                Start Ordering
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {myOrders.map(order => {
              const config = statusConfig[order.status];
              const Icon = config.icon;
              
              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.restaurantName}</CardTitle>
                        <p className="text-sm text-gray-500">
                          {format(order.createdAt, 'PPp')}
                        </p>
                      </div>
                      <Badge className={config.color}>{config.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Progress */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-semibold">{config.label}</span>
                      </div>
                      <Progress value={config.progress} />
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Items:</p>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>฿{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Info */}
                    <div className="pt-4 border-t">
                      <div className="flex items-start gap-2 text-sm mb-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                      {order.riderName && (
                        <p className="text-sm text-gray-600">
                          Rider: {order.riderName}
                        </p>
                      )}
                    </div>

                    {/* Total & Actions */}
                    <div className="pt-4 border-t flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-lg font-semibold">฿{order.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          Payment: {order.paymentMethod.replace('-', ' ')}
                        </p>
                      </div>
                      {order.status === 'completed' && !order.riderRating && (
                        <Button 
                          onClick={() => navigate(`/customer/rate/${order.id}`)}
                        >
                          Rate Rider
                        </Button>
                      )}
                      {order.riderRating && (
                        <Badge variant="outline" className="text-green-600">
                          ✓ Rated
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

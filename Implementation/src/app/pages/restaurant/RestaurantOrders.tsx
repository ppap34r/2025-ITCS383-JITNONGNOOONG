import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useApp } from '../../contexts/AppContext';
import { ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function RestaurantOrders() {
  const navigate = useNavigate();
  const { orders, updateOrder } = useApp();

  const restaurantId = 'REST001';
  const restaurantOrders = orders.filter(o => o.restaurantId === restaurantId);

  const handleStatusChange = (orderId: string, newStatus: any) => {
    updateOrder(orderId, { status: newStatus });
    toast.success('Order status updated');
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-blue-500',
    preparing: 'bg-orange-500',
    ready: 'bg-purple-500',
    delivering: 'bg-green-500',
    completed: 'bg-green-600',
    cancelled: 'bg-red-500'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl">Orders Management</h1>
            <Button variant="ghost" onClick={() => navigate('/restaurant/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {restaurantOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No orders yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {restaurantOrders.map(order => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Customer: {order.customerName}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4" />
                        {format(order.createdAt, 'PPp')}
                      </div>
                    </div>
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>฿{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="pt-2 border-t">
                    <p className="text-sm font-semibold mb-1">Delivery Address:</p>
                    <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-lg font-semibold">฿{order.total.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-48">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="ready">Ready for Pickup</SelectItem>
                            <SelectItem value="delivering">Delivering</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

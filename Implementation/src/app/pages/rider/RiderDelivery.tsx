import { useParams, useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useApp } from '../../contexts/AppContext';
import { ArrowLeft, MapPin, Phone, Navigation, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function RiderDelivery() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, updateOrder } = useApp();

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Order not found</p>
            <Button onClick={() => navigate('/rider/dashboard')} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCompleteDelivery = () => {
    updateOrder(order.id, { status: 'completed' });
    toast.success('Delivery completed! ฿50 earned');
    navigate('/rider/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl">Delivery Details</h1>
            <Button variant="ghost" onClick={() => navigate('/rider/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Order Status */}
          <Card className="border-2 border-orange-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order #{order.id}</CardTitle>
                <Badge className="bg-orange-500">Delivering</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-2xl font-semibold text-green-600 mb-2">฿50</p>
                <p className="text-sm text-gray-500">Delivery Fee</p>
              </div>
            </CardContent>
          </Card>

          {/* Restaurant Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pickup Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-semibold">{order.restaurantName}</p>
              <p className="text-sm text-gray-600">
                Restaurant ID: {order.restaurantId}
              </p>
              <div className="pt-3 border-t">
                <p className="text-sm font-semibold mb-2">Order Items:</p>
                {order.items.map((item, idx) => (
                  <p key={idx} className="text-sm text-gray-600">
                    {item.name} × {item.quantity}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Customer Name</p>
                <p className="font-semibold">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 text-gray-500 flex-shrink-0" />
                  <p className="text-sm">{order.deliveryAddress}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t">
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </Button>
                <Button variant="outline" className="flex-1">
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold capitalize">
                    {order.paymentMethod.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Total:</span>
                  <span className="font-semibold">฿{order.total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 pt-2 border-t">
                  {order.paymentMethod === 'credit-card' 
                    ? 'Payment already processed online'
                    : 'Customer will pay via QR code'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Complete Delivery Button */}
          <Button 
            className="w-full h-14 text-lg"
            onClick={handleCompleteDelivery}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Complete Delivery
          </Button>
        </div>
      </div>
    </div>
  );
}

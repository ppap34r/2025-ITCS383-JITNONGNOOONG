import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useApp } from '../../contexts/AppContext';
import { ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function RateRider() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, updateOrder } = useApp();
  
  const [politeness, setPoliteness] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [comment, setComment] = useState('');

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Order not found</p>
            <Button onClick={() => navigate('/customer/orders')} className="mt-4">
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (politeness === 0 || speed === 0) {
      toast.error('Please rate both politeness and speed');
      return;
    }

    updateOrder(order.id, {
      riderRating: {
        politeness,
        speed,
        comment: comment.trim() || undefined
      }
    });

    toast.success('Thank you for your rating!');
    navigate('/customer/orders');
  };

  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number; 
    onChange: (value: number) => void; 
    label: string;
  }) => (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2 mt-2">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="transition-transform hover:scale-110"
          >
            <Star 
              className={`w-8 h-8 ${
                rating <= value 
                  ? 'fill-yellow-500 text-yellow-500' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit mb-2"
            onClick={() => navigate('/customer/orders')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <CardTitle>Rate Your Rider</CardTitle>
          <p className="text-sm text-gray-500">
            Order #{order.id} • Rider: {order.riderName || 'Unknown'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <StarRating
              label="Politeness"
              value={politeness}
              onChange={setPoliteness}
            />

            <StarRating
              label="Speed of Delivery"
              value={speed}
              onChange={setSpeed}
            />

            <div>
              <Label htmlFor="comment">Additional Comments (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/customer/orders')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit Rating
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

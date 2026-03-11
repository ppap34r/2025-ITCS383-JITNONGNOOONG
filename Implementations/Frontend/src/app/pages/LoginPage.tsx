import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';

// Mock account database — in production this lives in the Java backend
const MOCK_ACCOUNTS = [
  {
    email: 'customer@foodexpress.com',
    password: 'customer123',
    role: 'customer' as const,
    id: 'CUST001',
    name: 'John Doe',
    redirect: '/customer/restaurants',
  },
  {
    email: 'sarah@foodexpress.com',
    password: 'sarah123',
    role: 'customer' as const,
    id: 'CUST002',
    name: 'Sarah Wilson',
    redirect: '/customer/restaurants',
  },
  {
    email: 'restaurant@foodexpress.com',
    password: 'restaurant123',
    role: 'restaurant' as const,
    id: 'REST001',
    name: 'Bangkok Street Food',
    restaurantId: 'REST001',
    redirect: '/restaurant/dashboard',
  },
  {
    email: 'sushi@foodexpress.com',
    password: 'sushi123',
    role: 'restaurant' as const,
    id: 'REST002',
    name: 'Sushi Master',
    restaurantId: 'REST002',
    redirect: '/restaurant/dashboard',
  },
  {
    email: 'rider@foodexpress.com',
    password: 'rider123',
    role: 'rider' as const,
    id: 'RIDER001',
    name: 'Mike Chen',
    redirect: '/rider/dashboard',
  },
  {
    email: 'admin@foodexpress.com',
    password: 'admin123',
    role: 'admin' as const,
    id: 'ADMIN001',
    name: 'Admin User',
    redirect: '/admin/dashboard',
  },
];

const ROLE_COLORS = {
  customer: { from: '#3b82f6', to: '#6366f1', label: 'Customer', emoji: '👤' },
  restaurant: { from: '#22c55e', to: '#16a34a', label: 'Restaurant', emoji: '🍽️' },
  rider: { from: '#f97316', to: '#ea580c', label: 'Rider', emoji: '🛵' },
  admin: { from: '#a855f7', to: '#7c3aed', label: 'Administrator', emoji: '🛡️' },
};

type Step = 'credentials' | 'otp';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<Step>('credentials');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedAccount, setMatchedAccount] = useState<typeof MOCK_ACCOUNTS[0] | null>(null);
  const [error, setError] = useState('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const account = MOCK_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
      );

      if (!account) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      setMatchedAccount(account);
      setStep('otp');
      setLoading(false);
      toast.success('OTP sent to your registered mobile number');
    }, 900);
  };

  const handleOTPVerify = () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (!matchedAccount) return;
      setUser({
        id: matchedAccount.id,
        role: matchedAccount.role,
        name: matchedAccount.name,
        email: matchedAccount.email,
        restaurantId: (matchedAccount as any).restaurantId,
      });
      toast.success(`Welcome back, ${matchedAccount.name}!`);
      navigate(matchedAccount.redirect);
    }, 700);
  };

  const roleInfo = matchedAccount ? ROLE_COLORS[matchedAccount.role] : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-orange-500 to-orange-400 shadow-lg">
            <span style={{ fontSize: 34 }}>🍔</span>
          </div>
          <h1 className="text-gray-900" style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Food<span className="text-orange-500">Express</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {step === 'credentials' ? 'Sign in to your account' : 'Two-factor verification'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 bg-white shadow-2xl border border-gray-100">

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-orange-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-center rounded-xl py-2 px-3 bg-red-50 text-red-600 border border-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
              </button>

              {/* Demo accounts */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-xs mb-3 text-gray-500">— Demo Accounts —</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '👤 Customer', email: 'customer@foodexpress.com', password: 'customer123' },
                    { label: '🍽️ Restaurant', email: 'restaurant@foodexpress.com', password: 'restaurant123' },
                    { label: '🛵 Rider', email: 'rider@foodexpress.com', password: 'rider123' },
                    { label: '🛡️ Admin', email: 'admin@foodexpress.com', password: 'admin123' },
                  ].map((demo) => (
                    <button
                      key={demo.email}
                      type="button"
                      onClick={() => { setEmail(demo.email); setPassword(demo.password); setError(''); }}
                      className="py-2 px-3 rounded-xl text-xs transition-all text-left bg-gray-50 border border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300"
                    >
                      <span>{demo.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs mt-3 text-gray-400">Click a demo account to auto-fill credentials</p>
              </div>

              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => navigate('/customer/register')}
                  className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                >
                  New customer? Create an account →
                </button>
              </div>
            </form>
          ) : (
            /* OTP Step */
            <div className="space-y-6">
              {/* Detected role badge */}
              {roleInfo && (
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl border"
                    style={{ background: `${roleInfo.from}10`, borderColor: `${roleInfo.from}40` }}
                  >
                    <span style={{ fontSize: 28 }}>{roleInfo.emoji}</span>
                    <div>
                      <p className="text-gray-900 text-sm font-semibold">{matchedAccount?.name}</p>
                      <p className="text-xs" style={{ color: roleInfo.from }}>{roleInfo.label} Account</p>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    Enter the 6-digit code sent to your phone
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <p className="text-center text-xs text-gray-400">
                Demo: any 6-digit code will work
              </p>

              <button
                onClick={handleOTPVerify}
                disabled={loading || otp.length !== 6}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Verify & Sign In</span><ArrowRight className="w-4 h-4" /></>}
              </button>

              <button
                onClick={() => { setStep('credentials'); setOtp(''); setMatchedAccount(null); }}
                className="w-full py-2 rounded-xl text-sm text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all"
              >
                ← Back to Login
              </button>
            </div>
          )}
        </div>

        <p className="text-center mt-6 text-xs text-gray-400">
          © 2026 FoodExpress · All rights reserved
        </p>
      </div>
    </div>
  );
}

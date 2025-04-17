import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CreditCard, Mail, Map, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAddressInfo, updateAddress } from '@/api/addressApi';

// Define form validation schema
const checkoutFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  cardNumber: z.string(),
  cardExpiry: z.string(),
  cardCvc: z.string(),
  specialInstructions: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormValues) => void;
  isProcessing: boolean;
  userData?: {
    fullName?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  } | null;
}

const CheckoutForm = ({ onSubmit, isProcessing, userData }: CheckoutFormProps) => {
  const navigate = useNavigate();
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);
  const isLoggedIn = !!userData;
  const [addressData, setAddressData] = useState<any>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      specialInstructions: '',
    },
  });

  useEffect(() => {
    const fetchAddressData = async () => {
      if (isLoggedIn) {
        try {
          const data = await getAddressInfo();
          setAddressData(data);

          if (data.address) {
            const addressParts = data.address.split(',');
            form.setValue('address', addressParts[0]?.trim() || '');
            form.setValue('city', addressParts[1]?.trim() || '');
            form.setValue('state', addressParts[2]?.trim() || '');
            form.setValue('zipCode', addressParts[3]?.trim() || '');
            setIsAddressExpanded(true);
          }
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      }
    };

    fetchAddressData();
  }, [isLoggedIn, form]);

  const handleAddressUpdate = async () => {
    const values = form.getValues();
    const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.zipCode}`.trim();

    try {
      await updateAddress(fullAddress);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const { cardNumber, cardExpiry, cardCvc } = form.getValues();

    const isValidCard = /^\d{16}$/.test(cardNumber || '');
    const isValidExpiry = /^\d{2}\/\d{2}$/.test(cardExpiry || '');
    const isValidCvc = /^\d{3,4}$/.test(cardCvc || '');

    if (!isValidCard || !isValidExpiry || !isValidCvc) {
      alert('Please fill all card information correctly.');
      return;
    }

    if (isLoggedIn) {
      navigate('/order-success');
    }
  };

  const handleProceedOrder = () => {
    const { cardNumber, cardExpiry, cardCvc } = form.getValues();

    const isValidCard = /^\d{16}$/.test(cardNumber || '');
    const isValidExpiry = /^\d{2}\/\d{2}$/.test(cardExpiry || '');
    const isValidCvc = /^\d{3,4}$/.test(cardCvc || '');

    if (!isValidCard || !isValidExpiry || !isValidCvc) {
      alert('Please fill all card information correctly.');
      return;
    }

    window.location.href = 'http://localhost:8080/order-success';
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-coffee-green/10 shadow-sm">
      <Form {...form}>
        <form onSubmit={handleCheckout} className="space-y-6">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-coffee-green flex items-center gap-2">
              <User size={20} />
              <span>Contact Information</span>
              {!isLoggedIn && (
                <span className="text-sm font-normal ml-2">
                  Already have an account?{' '}
                  <Link to="/login?returnUrl=/checkout" className="text-coffee-green underline">
                    Sign in
                  </Link>
                </span>
              )}
            </h2>

            {isLoggedIn ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <FormLabel>Full Name</FormLabel>
                  <div className="h-10 px-4 py-2 border border-coffee-green/20 rounded bg-coffee-green/5 flex items-center">
                    {userData?.fullName}
                  </div>
                </div>
                <div>
                  <FormLabel>Email</FormLabel>
                  <div className="h-10 px-4 py-2 border border-coffee-green/20 rounded bg-coffee-green/5 flex items-center">
                    {userData?.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-coffee-brown">Please sign in to continue with your checkout</p>
              </div>
            )}
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-coffee-green flex items-center gap-2">
                <Map size={20} />
                <span>Shipping Address</span>
              </h2>
              <button
                type="button"
                className="text-sm text-coffee-green underline"
                onClick={() => setIsAddressExpanded(!isAddressExpanded)}
              >
                {isAddressExpanded ? 'Hide' : 'Add address (optional)'}
              </button>
            </div>

            {isAddressExpanded && (
              <div className="space-y-4 animate-in fade-in">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {isLoggedIn && (
                  <Button
                    type="button"
                    size="sm"
                    className="bg-coffee-green hover:bg-coffee-green/90 text-white"
                    onClick={handleAddressUpdate}
                  >
                    Save Address
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Card Fields */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-coffee-green flex items-center gap-2">
              <CreditCard size={20} />
              <span>Card Information</span>
            </h2>
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input maxLength={16} placeholder="1234567812345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cardExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input maxLength={5} placeholder="MM/YY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cardCvc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVC</FormLabel>
                    <FormControl>
                      <Input maxLength={4} placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-coffee-green flex items-center gap-2">
              <Mail size={20} />
              <span>Special Instructions</span>
            </h2>
            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any notes?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Buttons */}
          <Button
            type="submit"
            size="lg"
            className="w-full mt-6 bg-green-800 hover:bg-green-900 text-white"
            loading={isProcessing}
            disabled={!isLoggedIn}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutForm;

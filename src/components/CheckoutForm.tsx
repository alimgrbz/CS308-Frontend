import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ButtonCustom } from '@/components/ui/button-custom';
import { CreditCard, Mail, Map, User } from 'lucide-react';
import { Link } from 'react-router-dom';

// Define form validation schema
const checkoutFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Expiry date must be in MM/YY format'),
  cardCvc: z.string().regex(/^\d{3,4}$/, 'CVC must be 3 or 4 digits'),
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
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: userData?.fullName || '',
      email: userData?.email || '',
      address: userData?.address || '',
      city: userData?.city || '',
      state: userData?.state || '',
      zipCode: userData?.zipCode || '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      specialInstructions: '',
    },
  });

  useEffect(() => {
    if (userData?.address) {
      setIsAddressExpanded(true);
    }
  }, [userData]);

  const handleSubmit = (values: CheckoutFormValues) => {
    onSubmit(values);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-coffee-green/10 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Contact Information */}
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
              <div className="text-coffee-brown font-medium text-base">
                Continue your order, {userData?.fullName || 'Guest'}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-coffee-brown">Please sign in to continue with your checkout</p>
              </div>
            )}
          </div>

          {/* Optional Shipping Address */}
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
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-coffee-green flex items-center gap-2">
              <CreditCard size={20} />
              <span>Payment Details</span>
            </h2>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        {...field}
                        maxLength={16}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
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
                      <FormLabel>Expiry Date (MM/YY)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MM/YY"
                          {...field}
                          maxLength={5}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 2) {
                              value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
                            }
                            field.onChange(value);
                          }}
                        />
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
                        <Input
                          placeholder="123"
                          {...field}
                          maxLength={4}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Special Instructions */}
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
                    <Textarea
                      placeholder="Add any special instructions or notes here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <ButtonCustom
            type="submit"
            size="lg"
            className="w-full mt-6"
            loading={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </ButtonCustom>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutForm;

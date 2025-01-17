'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useAuth, useUser } from '@clerk/nextjs'

type PaymentMethod = 'venmo' | 'zelle' | 'cashapp';
type AccountKey = 'uber' | 'lyft';

const initialFormState = {
  name: '',
  phone: '',
  flightNumber: '',
  destination: '',
  arrivalDate: '',
  arrivalTime: '',
  paymentMethods: {
    venmo: false,
    zelle: false,
    cashapp: false,
  },
  accounts: {
    uber: false,
    lyft: false,
  },
};

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {isLoaded, isSignedIn, signOut, userId} = useAuth();
  const { user } = useUser();
  const [formData, setFormData] = useState(initialFormState);
  const isBrownEmail = user?.primaryEmailAddress?.emailAddress?.endsWith('@brown.edu');

  const handleSignOut = async () => {
    console.log("Attempting to sign out...");
    try {
      await signOut(); // Sign out the user
      console.log("Sign out successful, redirecting to sign-in...");
      router.push('/sign-in'); // Redirect to the sign-in page
    } catch (error) {
      console.error("Error signing out:", error); // Log any errors
    }
  };

  useEffect(() => {
    // Logic to restore form data if needed
    if (searchParams) {
      try {
        const savedName = searchParams.get('name');
        if (savedName) {
          setFormData((prev) => ({
            ...prev,
            name: savedName,
            phone: searchParams.get('phone') || '',
            flightNumber: searchParams.get('flightNumber') || '',
            destination: searchParams.get('destination') || '',
            arrivalDate: searchParams.get('arrivalDate') || '',
            arrivalTime: searchParams.get('arrivalTime') || '',
            paymentMethods: JSON.parse(searchParams.get('paymentMethods') || '{}') || initialFormState.paymentMethods,
            accounts: JSON.parse(searchParams.get('accounts') || '{}') || initialFormState.accounts,
          }));
        }
      } catch (error) {
        console.error('Error restoring form data:', error);
        setFormData(initialFormState);
      }
    }
  }, [searchParams]);

  // Render logic based on authentication state
  if (isLoaded && (!isSignedIn || !isBrownEmail)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="absolute top-4 right-4">
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            Please sign in with your Brown University email address to access this form.
          </p>
          {isSignedIn && !isBrownEmail && (
            <p className="text-red-600 mb-4">
              You are currently signed in with a non-Brown email address.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show loading state while auth is being checked
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const queryParams = new URLSearchParams();
    
    // Add all form data to query parameters
    queryParams.append('name', formData.name);
    queryParams.append('phone', formData.phone);
    queryParams.append('flightNumber', formData.flightNumber);
    queryParams.append('destination', formData.destination);
    queryParams.append('arrivalDate', formData.arrivalDate);
    queryParams.append('arrivalTime', formData.arrivalTime); // Ensure this is in HH:mm format
    queryParams.append('paymentMethods', JSON.stringify(formData.paymentMethods));
    queryParams.append('accounts', JSON.stringify(formData.accounts));

    router.push(`/success?${queryParams.toString()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedValue = value.length > 6
      ? `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
      : value.length > 3
      ? `(${value.slice(0, 3)}) ${value.slice(3)}`
      : value;

    setFormData({ ...formData, phone: formattedValue });
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method],
      },
    }));
  };

  const handleAccountChange = (account: AccountKey) => {
    setFormData((prev) => ({
      ...prev,
      accounts: {
        ...prev.accounts,
        [account]: !prev.accounts[account],
      },
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute top-4 left-4">
        <h1 className="text-2xl font-bold">Bear Force One</h1>
      </div>
      <div className="absolute top-4 right-4">
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[350px] mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Travel Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-base">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Christina Paxson"
              required
              className="text-base placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-base">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="(123) 456-7890"
              required
              className="text-base placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="flightNumber" className="text-base">Flight Number</Label>
            <Input
              id="flightNumber"
              name="flightNumber"
              value={formData.flightNumber}
              onChange={handleChange}
              placeholder="AA123"
              required
              className="text-base placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="destination" className="text-base">Destination</Label>
            <Select 
              name="destination" 
              value={formData.destination}
              onValueChange={(value) => handleChange({ target: { name: 'destination', value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tf_green">T.F. Green</SelectItem>
                <SelectItem value="boston_logan">Boston Logan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="arrivalDate" className="text-base">Estimated Arrival Date</Label>
            <Input
              id="arrivalDate"
              name="arrivalDate"
              type="date"
              value={formData.arrivalDate}
              onChange={handleChange}
              min="2025-01-01"  // Optional: limit earliest date
              max="2025-12-31"  // Optional: limit latest date
              required
              className="text-base"
            />
          </div>
          <div>
            <Label htmlFor="arrivalTime" className="text-base">Estimated Arrival Time</Label>
            <Input
              id="arrivalTime"
              name="arrivalTime"
              type="time"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
              className="text-base"
            />
          </div>
          <div>
            <Label className="text-base">Payment Methods</Label>
            <div className="flex space-x-4">
              <label className="flex items-center text-base">
                <input
                  type="checkbox"
                  checked={formData.paymentMethods.venmo}
                  onChange={() => handlePaymentMethodChange('venmo')}
                  className="mr-2"
                />
                Venmo
              </label>
              <label className="flex items-center text-base">
                <input
                  type="checkbox"
                  checked={formData.paymentMethods.zelle}
                  onChange={() => handlePaymentMethodChange('zelle')}
                  className="mr-2"
                />
                Zelle
              </label>
              <label className="flex items-center text-base">
                <input
                  type="checkbox"
                  checked={formData.paymentMethods.cashapp}
                  onChange={() => handlePaymentMethodChange('cashapp')}
                  className="mr-2"
                />
                Cash App
              </label>
            </div>
          </div>
          <div>
            <Label className="text-base">Which accounts do you have?</Label>
            <div className="flex space-x-4">
              <label className="flex items-center text-base">
                <input
                  type="checkbox"
                  checked={formData.accounts.uber}
                  onChange={() => handleAccountChange('uber')}
                  className="mr-2"
                />
                Uber
              </label>
              <label className="flex items-center text-base">
                <input
                  type="checkbox"
                  checked={formData.accounts.lyft}
                  onChange={() => handleAccountChange('lyft')}
                  className="mr-2"
                />
                Lyft
              </label>
            </div>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};

// Wrap the Home component in a Suspense boundary
const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Home />
  </Suspense>
);

export default App;
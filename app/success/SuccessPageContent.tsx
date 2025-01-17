'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

const destinationMapping: { [key: string]: string } = {
  tf_green: 'T.F. Green',
  boston_logan: 'Boston Logan',
  // Add more mappings as needed
};

export const SuccessPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<any | null>(null);

  useEffect(() => {
    const queryData = Object.fromEntries(searchParams.entries());
    if (queryData) {
      setFormData({
        name: queryData.name || '',
        phone: queryData.phone || '',
        flightNumber: queryData.flightNumber || '',
        destination: destinationMapping[queryData.destination] || queryData.destination,
        arrivalDate: queryData.arrivalDate || '',
        arrivalTime: queryData.arrivalTime || '',
        paymentMethod: JSON.parse(queryData.paymentMethods || '{}'),
        accounts: JSON.parse(queryData.accounts || '{}'),
      });
    }
  }, [searchParams]);

  const handleEdit = () => {
    router.push('/');
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submission Successful</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Travel Information</h2>
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Phone:</strong> {formData.phone}</p>
        <p><strong>Flight Number:</strong> {formData.flightNumber}</p>
        <p><strong>Destination:</strong> {formData.destination}</p>
        <p><strong>Arrival Date:</strong> {formData.arrivalDate}</p>
        <p><strong>Arrival Time:</strong> {new Date(`${formData.arrivalDate}T${formData.arrivalTime}`).toLocaleTimeString()}</p>
        <p><strong>Payment Method:</strong> {formData.paymentMethod.venmo ? 'Venmo ' : ''}{formData.paymentMethod.zelle ? 'Zelle ' : ''}{formData.paymentMethod.cashapp ? 'Cash App ' : ''}</p>
        <p><strong>Accounts:</strong> {formData.accounts.uber ? 'Uber ' : ''}{formData.accounts.lyft ? 'Lyft ' : ''}</p>
        <Button onClick={handleEdit} className="mt-4">Edit Response</Button>
      </div>
    </div>
  );
};

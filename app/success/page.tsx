'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

// Define the type for form data
interface FormData {
  name: string;
  phone: string;
  travelType: string;
  travelNumber: string;
  destination: string;
  arrivalTime: string;
  paymentMethod: string;
}

export default function SuccessPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData | null>(null); // Initialize as null

  useEffect(() => {
    // In a real application, you would fetch the user's form data from your backend here
    // For now, we'll just use some dummy data
    setFormData({
      name: 'John Doe',
      phone: '123-456-7890',
      travelType: 'flight',
      travelNumber: 'AA123',
      destination: 'Brown University Campus',
      arrivalTime: '2023-09-01T14:00',
      paymentMethod: 'venmo',
    });
  }, []);

  const handleEdit = () => {
    router.push('/form')
  }

  if (!formData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submission Successful</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Travel Information</h2>
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Phone:</strong> {formData.phone}</p>
        <p><strong>Travel Type:</strong> {formData.travelType}</p>
        <p><strong>Flight/Train Number:</strong> {formData.travelNumber}</p>
        <p><strong>Destination:</strong> {formData.destination}</p>
        <p><strong>Arrival Time:</strong> {new Date(formData.arrivalTime).toLocaleString()}</p>
        <p><strong>Payment Method:</strong> {formData.paymentMethod}</p>
        <Button onClick={handleEdit} className="mt-4">Edit Response</Button>
      </div>
    </div>
  )
}


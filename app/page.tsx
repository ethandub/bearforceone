'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useAuth } from '@clerk/nextjs'

export default function Home() {
  const router = useRouter()
  const { signOut } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    travelType: '',
    travelNumber: '',
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
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    router.push('/success')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleTravelTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      travelType: value,
      destination: '',
    }));
  };

  const handlePaymentMethodChange = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method], // Toggle the checkbox
      },
    }));
  };

  const handleAccountChange = (account: string) => {
    setFormData((prev) => ({
      ...prev,
      accounts: {
        ...prev.accounts,
        [account]: !prev.accounts[account], // Toggle the checkbox
      },
    }));
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/sign-in');
  }

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
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="text-base" />
          </div>
          <div>
            <Label htmlFor="phone" className="text-base">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="text-base" />
          </div>
          <div>
            <Label htmlFor="travelType" className="text-base">Travel Type</Label>
            <Select name="travelType" onValueChange={handleTravelTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select travel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="train">Train</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="travelNumber" className="text-base">Flight/Train Number</Label>
            <Input
              id="travelNumber"
              name="travelNumber"
              value={formData.travelNumber}
              onChange={handleChange}
              required className="text-base"
            />
          </div>
          <div>
            <Label htmlFor="destination" className="text-base">Destination</Label>
            <Select name="destination" onValueChange={(value) => handleChange({ target: { name: 'destination', value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {formData.travelType === 'flight' && (
                  <>
                    <SelectItem value="tf_green">T.F. Green</SelectItem>
                    <SelectItem value="boston_logan">Boston Logan</SelectItem>
                  </>
                )}
                {formData.travelType === 'train' && (
                  <SelectItem value="providence_station">Providence Station</SelectItem>
                )}
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
              required className="text-base"
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
              required className="text-base"
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
  )
}
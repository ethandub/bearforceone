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
  const { signOut } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    travelType: '',
    travelNumber: '',
    destination: '',
    arrivalTime: '',
    paymentMethod: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log(formData)
    // For now, we'll just redirect to the success page
    router.push('/success')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/sign-in')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Travel Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="travelType">Travel Type</Label>
          <Select name="travelType" onValueChange={(value) => handleChange({ target: { name: 'travelType', value } })}>
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
          <Label htmlFor="travelNumber">Flight/Train Number</Label>
          <Input id="travelNumber" name="travelNumber" value={formData.travelNumber} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Select name="destination" onValueChange={(value) => handleChange({ target: { name: 'destination', value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="campus">Brown University Campus</SelectItem>
              <SelectItem value="downtown">Downtown Providence</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="arrivalTime">Estimated Arrival Time</Label>
          <Input id="arrivalTime" name="arrivalTime" type="datetime-local" value={formData.arrivalTime} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select name="paymentMethod" onValueChange={(value) => handleChange({ target: { name: 'paymentMethod', value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="venmo">Venmo</SelectItem>
              <SelectItem value="zelle">Zelle</SelectItem>
              <SelectItem value="cashapp">Cash App</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Submit</Button>
      </form>
      <Button onClick={handleSignOut} className="mt-4">Sign Out</Button>
    </div>
  )
}
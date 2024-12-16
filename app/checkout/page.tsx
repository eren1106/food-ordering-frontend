'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from '@/hooks/use-toast'
import { CheckoutDetail, ItemQuantity } from '@/interfaces'
import { SERVER_URL } from '@/constants'

export default function CheckoutPage() {
  const [checkoutDetail, setCheckoutDetail] = useState<CheckoutDetail | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchCheckoutDetail = async () => {
      const items = searchParams.get('items')
      if (!items) return

      const response = await fetch(`${SERVER_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...JSON.parse(items) as ItemQuantity[]]),
      })

      if (response.ok) {
        const data = await response.json()
        setCheckoutDetail(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch checkout details.",
          duration: 2000,
        })
      }
    }

    fetchCheckoutDetail()
  }, [searchParams])

  const handlePlaceOrder = async () => {
    const items = searchParams.get('items')
    if (!items) return;

    const response = await fetch(`${SERVER_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...JSON.parse(items) as ItemQuantity[] ]),
    })

    if (response.ok) {
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
        duration: 2000,
      })
      router.push('/order-confirmation')
    } else {
      toast({
        title: "Order Failed",
        description: "There was an issue placing your order. Please try again.",
        duration: 2000,
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkoutDetail?.orderItems.map((orderItem) => (
                <TableRow key={orderItem.item.id}>
                  <TableCell>{orderItem.item.name}</TableCell>
                  <TableCell>{orderItem.quantity}</TableCell>
                  <TableCell>${orderItem.item.price.toFixed(2)}</TableCell>
                  <TableCell>${(orderItem.item.price * orderItem.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                <TableCell>${checkoutDetail?.subTotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">Service Charge (10%)</TableCell>
                <TableCell>${checkoutDetail?.serviceCharge.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                <TableCell className="font-bold">${checkoutDetail?.total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handlePlaceOrder} disabled={!checkoutDetail}>
            <Check className="mr-2 h-4 w-4" /> Place Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
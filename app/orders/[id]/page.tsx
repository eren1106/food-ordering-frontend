import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Order } from '@/interfaces'
import { SERVER_URL } from '@/constants'

async function getOrder(id: string): Promise<Order | null> {
  const response = await fetch(`${SERVER_URL}/orders/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return data
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)

  if (!order) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Order #{order.id.toString().padStart(5, '0')}</CardTitle>
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
              {order?.orderItems.map((orderItem) => (
                <TableRow key={orderItem.item.id}>
                  <TableCell>{orderItem.item.name}</TableCell>
                  <TableCell>{orderItem.quantity}</TableCell>
                  <TableCell>${orderItem.item.price.toFixed(2)}</TableCell>
                  <TableCell>${(orderItem.item.price * orderItem.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                <TableCell>${order.subTotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">Service Charge (10%)</TableCell>
                <TableCell>${order.serviceCharge.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                <TableCell className="font-bold">${order.total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
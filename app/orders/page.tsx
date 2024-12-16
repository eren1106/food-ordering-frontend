import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Order } from '@/interfaces'
import { SERVER_URL } from '@/constants'

async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${SERVER_URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch orders')
  }

  const data = await response.json()
  return data
}

function OrderList({ orders }: { orders: Awaited<ReturnType<typeof getOrders>> }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>#{order.id.toString().padStart(5, '0')}</TableCell>
            <TableCell>${order.total.toFixed(2)}</TableCell>
            <TableCell>
              <Button variant="default" size="sm" asChild>
                <Link href={`/orders/${order.id}`}>View Details</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading orders...</div>}>
            <OrderList orders={orders} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
'use client'

import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FoodItem, ItemQuantity } from '@/interfaces'

const foodItems: FoodItem[] = [
  { id: 1, name: "Burger", price: 5.99 },
  { id: 2, name: "Pizza", price: 8.99 },
  { id: 3, name: "Salad", price: 4.99 },
  { id: 4, name: "Fries", price: 2.99 },
  { id: 5, name: "Soda", price: 1.99 },
]

export default function Home() {
  const [orderItems, setOrderItems] = useState<ItemQuantity[]>([]);
  const router = useRouter();

  const handleQuantityChange = (itemId: number, quantity: number) => {
    if (quantity < 0) return; // Prevent negative quantity

    setOrderItems(prevOrderItems => {
      const existingItem = prevOrderItems.find(item => item.itemId === itemId);
      if (existingItem) {
        if (quantity === 0) {
          return prevOrderItems.filter(item => item.itemId !== itemId);
        } else {
          return prevOrderItems.map(item =>
            item.itemId === itemId ? { ...item, quantity } : item
          );
        }
      } else {
        return [...prevOrderItems, { itemId, quantity }];
      }
    });
  };

  const handleCheckout = () => {
    router.push(`/checkout?items=${JSON.stringify(orderItems)}`);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Food Order</CardTitle>
        </CardHeader>
        <CardContent>
          {foodItems.map(item => {
            const orderItem = orderItems.find(order => order.itemId === item.id);
            const quantity = orderItem ? orderItem.quantity : 0;
            return (
              <div key={item.id} className="flex items-center justify-between py-2">
                <span>{item.name} - ${item.price.toFixed(2)}</span>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    className="w-16 mx-2 text-center"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleCheckout} disabled={orderItems.length < 1}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Checkout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
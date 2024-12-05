export interface FoodItem {
  id: number
  name: string
  price: number
}

export interface ItemQuantity {
  foodId: number
  quantity: number
}

export interface OrderItem {
  item: FoodItem
  quantity: number
}

export interface CheckoutDetail {
  orderItems: OrderItem[]
  subTotal: number
  serviceCharge: number
  total: number
}

export interface Order extends CheckoutDetail {
  id: number
}
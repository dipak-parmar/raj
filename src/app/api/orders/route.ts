import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET() {
  try {
    const ordersString = await redis.get('raj_all_orders');
    const orders = ordersString ? JSON.parse(ordersString) : [];
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.mobile || !body.amount || !body.address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique Order ID
    const orderId = `RAJ-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      ...body,
      orderId,
      status: 'pending',
      date: new Date().toLocaleString(),
    };

    const existingOrdersStr = await redis.get('raj_all_orders');
    const currentOrders: any[] = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    
    currentOrders.unshift(newOrder); // Add to beginning
    
    await redis.set('raj_all_orders', JSON.stringify(currentOrders));
    
    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();
    const existingOrdersStr = await redis.get('raj_all_orders');
    const currentOrders: any[] = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    
    const updatedOrders = currentOrders.map(order => {
      if (order.orderId === orderId) {
        return { ...order, status };
      }
      return order;
    });

    await redis.set('raj_all_orders', JSON.stringify(updatedOrders));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const existingOrdersStr = await redis.get('raj_all_orders');
    const currentOrders: any[] = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    const updatedOrders = currentOrders.filter(order => order.orderId !== orderId);
    
    await redis.set('raj_all_orders', JSON.stringify(updatedOrders));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

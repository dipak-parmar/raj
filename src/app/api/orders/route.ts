import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const orders = await kv.get('raj_all_orders') || [];
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newOrder = await request.json();
    const currentOrders: any[] = (await kv.get('raj_all_orders')) || [];
    currentOrders.unshift(newOrder); // Add to beginning
    await kv.set('raj_all_orders', currentOrders);
    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();
    const currentOrders: any[] = (await kv.get('raj_all_orders')) || [];
    
    const updatedOrders = currentOrders.map(order => {
      if (order.orderId === orderId) {
        return { ...order, status };
      }
      return order;
    });

    await kv.set('raj_all_orders', updatedOrders);
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

    const currentOrders: any[] = (await kv.get('raj_all_orders')) || [];
    const updatedOrders = currentOrders.filter(order => order.orderId !== orderId);
    
    await kv.set('raj_all_orders', updatedOrders);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

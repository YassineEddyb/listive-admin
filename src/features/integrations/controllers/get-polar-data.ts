import { polarClient } from '@/libs/polar/polar-client';

export interface PolarOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  customer_email: string;
  customer_name: string;
  product_name: string;
  subscription_id: string | null;
}

export interface PolarCustomer {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
  currency: string;
}

export interface PolarMetrics {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  active_subscriptions: number;
  currency: string;
}

/**
 * Fetch recent orders from Polar.
 */
export async function getPolarOrders(limit = 50): Promise<PolarOrder[]> {
  try {
    const result = await polarClient.orders.list({
      limit,
      sorting: ['-created_at'],
    });

    const items = result.result?.items || [];
    return items.map((order: any) => ({
      id: order.id,
      amount: order.amount / 100, // cents to dollars
      currency: order.currency || 'usd',
      status: order.status || 'completed',
      created_at: order.createdAt || order.created_at || '',
      customer_email: order.customer?.email || order.customerEmail || '',
      customer_name: order.customer?.name || '',
      product_name: order.product?.name || order.productName || '',
      subscription_id: order.subscriptionId || order.subscription_id || null,
    }));
  } catch (err: any) {
    console.error('[getPolarOrders] Error:', err?.message || err);
    return [];
  }
}

/**
 * Fetch customers from Polar.
 */
export async function getPolarCustomers(limit = 50): Promise<PolarCustomer[]> {
  try {
    const result = await polarClient.customers.list({
      limit,
      sorting: ['-created_at'],
    });

    const items = result.result?.items || [];
    return items.map((customer: any) => ({
      id: customer.id,
      email: customer.email || '',
      name: customer.name || null,
      created_at: customer.createdAt || customer.created_at || '',
      order_count: customer.orderCount ?? customer.order_count ?? 0,
      total_spent: (customer.totalSpent ?? customer.total_spent ?? 0) / 100,
      currency: customer.currency || 'usd',
    }));
  } catch (err: any) {
    console.error('[getPolarCustomers] Error:', err?.message || err);
    return [];
  }
}

/**
 * Fetch subscription stats from Polar.
 */
export async function getPolarSubscriptions(limit = 100) {
  try {
    const result = await polarClient.subscriptions.list({
      limit,
    });

    const items = result.result?.items || [];
    return items.map((sub: any) => ({
      id: sub.id,
      status: sub.status || 'unknown',
      customer_email: sub.customer?.email || sub.customerEmail || '',
      product_name: sub.product?.name || sub.productName || '',
      amount: (sub.amount ?? sub.recurringInterval ?? 0) / 100,
      currency: sub.currency || 'usd',
      current_period_end: sub.currentPeriodEnd || sub.current_period_end || '',
      created_at: sub.createdAt || sub.created_at || '',
      cancel_at_period_end: sub.cancelAtPeriodEnd ?? false,
    }));
  } catch (err: any) {
    console.error('[getPolarSubscriptions] Error:', err?.message || err);
    return [];
  }
}

/**
 * Compute aggregate metrics from Polar data.
 */
export async function getPolarMetrics(): Promise<PolarMetrics> {
  try {
    const [orders, customers, subscriptions] = await Promise.all([
      getPolarOrders(200),
      getPolarCustomers(200),
      getPolarSubscriptions(200),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === 'active'
    ).length;

    return {
      total_revenue: totalRevenue,
      total_orders: orders.length,
      total_customers: customers.length,
      active_subscriptions: activeSubscriptions,
      currency: 'usd',
    };
  } catch (err: any) {
    console.error('[getPolarMetrics] Error:', err?.message || err);
    return {
      total_revenue: 0,
      total_orders: 0,
      total_customers: 0,
      active_subscriptions: 0,
      currency: 'usd',
    };
  }
}

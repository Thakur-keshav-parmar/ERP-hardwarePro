const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));

const TABLES = {
  products: 'HardwareProProducts',
  bills: 'HardwareProBills',
  orders: 'HardwareProPurchaseOrders',
  suppliers: 'HardwareProSuppliers',
};

function fmt(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function getDateRange(range) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  if (range === 'week') {
    const from = new Date(today); from.setDate(today.getDate() - 6);
    return { from: from.toISOString().split('T')[0], to: todayStr };
  }
  if (range === 'month') {
    const from = new Date(today); from.setDate(1);
    return { from: from.toISOString().split('T')[0], to: todayStr };
  }
  return { from: todayStr, to: todayStr };
}

// ── Menus ─────────────────────────────────────────────────────────────────────
const MENUS = {
  home: [
    { label: '📦 Low Stock',      queryType: 'low_stock' },
    { label: '🔴 Out of Stock',   queryType: 'out_of_stock' },
    { label: '💰 Today\'s Sales', queryType: 'sales_today' },
    { label: '📊 This Week',      queryType: 'sales_week' },
    { label: '📅 This Month',     queryType: 'sales_month' },
    { label: '🛒 Pending Orders', queryType: 'pending_orders' },
    { label: '⏰ Expiring Soon',  queryType: 'expiring_soon' },
    { label: '🏆 Top Sellers',    queryType: 'top_sellers' },
  ],
  inventory: [
    { label: '📦 Low Stock',      queryType: 'low_stock' },
    { label: '🔴 Out of Stock',   queryType: 'out_of_stock' },
    { label: '⏰ Expiring Soon',  queryType: 'expiring_soon' },
    { label: '📋 All Products',   queryType: 'all_products' },
    { label: '🏠 Main Menu',      queryType: 'greeting' },
  ],
  sales: [
    { label: '💰 Today\'s Sales', queryType: 'sales_today' },
    { label: '📊 This Week',      queryType: 'sales_week' },
    { label: '📅 This Month',     queryType: 'sales_month' },
    { label: '🏆 Top Sellers',    queryType: 'top_sellers' },
    { label: '🏠 Main Menu',      queryType: 'greeting' },
  ],
  orders: [
    { label: '🛒 Pending Orders',   queryType: 'pending_orders' },
    { label: '✅ Received Orders',  queryType: 'received_orders' },
    { label: '📦 Low Stock',        queryType: 'low_stock' },
    { label: '🏭 Suppliers',        queryType: 'suppliers' },
    { label: '🏠 Main Menu',        queryType: 'greeting' },
  ],
  expiry: [
    { label: '⏰ Expiring in 30d',  queryType: 'expiring_soon' },
    { label: '⚠️ Expiring in 7d',   queryType: 'expiring_7' },
    { label: '🚫 Already Expired',  queryType: 'expired' },
    { label: '📦 Low Stock',        queryType: 'low_stock' },
    { label: '🏠 Main Menu',        queryType: 'greeting' },
  ],
};

// ── Query handlers ────────────────────────────────────────────────────────────
async function handleQuery(queryType) {
  switch (queryType) {

    case 'greeting': {
      const [pRes, bRes, oRes] = await Promise.all([
        dynamo.send(new ScanCommand({ TableName: TABLES.products })),
        dynamo.send(new ScanCommand({ TableName: TABLES.bills })),
        dynamo.send(new ScanCommand({ TableName: TABLES.orders })),
      ]);
      const products = pRes.Items || [];
      const outOfStock = products.filter(p => (p.quantity || 0) === 0).length;
      const lowStock = products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) <= 20).length;
      const today = new Date().toISOString().split('T')[0];
      const todayBills = (bRes.Items || []).filter(b => (b.createdAt || b.date || '').startsWith(today));
      const todaySales = todayBills.reduce((s, b) => s + (b.totalAmount || b.total || 0), 0);
      const pendingOrders = (oRes.Items || []).filter(o => o.status === 'pending' || o.status === 'confirmed').length;

      const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
      let msg = `👋 Hello! Here's your snapshot at ${now}\n\n`;
      msg += `📦 Total products: ${products.length}\n`;
      msg += `🔴 Out of stock: ${outOfStock} items\n`;
      msg += `🟡 Low stock: ${lowStock} items\n`;
      msg += `💰 Today's revenue: ${fmt(todaySales)} (${todayBills.length} bills)\n`;
      msg += `🛒 Pending orders: ${pendingOrders}\n`;
      msg += `\nWhat would you like to check?`;
      return { reply: msg, followUps: MENUS.home };
    }

    case 'low_stock': {
      const res = await dynamo.send(new ScanCommand({ TableName: TABLES.products }));
      const items = (res.Items || [])
        .filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) <= 20)
        .sort((a, b) => (a.quantity || 0) - (b.quantity || 0));
      if (items.length === 0) {
        return { reply: '✅ Great news! No low stock items.\nAll products have more than 20 units in stock.', followUps: MENUS.inventory };
      }
      let msg = `🟡 Low Stock Items (≤20 units)\n\n`;
      items.forEach(p => { msg += `• ${p.name} — Stock: ${p.quantity} units (${p.category || 'General'})\n`; });
      msg += `\n${items.length} items need restocking soon.`;
      return { reply: msg, followUps: MENUS.inventory };
    }

    case 'out_of_stock': {
      const res = await dynamo.send(new ScanCommand({ TableName: TABLES.products }));
      const items = (res.Items || [])
        .filter(p => (p.quantity || 0) === 0)
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      if (items.length === 0) {
        return { reply: '✅ All products are in stock!\nNo items are currently out of stock.', followUps: MENUS.inventory };
      }
      let msg = `🔴 Out of Stock\n\n`;
      items.forEach(p => { msg += `• ${p.name} — OUT OF STOCK (${p.category || 'General'})\n`; });
      msg += `\n${items.length} products need immediate restocking.`;
      return { reply: msg, followUps: MENUS.inventory };
    }

    case 'all_products': {
      const res = await dynamo.send(new ScanCommand({ TableName: TABLES.products }));
      const items = (res.Items || []).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      if (items.length === 0) {
        return { reply: 'No products found in the system.', followUps: MENUS.inventory };
      }
      let msg = `📋 All Products (${items.length} total)\n\n`;
      items.forEach(p => {
        const stock = (p.quantity || 0) === 0 ? 'OUT OF STOCK' : `Stock: ${p.quantity} units`;
        const expiry = (p.expiryDate || p.expiry) ? ` [Exp: ${p.expiryDate || p.expiry}]` : '';
        msg += `• ${p.name} — ${stock} (${p.category || 'General'})${expiry}\n`;
      });
      return { reply: msg, followUps: MENUS.inventory };
    }

    case 'sales_today': {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const res = await dynamo.send(new ScanCommand({ TableName: TABLES.bills }));
      const bills = res.Items || [];
      const todayBills = bills.filter(b => (b.createdAt || b.date || '').startsWith(today));
      const yBills = bills.filter(b => (b.createdAt || b.date || '').startsWith(yesterday));
      const todaySales = todayBills.reduce((s, b) => s + (b.totalAmount || b.total || 0), 0);
      const ySales = yBills.reduce((s, b) => s + (b.totalAmount || b.total || 0), 0);
      const trend = ySales > 0 ? ((todaySales - ySales) / ySales * 100).toFixed(1) : null;
      let msg = `💰 Today's Sales (${today})\n\n`;
      msg += `Revenue: ${fmt(todaySales)}\n`;
      msg += `Bills: ${todayBills.length}\n`;
      if (todayBills.length > 0) msg += `Avg bill: ${fmt(todaySales / todayBills.length)}\n`;
      msg += `\nYesterday: ${fmt(ySales)} (${yBills.length} bills)\n`;
      if (trend !== null) msg += `Trend: ${parseFloat(trend) >= 0 ? '📈' : '📉'} ${trend}%`;
      return { reply: msg, followUps: MENUS.sales };
    }

    case 'sales_week':
    case 'sales_month': {
      const range = queryType === 'sales_week' ? 'week' : 'month';
      const label = range === 'week' ? 'This Week' : 'This Month';
      const { from, to } = getDateRange(range);
      const res = await dynamo.send(new ScanCommand({ TableName: TABLES.bills }));
      const bills = (res.Items || []).filter(b => {
        const d = (b.createdAt || b.date || '').split('T')[0];
        return d >= from && d <= to;
      });
      const total = bills.reduce((s, b) => s + (b.totalAmount || b.total || 0), 0);
      const dailyMap = {};
      bills.forEach(b => {
        const d = (b.createdAt || b.date || '').split('T')[0];
        if (d) { dailyMap[d] = (dailyMap[d] || 0) + (b.totalAmount || b.total || 0); }
      });
      let msg = `📊 ${label} Sales (${from} → ${to})\n\n`;
      msg += `Total Revenue: ${fmt(total)}\n`;
      msg += `Total Bills: ${bills.length}\n`;
      if (bills.length > 0) msg += `Avg per bill: ${fmt(total / bills.length)}\n`;
      const days = Object.keys(dailyMap).sort();
      if (days.length > 0) {
        msg += `\nDaily Breakdown:\n`;
        days.forEach(d => { msg += `  ${d}: ${fmt(dailyMap[d])}\n`; });
      }
      return { reply: msg, followUps: MENUS.sales };
    }

    case 'pending_orders': {
      const res = await dynamo.send(new ScanCommand({ TableName: TABLES.orders }));
      const items = (res.Items || [])
        .filter(o => o.status === 'pending' || o.status === 'confirmed')
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      if (items.length === 0) {
        return { reply: '✅ No pending purchase orders.\nAll orders have been processed.', followUps: MENUS.orders };
      }
      let msg = `🛒 Pending Purchase Orders\n\n`;
      items.forEach(o => {
        msg += `• ${o.poId} — ${o.supplierName}\n  Status: ${o.status} | Amount: ${fmt(o.totalAmount)} | Items: ${(o.items || []).length}\n`;
      });
      msg += `\n${items.length} orders need attention.`;
      return { reply: msg, followUps: MENUS.orders };
    }

    case 'received_orders': {
      const res = await dynamo.send(new ScanCommand({ TableName: TABLES.orders }));
      const items = (res.Items || [])
        .filter(o => o.status === 'received')
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 10);
      if (items.length === 0) {
        return { reply: 'No received orders found.', followUps: MENUS.orders };
      }
      let msg = `✅ Recently Received Orders\n\n`;
      items.forEach(o => {
        msg += `• ${o.poId} — ${o.supplierName}\n  Amount: ${fmt(o.totalAmount)} | Items: ${(o.items || []).length}\n`;
      });
      return { reply: msg, followUps: MENUS.orders };
    }

    case 'expiring_soon':
    case 'expiring_7': {
      const days = queryType === 'expiring_7' ? 7 : 30;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const cutoff = new Date(today.getTime() + days * 86400000);
      const res = await dynamo.send(new ScanCommand({ TableName: TABLES.products }));
      const expiringSoon = [], expired = [];
      for (const p of (res.Items || [])) {
        const expiryStr = p.expiryDate || p.expiry;
        if (!expiryStr) continue;
        const exp = new Date(expiryStr); exp.setHours(0, 0, 0, 0);
        if (isNaN(exp.getTime())) continue;
        const daysLeft = Math.round((exp - today) / 86400000);
        const info = { name: p.name, category: p.category, expiryDate: expiryStr, quantity: p.quantity, daysLeft };
        if (daysLeft < 0) expired.push(info);
        else if (exp <= cutoff) expiringSoon.push(info);
      }
      expiringSoon.sort((a, b) => a.daysLeft - b.daysLeft);
      expired.sort((a, b) => a.daysLeft - b.daysLeft);
      if (expiringSoon.length === 0 && expired.length === 0) {
        return { reply: `✅ No products expiring in the next ${days} days.`, followUps: MENUS.expiry };
      }
      let msg = `⏰ Expiry Report (next ${days} days)\n\n`;
      if (expired.length > 0) {
        msg += `🚫 Already Expired (${expired.length}):\n`;
        expired.forEach(p => { msg += `• ${p.name} — Expired ${Math.abs(p.daysLeft)}d ago (${p.category || 'General'})\n`; });
        msg += '\n';
      }
      if (expiringSoon.length > 0) {
        msg += `⚠️ Expiring Soon (${expiringSoon.length}):\n`;
        expiringSoon.forEach(p => { msg += `• ${p.name} — ${p.daysLeft}d left [${p.expiryDate}] Stock: ${p.quantity}\n`; });
      }
      return { reply: msg, followUps: MENUS.expiry };
    }

    case 'expired': {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const res = await dynamo.send(new ScanCommand({ TableName: TABLES.products }));
      const items = [];
      for (const p of (res.Items || [])) {
        const expiryStr = p.expiryDate || p.expiry;
        if (!expiryStr) continue;
        const exp = new Date(expiryStr); exp.setHours(0, 0, 0, 0);
        if (isNaN(exp.getTime()) || exp >= today) continue;
        const daysAgo = Math.round((today - exp) / 86400000);
        items.push({ ...p, daysAgo });
      }
      items.sort((a, b) => a.daysAgo - b.daysAgo);
      if (items.length === 0) {
        return { reply: '✅ No expired products found.', followUps: MENUS.expiry };
      }
      let msg = `🚫 Expired Products (${items.length})\n\n`;
      items.forEach(p => { msg += `• ${p.name} — Expired ${p.daysAgo}d ago [${p.expiryDate || p.expiry}] Stock: ${p.quantity}\n`; });
      return { reply: msg, followUps: MENUS.expiry };
    }

    case 'top_sellers': {
      const res = await dynamo.send(new ScanCommand({ TableName: TABLES.bills }));
      const counts = {};
      for (const bill of (res.Items || [])) {
        for (const item of (bill.items || [])) {
          const key = item.productName || item.name || item.productId || 'Unknown';
          counts[key] = (counts[key] || 0) + (item.quantity || 1);
        }
      }
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
      if (sorted.length === 0) {
        return { reply: 'No sales data available yet.', followUps: MENUS.sales };
      }
      let msg = `🏆 Top Selling Products (All Time)\n\n`;
      sorted.forEach(([name, qty], i) => { msg += `${i + 1}. ${name} — ${qty} units sold\n`; });
      return { reply: msg, followUps: MENUS.sales };
    }

    case 'suppliers': {
      const res = await dynamo.send(new ScanCommand({ TableName: TABLES.suppliers }));
      const items = (res.Items || []).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      if (items.length === 0) {
        return { reply: 'No suppliers found.', followUps: MENUS.orders };
      }
      let msg = `🏭 Suppliers (${items.length})\n\n`;
      items.forEach(s => {
        msg += `• ${s.name}\n`;
        if (s.phone) msg += `  📞 ${s.phone}\n`;
        if (s.email) msg += `  📧 ${s.email}\n`;
      });
      return { reply: msg, followUps: MENUS.orders };
    }

    default:
      return { reply: '❓ Unknown query. Please choose from the options below.', followUps: MENUS.home };
  }
}

// ── Lambda handler ────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const queryType = body.queryType || 'greeting';
    const result = await handleQuery(queryType);
    return { statusCode: 200, headers, body: JSON.stringify(result) };
  } catch (err) {
    console.error('AdminChat error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ reply: '⚠️ Error fetching data. Please try again.', followUps: MENUS.home }),
    };
  }
};

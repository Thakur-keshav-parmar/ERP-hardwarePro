const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const TABLES = {
  products: 'HardwareProProducts',
  bills: 'HardwareProBills',
  orders: 'HardwareProPurchaseOrders',
};

function fmt(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

async function sendTelegram(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error('Telegram error: ' + JSON.stringify(data));
  return data;
}

async function buildDigest() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const [productsRes, billsRes, ordersRes] = await Promise.all([
    dynamo.send(new ScanCommand({ TableName: TABLES.products })),
    dynamo.send(new ScanCommand({ TableName: TABLES.bills })),
    dynamo.send(new ScanCommand({ TableName: TABLES.orders })),
  ]);

  const products = productsRes.Items || [];
  const bills = billsRes.Items || [];
  const orders = ordersRes.Items || [];

  // Sales for today
  const todayBills = bills.filter(b => (b.createdAt || b.date || '').startsWith(today));
  const todaySales = todayBills.reduce((s, b) => s + (b.totalAmount || b.total || 0), 0);

  // Sales for yesterday
  const yesterdayBills = bills.filter(b => (b.createdAt || b.date || '').startsWith(yesterday));
  const yesterdaySales = yesterdayBills.reduce((s, b) => s + (b.totalAmount || b.total || 0), 0);

  // Sales trend
  const trend = yesterdaySales > 0
    ? ((todaySales - yesterdaySales) / yesterdaySales * 100).toFixed(1)
    : null;

  // Stock alerts
  const outOfStock = products.filter(p => (p.quantity || 0) === 0);
  const lowStock = products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) <= 5);

  // Pending orders
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed');

  // Top 3 low stock by name
  const topLow = lowStock.slice(0, 3).map(p => `  • ${p.name} (qty: ${p.quantity})`).join('\n');

  // Build message
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
  let msg = `📊 <b>Daily Inventory Digest</b>\n`;
  msg += `🕙 ${now}\n\n`;

  msg += `💰 <b>Sales Summary</b>\n`;
  msg += `Today: <b>${fmt(todaySales)}</b> (${todayBills.length} bills)\n`;
  msg += `Yesterday: ${fmt(yesterdaySales)} (${yesterdayBills.length} bills)\n`;
  if (trend !== null) {
    const arrow = parseFloat(trend) >= 0 ? '📈' : '📉';
    msg += `Trend: ${arrow} ${trend}%\n`;
  }

  msg += `\n📦 <b>Inventory Alerts</b>\n`;
  if (outOfStock.length > 0) {
    msg += `🔴 Out of stock: <b>${outOfStock.length} items</b>\n`;
  } else {
    msg += `✅ No out-of-stock items\n`;
  }

  if (lowStock.length > 0) {
    msg += `🟡 Low stock: <b>${lowStock.length} items</b>\n`;
    if (topLow) msg += topLow + '\n';
    if (lowStock.length > 3) msg += `  ...and ${lowStock.length - 3} more\n`;
  } else {
    msg += `✅ Stock levels look healthy\n`;
  }

  msg += `\n🛒 <b>Purchase Orders</b>\n`;
  if (pendingOrders.length > 0) {
    msg += `⏳ Pending/Confirmed: <b>${pendingOrders.length} orders</b> need attention\n`;
  } else {
    msg += `✅ No pending purchase orders\n`;
  }

  msg += `\n📋 <b>Quick Stats</b>\n`;
  msg += `Total products: ${products.length}\n`;
  msg += `Total bills today: ${todayBills.length}\n`;

  return msg;
}

exports.handler = async () => {
  try {
    const digest = await buildDigest();
    await sendTelegram(digest);
    console.log('Digest sent successfully');
    return { statusCode: 200, body: 'Digest sent' };
  } catch (err) {
    console.error('DigestAgent error:', err);
    // Try to send error notification
    try {
      await sendTelegram(`⚠️ <b>Digest Agent Error</b>\n${err.message}`);
    } catch (_) {}
    return { statusCode: 500, body: err.message };
  }
};

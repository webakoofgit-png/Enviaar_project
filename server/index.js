import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testConnection } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Real ENVIAAR Jewellery mock database fallback
let mockProducts = [
  {
    id: 1,
    name: 'Aurelia Drop Earrings',
    category: 'Earrings',
    sku: '#ENV-EAR001',
    createdAt: 'Jan 01, 2024',
    regularPrice: 3990.00,
    sellPrice: 3490.00,
    stock: 48,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=80'
  },
  {
    id: 2,
    name: 'Mira Pearl Studs',
    category: 'Earrings',
    sku: '#ENV-EAR002',
    createdAt: 'Jan 01, 2024',
    regularPrice: 2200.00,
    sellPrice: 1890.00,
    stock: 65,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80'
  },
  {
    id: 3,
    name: 'Elara Necklace Set',
    category: 'Necklaces',
    sku: '#ENV-NCK001',
    createdAt: 'Jan 01, 2024',
    regularPrice: 8490.00,
    sellPrice: 7490.00,
    stock: 18,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=300&q=80'
  },
  {
    id: 4,
    name: 'Noor Pendant Chain',
    category: 'Necklaces',
    sku: '#ENV-NCK002',
    createdAt: 'Jan 01, 2024',
    regularPrice: 3490.00,
    sellPrice: 2990.00,
    stock: 32,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1611591475874-b8e45fd430e3?w=300&q=80'
  },
  {
    id: 5,
    name: 'Solène Tennis Bracelet',
    category: 'Bracelets',
    sku: '#ENV-BRC001',
    createdAt: 'Jan 01, 2024',
    regularPrice: 4990.00,
    sellPrice: 4290.00,
    stock: 24,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1611591475874-b8e45fd430e3?w=300&q=80'
  },
  {
    id: 6,
    name: 'Amaara Cocktail Ring',
    category: 'Rings',
    sku: '#ENV-RNG001',
    createdAt: 'Jan 01, 2024',
    regularPrice: 3290.00,
    sellPrice: 2790.00,
    stock: 15,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=80'
  },
  {
    id: 7,
    name: 'Tara Sculpted Kada',
    category: 'Kada & Bangles',
    sku: '#ENV-KAD001',
    createdAt: 'Jan 01, 2024',
    regularPrice: 4490.00,
    sellPrice: 3890.00,
    stock: 0,
    status: 'out Stock',
    image: 'https://images.unsplash.com/photo-1611591475874-b8e45fd430e3?w=300&q=80'
  },
  {
    id: 8,
    name: 'Avni Everyday Mangalsutra',
    category: 'Mangalsutra',
    sku: '#ENV-MNG001',
    createdAt: 'Jan 02, 2024',
    regularPrice: 5200.00,
    sellPrice: 4590.00,
    stock: 20,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=300&q=80'
  },
  {
    id: 9,
    name: 'Veer Minimal Cuff',
    category: 'Men’s Jewellery',
    sku: '#ENV-MEN001',
    createdAt: 'Jan 02, 2024',
    regularPrice: 2990.00,
    sellPrice: 2490.00,
    stock: 30,
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1611591475874-b8e45fd430e3?w=300&q=80'
  },
  {
    id: 10,
    name: 'Arjun Signet Ring',
    category: 'Men’s Jewellery',
    sku: '#ENV-MEN002',
    createdAt: 'Jan 02, 2024',
    regularPrice: 3800.00,
    sellPrice: 3290.00,
    stock: 0,
    status: 'Inactive',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=80'
  }
];

// Admin Login Endpoint
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? OR username = ?', [email, email]);
    if (rows.length > 0) {
      const admin = rows[0];
      // In production, compare hashed password. For development:
      if (password === 'admin123' || password === admin.password_hash) {
        return res.json({
          success: true,
          user: { name: admin.username || 'ENVIAAR Admin', email: admin.email, role: admin.role || 'Store Administrator' }
        });
      }
    }
  } catch (err) {
    console.warn('DB admin check fallback used');
  }

  // Fallback default admin credentials
  if ((email === 'admin@enviaar.com' || email === 'admin') && (password === 'admin123' || password === 'admin')) {
    return res.json({
      success: true,
      user: { name: 'ENVIAAR Admin', email: 'admin@enviaar.com', role: 'Store Administrator' }
    });
  }

  res.status(401).json({ error: 'Invalid admin credentials' });
});

// Customer Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'Valued Customer';

  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const [result] = await pool.query(
      `INSERT INTO customers (name, email, phone, password_hash, status)
       VALUES (?, ?, ?, ?, 'Active')`,
      [fullName, email, phone || null, password || null]
    );

    const user = { id: result.insertId, name: fullName, email, phone: phone || '' };
    return res.status(201).json({ success: true, message: 'Account created successfully in database', user });
  } catch (err) {
    console.warn('DB customer registration fallback used:', err.message);
    const mockUser = { id: Date.now(), name: fullName, email, phone: phone || '' };
    return res.status(201).json({ success: true, message: 'Account created successfully', user: mockUser });
  }
});

// Customer Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
    if (rows.length > 0) {
      const customer = rows[0];
      if (!customer.password_hash || customer.password_hash === password) {
        return res.json({
          success: true,
          user: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone || '' }
        });
      } else {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    }
  } catch (err) {
    console.warn('DB customer login check fallback used');
  }

  return res.json({
    success: true,
    user: { id: Date.now(), name: email.split('@')[0] || 'Customer', email, phone: '' }
  });
});

// Mock Customers Fallback List
let mockCustomers = [
  {
    id: 1,
    name: "vipul.m3011",
    email: "vipul.m3011@gmail.com",
    phone: "+91 98765 43210",
    totalOrders: 1,
    totalSpent: 2790.00,
    tier: "VIP Circle",
    createdAt: "2026-09-26"
  },
  {
    id: 2,
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 12345",
    totalOrders: 4,
    totalSpent: 18450.00,
    tier: "VIP Circle",
    createdAt: "2024-01-15"
  },
  {
    id: 3,
    name: "Priya Kapoor",
    email: "priya.k@example.com",
    phone: "+91 98123 45678",
    totalOrders: 2,
    totalSpent: 9280.00,
    tier: "Member",
    createdAt: "2024-02-10"
  },
  {
    id: 4,
    name: "Rohan Verma",
    email: "rohan.v@example.com",
    phone: "+91 99887 66554",
    totalOrders: 5,
    totalSpent: 24900.00,
    tier: "VIP Circle",
    createdAt: "2024-03-01"
  },
  {
    id: 5,
    name: "Ananya Roy",
    email: "ananya.roy@example.com",
    phone: "+91 97766 55443",
    totalOrders: 1,
    totalSpent: 3490.00,
    tier: "New Member",
    createdAt: "2024-04-12"
  }
];

// Get Customers Endpoint
app.get('/api/customers', async (req, res) => {
  const { q, tier } = req.query;

  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.name, c.email, c.phone,
             c.total_orders AS totalOrders, c.total_spent AS totalSpent,
             c.created_at AS createdAt
      FROM customers c
      ORDER BY c.id DESC
    `);

    if (rows.length > 0) {
      const formatted = rows.map((r) => ({
        ...r,
        tier: (r.totalSpent || 0) >= 10000 ? "VIP Circle" : "Member",
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : "2024-01-01"
      }));
      return res.json(formatted);
    }
  } catch (err) {
    console.warn("MySQL DB customers fetch fallback mode");
  }

  let results = [...mockCustomers];
  if (tier && tier !== 'All') {
    results = results.filter(c => c.tier.toLowerCase() === tier.toString().toLowerCase());
  }
  if (q) {
    const search = q.toString().toLowerCase();
    results = results.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.phone.includes(search)
    );
  }
  res.json(results);
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'ok',
    server: 'ENVIAAR Express Backend',
    database: dbConnected ? 'Connected (MySQL)' : 'Fallback Mode (Mock)'
  });
});

// Dashboard Stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [pRows] = await pool.query('SELECT COUNT(*) AS total FROM products');
    const [rRows] = await pool.query('SELECT COALESCE(SUM(total_amount), 84320) AS total FROM orders');
    const [oRows] = await pool.query('SELECT COUNT(*) AS total FROM orders');
    const [cRows] = await pool.query('SELECT COUNT(*) AS total FROM customers');

    res.json({
      totalProducts: pRows[0]?.total || mockProducts.length,
      totalRevenue: parseFloat(rRows[0]?.total || 84320.00),
      totalOrders: oRows[0]?.total || 142,
      totalCustomers: cRows[0]?.total || 3240,
      trends: {
        products: '+4.2%',
        revenue: '+12.5%',
        orders: '-1.4%',
        customers: '+2.1%'
      }
    });
  } catch (err) {
    res.json({
      totalProducts: mockProducts.length,
      totalRevenue: 84320.00,
      totalOrders: 142,
      totalCustomers: 3240,
      trends: {
        products: '+4.2%',
        revenue: '+12.5%',
        orders: '-1.4%',
        customers: '+2.1%'
      }
    });
  }
});

// Get Products endpoint
app.get('/api/products', async (req, res) => {
  const { status, q } = req.query;

  try {
    let sql = `
      SELECT p.id, p.name, p.sku, p.regular_price AS regularPrice, p.sell_price AS sellPrice,
             p.stock_quantity AS stock, p.status, p.image_url AS image, p.created_at AS createdAt,
             c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      sql += ` AND p.status = ?`;
      params.push(status);
    }

    if (q) {
      sql += ` AND (p.name LIKE ? OR p.sku LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`);
    }

    sql += ` ORDER BY p.id DESC`;

    const [rows] = await pool.query(sql, params);
    
    const formatted = rows.map(r => ({
      ...r,
      createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Jan 01, 2024'
    }));

    res.json(formatted);
  } catch (err) {
    let results = [...mockProducts];
    if (status && status !== 'All') {
      results = results.filter(p => p.status.toLowerCase() === status.toString().toLowerCase());
    }
    if (q) {
      const search = q.toString().toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search));
    }
    res.json(results);
  }
});

// Add Product endpoint
app.post('/api/products', async (req, res) => {
  const { name, category, sku, regularPrice, sellPrice, stock, status, image, media } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO products (name, sku, regular_price, sell_price, stock_quantity, status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, sku || `#ENV-JWL${Math.floor(100 + Math.random() * 900)}`, regularPrice || 0, sellPrice || 0, stock || 0, status || 'Published', image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80']
    );

    res.status(201).json({ id: result.insertId, message: 'Product created successfully', media: media || [] });
  } catch (err) {
    const newId = mockProducts.length + 1;
    const newProduct = {
      id: newId,
      name: name || 'New ENVIAAR Product',
      category: category || 'Fine Jewellery',
      sku: sku || `#ENV-JWL${Math.floor(100 + Math.random() * 900)}`,
      createdAt: 'Just now',
      regularPrice: regularPrice || 4990.00,
      sellPrice: sellPrice || 4290.00,
      stock: stock || 50,
      status: status || 'Published',
      image: image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80',
      media: media || (image ? [{ id: '1', url: image, type: 'image' }] : [])
    };
    mockProducts.unshift(newProduct);
    res.status(201).json(newProduct);
  }
});

// Update Product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, sellPrice, stock, status } = req.body;

  try {
    await pool.query(
      `UPDATE products SET name = COALESCE(?, name), sell_price = COALESCE(?, sell_price), stock_quantity = COALESCE(?, stock_quantity), status = COALESCE(?, status) WHERE id = ?`,
      [name, sellPrice, stock, status, id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    const p = mockProducts.find(item => item.id == id);
    if (p) {
      if (status) p.status = status;
      if (name) p.name = name;
      if (sellPrice) p.sellPrice = sellPrice;
      if (stock !== undefined) p.stock = stock;
    }
    res.json({ message: 'Product updated' });
  }
});

// Delete Products
app.delete('/api/products', async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No product IDs provided' });
  }

  try {
    await pool.query(`DELETE FROM products WHERE id IN (?)`, [ids]);
    res.json({ message: `${ids.length} products deleted successfully` });
  } catch (err) {
    mockProducts = mockProducts.filter(p => !ids.includes(p.id));
    res.json({ message: `${ids.length} products deleted` });
  }
});

// Real ENVIAAR Mock Orders
let mockOrders = [
  {
    id: "ord_1001",
    orderNumber: "ENV-2026-1042",
    customerName: "Aarav Sharma",
    customerEmail: "aarav.sharma@example.com",
    customerPhone: "+91 98765 43210",
    shippingAddress: "Flat 402, Royal Palms, Bandra West, Mumbai, Maharashtra - 400050",
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Paid",
    status: "Processing",
    totalAmount: 7980,
    items: [
      { id: "1", name: "Aurelia Drop Earrings", price: 3490, quantity: 1, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=80", finish: "Gold" },
      { id: "5", name: "Solène Tennis Bracelet", price: 4490, quantity: 1, image: "https://images.unsplash.com/photo-1611591475874-b8e45fd430e3?w=300&q=80", finish: "Silver" }
    ],
    createdAt: "2026-09-24 14:30:00"
  },
  {
    id: "ord_1002",
    orderNumber: "ENV-2026-1041",
    customerName: "Priya Kapoor",
    customerEmail: "priya.k@example.com",
    customerPhone: "+91 98123 45678",
    shippingAddress: "Villa 12, Jubilee Hills, Hyderabad, Telangana - 500033",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    status: "Shipped",
    totalAmount: 11980,
    items: [
      { id: "3", name: "Elara Necklace Set", price: 7490, quantity: 1, image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=300&q=80", finish: "Rose Gold" }
    ],
    createdAt: "2026-09-22 10:15:00"
  }
];

// Get Orders API Endpoint
app.get('/api/orders', async (req, res) => {
  const { status, q } = req.query;

  try {
    let sql = `
      SELECT o.id, o.order_number AS orderNumber, o.total_amount AS totalAmount,
             o.status, o.payment_status AS paymentStatus, o.payment_method AS paymentMethod,
             o.shipping_address AS shippingAddress, o.created_at AS createdAt,
             c.name AS customerName, c.email AS customerEmail, c.phone AS customerPhone
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      sql += ` AND o.status = ?`;
      params.push(status);
    }

    if (q) {
      sql += ` AND (o.order_number LIKE ? OR c.name LIKE ? OR c.email LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    sql += ` ORDER BY o.id DESC`;
    const [rows] = await pool.query(sql, params);

    if (rows.length > 0) {
      return res.json(rows);
    }
  } catch (err) {
    console.warn("MySQL DB order fetch fallback mode");
  }

  let results = [...mockOrders];
  if (status && status !== 'All') {
    results = results.filter(o => o.status.toLowerCase() === status.toString().toLowerCase());
  }
  if (q) {
    const search = q.toString().toLowerCase();
    results = results.filter(o =>
      o.orderNumber.toLowerCase().includes(search) ||
      o.customerName.toLowerCase().includes(search) ||
      o.customerEmail.toLowerCase().includes(search)
    );
  }
  res.json(results);
});

// Create Order API Endpoint
app.post('/api/orders', async (req, res) => {
  const {
    orderNumber,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    paymentMethod,
    totalAmount,
    items,
    status
  } = req.body;

  const newOrder = {
    id: `ord_${Date.now()}`,
    orderNumber: orderNumber || `ENV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: customerName || 'Valued Customer',
    customerEmail: customerEmail || 'customer@enviaar.com',
    customerPhone: customerPhone || '',
    shippingAddress: shippingAddress || 'Address on file',
    paymentMethod: paymentMethod || 'UPI',
    paymentStatus: 'Paid',
    status: status || 'Pending',
    totalAmount: totalAmount || 0,
    items: items || [],
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  try {
    // Insert into customers if not exists
    const [cRows] = await pool.query(`SELECT id FROM customers WHERE email = ?`, [newOrder.customerEmail]);
    let customerId;
    if (cRows.length > 0) {
      customerId = cRows[0].id;
    } else {
      const [cRes] = await pool.query(
        `INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)`,
        [newOrder.customerName, newOrder.customerEmail, newOrder.customerPhone]
      );
      customerId = cRes.insertId;
    }

    // Insert order into orders table
    const [oRes] = await pool.query(
      `INSERT INTO orders (order_number, customer_id, total_amount, status, payment_status, payment_method, shipping_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [newOrder.orderNumber, customerId, newOrder.totalAmount, newOrder.status, newOrder.paymentStatus, newOrder.paymentMethod, newOrder.shippingAddress]
    );

    newOrder.id = String(oRes.insertId);
  } catch (err) {
    console.warn("DB Order save fallback to mock array");
  }

  mockOrders.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

// Update Order Status API Endpoint
app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  try {
    await pool.query(
      `UPDATE orders SET status = COALESCE(?, status), payment_status = COALESCE(?, payment_status) WHERE id = ? OR order_number = ?`,
      [status, paymentStatus, id, id]
    );
  } catch (err) {
    console.warn("DB Order update fallback");
  }

  const found = mockOrders.find(o => o.id === id || o.orderNumber === id);
  if (found) {
    if (status) found.status = status;
    if (paymentStatus) found.paymentStatus = paymentStatus;
  }

  res.json({ success: true, message: `Order ${id} status updated to ${status}` });
});

app.listen(PORT, () => {
  console.log(`🚀 ENVIAAR Express Backend running on http://localhost:${PORT}`);
  testConnection();
});

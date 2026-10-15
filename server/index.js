import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { testConnection } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FALLBACK_PRODUCTS_FILE = path.join(__dirname, 'products_fallback.json');
const FALLBACK_REVIEWS_FILE = path.join(__dirname, 'reviews_fallback.json');

const app = express();
const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initial mock customer reviews fallback
const initialMockReviews = [];

function loadFallbackReviews() {
  try {
    if (fs.existsSync(FALLBACK_REVIEWS_FILE)) {
      const data = fs.readFileSync(FALLBACK_REVIEWS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load reviews fallback file:', err.message);
  }
  return initialMockReviews;
}

function saveFallbackReviews(reviews) {
  try {
    fs.writeFileSync(FALLBACK_REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to save reviews fallback file:', err.message);
  }
}

let mockReviews = loadFallbackReviews();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Real ENVIAAR Jewellery mock database fallback
const initialMockProducts = [];

function loadFallbackProducts() {
  try {
    if (fs.existsSync(FALLBACK_PRODUCTS_FILE)) {
      const data = fs.readFileSync(FALLBACK_PRODUCTS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load products fallback file:', err.message);
  }
  return initialMockProducts;
}

function saveFallbackProducts(products) {
  try {
    fs.writeFileSync(FALLBACK_PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to save products fallback file:', err.message);
  }
}

let mockProducts = loadFallbackProducts();

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

const mockUserProfilesMap = new Map();

async function ensureCustomerTableColumns() {
  try {
    await pool.query(`ALTER TABLE customers ADD COLUMN gender VARCHAR(20) DEFAULT NULL`);
  } catch (e) {}
  try {
    await pool.query(`ALTER TABLE customers ADD COLUMN birthday VARCHAR(50) DEFAULT NULL`);
  } catch (e) {}
  try {
    await pool.query(`ALTER TABLE customers ADD COLUMN anniversary VARCHAR(50) DEFAULT NULL`);
  } catch (e) {}
}
ensureCustomerTableColumns().catch(() => {});

// Customer Profile Update Endpoint
app.put('/api/auth/profile', async (req, res) => {
  const { email, name, phone, gender, birthday, anniversary } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const emailKey = email.toLowerCase().trim();
  const existing = mockUserProfilesMap.get(emailKey) || {};
  const updatedUser = {
    ...existing,
    id: existing.id || Date.now(),
    email,
    name: name !== undefined ? name : existing.name,
    phone: phone !== undefined ? phone : existing.phone,
    gender: gender !== undefined ? gender : existing.gender,
    birthday: birthday !== undefined ? birthday : existing.birthday,
    anniversary: anniversary !== undefined ? anniversary : existing.anniversary,
  };

  mockUserProfilesMap.set(emailKey, updatedUser);

  try {
    await pool.query(
      `UPDATE customers SET 
        name = COALESCE(?, name), 
        phone = COALESCE(?, phone), 
        gender = COALESCE(?, gender), 
        birthday = COALESCE(?, birthday), 
        anniversary = COALESCE(?, anniversary) 
       WHERE LOWER(email) = ?`,
      [name || null, phone || null, gender || null, birthday || null, anniversary || null, emailKey]
    );
  } catch (err) {
    console.warn('DB customer profile update fallback:', err.message);
  }

  return res.json({ success: true, user: updatedUser });
});

// Customer Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'Valued Customer';

  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const emailKey = email.toLowerCase().trim();

  try {
    const [existing] = await pool.query('SELECT * FROM customers WHERE LOWER(email) = ?', [emailKey]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const [result] = await pool.query(
      `INSERT INTO customers (name, email, phone, password_hash, status)
       VALUES (?, ?, ?, ?, 'Active')`,
      [fullName, email, phone || null, password || null]
    );

    const user = { id: result.insertId, name: fullName, email, phone: phone || '' };
    mockUserProfilesMap.set(emailKey, user);
    return res.status(201).json({ success: true, message: 'Account created successfully in database', user });
  } catch (err) {
    console.warn('DB customer registration fallback used:', err.message);
    const mockUser = { id: Date.now(), name: fullName, email, phone: phone || '' };
    mockUserProfilesMap.set(emailKey, mockUser);
    return res.status(201).json({ success: true, message: 'Account created successfully', user: mockUser });
  }
});

// Customer Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const emailKey = email.toLowerCase().trim();
  const mockProfile = mockUserProfilesMap.get(emailKey);

  try {
    const [rows] = await pool.query('SELECT * FROM customers WHERE LOWER(email) = ?', [emailKey]);
    if (rows.length > 0) {
      const customer = rows[0];
      if (!customer.password_hash || customer.password_hash === password) {
        const user = {
          id: customer.id,
          name: mockProfile?.name || customer.name,
          email: customer.email,
          phone: mockProfile?.phone || customer.phone || '',
          gender: mockProfile?.gender || customer.gender || '',
          birthday: mockProfile?.birthday || customer.birthday || '',
          anniversary: mockProfile?.anniversary || customer.anniversary || '',
        };
        mockUserProfilesMap.set(emailKey, user);
        return res.json({ success: true, user });
      } else {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    }
  } catch (err) {
    console.warn('DB customer login check fallback used');
  }

  const user = mockProfile || {
    id: Date.now(),
    name: email.split('@')[0] || 'Customer',
    email,
    phone: '',
  };

  mockUserProfilesMap.set(emailKey, user);

  return res.json({
    success: true,
    user
  });
});

// Mock Customers Fallback List
let mockCustomers = [];

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

    const formatted = rows.map((r) => ({
      ...r,
      tier: (r.totalSpent || 0) >= 10000 ? "VIP Circle" : "Member",
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : "2024-01-01"
    }));
    return res.json(formatted);
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
    const [rRows] = await pool.query('SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders');
    const [oRows] = await pool.query('SELECT COUNT(*) AS total FROM orders');
    const [cRows] = await pool.query('SELECT COUNT(*) AS total FROM customers');

    res.json({
      totalProducts: pRows[0]?.total || mockProducts.length,
      totalRevenue: parseFloat(rRows[0]?.total || 0.00),
      totalOrders: oRows[0]?.total || 0,
      totalCustomers: cRows[0]?.total || 0,
      trends: {
        products: '+0.0%',
        revenue: '+0.0%',
        orders: '+0.0%',
        customers: '+0.0%'
      }
    });
  } catch (err) {
    res.json({
      totalProducts: mockProducts.length,
      totalRevenue: 0.00,
      totalOrders: 0,
      totalCustomers: 0,
      trends: {
        products: '+0.0%',
        revenue: '+0.0%',
        orders: '+0.0%',
        customers: '+0.0%'
      }
    });
  }
});

async function resolveCategoryId(categoryName, productName) {
  const cat = (categoryName || '').trim() || (
    productName && productName.toLowerCase().includes('earring') ? 'Earrings' :
    productName && productName.toLowerCase().includes('necklace') ? 'Necklaces' :
    productName && productName.toLowerCase().includes('bracelet') ? 'Bracelets' :
    productName && productName.toLowerCase().includes('ring') ? 'Rings' :
    productName && productName.toLowerCase().includes('kada') ? 'Kada' :
    productName && productName.toLowerCase().includes('mangalsutra') ? 'Mangalsutra' :
    productName && productName.toLowerCase().includes('men') ? 'Men’s' :
    'Earrings'
  );

  try {
    const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const [rows] = await pool.query('SELECT id FROM categories WHERE slug = ? OR LOWER(name) = ? LIMIT 1', [slug, cat.toLowerCase()]);
    if (rows.length > 0) {
      return rows[0].id;
    }
    const [inserted] = await pool.query('INSERT INTO categories (name, slug) VALUES (?, ?)', [cat, slug]);
    return inserted.insertId;
  } catch (err) {
    console.warn('Failed to resolve categoryId:', err.message);
    return null;
  }
}

// Get Products endpoint
app.get('/api/products', async (req, res) => {
  const { status, q } = req.query;

  try {
    let sql = `
      SELECT p.id, p.name, p.sku, p.regular_price AS regularPrice, p.sell_price AS sellPrice,
             p.stock_quantity AS stock, p.status, p.image_url AS image, p.created_at AS createdAt,
             COALESCE(c.name,
               CASE 
                 WHEN LOWER(p.name) LIKE '%earring%' THEN 'Earrings'
                 WHEN LOWER(p.name) LIKE '%necklace%' THEN 'Necklaces'
                 WHEN LOWER(p.name) LIKE '%bracelet%' THEN 'Bracelets'
                 WHEN LOWER(p.name) LIKE '%ring%' THEN 'Rings'
                 WHEN LOWER(p.name) LIKE '%bangle%' OR LOWER(p.name) LIKE '%kada%' THEN 'Kada'
                 WHEN LOWER(p.name) LIKE '%mangalsutra%' THEN 'Mangalsutra'
                 WHEN LOWER(p.name) LIKE '%men%' THEN 'Men’s'
                 ELSE 'Earrings'
               END
             ) AS category
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
  const { id, name, category, sku, regularPrice, sellPrice, priceUSD, priceAED, stock, status, image, media, description, details, materialsFinish } = req.body;

  // Ensure image_url safely fits within standard MySQL VARCHAR(255) if it's a huge Base64 data string
  const safeImageUrl = (image && image.length < 500)
    ? image
    : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80';

  const productObj = {
    id: id || Date.now(),
    name: name || 'New ENVIAAR Product',
    category: category || 'Fine Jewellery',
    sku: sku || `#ENV-JWL${Math.floor(100 + Math.random() * 900)}`,
    description: description || 'A refined ENVIAAR piece made for effortless transitions.',
    details: details || undefined,
    materialsFinish: materialsFinish || undefined,
    createdAt: 'Just now',
    regularPrice: regularPrice || 4990.00,
    sellPrice: sellPrice || 4290.00,
    priceUSD: priceUSD ? parseFloat(priceUSD) : undefined,
    priceAED: priceAED ? parseFloat(priceAED) : undefined,
    stock: stock || 50,
    status: status || 'Published',
    image: image || safeImageUrl,
    media: media || (image ? [{ id: '1', url: image, type: 'image' }] : [])
  };

  try {
    const categoryId = await resolveCategoryId(productObj.category, productObj.name);

    const [result] = await pool.query(
      `INSERT INTO products (name, sku, category_id, description, regular_price, sell_price, stock_quantity, status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productObj.name,
        productObj.sku,
        categoryId,
        productObj.description,
        productObj.regularPrice,
        productObj.sellPrice,
        productObj.stock,
        productObj.status,
        safeImageUrl
      ]
    );

    productObj.id = result.insertId;
    const existingIndex = mockProducts.findIndex(p => String(p.id) === String(productObj.id) || p.name.toLowerCase().trim() === productObj.name.toLowerCase().trim());
    if (existingIndex >= 0) {
      mockProducts[existingIndex] = { ...mockProducts[existingIndex], ...productObj };
    } else {
      mockProducts.unshift(productObj);
    }
    saveFallbackProducts(mockProducts);
    res.status(201).json(productObj);
  } catch (err) {
    console.warn('MySQL DB product insert fallback used:', err.message);

    const existingIndex = mockProducts.findIndex(p => String(p.id) === String(productObj.id) || p.name.toLowerCase().trim() === productObj.name.toLowerCase().trim());
    if (existingIndex >= 0) {
      mockProducts[existingIndex] = { ...mockProducts[existingIndex], ...productObj };
    } else {
      mockProducts.unshift(productObj);
    }
    saveFallbackProducts(mockProducts);
    res.status(201).json(productObj);
  }
});

// Update Product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, sellPrice, priceUSD, priceAED, stock, status, description, details, materialsFinish } = req.body;

  try {
    await pool.query(
      `UPDATE products SET name = COALESCE(?, name), description = COALESCE(?, description), sell_price = COALESCE(?, sell_price), stock_quantity = COALESCE(?, stock_quantity), status = COALESCE(?, status) WHERE id = ?`,
      [name, description, sellPrice, stock, status, id]
    );
  } catch (err) {
    console.warn('MySQL DB product update fallback used:', err.message);
  }

  const p = mockProducts.find(item => item.id == id);
  if (p) {
    if (status) p.status = status;
    if (name) p.name = name;
    if (description) p.description = description;
    if (details !== undefined) p.details = details;
    if (materialsFinish !== undefined) p.materialsFinish = materialsFinish;
    if (sellPrice) p.sellPrice = sellPrice;
    if (priceUSD !== undefined) p.priceUSD = priceUSD ? parseFloat(priceUSD) : undefined;
    if (priceAED !== undefined) p.priceAED = priceAED ? parseFloat(priceAED) : undefined;
    if (stock !== undefined) p.stock = stock;
    saveFallbackProducts(mockProducts);
  }
  res.json({ message: 'Product updated' });
});

const deletedServerProductIds = new Set();

// Delete Products
app.delete('/api/products', async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No product IDs provided' });
  }

  ids.forEach((id) => deletedServerProductIds.add(String(id)));

  try {
    await pool.query(`DELETE FROM products WHERE id IN (?)`, [ids]);
  } catch (err) {
    console.warn('MySQL DB product delete fallback used:', err.message);
  }

  mockProducts = mockProducts.filter((p) => !ids.includes(p.id) && !ids.includes(String(p.id)));
  saveFallbackProducts(mockProducts);
  res.json({ message: `${ids.length} products deleted` });
});

// Real ENVIAAR Mock Orders
let mockOrders = [];

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

    return res.json(rows);
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

// GET Reviews Endpoint
app.get('/api/reviews', (req, res) => {
  const { productId } = req.query;
  if (productId) {
    const filtered = mockReviews.filter(r => String(r.productId) === String(productId));
    return res.json(filtered);
  }
  return res.json(mockReviews);
});

// POST Review Endpoint (Text-Only Reviews)
app.post('/api/reviews', (req, res) => {
  const { productId, authorName, authorEmail, rating, title, comment } = req.body;

  if (!productId || !comment) {
    return res.status(400).json({ error: 'Product ID and review comment are required.' });
  }

  const newReview = {
    id: req.body.id || `rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    productId: String(productId),
    authorName: authorName ? String(authorName).trim() : 'Verified Buyer',
    authorEmail: authorEmail ? String(authorEmail).trim() : '',
    rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
    title: title ? String(title).trim() : 'Great Jewellery Piece',
    comment: String(comment).trim(),
    createdAt: new Date().toISOString().split('T')[0],
    verifiedPurchase: true
  };

  const existingIndex = mockReviews.findIndex(r => r.id === newReview.id);
  if (existingIndex >= 0) {
    mockReviews[existingIndex] = newReview;
  } else {
    mockReviews.unshift(newReview);
  }

  saveFallbackReviews(mockReviews);
  return res.status(201).json({ success: true, review: newReview });
});

// DELETE Review Endpoint (Admin Review Deletion / Moderation)
app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = mockReviews.length;
  mockReviews = mockReviews.filter(r => String(r.id) !== String(id));

  saveFallbackReviews(mockReviews);

  if (mockReviews.length < initialLength) {
    return res.json({ success: true, message: `Review ${id} deleted successfully.` });
  } else {
    return res.status(404).json({ error: `Review ${id} not found.` });
  }
});

// Serve frontend static files if dist folder exists (Single domain deployment on Hostinger)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.warn('⚠️ Frontend dist directory not found at:', distPath);
  app.get('/', (req, res) => {
    res.send('ENVIAAR API Backend is running.');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ENVIAAR Express Backend running on http://0.0.0.0:${PORT}`);
  testConnection();
});

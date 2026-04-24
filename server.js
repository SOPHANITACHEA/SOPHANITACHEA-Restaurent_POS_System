const express = require('express');
// const mongoose = require('mongoose');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// MONGODB CONNECT
// =========================
// mongoose.connect('mongodb://127.0.0.1:27017/web_pos_y2')
// .then(() => console.log("✅ MongoDB Connected"))
// .catch(err => console.log(err));


// =========================
// SCHEMA
// =========================
const orderSchema = new mongoose.Schema({
  orderId: String,
  tableNumber: Number,
  items: Array,
  subtotal: Number,
  discount: Number,
  total: Number,
  cash: Number,
  change: Number,
  createdAt: String,
  status: String
});

const Order = mongoose.model('Order', orderSchema);


// =========================
// TELEGRAM CONFIG
// =========================
const BOT_TOKEN = '8450417975:AAHv3hMGfwo93mMg4GzmJzok6hMeorpdu4E';
const CHAT_ID = '-1003856624087';



// =========================
// POST ORDER
// =========================
app.post('/orders', async (req, res) => {
  const order = req.body;

  // ✅ VALIDATION HERE
  if (!order.items || order.items.length === 0) {
    return res.status(400).json({ message: "Order must have items" });
  }

  try {
    // SAVE TO MONGODB
    const newOrder = new Order(order);
    await newOrder.save();

    // TELEGRAM
    if (order.status === 'Completed') {
      const text = `
🧾 New Paid Order
ID: ${order.orderId}
Total: $${order.total}
Items: ${order.items.map(i => i.name + ' x' + i.quantity).join(', ')}
`;

      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          chat_id: CHAT_ID,
          text
        }
      );

      console.log('📩 Telegram sent');
    }

    res.status(201).json(newOrder);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



// =========================
// GET ORDERS
// =========================
app.get('/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});


// =========================
// UPDATE ORDER
// =========================
app.put('/orders/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (updated.status === 'Completed') {
      const text = `
🧾 PreOrder Paid
ID: ${updated.orderId}
Total: $${updated.total}
Items: ${updated.items.map(i => i.name + ' x' + i.quantity).join(', ')}
`;

      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          chat_id: CHAT_ID,
          text
        }
      );
    }

    res.json(updated);

  } catch (err) {
    res.status(500).json(err);
  }
});

// =========================
// DELETE ORDER
// =========================
app.delete('/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});


// =========================
// DELETE EMPTY ORDERS
// =========================
app.delete('/orders/empty', async (req, res) => {
  try {
    const result = await Order.deleteMany({ items: { $size: 0 } });

    res.json({
      message: "Empty orders deleted",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// =========================
// START SERVER
// =========================
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
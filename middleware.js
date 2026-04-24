// const axios = require('axios');

// module.exports = (req, res, next) => {

//   // only trigger when creating order
//   if (req.method === 'POST' && req.path === '/orders') {

//     const order = req.body;

//     const BOT_TOKEN = '8450417975:AAEM7vkXoqfr7YZ3rIsCfVu6mSLwcR3jcR4';
// const CHAT_ID = '748912934';

// const drinkList = order.items
//   .map(i => `${i.name} x${i.quantity}`)
//   .join(', ');

// const message =
// `🧾 New Order
// Invoice: ${order.orderId}
// Total: $${order.total}
// Items: ${drinkList}`;

// axios.post(
//   `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
//   {
//     chat_id: CHAT_ID,
//     text: message
//   }
// )
// .then(() => {
//   console.log('Telegram sent');
// })
// .catch(err => {
//   console.log('Telegram error:', err.response?.data || err.message);
// });

//   }

//   next();
// };

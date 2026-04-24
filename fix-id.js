const fs = require('fs');

const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

db.orders = db.orders.map(o => {
  if (!o.id) {
    o.id = Math.random().toString(36).substring(2, 8);
  }
  return o;
});

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

console.log("IDs added to all orders");

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);


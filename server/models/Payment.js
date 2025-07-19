import mongoose from 'mongoose';

const paymentHistorySchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
  },
  amountPaid: {
    type: Number,
    required: true
  },
  amountDue: {
    type: Number,
    default: 0
    
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    default: 'cash',
    enum: ['cash', 'online', 'upi', 'bank']
  },
  
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

export default mongoose.model('PaymentHistory', paymentHistorySchema);

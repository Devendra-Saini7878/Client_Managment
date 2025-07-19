import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  channelName: String,
  clientName: String,
  title: String,
  date: String,
  defaultType: String,
  videoType: String,
  posterQuality: String,
  audioType: String,
  price: Number,
  paymentStatus: String,
  amountPaid: {
    type: Number,
    default: 0
  },
  amountDue: {
    type: Number,
    default: 0
  },
  userId: String,
});

export default mongoose.model('FormData', formSchema);

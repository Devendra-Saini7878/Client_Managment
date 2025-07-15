import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  channelName: String,
  clientName: String,
  title: String,
  date: String,
  datePayment: String,
  defaultType: String,
  videoType: String,
  posterQuality: String,
  audioType: String,
  price: Number,
  paymentStatus: String,
  userId: String
});

export default mongoose.model('FormData', formSchema);

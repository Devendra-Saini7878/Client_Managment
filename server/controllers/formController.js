import FormData from '../models/FormData.js';

export const createForm = async (req, res) => {
  const data = { ...req.body, userId: req.user.id };
  console.log(data);
  const form = await FormData.create(data);
  res.status(201).json(form);
};

export const getForms = async (req, res) => {
  const forms = await FormData.find({ userId: req.user.id });
  res.json(forms);
};

export const updateForm = async (req, res) => {
  const updated = await FormData.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  res.json(updated);
};
console.log(FormData)
export const deleteForm = async (req, res) => {
  const deleted = await FormData.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) {
    return res.status(404).json({ message: 'Form not found' });
  }
  res.json({ message: 'Form deleted' });
};

// NEW: Channel summary controller
export const getChannelSummary = async (req, res) => {
  const { channelName } = req.query;
  if (!channelName) return res.status(400).json({ message: 'Channel name is required' });

  const forms = await FormData.find({ userId: req.user.id, channelName });

  const total = forms.reduce((sum, f) => sum + f.price, 0);
  const paid = forms.filter(f => f.paymentStatus === 'yes').reduce((sum, f) => sum + f.price, 0);
  const due = total - paid;

  res.json({ channelName, total, paid, due });
};


// ✅ Route to pay a custom amount
export const payChannelDues = async (req, res) => {
  const { channelName, amount, method = 'cash', paidBy } = req.body;
  if (!channelName || !amount || !paidBy) {
    return res.status(400).json({ message: 'Channel name, amount, and paidBy are required.' });
  }
  

  
}
export const getPaymentHistory = async (req, res) => {
  const history = await PaymentHistory.find({ userId: req.user.id });
  res.json(history);
};
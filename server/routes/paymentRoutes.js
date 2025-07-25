import express from "express";
import auth from "../middleware/auth.js";
import FormData from "../models/FormData.js";
import PaymentHistory from "../models/Payment.js";

const router = express.Router();

// ✅ Route to pay a custom amount
router.post("/pay", auth, async (req, res) => {
  const { channelName, amount, method = "cash" } = req.body;

  if (!channelName || !amount) {
    return res
      .status(400)
      .json({ message: "Channel name and amount are required." });
  }

  try {
    // Changed from findById to find since we're querying by multiple fields
    const entries = await FormData.find({
      userId: req.user.id,
      channelName: { $regex: new RegExp(`^${channelName}$`, "i") },
      paymentStatus: { $in: ["no", "partial"] },
    }).sort({ date: 1 });

    if (!entries || entries.length === 0) {
      return res
        .status(404)
        .json({ message: "No unpaid entries found for this channel" });
    }
    let payAmount = amount;
    let amountPaid = 0;
    
    for (let entry of entries) {
      const remainingDue = entry.price - (entry.amountPaid || 0);
    
      if (payAmount >= remainingDue) {
        // Fully pay this entry
        entry.paymentStatus = "yes";
        entry.datePayment = new Date();
        entry.amountPaid = (entry.amountPaid || 0) + remainingDue;
        entry.amountDue = 0;
        amountPaid += remainingDue;
        payAmount -= remainingDue;
      } else {
        // Partially pay this entry
        entry.paymentStatus = "partial";
        entry.datePayment = new Date();
        entry.amountPaid = (entry.amountPaid || 0) + payAmount;
        entry.amountDue = remainingDue - payAmount;
        amountPaid += payAmount;
        payAmount = 0;
      }
    
      await entry.save();
    
      if (payAmount <= 0) break;
    }
    



      
      if (amountPaid > 0) {
        const updated = await FormData.find({
          userId: req.user.id,
          channelName: { $regex: new RegExp(`^${channelName}$`, "i") },

          price: { $ne: 0 },
        });


      
        const total = updated.reduce((sum, e) => sum + e.price, 0);
        const paid = updated.reduce((sum, e) => sum + (e.amountPaid || 0), 0);
        const due = total - paid;
        const clientName = entries[0]?.clientName || "Unknown";

        await PaymentHistory.create({
          channelName,
          clientName,
          amountPaid,
          amountDue: due, // ✅ actual current due
          method,
          paymentDate: new Date(),
          paidBy: req.user.email || "Unknown",
          userId: req.user.id,
        });
        return res.status(200).json({
          message: "Payment recorded.",
          updatedEntries: updated,
          updatedSummary: { total, paid, due },
        });
      }
    }      
  
  
  catch (err) {
    res.status(500).json({ message: "Payment failed." });
  }
});


// ✅ Payment History with optional channel filter
router.get("/history", auth, async (req, res) => {
  try {
    const { channelName } = req.query;

    const query = { userId: req.user.id };
    if (channelName) {
      query.channelName = { $regex: new RegExp(`^${channelName}$`, "i") };
    }

    const history = await PaymentHistory.find(query).sort({
      paymentDate: -1,
    });

    res.json(history);
  } catch (err) {
    console.error("Payment history fetch error:", err);
    res.status(500).json({ message: "Failed to fetch payment history." });
  }
});


// ✅ Route to mark all dues as paid

router.post("/pay-all", auth, async (req, res) => {
  const { channelName, method = "cash" } = req.body;

  if (!channelName)
    return res.status(400).json({ message: "Channel name is required" });

  try {
    // Get unpaid or partially paid entries
    const entries = await FormData.find({
      userId: req.user.id,
      channelName: { $regex: new RegExp(`^${channelName}$`, "i") },
      paymentStatus: { $in: ["no", "partial"] }
    }).sort({ date: 1 });

    let totalAmountPaid = 0;

    for (let entry of entries) {
      const alreadyPaid = entry.amountPaid || 0;
      const remainingDue = entry.price - alreadyPaid;

      if (remainingDue > 0) {
        entry.paymentStatus = "yes";
        entry.datePayment = new Date();
        entry.amountPaid = alreadyPaid + remainingDue;
        entry.amountDue = 0;

        totalAmountPaid += remainingDue;

        await entry.save();
      }
    }

    const clientName = entries[0]?.clientName || "Unknown";

    // Only create history if some payment was made
    if (totalAmountPaid > 0) {
      await PaymentHistory.create({
        channelName,
        clientName,
        amountPaid: totalAmountPaid,
        method,
        paymentDate: new Date(),
        paidBy: req.user.email || "Unknown",
        userId: req.user.id,
        amountDue: 0 // All dues are cleared
      });
    }

    const updated = await FormData.find({
      userId: req.user.id,
      channelName: { $regex: new RegExp(`^${channelName}$`, "i") },
      price: { $ne: 0 }
    });

    const total = updated.reduce((sum, e) => sum + e.price, 0);
    const paid = updated.reduce((sum, e) => sum + (e.amountPaid || 0), 0);
    const due = total - paid;

    res.json({
      message: "All dues cleared.",
      updatedEntries: updated,
      updatedSummary: { total, paid, due }
    });

  } catch (err) {
    console.error("Pay-All Error:", err);
    res.status(500).json({ message: "Error clearing dues." });
  }
});



// ✅ Payment History
router.get("/history", auth, async (req, res) => {
  try {
    const history = await PaymentHistory.find({ userId: req.user.id }).sort({
      paymentDate: -1,
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payment history." });
  }
});

export default router;

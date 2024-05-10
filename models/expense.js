import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    title: { type: String, required: true },
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;

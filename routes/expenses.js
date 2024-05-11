import express from 'express';
import Expense from '../models/expense.js';

const router = express.Router();

// Define your routes here
router.post('/', (req, res) => {
    const user = req.user;
    const { type, amount, title } = req.body;
    
    if(!type || !title || !amount) {
        return res.json({message: 'type, amount, title is mandatory'})
    }

    const expense = new Expense({
        userId: user.userId,
        type: type,
        amount: amount,
        title: title
    });

    try {
        expense.save();
    } catch (error) {
        res.json({
            message: 'Error while saving the expense.',
        })
    }

    res.json({
        message: 'Expense saved successfully.',
        expense: expense
    });
});

// Define your routes here
router.put('/:id', async (req, res) => {
    const _id = req.params['id']; 
    const expense = await Expense.findOne({ _id });
    
    if (!expense) {
        return res.json({ message: `User done not have the expense having id ${_id}.` })
    }

    await Expense.updateOne({ _id }, { ...req.body });

    res.json({
        message: 'Expense updated successfully.'
    });
});

// Define your routes here
router.get('/', async (req, res) => {
    const user = req.user;
    const expenses = await Expense.find({ userId: user.userId });

    res.json({
        expenses: expenses
    });
});

export default router;

import Transaction from '../models/transactions.model.js';

export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id 
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error); 
  }
};


export const getTransactions = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'Admin') {
      query = Transaction.find();
    } else {
      query = Transaction.find({ user: req.user._id });
    }

    const transactions = await query.sort({ date: -1 });
    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    next(error);
  }
};


export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.status(200).json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    next(error);
  }
};


export const getTransactionSummary = async (req, res, next) => {
  try {

    const filter = req.user.role === 'Admin' ? {} : { user: req.user._id };
    const transactions = await Transaction.find(filter);

    const summary = transactions.reduce((acc, curr) => {
      if (curr.type === 'income') acc.totalIncome += curr.amount;
      if (curr.type === 'expense') acc.totalExpenses += curr.amount;
      return acc;
    }, { totalIncome: 0, totalExpenses: 0 });

    res.status(200).json({ 
      success: true, 
      data: { 
        ...summary, 
        netBalance: summary.totalIncome - summary.totalExpenses 
      } 
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryStats = async (req, res, next) => {
  try {
    const filter = req.user.role === 'Admin' ? {} : { user: req.user._id };
    
    const stats = await Transaction.aggregate([
      { $match: filter }, 
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
import { Router } from 'express';
import { 
  createTransaction, 
  getTransactions, 
  getTransactionSummary, 
  getCategoryStats,
  deleteTransaction
} from '../controllers/transacctions.controller.js';
import { authorize, checkRole } from '../middlewares/auth.middleware.js';

const transactionRouter = Router();

transactionRouter.get('/', authorize, getTransactions);

transactionRouter.post('/', authorize, checkRole(['Admin']), createTransaction);

transactionRouter.put('/:id', authorize, checkRole(['Admin']), (req, res) => {
  res.send({ title: 'UPDATE financial record (Admin Only)' });
});

transactionRouter.delete('/:id', authorize, checkRole(['Admin']), deleteTransaction);

transactionRouter.get('/summary', authorize, checkRole(['Analyst', 'Admin']), getTransactionSummary);

transactionRouter.get('/categories', authorize, checkRole(['Analyst', 'Admin']), getCategoryStats);

transactionRouter.get('/user/:id', authorize, checkRole(['Admin']), (req, res) => {
  res.send({ title: 'GET records for specific user (Admin Only)' });
});

export default transactionRouter;
import {Router} from 'express';
const userRouter=Router();
import {getUsers,getUser, deleteUser, updateUser} from '../controllers/user.controller.js'
import { authorize, checkRole } from '../middlewares/auth.middleware.js';


userRouter.get('/',getUsers);
userRouter.get('/:id',authorize,getUser);
userRouter.put('/:id',authorize,checkRole(['Admin']),updateUser);
userRouter.delete('/:id',authorize,checkRole(['Admin']),deleteUser);

export default userRouter;
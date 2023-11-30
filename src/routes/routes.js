import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateToken } from "../controller/updateToken.js";

export const routes = express.Router();

routes.post('/register', createUser)

routes.get('/', (req, res) => {
    res.send("Server Running!")
})

routes.post('/users/register', userController.createUser);
routes.post('/users/login', userController.login);
routes.get('/users/token', updateToken)
routes.get('/users/current', authMiddleware, userController.getUser);
routes.delete('/users/logout', authMiddleware, userController.logout);


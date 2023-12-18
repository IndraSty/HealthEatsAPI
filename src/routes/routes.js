import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateToken } from "../controller/updateToken.js";
import foodController from "../controller/food-controller.js";

export const routes = express.Router();

routes.get('/', (req, res) => {
    res.send("Server Running!")
})

routes.post('/users/register', userController.createUser);
routes.post('/users/login', userController.login);
routes.get('/users/token', updateToken)
routes.get('/users/current', authMiddleware, userController.getUser);
routes.delete('/users/logout', authMiddleware, userController.logout);
routes.get('/foods/random', authMiddleware, foodController.getRandomFood);
routes.get('/foods', authMiddleware, foodController.getFoods);
routes.get('/foods/:foodId', authMiddleware, foodController.getFoodById);
routes.post('/predictions', authMiddleware, foodController.predictionAndRecommendations);


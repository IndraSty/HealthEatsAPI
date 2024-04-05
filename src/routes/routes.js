import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateToken } from "../controller/updateToken.js";
import foodController from "../controller/food-controller.js";
import Multer from "multer";


export const routes = express.Router();

const multer = new Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

routes.get('/', (req, res) => {
    res.send("Server Running!")
})

routes.post('/users/register', userController.createUser);
routes.post('/users/login', userController.login);
routes.get('/users/token', updateToken)
routes.get('/users/current', authMiddleware, userController.getUser);
routes.post('/users/current/update', multer.single('file'), authMiddleware, userController.updateuser);
routes.delete('/users/logout', authMiddleware, userController.logout);

routes.get('/foods/random', authMiddleware, foodController.getRandomFood);
routes.get('/foods', authMiddleware, foodController.getFoods);
routes.get('/foods/all', authMiddleware, foodController.getAllFoods);
routes.get('/foods/:foodId', authMiddleware, foodController.getFoodById);
routes.post('/predictions', authMiddleware, foodController.predictionAndRecommendations);

routes.post('/foods/favorite/:foodId', authMiddleware, foodController.addFavorite);
routes.delete('/foods/favorite/:foodId', authMiddleware, foodController.rmFavorite);
routes.get('/foods/favorite/all', authMiddleware, foodController.getAllFavorite);


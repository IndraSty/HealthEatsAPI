// import * as tf from "@tensorflow/tfjs-node";
import * as tf from "@tensorflow/tfjs-node";
import { prisma } from "../application/database.js";

const getFoods = async (req, res, next) => {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const offset = limit * page
    const totalRows = await prisma.foods.count({
        where: {
            food_name: {
                contains: search,
            },
        },
    });

    const totalPage = Math.ceil(totalRows / limit);
    const result = await prisma.foods.findMany({
        where: {
            food_name: {
                contains: search,
            },
        },
        orderBy: {
            id_food: "desc",
        },
        skip: offset,
        take: limit,
    });
    res.status(200).json({
        result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
    });

}

const getRandomFood = async (req, res, next) => {
    try {
        const userId = req.userId;
        const foods = await prisma.foods.findMany({
            where: {
                food_name: {
                    not: ""
                }
            },
            orderBy: {
                id_food: "asc"
            },
            include: {
                favorite: {
                    where: {
                        id_user: userId
                    },
                    select: {
                        isFavorite: true
                    }
                }
            }
        });

        for (let i = foods.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [foods[i], foods[j]] = [foods[j], foods[i]]
        }

        const randomFood = foods.slice(0, 6)

        res.status(200).json({
            result: randomFood
        })
    } catch (error) {
        res.status(404).json({
            msg: "No Foods Can Display"
        });
    }
}

const getFoodById = async (req, res, next) => {
    try {
        const foodId = parseInt(req.params.foodId);
        const userId = req.userId;

        const checkFoodId = await prisma.foods.count({
            where: {
                id_food: foodId
            }
        });
        if (checkFoodId !== 1) return res.status(404).json({
            msg: "Food Id is Not Found!"
        })

        const food = await prisma.foods.findUnique({
            where: {
                id_food: foodId
            },
            include: {
                favorite: {
                    where: {
                        id_user: userId
                    },
                    select: {
                        isFavorite: true
                    }
                }
            }
        });


        res.status(200).json({
            result: food
        })
    } catch (error) {
        res.status(404).json({
            msg: "Food Id is Not Found!"
        })
    }
}

const predictionAndRecommendations = async (req, res) => {
    const jawaban = req.body.input_data;
    const userId = req.userId;
    console.log(userId)

    async function loadModel() {
        try {
            const model = await tf.loadLayersModel("../model/model.json");
            console.log('Model loaded successfully');
            return model;
        } catch (err) {
            console.error('Error loading model', err);
            throw err;  // Melempar kesalahan agar dapat ditangani di luar fungsi ini
        }
    }

    try {
        const model = await loadModel();
        const input = tf.tensor2d([jawaban]);

        const output = model.predict(input);
        const predictionIndex = output.argMax(-1).dataSync()[0];
        const maxVal = output.max().dataSync()[0] * 100;

        //   output.print();
        const penyakit = ['Sehat', 'Stroke', 'Hipertensi'];
        const prediksi = penyakit[predictionIndex];

        const disease = await prisma.diseases.findUnique({
            where: {
                id_disease: predictionIndex
            },
            select: {
                description: true
            }
        })

        const result = await prisma.details_disease.findMany({
            where: {
                id_disease: predictionIndex
            },
            select: {
                id_details: true,
                id_disease: true,
                foods: {
                    select: {
                        food_name: true,
                        image: true
                    }
                },
            }
        });

        const recomen = await prisma.recommendations.create({
            data: {
                id_user: userId,
            },
            
        });

        const deTailsid = result.map((idDetails) => idDetails.id_details);
        console.log(deTailsid)

        for (let index = 0; prediksi === "Sehat" ? index < 7 : index < deTailsid.length; index++) {
            await prisma.detail_recommendations.create({
                data: {
                    id_recommendation: recomen.id_recommendation,
                    id_details: deTailsid[index]
                }
            })
            // console.log(deTailsid[index])


        }

        const foods = await prisma.foods.findMany({
            where: {
                food_name: {
                    not: ""
                }
            }
        });

        for (let i = 11; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [foods[i], foods[j]] = [foods[j], foods[i]]
        }

        const randomFood = foods.slice(0, 6)


        prediksi === "Sehat" ? res.status(200).json({
            result: {
                message: "Sukses Melakukan Prediksi",
                penyakit: prediksi,
                persentase: `${maxVal.toFixed(2)}%`,
                description: disease.description,
                recommendations: randomFood
            }
        }) :
            res.status(200).json({
                result: {
                    message: "Sukses Melakukan Prediksi",
                    penyakit: prediksi,
                    persentase: `${maxVal.toFixed(2)}%`,
                    description: disease.description,
                    recommendations: result
                }
            });
    } catch (err) {
        console.error('Error during prediction', err);
        res.status(500).json({ error: 'An error occurred during prediction' });
    }
}

const getAllFoods = async (req, res, next) => {
    try {
        const userId = req.userId;
        const foods = await prisma.foods.findMany({
            where: {
                food_name: {
                    not: ""
                }
            },
            orderBy: {
                id_food: "asc"
            },
            include: {
                favorite: {
                    where: {
                        id_user: userId
                    },
                    select: {
                        isFavorite: true
                    }
                }
            }
        });

        console.log(foods.length)

        return res.status(200).json({
            result: foods
        })
    } catch (error) {
        res.status(404).json({
            msg: "No Foods Can Display"
        });
    }
}

const addFavorite = async (req, res, next) => {
    try {
        const foodId = parseInt(req.params.foodId);
        const userId = req.userId;

        const user = await prisma.users.findUnique({
            where: {
                id_user: userId
            }
        });

        if (user) {
            const result = await prisma.favorite.create({
                data: {
                    id_user: userId,
                    id_food: foodId
                }
            });

            return res.status(200).json({
                result
            })
        } else {
            res.status(404).json({
                msg: "User Not Found!"
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Something went wrong while add favorite"
        });
    }
}

const rmFavorite = async (req, res, next) => {
    try {
        const foodId = parseInt(req.params.foodId);
        const userId = req.userId;

        const user = await prisma.users.findUnique({
            where: {
                id_user: userId
            }
        });

        if (user) {
            const favorite = await prisma.favorite.findFirst({
                where: {
                    id_food: foodId,
                    id_user: userId
                }
            });

            if (favorite) {
                await prisma.favorite.delete({
                    where: {
                        id: favorite.id
                    }
                })

                return res.status(200).json({
                    message: "Success Remove from Favorite"
                })
            } else {
                res.status(404).json({
                    msg: "Favorite Id Not Found!"
                });
            }
        } else {
            res.status(404).json({
                msg: "User Not Found!"
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Something went wrong while remove favorite"
        });
    }
}

const getAllFavorite = async (req, res, next) => {
    try {
        const userId = req.userId;
        const favorite = await prisma.favorite.findMany({
            where: {
                id_user: userId
            },
            include: {
                foods: true
            }
        });

        if (favorite.length > 0) {
            res.status(200).json({
                result: favorite
            })
        } else {
            res.status(404).json({
                msg: "No Favorite item Can Display"
            });
        }

    } catch (error) {
        res.status(500).json({
            msg: "Something went wrong while get favorite"
        });
    }
}


export default {
    getFoods,
    getRandomFood,
    getFoodById,
    predictionAndRecommendations,
    getAllFoods,
    addFavorite,
    rmFavorite,
    getAllFavorite
}
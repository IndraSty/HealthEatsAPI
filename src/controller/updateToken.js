import jwt from "jsonwebtoken";
import { prisma } from "../application/database.js";

export const updateToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ errors: "Unauthorization" });

        const user = await prisma.users.findFirst({
            where: {
                refreshToken: refreshToken
            },
            select: {
                id_user: true,
                email: true,
                name: true
            }
        });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ errors: "Forbidden" });

            const userId = user.id_user;
            const email = user.email;
            const name = user.name;

            const accessToken = jwt.sign({ userId, email, name }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30s'
            });

            return res.status(200).json({
                accessToken
            });
        })
    } catch (error) {
        return res.status(403).json({ errors: "Forbidden" });
    }
}
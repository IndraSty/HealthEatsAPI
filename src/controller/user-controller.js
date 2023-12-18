import { prisma } from "../application/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { response, responseError } from "../response/response.js";

const isValidGmail = (email) => {
  const gmailRegex = /^[a-zA-Z0-9._-]+@gmail.com$/;
  return gmailRegex.test(email);
}

// register 
const createUser = async (req, res, next) => {
  const { name, email, password } = req.body
  try {
    // cek pada database apakah email sudah tersedia
    const emailExist = await prisma.users.count({
      where: {
        email: email
      }
    })
    const validEmail = isValidGmail(email)
    if (!validEmail) {
      return responseError(400, "Email must end with @gmail.com domain", res)
    }
    if (emailExist === 1) {
      return responseError(400, "Email already exist", res)
    }

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
      select: {
        id_user: true,
        email: true,
        name: true,
        born: true,
        image: true,
        phone: true,
        created_at: true,
      }
    })
    response(201, user, "Register Success. Please Login", res)
  } catch (error) {
    responseError(400, error, res)
    console.log(error)
  }
  next()
};

//Login
const login = async (req, res, next) => {
  try {
    const user = await prisma.users.findFirst({
      where: {
        email: req.body.email
      },
      select: {
        id_user: true,
        email: true,
        password: true,
        name: true
      }
    });

    const checkPassword = await bcrypt.compare(req.body.password, user.password);
    if (!checkPassword) return res.status(400).json({ msg: "Wrong Password" });

    const userId = user.id_user;
    const email = user.email;
    const name = user.name;

    const accessToken = jwt.sign({ userId, email, name }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h'
    })
    const refreshToken = jwt.sign({ userId, email, name }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1w'
    })

    await prisma.users.update({
      data: {
        refreshToken: refreshToken
      },
      where: {
        id_user: userId
      },
      select: {
        refreshToken: true
      }
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken })

  } catch (error) {
    res.status(404).json({ errors: "Email Not Found" });
    next();
  }
}

const getUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await prisma.users.findUnique({
      where: {
        id_user: userId
      },
      select: {
        id_user: true,
        email: true,
        name: true,
        born: true,
        phone: true,
        image: true,
        recommendations: true,
        created_at: true,
        updated_at: true
      }
    });

    return response(200, user, "Get Data User Success", res);
  } catch (error) {
    res.status(404).json({ errors: "User Id is not found!" });
  }
}

const logout = async (req, res, next) => {
  try {
    const userId = req.userId;
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    await prisma.users.update({
      where: {
        id_user: userId
      },
      data: {
        refreshToken: null
      }
    });
    res.clearCookie('refreshToken');
    return res.status(200).json({
      message: "Logout Berhasil"
  });
  } catch (error) {
    res.status(404).json({
      errors: "User Id is not found!"
    });
  }
}

export default {
  createUser,
  login,
  getUser,
  logout
};

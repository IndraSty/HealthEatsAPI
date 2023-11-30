import { prisma } from "../application/database.js";
import bcrypt from "bcrypt"
import {response, responseError} from "../response/response.js";

// fungsi validasi email harus dengan akhiran @gmail.com
const isValidGmail = (email) =>{
  const gmailRegex = /^[a-zA-Z0-9._-]+@gmail.com$/;
  return gmailRegex.test(email);
}
// register 
export const createUser = async (req, res, next) => {
  const {name, email, password} = req.body
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
      }
    })
    response(201, user, "Register Success", res)
  } catch (error) {
    responseError(400, error, res)
    console.log(error)
  }
  next()
};

export default {
  createUser,
};

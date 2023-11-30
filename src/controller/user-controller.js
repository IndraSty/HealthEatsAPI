import { prisma } from "../application/database.js";
import bcrypt from "bcrypt"

// fungsi validasi email harus dengan akhiran @gmail.com
const isValidGmail = (email) =>{
  const gmailRegex = /^[a-zA-Z0-9._-]+@gmail.com$/;
  return gmailRegex.test(email);
}
// register 
export const createUser = async (req, res, next) => {
  const {name, email, password} = req.body
  try {
    console.log(name, email, password)
    // cek pada database apakah email sudah tersedia
    const emailExist = await prisma.users.count({
      where: {
        email: email
      } 
    })
    const validEmail = isValidGmail(email)
    if (!validEmail) {
      return res.status(400).json({message: "Email must end with @gmail.com domain"})
    }
    if (emailExist === 1) {
      return res.status(400).json({message: "Email already exist"})
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
    res.status(201).json(user)
  } catch (error) {
    res.status(400)
    console.log(error)
  }
  next()
};

export default {
  createUser,
};

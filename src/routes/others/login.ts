import express from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsersEntity } from "../../entities/users-entity";
import { UserLogsEntity } from "../../entities/user-logtable";

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UsersEntity.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({
         access: false, message: "Invalid username or password"
         });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({
         access: false, message: "Invalid username or password" 
        });
    }

    const accessToken = jwt.sign({  id: user.id }, "system");

    return res.json({ 
        access: accessToken, 
     });
  } catch (error) {
    console.error("Login error:", error);

    // const createlogin = await UserLogsEntity.create({
    //   username:username
    // })
    // await createlogin.save()


    
    return res.status(500).json({
        message: "Internal server error",
     });
  }

  


});

export {
  router as loginRouter
};
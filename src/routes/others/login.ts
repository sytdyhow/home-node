import express from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsersEntity } from "../../entities/users-entity";
const cors = require('cors');

const router = express.Router();

router.post('/login', cors() ,async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UsersEntity.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({
         access: false, message: "Invalid username or password"
         });
    }

    if(user.roles_id === 2) return res.status(401).json({
      access: false, message: "Siz galkan ulgamyna gözegçi hökmünde girizildiňiz" 
     });

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({
         access: false, message: "Invalid username or password" 
        });
    }

    const accessToken = jwt.sign({  id: user.id, }, 'system');

    return res.json({ 
        access: accessToken, 
     });
  } catch (error) {
    console.error("Login error:", error);   
    return res.status(500).json({
        message: "Internal server error",
     });
  }

});

export {
  router as loginRouter
};

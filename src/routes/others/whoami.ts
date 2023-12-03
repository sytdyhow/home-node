import express from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

const router = express.Router();
router.get('/whoami', async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1]!;
  const decodedToken = jwt.verify(token, 'system') as JwtPayload;
  const users_id = decodedToken.id;

  



        return res.json({users_id});
  
});

export {
  router as Whoami
};
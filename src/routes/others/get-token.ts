import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const router = express.Router();

router.get('/get-token', async (req, res) => {
  const auth = req.headers.authorization;
  
  const token = auth?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }
  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const user_id = decodedToken.id;
    const system_id = req.query?.system_id;
    
    if(system_id == null) return res.status(400).json({message:'no-system-id-given'})

    const accessToken = jwt.sign({  id: user_id, system_id }, "system");
    return res.json(accessToken);
  } catch (error) {
    return res.status(401).json({error, message:'try catch error'});
  }
});

export {
  router as getToken
};

import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import LogsDatasource from "../../database/logsdb";
import { PairsEntity } from "../../entities/pairs_entity";
import { RulesEntity } from "../../entities/rules-entity";

const router = express.Router();

router.get('/users-rules', async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const users_id = decodedToken.id;

      const rule_id = await LogsDatasource
      .getRepository(PairsEntity)    
      .createQueryBuilder('pairs_table')
      .select(['pairs_table.rule_id'])
      .where('pairs_table.user_id = :id',{id:users_id})
      .getMany()

     const rulesIds= rule_id.map((rl)=>rl.rule_id)

      const rules =await LogsDatasource
      .getRepository(RulesEntity)
      .createQueryBuilder('rules')
      .select(['rules.id','rules.rule_name'])
      .where('rules.id IN(:...ids)',{ids:rulesIds})
      .getMany()

    return res.json({rules });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export {
  router as Users_rules
};
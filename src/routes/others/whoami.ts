import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UsersEntity } from "../../entities/users-entity";

const router = express.Router();

router.get('/whoami', async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const user_id = decodedToken.id;
    const system_id = decodedToken?.system_id;
    if(!system_id){
      const user = await UsersEntity.findOneBy({id:user_id});
      const {password, ...userWithoutPassword} = user != null ? user : {password:''}
      return res.json(userWithoutPassword);
    }

    const user = await UsersEntity.createQueryBuilder('users')
      .select([
        'users.id AS id',
        'users.username AS username',
        'users.roles_id AS home_role',
        'users_systems.role_id AS system_role_id',
      ])
      .leftJoin('users_systems', 'users_systems', 'users_systems.user_id = users.id')
      .where('users_systems.system_id = :system_id AND users.id = :user_id', { system_id, user_id })
      .getRawOne();

      return res.json(user);
  } catch (error) {
    return res.json(error);
  }
});

export {
  router as Whoami
};

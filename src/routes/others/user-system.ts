import express from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { UsersEntity } from "../../entities/users-entity";
import { SystemsEntity } from "../../entities/systems-entity";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RolesEntity } from "../../entities/roles-entity";

const router = express.Router();

router.get('/user-systems', async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const users_id = decodedToken.id;

    // const systemss = await getRepository(SystemsEntity)
    //   .createQueryBuilder('systems')
    //   .innerJoin('users_systems', 'us', 'systems.id = us.system_id')
    //   .where('us.user_id = :id', { id: users_id })
    //   .getMany();

    const givenSystems = await UsersEntity
    .createQueryBuilder('users')
    .select([
      // 'users.username as username',
      'systems.name as name',
      'systems.url as url',
      'systems.id as id',
      'systems.description as description',
    ])
    .leftJoin('users_permissions', 'users_permissions', 'users.id = users_permissions.user_id')
    .leftJoin('permissions_systems', 'permissions_systems', 'users_permissions.permission_id = permissions_systems.permission_id')
    .leftJoin('systems', 'systems', 'systems.id = permissions_systems.system_id')
    .where('users.id = :id', { id: users_id })
    .andWhere('systems.is_active = TRUE')
    .getRawMany();

    // console.log("givenSystems:", givenSystems);

    const user = await getRepository(UsersEntity)
      .createQueryBuilder('users')
      .select(['users.username'])
      .where('users.id = :id', { id: users_id })
      .getOne();

    const role = await getRepository(RolesEntity)
      .createQueryBuilder('roles')
      .leftJoin('users', 'rol', 'roles.id = rol.roles_id')
      .where('rol.id = :id', { id: users_id })
      .getMany();

    const userDetails = {
      user,
      role
    };

    // const systems = systemss.filter(system => system.is_active);

    return res.json({ systems: givenSystems, userDetails });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export {
  router as UserSystemRouter
};
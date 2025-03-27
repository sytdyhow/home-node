

import express from "express";
import { UsersEntity } from "../../entities/users-entity";
import { RolesEntity } from "../../entities/roles-entity";
import { createQueryBuilder, getRepository, In } from "typeorm";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SystemsEntity } from "../../entities/systems-entity";
import { PermissionsEntity } from "../../entities/permissions-entity";
import { UsersPermissionsEntity } from "../../entities/users-permissions-entity";

const router = express.Router();


router.get('/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const repo = await getRepository(UsersEntity)
      .createQueryBuilder('users')
      .select(['users.id', 'users.username'])
      .where('users.id = :id', { id })
      .getOne();

    if (!repo) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ results: repo });
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/admins', async (req, res) => {
  try {
    const roles = await getRepository(RolesEntity)
      .createQueryBuilder('roles')
      .select(['roles.id'])
      .where('roles.name=:name', { name: 'admin' })
      .getOne();

    const id = roles?.id

    if (!roles) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const user = await getRepository(UsersEntity)
      .createQueryBuilder('users')
      .select(['users.id', 'users.username'])
      .where('users.roles_id=:id', { id: id })
      .getMany();

    return res.json({ results: user });
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
})



router.get('/users', async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const user_id = decodedToken.id;
    const system_id = decodedToken.system_id
    const user = await UsersEntity.findOneBy({ id: user_id });
    
    if(system_id != null){
      const users = await UsersEntity.createQueryBuilder('users')
      .select([
        'users.id AS id',
        'users.username AS username',
        'users.is_active AS is_active',
        'users.data_joined AS data_joined',
        'users.roles_id AS roles_id',
      ])  
      .leftJoin('users_systems', 'users_systems', 'users_systems.user_id = users.id') 
      .where('users_systems.system_id = :system_id', { system_id })
      .getRawMany();
      
      return res.send({ results: users });
    }

    if (user?.roles_id === 0) {
    const users = await UsersEntity.find();
    const activeUsers = await Promise.all(users.map(async (user) => {
      const { password, ...userWithoutPassword } = user
      const query = SystemsEntity.createQueryBuilder('systems')
      .select([
        'systems.id AS id',
        'systems.name AS name',
        'systems.is_active AS is_active',
        'systems.url AS url',
        'systems.description AS description',
        'systems.icon AS icon',
        'users_systems.role_id AS system_role_id',
      ])
      .leftJoin('users_systems', 'users_systems', 'users_systems.system_id = systems.id')
      .where('users_systems.user_id = :user_id', { user_id: user.id })
      const systems = await query.getRawMany();

      const usersPermissionsArray = await UsersPermissionsEntity.findBy({user_id: user.id});
      const permissions = usersPermissionsArray.map((perm: any)=>perm.permission_id);
      const permissionsFromDb = await PermissionsEntity.find({where: { id: In(permissions)}});      
      return {
        ...userWithoutPassword,
        permissions: permissionsFromDb,
      };
    }));

    return res.send({ results: activeUsers });
    }
    return res.json({ results: [] });
  } catch (error) {
    return res.json({ error });
  }
});



export { router as getUserRouter };

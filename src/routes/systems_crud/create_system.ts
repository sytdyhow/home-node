import express from 'express';
import multer from 'multer';
import { SystemsEntity } from '../../entities/systems-entity';
import { getRepository } from 'typeorm';
import { UsersEntity } from '../../entities/users-entity';
import { RolesEntity } from '../../entities/roles-entity';
import jwt, { JwtPayload } from 'jsonwebtoken';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/systems', upload.single('icon'), async (req, res) => {


  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];


  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const users_id = decodedToken.id;


      const role_id = await getRepository(UsersEntity)
      .createQueryBuilder('users')
      .select(['users.roles_id'])
      .where('users.id = :id', { id: users_id })
      .getOne();

   


    const role = await getRepository(RolesEntity)
      .createQueryBuilder('roles')
      .leftJoin('users', 'rol', 'roles.id = rol.roles_id')
      .where('rol.id = :id', { id: users_id })
      .getMany();
      
      const roleId=role[0].id;
      const rolename=role[0].name


      if(role_id?.roles_id===roleId && rolename==="admin"){
       
  const { name, url, description, icon, is_active } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  if (!icon) {
    return res.status(400).json({ error: 'Icon is required' });
  }


  const system = SystemsEntity.create({
    name: name,
    url: url,
    description: description,
    icon: icon,
    is_active: is_active,
  });

  try {
    await system.save();
    return res.json({
      success: true,
      body: system,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create system' });
  }

      }


    return res.json({error: "Only admin can do this operation"});
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
  


});

export { router as createSystemrouter };
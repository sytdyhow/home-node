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
    const user_id = decodedToken.id;

    const user = await UsersEntity.findOneBy({id:user_id});    

    if (user?.roles_id === 0) {
      const { name, url, description, icon, is_active, permission_url } = req.body;

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

      const system = SystemsEntity.create({ name, url, description, icon, is_active, permission_url });

      try {
        await system.save();
        return res.json({
          success: true,
          body: system,
        });
      } catch (error) {
        console.error(error);
        
        return res.status(500).json({ error: 'Failed to create system' });
      }
    }

    return res.json({ error: "Only admin can do this operation" });
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }



});

export { router as createSystemrouter };
import express from 'express';
import multer from 'multer';
import { SystemsEntity } from '../../entities/systems-entity';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Specify the destination folder for uploaded files

router.post('/system', upload.single('icon'), async (req, res) => {
  const { name, url, description, icon, is_active } = req.body;

  const system = SystemsEntity.create({
    name: name,
    url: url,
    description: description,
    icon: icon ,
    is_active: is_active,
  });

  await system.save();
  return res.json(system);
});

export { router as createSystemrouter };
import express from 'express';
import multer from 'multer';
import { SystemsEntity } from '../../entities/systems-entity';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/systems', upload.single('icon'), async (req, res) => {
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
});

export { router as createSystemrouter };
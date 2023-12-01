import express from "express";
import { UsersEntity } from "../../entities/users-entity";

const router = express.Router();

router.delete('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10); 
  
    try {
      const user = await UsersEntity.findOne({ where: { id: userId } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      await user.remove();
  
      return res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  export {
    router as deleteUserRouter
  };
  
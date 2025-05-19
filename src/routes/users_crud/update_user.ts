import express from "express";
import { UsersEntity } from "../../entities/users-entity";
import * as bcrypt from "bcrypt";
import { UsersPermissionsEntity } from "../../entities/users-permissions-entity";
import jwt, { JwtPayload } from "jsonwebtoken";

const router = express.Router();

router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const {
    username,
    password,
    confirm,
    is_active,
    permissions,
    roles_id,
  } = req.body;

  try {
    const user = await UsersEntity.findOne({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    else {
      if (!username) return res.status(400).json({ error: 'Username is required' });
      if (!permissions || permissions.length === 0) return res.status(400).json({ error: 'System ID is required' });

      if (roles_id == null) return res.status(400).json({ error: 'Roles ID is required' });
      if (password != null && confirm != null)
        if (password === confirm) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(confirm, salt);
          user.password = hashedPassword;
        } else return res.status(400).json({ error: 'Passwords do not match' });

      user.username = username;
      user.is_active = is_active;
      user.roles_id = roles_id;

      await user.save();

      await UsersPermissionsEntity.delete({
        user_id: Number(id)
      })

      const newUsersPermissionsArray = permissions.map((permission: any) => {
        return {
          user_id: id,
          permission_id: permission.id,
        }
      })

      await UsersPermissionsEntity.save(newUsersPermissionsArray);
      console.log(4);
      return res.json({
        success: true,
        body: {
          id: user.id,
          username: user.username,
          roles_id: user.roles_id,
          permissions,
          is_active: user.is_active,
          data_joined: user.data_joined
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user information', message: error });
  }
});

router.put('/user', async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }
  const {
    old_password,
    password,
    confirm,
  } = req.body;
  console.log(req.body);

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const user_id = decodedToken.id;
    const user = await UsersEntity.findOne({ where: { id: Number(user_id) } });

    if (!user) return res.status(404).json({ error: 'Ulanyjy tapylmady' });
    else if (password != null && confirm != null) {
      if (password === confirm) {
        
        const checkPassword = await bcrypt.compare(old_password, user.password);
        if (!checkPassword) return res.status(400).json({ error: 'Köne parolyňyz ýalňyş' });
        if (user.password === password) return res.status(400).json({ error: 'Täze parol köne parol bilen meňzeş bolup bilmeýär' });
        
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(confirm, salt);

        user.password = hashedPassword;
      } else return res.status(400).json({ error: 'Passwords do not match' });

      await user.save();
      return res.json({
        success: true,
        body: {
          id: user.id,
          username: user.username,
          roles_id: user.roles_id,
          is_active: user.is_active,
          // data_joined: user.data_joined
        },
      });
    }

    return res.json({ success: false, message: 'Password is required' });

  } catch (error) {
    console.error('Error updating user:', error);
    
    return res.status(500).json({ error: 'Failed to update user information', message: error });
  }
});

export { router as updateUserRouter };
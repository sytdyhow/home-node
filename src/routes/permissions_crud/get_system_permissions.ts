import express from "express";
import axios from 'axios';
import { UsersEntity } from "../../entities/users-entity";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SystemsEntity } from "../../entities/systems-entity";
import * as https from 'https';

const router = express.Router();


router.get('/system_permissions', async (req, res) => {

  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const user_id = decodedToken.id;

    const user = await UsersEntity.findOneBy(({ id: user_id }))

    if (user?.roles_id === 0) {
      const systems = await SystemsEntity.find();
      const result = await Promise.all(systems?.map(async (system: any) => {
        try {
          const response = await axios.get(system.permission_url, {
            httpsAgent: new https.Agent({
              rejectUnauthorized: false, // Be careful with this in production!
            })
          })
          const permissions = response.data;
          return {system_id: system.id, system_name: system.name, permissions};
        } catch (error) {
          // console.error("Error while fetching permission of system", error);
          return {system_id: system.id, system_name: system.name, permissions: []};
        }
      }))
      return res.send(result);
      return res.send([
        {
          system_id: 43,
          system_name: "Goragçy",
          permissions: [
            {
              label: 'Gurnap bilmek',
              datakey: 'can_install_client',
              datatype: 'boolean'
            },
            {
              label: 'Ulanyjy goshup bilmek',
              datakey: 'can_add_user',
              datatype: 'boolean'
            },
            {
              label: 'Kategoriýa üýtgedip bilmek',
              datakey: 'can_mofidy_category',
              datatype: 'boolean'
            },
            {
              label: 'Enjama rugsat berip bilmedk',
              datakey: 'can_allow_device',
              datatype: 'boolean'
            },
            {
              label: 'Kompýuterleri görüp bilmek',
              datakey: 'can_see_computers',
              datatype: 'boolean'
            },
            {
              label: 'Enjamlary görüp bilmek',
              datakey: 'can_see_devices',
              datatype: 'boolean'
            },
            {
              label: 'Loglary görüp bilmek',
              datakey: 'can_see_logs',
              datatype: 'boolean'
            }
          ]
        },
        {
          system_id: 44,
          system_name: "Gözegçi",
          permissions: [
            {
              label: 'Admin panele girip bilmek',
              datakey: 'can_enter_admin_panel',
              datatype: 'boolean'
            },
            {
              label: 'Otagyň içini üýtgedip bilmek',
              datakey: 'can_modify_room',
              datatype: 'boolean'
            },
          ]
        }
      ]);
    }

    return res.json([
      {
        label: 'Admin panele girip bilmek',
        datakey: 'can_enter_admin_panel',
        datatype: 'boolean'
      },
      {
        label: 'Otagyň içini üýtgedip bilmek',
        datakey: 'can_modify_room',
        datatype: 'boolean'
      },
    ]);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

});

export { router as getSystemPermissionsRouter }
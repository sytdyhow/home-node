import express from "express";
import { UsersEntity } from "../../entities/users-entity";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PermissionsEntity } from "../../entities/permissions-entity";
import { PermissionsSystemsEntity } from "../../entities/permissions-systems-entity";
import { PermissionContentEntity } from "../../entities/permission-content-entity";
import { SystemsEntity } from "../../entities/systems-entity";

const router = express.Router();


router.get('/permissions', async (req, res) => {

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
        const permissions = await PermissionsEntity.find();
        const permissionsSystems = await PermissionsSystemsEntity.find();
        const permissionsContent = await PermissionContentEntity.find();
        const systems = await SystemsEntity.find();
        // console.log("permissions", permissions);
        // console.log("permissionsSystems", permissionsSystems);
        // console.log("systems", systems);
        
        // console.log("permissionsContent", permissionsContent);
        const results = permissions?.map((permission: any) => {
            const permission_content = permissionsContent.filter((content: any) => content.permission_id === permission.id)
            const permission_systems = permissionsSystems.filter((p_sys: any) => p_sys.permission_id === permission.id).map((p_sys: any) => {
                const system = systems.find((s: any) => s.id === p_sys.system_id );
                return {name:system?.name, id:system?.id}
            })
            
            return {
                ...permission,
                permission_content,
                permission_systems
            }
        })
        return res.json({results})
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

export { router as getPermissionsRouter }
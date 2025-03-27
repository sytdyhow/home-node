import express from "express";
import { RolesEntity } from "../../entities/roles-entity";
import { getRepository } from "typeorm";
import { UsersEntity } from "../../entities/users-entity";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PermissionsEntity } from "../../entities/permissions-entity";
import { PermissionContentEntity } from "../../entities/permission-content-entity";
import { PermissionsSystemsEntity } from "../../entities/permissions-systems-entity";
import { SystemsEntity } from "../../entities/systems-entity";

const router = express.Router();

router.post('/permissions', async (req, res) => {
    const auth = req.headers.authorization;
    const token = auth?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Missing token" });
    }

    try {
        const decodedToken = jwt.verify(token, 'system') as JwtPayload;
        const users_id = decodedToken.id;

        const { permission_name, permissions, systems } = req.body;
        const permission = await PermissionsEntity.save({permission_name});
        // console.log("permission", permission);
        
        const permission_id = permission.id;
        const permission_content = permissions?.map((permission: any)=>({permission_id, ...permission}));
        // console.log("permContent:", permissionContent);
        
        const permissionSystems = systems.map((system_id: any) => ({
            system_id,
            permission_id: permission.id
        }))
        await PermissionsSystemsEntity.save(permissionSystems);
        await PermissionContentEntity.save(permission_content);

        const systemsFromDb = await SystemsEntity.find();
        const permission_systems = systems.map((sys_id: any) => {
            const system = systemsFromDb.find((s: any) => s.id === sys_id );
            return {name:system?.name, id:system?.id}
        })

        const body = {
            ...permission,
            permission_content,
            permission_systems
        }

        return res.json({body});
    } catch (error) {
        console.error(error);
        
        return res.status(502).json({ message: 'Server side error' });
    }


});

export {
    router as createPermissionRouter
};
import express from "express";
import { SystemsEntity } from "../../entities/systems-entity";
import { PermissionsSystemsEntity } from "../../entities/permissions-systems-entity";
import { PermissionContentEntity } from "../../entities/permission-content-entity";
import { PermissionsEntity } from "../../entities/permissions-entity";

const router = express.Router();

router.put("/permissions/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await PermissionsSystemsEntity.delete({ permission_id: parseInt(id) });
        await PermissionContentEntity.delete({ permission_id: parseInt(id) });
        // const deletedPermission = await PermissionsEntity.delete(parseInt(id));
        
        const permission_id = parseInt(id);
        const { permission_name, permissions, systems } = req.body;
        const permission = await PermissionsEntity.save({id:permission_id, permission_name});
        // console.log("permission", permission);
        
        const permission_content = permissions?.map((permission: any)=>({permission_id, ...permission}));
        // console.log("permContent:", permissionContent);
        
        const permissionSystems = systems.map((system_id: any) => ({
            system_id,
            permission_id
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

        return res.json({ success: true, body });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export { router as updatePermissionsRouter };
import express from "express";
import { UsersEntity } from "../../entities/users-entity";
import * as bcrypt from 'bcrypt'
import { SystemsEntity } from "../../entities/systems-entity";
import { RolesEntity } from "../../entities/roles-entity";
import { RulesEntity } from "../../entities/rules-entity";

const router = express.Router();

router.post('/users', async (req, res) => {
  const {
    username,
    password,
    is_active,
    systemId,
    rolesId,
    // rulesId
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = UsersEntity.create({
    username: username,
    password: hashedPassword, 
    is_active:is_active,
    data_joined:new Date(),

    systems: req.body.systemId.map((systemm: number) => {
        const entity = new SystemsEntity();
        entity.id = systemm;
        return entity;
      }),

      roles:req.body.rolesId.map((role:number)=>{
        const entity=new RolesEntity();
        entity.id=role;
        return entity;
      }),

      // rules:req.body.rulesId.map((rule:number)=>{
      //   const entity=new RulesEntity();
      //   entity.id=rule;
      //   return entity;
      // })



  });

  await user.save();
  return res.json(user);
});

export {
  router as createUserRouter 
};
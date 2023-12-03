import { createConnection } from "typeorm";
import { RulesEntity } from "./entities/rules-entity";
import express from "express";
import { createRulerouter } from "./routes/rules_crud/create_rule";
import { deleteRulerouter } from "./routes/rules_crud/delete_rule";
import { getRulerouter } from "./routes/rules_crud/get_rule";
import { updateRuleRouter } from "./routes/rules_crud/update_rule";
import { UsersEntity } from "./entities/users-entity";
import { RolesEntity } from "./entities/roles-entity";
import { createRolerouter } from "./routes/roles_crud/create_role";
import { getRolerouter } from "./routes/roles_crud/get_role";
import { deleteRolerouter } from "./routes/roles_crud/delete_role";
import { updateRoleRouter } from "./routes/roles_crud/update_role";
import { SystemsEntity } from "./entities/systems-entity";
import { getSystemrouter } from "./routes/systems_crud/get_system";
import { deleteSystemrouter } from "./routes/systems_crud/delete_system";
import { createSystemrouter } from "./routes/systems_crud/create_system";
import { updateSystemRouter } from "./routes/systems_crud/update_system";
import { getUserRouter } from "./routes/users_crud/get_user";
import { createUserRouter } from "./routes/users_crud/create_user";
import { updateUserRouter } from "./routes/users_crud/update_user";
import { deleteUserRouter } from "./routes/users_crud/delete_user";
import { loginRouter } from "./routes/others/login";
import { UserSystemRouter } from "./routes/others/user-system";
import { UserLogsEntity } from "./entities/user-logtable";
import { Whoami } from "./routes/others/whoami";
require('dotenv').config();
const cors = require('cors');



const app = express();

const main = async () => {
  try {
    await createConnection({
      type: "mysql",
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [RulesEntity, UsersEntity, RolesEntity, SystemsEntity,UserLogsEntity],
      synchronize: true,
      
    });

    console.log("Connected to the database");
    app.use(cors())
    app.use(express.json());
 
    app.use(createRulerouter)
    app.use(deleteRulerouter)
    app.use(getRulerouter)
    app.use(updateRuleRouter)
    app.use(getRolerouter)
    app.use(createRolerouter)
    app.use(deleteRolerouter)
    app.use(updateRoleRouter)
    app.use(getSystemrouter)
    app.use(deleteSystemrouter)
    app.use(createSystemrouter)
    app.use(updateSystemRouter)
    app.use(getUserRouter)
    app.use(createUserRouter)
    app.use(updateUserRouter)
    app.use(deleteUserRouter)
    app.use(loginRouter)
    app.use(UserSystemRouter)
    app.use(Whoami)


    app.listen(9000, () => {
      console.log("Running on port 9000");
    });
  } catch (error) {
    console.log("Unable to connect to the database");
    console.error(error);
  }
};

main();
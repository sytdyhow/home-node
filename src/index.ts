import { createConnection } from "typeorm";
import { RulesEntity } from "./entities/rules-entity";
import express from "express";
import { createRulerouter } from "./routes/rules_crud/create_rule";
import { deleteRulerouter } from "./routes/rules_crud/delete_rule";
import { getRulerouter } from "./routes/rules_crud/get_rule";
import { updateRuleRouter } from "./routes/rules_crud/update_rule";
import { UsersEntity } from "./entities/users-entity";
import { RolesEntity } from "./entities/roles-entity";
import { createRoleRouter } from "./routes/roles_crud/create_role";
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
import { DataSource } from "typeorm";
import LogsDatasource from "./database/logsdb";
import { Users_rules } from "./routes/others/users-rules";
import { Roles_users } from "./routes/others/roles-users";
import { UsersSystemsEntity } from "./entities/users-systems-entity";
import { getToken } from "./routes/others/get-token";

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';


// Load SSL certificate and key
const options = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

require('dotenv').config();
const cors = require('cors');

const app = express();
const app_front = express();

const main = async () => {
  try {
    await createConnection({
      type: "mysql",
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UsersEntity, RolesEntity, SystemsEntity, UserLogsEntity, UsersSystemsEntity],
      synchronize: false,
    });

    console.log("Connected to the database");
    app.use(cors())
    app.use(express.json());

    app.use(createRulerouter)
    app.use(deleteRulerouter)
    app.use(getRulerouter)
    app.use(updateRuleRouter)
    app.use(getRolerouter)
    app.use(createRoleRouter)
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
    app.use(getToken)
    app.use(Users_rules)
    app.use(Roles_users)


    app_front.use(cors())
    app_front.use(express.json());
    // Serve static files from the dist directory
    app_front.use(express.static(path.join(__dirname, 'dist'),
      {
        setHeaders: (res) => {
          res.set('Access-Control-Allow-Origin', '*'); // Allow all origins
        }
      }));

    // Handle all requests and send back the index.html file
    app_front.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    const initializeDatasource = (DataSource: DataSource, message: string) => {
      DataSource.initialize().then(() => {
        console.log(message)
      }).catch((err) => {
        console.error("Error during Data Source initialization", err)
      })
    } 

    const http_front_port = 8080;
    const https_front_port = 8443;
    const back_port = 9000;

    const https_server_front = https.createServer(options, app_front);
    const http_server_front = http.createServer(app_front);
    const server_back = https.createServer(options, app);

    // Create HTTP server for redirecting to HTTPS
    // http_server_front.listen(http_front_port, () => {
    //   console.log(`Running http frontend on port ${http_front_port}`);
    // });

    https_server_front.listen(https_front_port, () => {  
      console.log(`Running https frontend on port ${https_front_port}`);
    });

    server_back.listen(back_port, () => {
      initializeDatasource(LogsDatasource, "Datasource logs initialized")
      console.log(`Running backend on port ${back_port}`);
    });

  } catch (error) {
    console.log("Unable to connect to the database");
    console.error(error);
  }
};

main();
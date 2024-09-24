import { DataSource } from "typeorm"
import dotenv from "dotenv";
import { RulesEntity } from "../entities/rules-entity";
import { PairsEntity } from "../entities/pairs_entity";

dotenv.config();


const LogsDatasource = new DataSource({
    type: "mysql",
    host: process.env.LOGS_HOST,
    port: 3306,
    username: process.env.LOGS_USERNAME,
    password: process.env.LOGS_PASSWORD,
    database: process.env.LOGS_DATABASE,
    connectTimeout: 25000,
    synchronize: false,
    entities:[RulesEntity,PairsEntity]
  })  

export default LogsDatasource

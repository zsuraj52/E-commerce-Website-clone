import "reflect-metadata"
import { DataSource } from "typeorm"
import * as models from "./entity/index"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "test",
    database: "shoppingapp",
    synchronize: true,
    logging: false,
    entities: [...Object.values(models)],
    migrations: [],
    subscribers: [],
})

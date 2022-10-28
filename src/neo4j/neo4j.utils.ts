import { ConfigService } from "@nestjs/config";
import { Neo4jConfig } from "./neo4j-config.interface";

export const createDatabaseConfig = (comfigService: ConfigService, customConfig?: Neo4jConfig) : Neo4jConfig =>{
    return {
        host: comfigService.get('DATABASE_HOST'),
        password: comfigService.get('DATABASE_PASSWORD'),
        port: comfigService.get('DATABASE_PORT'),
        scheme: comfigService.get('DATABASE_SCHEME'),
        username: comfigService.get('DATABASE_USERNAME'),
    };
}
export class ConnectionError extends Error{
    public details: string
    constructor(oldError: Error){
        super();
        this.message = "Connection with Neo4j database was not established";
        this.name = 'Connection Error';
        this.stack = oldError.stack;
        this.details = oldError.message;
    }
}
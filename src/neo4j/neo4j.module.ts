import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'cypher-query-builder';
import {  Neo4jConfig } from './neo4j-config.interface';
let ConnectionWithDriver = require('./neo4j-config.interface');
let NEO4J_CONFIG = require('./neo4j.constants');
let ConnectionError = require('./neo4j.utils');
let createDatabaseConfig = require('./neo4j.utils');
 
@Module({})
export class Neo4jModule {
    static forRootAsync(customConfig?: Neo4jConfig): DynamicModule {
        return {
            module: Neo4jModule,
            imports: [ConfigModule],
            global: true,
            providers: [
                {
                    provide: NEO4J_CONFIG,
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) =>
                        createDatabaseConfig(configService, customConfig),
                },
                {
                    provide: NEO4J_CONFIG,
                    inject: [NEO4J_CONFIG],
                    useFactory: async (config: Neo4jConfig) => {
                        try {
                            const { host, scheme, port, username, password } = config;
                            const connection = new Connection(`${scheme}://${host}:${port}`, {
                                username,
                                password,
                            }) as typeof ConnectionWithDriver;
                            await connection.driver.verifyConnectivity()
                        } catch(error){
                            throw new ConnectionError( error);
                        }
                    },
                },
            ],
        };
    }
}


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

// default.yml vai estar disponivel em todos os environments

async function bootstrap() {
    const logger = new Logger('bootstrap'); // bootstrap - context

    // config usa node_env para saber qual é o environment, se não está definido pega do development
    const serverConfig = config.get('server');

    // Se correr com PORT=3006 yarn start:dev -- process.env.PORT é 3006
    const port = process.env.PORT || serverConfig.port;

    const app = await NestFactory.create(AppModule);

    if (process.env.NODE_ENV === 'development') {
        app.enableCors();
    }

    await app.listen(port);

    logger.log(`Application started and running in port: ${port}`);
}
bootstrap();

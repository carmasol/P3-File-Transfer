import { Module } from '@nestjs/common';
import { DatabaseCheckController } from './database-check.controller';

@Module({
  controllers: [DatabaseCheckController]
})
export class DatabaseCheckModule {}

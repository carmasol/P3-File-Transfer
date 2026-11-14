
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('database-check')
export class DatabaseCheckController {
    constructor(private readonly prisma: PrismaService) { }

    @Get()
    async check() {
        const userCount = await this.prisma.user.count();
        const fileCount = await this.prisma.file.count();

        return {
            status: 'connected',
            database: 'datashare_db',
            users: userCount,
            files: fileCount,
        };
    }
}

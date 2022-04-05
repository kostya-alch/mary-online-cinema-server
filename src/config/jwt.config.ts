import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

// фунцция, которая берет секретный ключ из конфига
export const getJWTConfig = async (
   configService: ConfigService
): Promise<JwtModuleOptions> => ({
   secret: configService.get('JWT_SECRET'),
});

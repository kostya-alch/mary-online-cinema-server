import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

// фунцция, которая берет ссылку из конфига монго
export const getMongoDbConfig = async (
   configService: ConfigService
): Promise<TypegooseModuleOptions> => ({
   uri: configService.get('MONGO_URI'),
});

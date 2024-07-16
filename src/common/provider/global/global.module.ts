import { Module, Global } from '@nestjs/common';
import { GlobalService } from './token-global';

@Global()
@Module({
  providers: [GlobalService],
  exports: [GlobalService],
})
export class GlobalModule {}

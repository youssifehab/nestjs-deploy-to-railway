import { Injectable, Inject } from '@nestjs/common';
import { DevConfigService } from './common/providers/devConfigService';

@Injectable()
export class AppService {
  constructor(
    private devConfig: DevConfigService,
    @Inject('CONFIG') private config: { port: string },
  ) {}
  getHello(): string {
    return `Hello World! ${this.devConfig.getDBHOST()} PORT: ${this.config.port}`;
  }
}

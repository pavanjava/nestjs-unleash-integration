import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { startUnleash, Unleash } from 'unleash-client';
import { ConfigService } from '@nestjs/config';

@Controller('/api/v1')
export class AppController {
  private unleash: Unleash;
  private readonly logger: Logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {
    this.init();
  }

  private init = async (): Promise<void> => {
    this.unleash = await startUnleash({
      url: this.configService.get<string>('UNLEASH_API_ENDPOINT'),
      appName: 'beta-api',
      metricsInterval: parseInt(this.configService.get('METRICS_INTERVAL'), 10),
      refreshInterval: parseInt(this.configService.get('REFRESH_INTERVAL'), 10),
      customHeaders: {
        Authorization: this.configService.get<string>('API_KEY'),
      },
    });
  };

  @Get('/analytics')
  dataAnalytics(): any {
    // Unleash SDK has now fresh state from the unleash-api
    const isEnabled: boolean = this.unleash.isEnabled('beta-api');
    this.logger.log(`feature switch "beta-api" is ${isEnabled}`);
    if (isEnabled) {
      return this.appService.dataAnalytics();
    } else {
      return {
        response: 'can not access this api as its in experimental mode',
      };
    }
  }
}

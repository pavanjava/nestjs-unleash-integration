import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private response = {};
  constructor() {
    this.response['XS'] = '5';
    this.response['S'] = '15';
    this.response['M'] = '25';
    this.response['L'] = '38';
    this.response['XL'] = '28';
    this.response['XXL'] = '15';
  }

  dataAnalytics = (): any => {
    return this.response;
  };
}

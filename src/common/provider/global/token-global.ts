import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class GlobalService {
  private token: string;

  getToken(): string {
    return this.token;
  }

  setToken(value: string): void {
    this.token = value;
  }
}

import { Injectable } from '@nestjs/common';
import { Agent } from 'https';
import {
  AuthenticationApi,
  Configuration,
  SlidesApi,
  Token,
} from './../display-api-client/';

@Injectable()
export class RemoveSlideService {
  configuration = new Configuration({
    basePath: 'https://displayapiservice.local.itkdev.dk',
    baseOptions: {
      // Axios won't accept our mkcert certs for now - so lets just disable
      // cert verification.
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
    },
  });

  async getAdminToken(): Promise<Token> {
    const authentication = new AuthenticationApi(this.configuration);

    const credentials = {
      email: 'admin@example.com',
      password: 'password',
    };

    const response = await authentication.postCredentialsItem(credentials);

    return response.data;
  }

  async getAuthenticatedConfig(): Promise<Configuration> {
    const configWithAuth = { ...this.configuration } as Configuration;

    const tokenData = await this.getAdminToken();

    configWithAuth.accessToken = tokenData.token;

    return configWithAuth;
  }

  async deleteSlide(id: string) {
    try {
      const config = await this.getAuthenticatedConfig();
      const slideApi = new SlidesApi(config);

      await slideApi.deleteV1SlideId(id);
    } catch (error) {
      console.log(
        '🚀 ~ file: remove-slide.service.ts ~ line 53 ~ RemoveSlideService ~ deleteSlide ~ error',
        error.message,
      );
    }
  }
}

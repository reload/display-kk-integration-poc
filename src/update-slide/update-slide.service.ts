import { Injectable } from '@nestjs/common';
import { Agent } from 'https';
import {
  AuthenticationApi,
  Configuration,
  SlideSlideInputJsonld,
  SlidesApi,
  Token,
  CollectionJsonld,
} from './../display-api-client/';

@Injectable()
export class UpdateSlideService {
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

  async getBindKey(): Promise<string> {
    const authentication = new AuthenticationApi(this.configuration);

    const response = await authentication.postLoginInfoScreen();
    return response.data.bindKey;
  }

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

  async updateSlide(id) {
    try {
      const timestamp = Date.now() + '';
      const config = await this.getAuthenticatedConfig();
      const slideApi = new SlidesApi(config);

      const collectionObject: CollectionJsonld = {
        values: ['hej'],
      } as unknown;

      const slideData: SlideSlideInputJsonld = {
        title: 'updatet  ' + timestamp,
        theme: '',
        description: '',
        templateInfo: {
          '@id': '/v1/templates/01FP2SNGFN0BZQH03KCBXHKYHG',
          options: [],
        },
        onPlaylists: collectionObject,
        duration: null,
        content: { title: 'updatet', text: '<p>updatet</p>' },
        media: [],
        feed: null,
        published: { from: null, to: null },
      } as unknown;

      await slideApi.putV1SlideId(id, slideData);
    } catch (error) {
      console.log(
        '🚀 ~ file: app.service.ts ~ line 140 ~ AppService ~ updateSlide ~ error',
        error.message,
      );
    }
  }
}

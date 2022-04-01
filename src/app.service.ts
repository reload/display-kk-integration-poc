import { Injectable } from '@nestjs/common';
import { Agent } from 'https';
import {
  AuthenticationApi,
  Configuration,
  PlaylistPlaylistInputJsonld,
  PlaylistsApi,
  SlideSlideInputJsonld,
  SlidesApi,
  Token,
  TemplatesApi,
  CollectionJsonld,
} from './display-api-client';

@Injectable()
export class AppService {
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

  async getPlaylists(): Promise<Array<Playlist>> {
    const config = await this.getAuthenticatedConfig();
    const playlistApi = new PlaylistsApi(config);

    // The endpoint is not declared to return anything for some reason, so
    // we have to go the any-route to extract the data.
    const playLists = (await playlistApi.getV1Playlists(1)) as any;
    const data = playLists.data['hydra:member'];
    const names = data.map((playlist) => playlist.title);
    return names;
  }

  async createTestPlaylist(): Promise<void> {
    const config = await this.getAuthenticatedConfig();
    const playlistApi = new PlaylistsApi(config);
    playlistApi.putV1PlaylistSlideId;
    // Generate a unique data object for the playlist.
    const timestamp = Date.now() + '';
    const playlistData: PlaylistPlaylistInputJsonld = {
      title: 'playlist-' + timestamp,
      description: 'Description of playlist-' + timestamp,
    };

    const testplaylist = await playlistApi.createV1Playlist(playlistData);
    console.log(
      '🚀 ~ file: app.service.ts ~ line 82 ~ AppService ~ createTestPlaylist ~ testplaylist',
      testplaylist,
    );
  }

  async getSlides() {
    const config = await this.getAuthenticatedConfig();
    const slideApi = new SlidesApi(config);

    const result = await slideApi.getV1Slides();
    const data = result.data['hydra:member'];
    return data;
  }

  async getTemplates() {
    const config = await this.getAuthenticatedConfig();
    const templatesApi = new TemplatesApi(config);

    const result = await templatesApi.getV1Templates();
    const data = result.data['hydra:member'];
    return data;
  }

  async createTestSlide(): Promise<void> {
    try {
      const config = await this.getAuthenticatedConfig();
      const slideApi = new SlidesApi(config);

      // Generate a unique data object for the slide.
      const timestamp = Date.now() + '';

      const slideData: SlideSlideInputJsonld = {
        title: 'Slide-' + timestamp,
        theme: '',
        description: '',
        templateInfo: {
          '@id': '/v1/templates/01FP2SNGFN0BZQH03KCBXHKYHG',
          options: [],
        },
        duration: null,
        content: {
          title: 'Overskrift på slide' + timestamp,
          text: '<p>Tekst på slide</p>',
        },
        media: [],
        feed: null,
        published: { from: null, to: null },
      } as unknown;
      await slideApi.createV1Slides(slideData);
    } catch (error) {
      console.log(
        '🚀 ~ file: app.service.ts ~ line 97 ~ AppService ~ createTestSlide ~ error',
        error.message,
      );
    }
  }

  async createSlideInPlaylist() {
    try {
      const timestamp = Date.now() + '';
      const config = await this.getAuthenticatedConfig();
      const slideApi = new SlidesApi(config);
      const playlistApi = new PlaylistsApi(config);

      const playlistData: PlaylistPlaylistInputJsonld = {
        title: 'playlist-' + timestamp,
        description: 'Description of playlist-' + timestamp,
      };

      const playlist = await playlistApi.createV1Playlist(playlistData);
      const playlistId = playlist.data['@id'].replace('/v1/playlists/', '');

      const slideDataTemplate: SlideSlideInputJsonld = {
        title: 'Slide-' + timestamp,
        theme: '',
        description: '',

        templateInfo: {
          '@id': '/v1/templates/01FP2SNGFN0BZQH03KCBXHKYHG',
          options: [],
        },
        duration: null,
        content: {
          title: 'Overskrift på slide' + timestamp,
          text: '<p>Tekst på slide</p>',
        },
        media: [],
        feed: null,
        published: { from: null, to: null },
      } as unknown;

      const slideData = await slideApi.createV1Slides(slideDataTemplate);

      const slideId = slideData.data['@id'].replace('/v1/slides/', '');

      const slidePlaylistData = [
        {
          slide: slideId,
          weight: 0,
        },
      ];

      const addToPlaylist = await playlistApi.putV1PlaylistSlideId(
        playlistId,
        slidePlaylistData,
      );
      console.log(
        '🚀 ~ file: app.service.ts ~ line 224 ~ AppService ~ createSlideInPlaylist ~ addToPlaylist',
        addToPlaylist,
      );
    } catch (error) {
      console.log(
        '🚀 ~ file: app.service.ts ~ line 140 ~ AppService ~ createSlideInPlaylist ~ error',
        error.message,
      );
    }
  }

  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}

type Playlist = {
  name: string;
};

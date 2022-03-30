import { Injectable } from '@nestjs/common';
import { Agent } from 'https';
import {
  AuthenticationApi,
  Configuration,
  PlaylistPlaylistInputJsonld,
  PlaylistsApi,
  Token,
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

    // Generate a unique data object for the playlist.
    const timestamp = Date.now() + '';
    const playlistData: PlaylistPlaylistInputJsonld = {
      title: 'playlist-' + timestamp,
      description: 'Description of playlist-' + timestamp,
    };

    playlistApi.createV1Playlist(playlistData);
  }

  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}

type Playlist = {
  name: string;
};

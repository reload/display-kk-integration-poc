# KK Display integration PoC

Based on [Nest](https://github.com/nestjs/nest)

## Running the app

Make sure the api-server is up and running before you start. The simplest way
to ensure this is to use the `api:reset` task of the [display-dev](https://github.com/reload/display-dev)
setup.

Then:

```bash
# Start the server
$ yarn install
$ yarn start:dev

# You should now be able to issues requests to the PoC server. Consult the
# startup log-output for a list of endpoints

# Verify the server is up
$ curl localhost:3000/hello

# The following endpoints are now available. They are independent of each other
# eg. there is no need for calling authenticate before createTestPlayList.

# Authenticate against the api (using hardcoded admin credentials) and output
# the token-data returned by the api.
$ curl localhost:3000/adminToken

# Fetch a bind-key by calling the only api endpoint that does not require
# authentication
$ curl localhost:3000/bindKey

# Fetch a list of playlists
$ curl localhost:3000/playLists

# Create a test playlist
$ curl localhost:3000/createTestPlaylist
```

## Notes

Note that you so far must overwrite the specified InputJsonld (Types),
see an example here with SlideSlideInputJsonld

```
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
      console.log(error);
    }
  }
```

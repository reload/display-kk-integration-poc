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

## PoC Notes

### OpenApi generated client

We have a choice between multiple generators when it comes to creating typescript
clients for the API. We currently opt for `typescript-axios` but there are
the following alternatives that could also be considered:

* typescript-fetch
* typescript-node
* typescript-rxjs

We've tried and discarded the following:

* typescript-nestjs (compile errors)

### OpenApi client generation

The OpenApi spec is created via a mix of [api_platform auto-generation](https://github.com/os2display/display-api-service/blob/168d10d2019a161e02ed8ba83e21c5d2878abbcb/composer.json#L130)
 configured via [yaml-files](https://github.com/os2display/display-api-service/tree/168d10d2019a161e02ed8ba83e21c5d2878abbcb/config/api_platform),
and a more handheld specification via a [factory](https://github.com/os2display/display-api-service/blob/168d10d2019a161e02ed8ba83e21c5d2878abbcb/src/OpenApi/OpenApiFactory.php)

We use the same spec to generate a typescript client via the `scripts/generate-client.sh`.

The Admin and Display projects also uses this API, albeit in a type unsafe
manner.

### Invalid OpenAPI Spec

Note that you so far must overwrite the specified InputJsonld (Types),
see an example here with SlideSlideInputJsonld

```typescript
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

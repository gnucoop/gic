# Local @gic/angular test/testapp development

1. `yarn install` at the root of `angular`
2. `yarn run build.dev` to build local `@gic/angular` and `@gic/core`
3. `cd test/testapp` to the test app
4. `yarn install` in the test app directory
5. `yarn run serve` copies packages and serve the app (see package.json for more options)
6. [http://localhost:4200/](http://localhost:4200/)


# yarn link local development

`yarn link` doesn't work as expected due to the `devDependency` on `@angular/core`. This is the work around...

    yarn run build.link ../gic-conference-app

When the command above is ran from the `angular` directory, it will build `@gic/angular` and copy the `dist` directory to the correct location of another local project. In the example above, the end result is that it copies the `dist` directory to `../gic-conference-app/node_modules/@gic/angular/dist`. The path given should be relative to the root of this mono repo.

## package.json note

The `package.json` file in this directory references __Ionic 3__ and is in here to get GitHub to properly show the Used By counts on the repo. __Do not remove it!__

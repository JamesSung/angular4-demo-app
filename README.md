# Angular4DemoApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.3.


## Play the app

Click here to see the app => <a href="https://jamessung.github.io">Play The App</a>


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

If you are not interested in back end programs skip this part. This app can be running well without server side programs.
Otherwise install MongoDB(V3.4.4 or higher) and download my <a href="https://github.com/JamesSung/springspringspring">SpringSpringSpring</a> project.
After starting the MongoDb, run the Spring project on server. If you use Eclipse go run as > maven build...  
put "spring-boot:run" as a goal. You may need to modify src\app\services\booking.service.ts file to change the server port.
One more thing is that I recomend you test with Chrome browser with option --disable-web-security because you are going to
do cross domain test between 4200 and 8081.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}


// if ('serviceWorker' in navigator && environment.production) {
// declaring scope manually
//   navigator.serviceWorker.register('ngsw-worker.js', { scope: '/' }).then((registration) => {
//     console.log('Service worker registration succeeded:', registration);
//   }, /*catch*/(error) => {
//     console.log('Service worker registration failed:', error);
//   });
// } else {
//   console.log('Service workers are not supported.');
// }

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
});



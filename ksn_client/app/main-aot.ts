/**
 * Created by Maxi- PC on 23.11.2016.
 */
import { platformBrowser }    from '@angular/platform-browser';
import { AppModuleNgFactory } from '../aot/app/app.module.ngfactory';
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
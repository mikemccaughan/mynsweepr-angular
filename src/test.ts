// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { getTestBed } from '@nm/@angular/core/types/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting
} from '@nm/@angular/platform-browser/types/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);

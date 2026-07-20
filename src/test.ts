// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// As of Angular 21 the TestBed defaults to zoneless change detection. These specs
// rely on zone-based auto change detection, matching how the app itself bootstraps
// in main.ts, so opt every TestBed back in.
@NgModule({ providers: [provideZoneChangeDetection()] })
class ZoneChangeDetectionTestModule {}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  [BrowserDynamicTestingModule, ZoneChangeDetectionTestModule],
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: false } }
);

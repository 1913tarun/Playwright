// @ts-check
const { devices } = require('@playwright/test');
const config = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  expect: {   
    timeout: 10*1000
  },
   
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
  //browser/ screenshot/ log
  browserName : 'chromium', //firefox webkit chromium
  headless : true,
  screenshot : 'on',
  trace : 'retain-on-failure',//off, on
  }, 
};

module.exports = config;

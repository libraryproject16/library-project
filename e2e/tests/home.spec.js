var homePage = require('../pages/home.page');

describe('Home page', function() {
    it('should exist', function() {
        homePage.navigate();

        browser.sleep(2000);
    });
});
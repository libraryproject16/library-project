var homePage = require('../pages/home.page');

describe('Home page', function() {
    it('heading should be set appropriately', headingSet);

    function headingSet() {
        homePage.navigate();

        expect(homePage.heading.getText()).toEqual('Library Project');
    }
});
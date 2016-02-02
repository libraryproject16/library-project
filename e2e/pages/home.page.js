var serverAddress = require('../helpers/server-address');
var homePage = Object.create({}, {
    navigate: { value: navigate }
});

module.exports = homePage;

function navigate() {
    // TODO: When angular exists: browser.get(serverAddress);
    browser.driver.get(serverAddress);
}
var homePage = Object.create({}, {
    navigate: { value: navigate },
    heading: { get: getHeading }
});

module.exports = homePage;

function navigate() {
    browser.get('');
}

function getHeading() {
    return element(by.tagName('h1'));
}
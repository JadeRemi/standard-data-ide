
function WebpackConfig(config) {
    return config;
}

function templateContent (title, _a) {
    if (title === void 0) { title = ''; }
    var _b = _a === void 0 ? {
        injectBody: '',
        injectHead: ''
    } : _a, _c = _b.injectHead, injectHead = _c === void 0 ? '' : _c, _d = _b.injectBody, injectBody = _d === void 0 ? '' : _d;
    return "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">" + injectHead + "<title>" + title + "</title></head><body>" + injectBody + "</body></html>";
};

export { WebpackConfig , templateContent}
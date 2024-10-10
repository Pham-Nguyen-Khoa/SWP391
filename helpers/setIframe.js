const cheerio = require('cheerio');

module.exports.setIframe = (iframe) => {
    const $ = cheerio.load(iframe);
    const $iframe = $('iframe');


    if ($iframe.length === 0) {
        return null;
    }


    $iframe.attr('width', '100%');
    $iframe.attr('height', '300');

    const iframeSrc = $iframe.attr('src');
    console.log($.html($iframe));

    return $.html($iframe);
}

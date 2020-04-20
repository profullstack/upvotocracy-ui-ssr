import showdown from 'showdown';
// import is from 'is_js';
const converter = new showdown.Converter({simplifiedAutoLink: true});

function parseContent(content) {
    let parsed;    

    // if (typeof window === 'undefined') {
    //     return converter.makeHtml(content)
    //         .replace(/\s*@(\w+)/g, ` <a href="/u/$1">@$1</a>`);
    // }
    // }

    // if (is.safari() || is.firefox()) {
    //     return converter.makeHtml(content)
    //         .replace(/\s*@(\w+)/g, ` <a href="/u/$1">@$1</a>`);
    // } else {
    //     return converter.makeHtml(content)
    //         .replace(/(?<!https?.+)\/?a\/([^\s]*)/g, ` <a href="/a/$1">a/$1</a>`)
    //         .replace(/\s*@(\w+)/g, ` <a href="/u/$1">@$1</a>`);
    // }

    try {
        parsed = converter.makeHtml(content)
            // .replace(/(?<!https?.+)\/?a\/([^\s]*)/g, ` <a href="/a/$1">a/$1</a>`)
            .replace(/\s*@(\w+)/g, ` <a href="/u/$1">@$1</a>`);
    } catch(err) {
        console.log(err);
        parsed = converter.makeHtml(content)
        .replace(/\s*@(\w+)/g, ` <a href="/u/$1">@$1</a>`);
    }

    return parsed;
}

export {
    parseContent  
}
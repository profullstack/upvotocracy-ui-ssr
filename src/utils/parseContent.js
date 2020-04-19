import showdown from 'showdown';
const converter = new showdown.Converter({simplifiedAutoLink: true});

function parseContent(content) {
    return converter.makeHtml(content)
                    .replace(/\s*(?<!http.*)a\/([\w/]+)/g, ` <a href="/a/$1">a/$1</a>`)
                    .replace(/\s*@(\w+)/g, ` <a href="/u/$1">@$1</a>`);
}

export {
    parseContent  
}
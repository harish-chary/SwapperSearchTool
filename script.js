const searchEngineElement = document.getElementById("searchEngine"); //searchEngineElement.innerHTML
const searchDataElement = document.getElementById("searchDataElement"); //searchDataElement.innerHTML
const searchTextElement = document.getElementById("searchText"); //searchTextElement.value

const googleButton = document.getElementById('google');
const duckduckgoButton = document.getElementById('duckDuckGo');
const yahooButon = document.getElementById('yahoo');
const bingButton = document.getElementById('bing');
var searchEngine = "No search engine found in this webpage";
var searchURL = "";
var isDisabled = false;

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    currentUrl = tabs[0]?.url;
    searchEngine = getSearchEngineName(currentUrl);
    if (searchEngineElement && searchEngine!="No search engine found in this webpage"){
        searchEngineElement.innerHTML = searchEngine;
        if(searchTextElement){
            searchTextElement.value = getSearchTermFromUrl(currentUrl,searchEngine);
        }
    }
});

function getSearchEngineName(url) {
    const searchEnginePatterns = {
        google: /(?:www\.)?google\.[a-z]{2,3}/,
        bing: /(?:www\.)?bing\.[a-z]{2,3}/,
        yahoo: /(?:www\.)?yahoo\.[a-z]{2,3}/,
        duckduckgo: /(?:www\.)?duckduckgo\.[a-z]{2,3}/,
    };

    for (const engine in searchEnginePatterns) {
        if (searchEnginePatterns[engine].test(url)) {
            return engine;
        }
    }

    return "No search engine found in this webpage";
}

function getSearchTermFromUrl(url, searchEngine) {
  const searchEngineMappings = {
    google: 'q',
    yahoo: 'p',
    bing: 'q',
    duckduckgo: 'q',
  };

  const lowerCaseSearchEngine = searchEngine.toLowerCase();

  if (searchEngineMappings.hasOwnProperty(lowerCaseSearchEngine)) {
    const queryParam = searchEngineMappings[lowerCaseSearchEngine];
    const regex = new RegExp(`[?&]${queryParam}=([^&]+)`);
    const match = url.match(regex);

    if (match && match[1]) {
      return decodeURIComponent(match[1].replace(/\+/g, ' '));
    } else {
      return '';
    }
  } else {
    return 'Search engine not found';
  }
}

function generateSearchURL(searchText, searchEngine) {
    const searchEngineURLs = {
        google: 'https://www.google.com/search?q=',
        yahoo: 'https://search.yahoo.com/search?p=',
        bing: 'https://www.bing.com/search?q=',
        duckduckgo: 'https://duckduckgo.com/?q=',
    };
    
    const lowerCaseSearchEngine = searchEngine.toLowerCase();
    
    if (searchEngineURLs.hasOwnProperty(lowerCaseSearchEngine)) {
        const baseURL = searchEngineURLs[lowerCaseSearchEngine];
        const encodedSearchText = encodeURIComponent(searchText);
        const searchURL = baseURL + encodedSearchText;
    
        return searchURL;
    } else {
        return 'Cannot generate URL';
    }
}

function redirectToURL(url) {
    console.log("Called!");
    if(url == "Cannot generate URL"){
        console.log("Cannot redirect");
        return;
    }
    if(searchEngine == "No search engine found in this webpage"){
        openInNewTab(url);
    }
    else{
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (url && typeof url === 'string') {
                chrome.tabs.update(tabs[0].id, { url: url });
            } else {
                console.log('Invalid URL provided');
            }
        });
    }
}

function openInNewTab(url) {
    window.open(url, '_blank');
}

googleButton.addEventListener('click', function() {
    console.log("Event google!");
    redirectToURL(generateSearchURL(searchTextElement.value,'google'));
});
duckduckgoButton.addEventListener('click', function() {
    console.log("Event duckduckgo!");
    redirectToURL(generateSearchURL(searchTextElement.value,'duckduckgo'));
});
yahooButon.addEventListener('click', function() {
    console.log("Event yahoo!");
    redirectToURL(generateSearchURL(searchTextElement.value,'yahoo'));
});
bingButton.addEventListener('click', function() {
    console.log("Event bing!");
    redirectToURL(generateSearchURL(searchTextElement.value,'bing'));
});
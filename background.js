chrome.browserAction.onClicked.addListener(function(tab) {
   chrome.tabs.executeScript(null, {file: "rewrite.js"});
   chrome.tabs.executeScript(null, {file: "yt/js/base_all_with_bidi-vfl82022.js"});
});
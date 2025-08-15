chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "fetchHTML") {
      var htmlData = document.documentElement.outerHTML;
      sendResponse({ htmlData: htmlData });
    }
  });
  

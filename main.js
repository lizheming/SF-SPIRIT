require(
  { baseUrl: chrome.extension.getURL("/") },
  ["app/test/App"],
  function (App) {
    App.run();
  }
);

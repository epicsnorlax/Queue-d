// background.js
// This runs in the background (service worker) of your extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed!');
});
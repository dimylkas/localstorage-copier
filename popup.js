document.addEventListener('DOMContentLoaded', init);

const exControls = {
  btnCopyProp: null,
  btnPasteProp: null,
  divStorageKeysList: null,
};

function init() {
  exControls.btnCopyProp = document.getElementById('btn-copy-prop');
  exControls.btnPasteProp = document.getElementById('btn-paste-prop');
  exControls.divStorageKeysList = document.getElementById('storage-keys-list');

  // restoreUserSetup();
  getLocalStorageData();

  initEventHandlers();
}

function restoreUserSetup() {
  chrome.storage.local.get('localStorageData', (localStorageData) => {
    console.log(localStorageData);
  });
}

function initEventHandlers() {
  exControls.btnCopyProp.addEventListener('click', copyProperty);
  exControls.btnPasteProp.addEventListener('click', pasteProperty);
}

function getLocalStorageData(isDraw = true, callback) {
  const code = 'Object.keys(localStorage).map((key) => ({ key, value: JSON.parse(localStorage.getItem(key)) }))';
  chrome.tabs.executeScript(
      null,
      { code },
      (result) => {
        console.log(result);
        if (result && result.length && result[0] && result[0].length) {
          if (isDraw) {
            drawStorageKeysList(result[0]);
          }

          if (callback) {
            callback(result[0]);
          }
        }
      }
  );
}

function copyProperty() {
  getLocalStorageData(false,(localStorageData) => {
    chrome.storage.local.set({ localStorageData });
    window.close();
  });
}

function pasteProperty() {
  chrome.storage.local.get(['localStorageData'], (result) => {
    chrome.tabs.executeScript(
      null,
      {
        code: 'var localStorageDataTmp = '+ JSON.stringify(result.localStorageData) + ';'
        + 'localStorageDataTmp.forEach((item) => { localStorage.setItem(item.key, JSON.stringify(item.value)); });'
      },
      () => { window.close(); }
    );
  });
}

function drawStorageKeysList(list) {
  list.forEach((item) => {
    exControls.divStorageKeysList.insertAdjacentHTML(
        'beforeend',
        '<div class="ellipsis">'
        + `<label class="new-item" title="${item.key} : ${item.value}">`
        + `<input type="checkbox" name="checkbox" checked="checked" disabled="disabled"> ${item.key}`
        + '</label></div>'
    );
  });
}

/*
function addNewInput() {
  const timestamp = Date.now();

  exControls.btnAddProp.insertAdjacentHTML(
      'beforebegin',
      <div class="new-item ${timestamp}">
      + '<input type="text" class="input new-prop">'
      + '</div>'
  );

  const btn = document.createElement('button');
  btn.innerHTML = '-';
  btn.className = 'btn btn-default btn-remove-new-prop';
  btn.addEventListener('click', (element) => element.target.parentNode.remove());

  document.getElementsByClassName(`${timestamp}`)[0].appendChild(btn);
}
*/
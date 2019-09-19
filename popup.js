document.addEventListener('DOMContentLoaded', init);

const exControls = {
  btnCopyProp: null,
  btnPasteProp: null,
};

function init() {
  exControls.btnCopyProp = document.getElementById('btn-copy-prop');
  exControls.btnPasteProp = document.getElementById('btn-paste-prop');

  initEventHandlers();
}

function initEventHandlers() {
  exControls.btnCopyProp.addEventListener('click', copyProperty);
  exControls.btnPasteProp.addEventListener('click', pasteProperty);
}

function copyProperty() {
  chrome.tabs.executeScript(
    null,
    {
      code: "localStorage.getItem('credential');"
    },
    (result) => {
      chrome.storage.local.set({ credential: result[0] });
      window.close();
    }
  );
}

function pasteProperty() {
  chrome.storage.local.get(['credential'], (result) => {
    chrome.tabs.executeScript(
      null,
      {
        code: 'localStorage.setItem(\'credential\', ' + JSON.stringify(result.credential) +');'
      },
      () => { window.close(); }
    );
  });
}

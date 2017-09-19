// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')
const $ = require('jQuery')

const escalateCurrencyChangeToMainProcess = (currency) => {
  ipcRenderer.send('currency-change', currency)
}

const setupWindowListeners = () => {
  $('input[name=currency]').change((data) => {
    escalateCurrencyChangeToMainProcess($(data.target).val());
  })
}

$(document).ready(() => {
  setupWindowListeners()
});
const {app, BrowserWindow, TouchBar, ipcMain} = require('electron')
const request = require('request')
const path = require('path')
const url = require('url')
const {TouchBarButton, TouchBarLabel, TouchBarSpacer} = TouchBar

let currency = 'USD'

const setupIpcListeners = () => {
  ipcMain.on('currency-change', (event, arg) => {
    currency = arg
    fetchPrices();
  })
}

const bitcoinLabel = new TouchBarLabel({
  label: "Fetching BTC-USD..."
})

const etherLabel = new TouchBarLabel({
  label: "Fetching ETH–USD..."
})

const fetchPrices = () => {
  request(`https://api.cryptonator.com/api/ticker/btc-${ currency }`, (error, response, body) => {
    if(!error && response.statusCode == 200) { 
      bitcoinLabel.label = `1฿ = ${ currency }${ parseFloat(JSON.parse(body).ticker.price).toFixed(2) }`
    }
  });

  request(`https://api.cryptonator.com/api/ticker/eth-${ currency }`, (error, response, body) => {
    if(!error && response.statusCode == 200) { 
      etherLabel.label = `1Ξ = ${ currency }${ parseFloat(JSON.parse(body).ticker.price).toFixed(2) }`
    }
  });
}

const touchBar = new TouchBar([
  bitcoinLabel,
  new TouchBarSpacer({size: 'small'}),
  etherLabel
])

let window

app.once('ready', () => {
  window = new BrowserWindow({
    frame: false,
    width: 200,
    height: 200
  })
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  window.setTouchBar(touchBar)
  fetchPrices();
  let interval = setInterval(fetchPrices, 10000)

  setupIpcListeners();
})
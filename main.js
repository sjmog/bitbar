const {app, BrowserWindow, TouchBar} = require('electron')
const request = require('request')
const {TouchBarButton, TouchBarLabel, TouchBarSpacer} = TouchBar

const bitcoinLabel = new TouchBarLabel({
  label: "Fetching BTC-USD..."
})

const fetchBitcoinPrice = () => {
  request('https://api.cryptonator.com/api/ticker/btc-usd', (error, response, body) => {
    if(!error && response.statusCode == 200) { 
      bitcoinLabel.label = `$${ parseFloat(JSON.parse(body).ticker.price).toFixed(2) }`
    }
  });
}

let interval = setInterval(fetchBitcoinPrice, 10000)

const touchBar = new TouchBar([
  bitcoinLabel
])

let window

app.once('ready', () => {
  window = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden-inset',
    width: 200,
    height: 200,
    backgroundColor: '#000'
  })
  window.loadURL('about:blank')
  window.setTouchBar(touchBar)
  fetchBitcoinPrice();
})
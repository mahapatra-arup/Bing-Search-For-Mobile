import words from '../data/words.js'

chrome.runtime.connect({ name: "popup" });

let andreaCorrigaWebsite = 'https://bing.com'

// Desktop object
var desktopArray = {
    title: "pc",
    width: 0,
    height: 0,
    deviceScaleFactor: 1,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/604.1 Edg/109.0.100.0",
    touch: false,
    mobile: false
}

// Phones for mobile searches
var phonesArray = [{
    title: "Google Nexus 4",
    width: 380,
    height: 320,
    deviceScaleFactor: 2,
    userAgent: "Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 EdgA/42.0.0.2057",
    touch: true,
    mobile: true
}]

var phones = {}

phonesArray.forEach(function (phone) {
    phones[phone.title.replace(/\s+/gi, '')] = phone;
})

// Wait time between searches
let milliseconds = 1401

// Default value
let numberOfSearches = 39
let numberOfSearchesMobile = 43

// Dom Elements for jQuery purpose
const domElements = {
    txtDelaySearchesForm: '#txtDelaySearchesForm',
    currentSearchNumber: '#currentSearchNumber',
    currentSearchMobileNumber: '#currentSearchMobileNumber',
    totSearchesNumber: '#totSearchesNumber',
    totSearchesMobileNumber: '#totSearchesMobileNumber',
    allButton: '#allButton',
    desktopButton: '#desktopButton',
    mobileButton: '#mobileButton',
    totSearchesForm: '#totSearchesForm',
    totSearchesMobileForm: '#totSearchesMobileForm'
}

// Await time between searches
const timer = ms => new Promise(res => setTimeout(res, ms))

// Progressbar object
let progressDesktop = document.querySelector(".progress-bar-desktop")
let progressMobile = document.querySelector(".progress-bar-mobile")

//--------------Delay Of Searches-----------------
// Set Delay Of Searches default values inside the input (Update)
$(domElements.txtDelaySearchesForm).val(milliseconds)
// Update the html with default numberOfSearches number 0/totSearches
$(domElements.txtDelaySearchesForm).html(milliseconds)
// When change the value inside the input
$(domElements.txtDelaySearchesForm).on('change', function () {
    milliseconds = parseInt($(domElements.txtDelaySearchesForm).val())
    $(domElements.txtDelaySearchesForm).html(milliseconds)

})
//------------------------------------------------

// Set numberOfSearches default values inside the input
$(domElements.totSearchesForm).val(numberOfSearches)
$(domElements.totSearchesMobileForm).val(numberOfSearchesMobile)

// Update the html with default numberOfSearches number 0/totSearches
$(domElements.totSearchesNumber).html(numberOfSearches)
$(domElements.totSearchesMobileNumber).html(numberOfSearchesMobile)

// When change the value inside the input
$(domElements.totSearchesForm).on('change', function () {
    numberOfSearches = parseInt($(domElements.totSearchesForm).val())
    $(domElements.totSearchesNumber).html(numberOfSearches)

})

$(domElements.totSearchesMobileForm).on('change', function () {
    numberOfSearchesMobile = parseInt($(domElements.totSearchesMobileForm).val())
    $(domElements.totSearchesMobileNumber).html(numberOfSearchesMobile)

})



//All  pc & mobile both Search
$(domElements.allButton).on('click', async () => {
    await timer(1000)
    let tabId = await getTabId()
    //pc search
    await timer(1000)
    handleDesktopMode(tabId)


    //sleep (numberOfSearches*2)=because 2ms increase per serarch time   and 4000= for wait next mobile search
    await timer((milliseconds * numberOfSearches) + 3000) //Wait for complete desktopmode Saerch


    //mobile search
    let tabId1 = await getTabId()
    handleMobileMode(tabId)
})

// Start search desktop
$(domElements.desktopButton).on("click", async () => {
    let tabId = await getTabId()
    handleDesktopMode(tabId)
})

// Start search mobile
$(domElements.mobileButton).on('click', async () => {
    let tabId = await getTabId()
    handleMobileMode(tabId)
})

/**
 * Perform random searches on Bing
 */
async function doSearchesDesktop() {

    deactivateForms()

    for (var i = 0; i < numberOfSearches; i++) {

        let randomNumber = Math.floor(Math.random() * words.length)

        chrome.tabs.update({
            url: `https:www.bing.com/search?q=${words[randomNumber]}`
        })

        setProgress(parseInt(((i + 1) / numberOfSearches) * 100), 'desktop')

        $(domElements.currentSearchNumber).html(i + 1)
        await timer(milliseconds) //Increase 2 mili second
    }

    openAndreaCorriga()

    setProgress(0, 'desktop')
    activateForms()
}

/**
 * Perform random searches Mobile on Bing
 */
async function doSearchesMobile() {

    deactivateForms()

    for (var i = 0; i < numberOfSearchesMobile; i++) {

        let randomNumber = Math.floor(Math.random() * words.length)

        chrome.tabs.update({
            url: `https:www.bing.com/search?q=${words[randomNumber]}`
        })

        setProgress(parseInt(((i + 1) / numberOfSearchesMobile) * 100), 'mobile')

        $(domElements.currentSearchMobileNumber).html(i + 1)
        await timer(milliseconds)//Increase 2 mili second
    }

    setProgress(0, 'mobile')
    activateForms()
}

function openAndreaCorriga() {
    chrome.tabs.update({
        url: andreaCorrigaWebsite
    })
}

/**
 * Deactivate Make search button 
 * and Number of Search form
 */
function deactivateForms() {
    $(domElements.txtDelaySearchesForm).prop("disabled", true)
    $(domElements.allButton).prop("disabled", true)
    $(domElements.desktopButton).prop("disabled", true)
    $(domElements.mobileButton).prop("disabled", true)
    $(domElements.totSearchesForm).prop("disabled", true)
    $(domElements.totSearchesMobileForm).prop("disabled", true)
}

/**
 * Activate Make search button 
 * and Number of Search form
 */
function activateForms() {
    $(domElements.txtDelaySearchesForm).prop("disabled", false)
    $(domElements.allButton).prop("disabled", false)
    $(domElements.desktopButton).prop("disabled", false)
    $(domElements.mobileButton).prop("disabled", false)
    $(domElements.totSearchesForm).prop("disabled", false)
    $(domElements.totSearchesMobileForm).prop("disabled", false)
}

/**
 * Update progressbar value
 * @param {*} value 
 */
function setProgress(value, type) {
    if (type == 'desktop') {
        progressDesktop.style.width = value + "%";
        progressDesktop.innerText = value + "%";
    }

    if (type == 'mobile') {
        progressMobile.style.width = value + "%";
        progressMobile.innerText = value + "%";
    }
}

async function getTabId() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0]
            var activeTabId = activeTab.id
            resolve(activeTabId)
        })
    })
}

function handleMobileMode(tabId) {
    enableDebugger(tabId)

    chrome.debugger.sendCommand({
        tabId: tabId
    }, "Network.setUserAgentOverride", {
        userAgent: phones.GoogleNexus4.userAgent
    }, function () {

        chrome.debugger.sendCommand({
            tabId: tabId
        }, "Page.setDeviceMetricsOverride", {
            width: phones.GoogleNexus4.width,
            height: phones.GoogleNexus4.height,
            deviceScaleFactor: phones.GoogleNexus4.deviceScaleFactor,
            mobile: phones.GoogleNexus4.mobile,
            fitWindow: true
        }, async function () {
            await doSearchesMobile()

            disableDebugger(tabId)

            openAndreaCorriga()
        })

    })

}

/**Only for Desktop user */
function handleDesktopMode(tabId) {
    enableDebugger(tabId)

    chrome.debugger.sendCommand({
        tabId: tabId
    }, "Network.setUserAgentOverride", {
        userAgent: desktopArray.userAgent
    }, function () {

        chrome.debugger.sendCommand({
            tabId: tabId
        }, "Page.setDeviceMetricsOverride", {
            width: desktopArray.width,
            height: desktopArray.height,
            deviceScaleFactor: desktopArray.deviceScaleFactor,
            mobile: desktopArray.mobile,
            fitWindow: true
        }, async function () {
            await doSearchesDesktop()

            disableDebugger(tabId)

            openAndreaCorriga()
        })

    })

}

function enableDebugger(tabId) {
    chrome.debugger.attach({ tabId }, "1.2", function () {
        console.log(`Debugger enabled by tab: ${tabId}`);
    })
}

function disableDebugger(tabId) {
    chrome.debugger.detach({ tabId }, function () {
        console.log(`Debugger disables by tab: ${tabId}`);
    })
}


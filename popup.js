document.addEventListener('DOMContentLoaded', function () {
    var cleanButton = document.getElementById('cleanButton');
    cleanButton.addEventListener('click', cleanNumbers);
  });
  
  function cleanNumbers() {
    // Fetch HTML content of the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
  
      chrome.tabs.sendMessage(activeTab.id, { action: "fetchHTML" }, function (response) {
        const text = response.htmlData;
  
        // Updated regex to match numbers with various formats and country codes
        const regex = /\+\d{1,}[\s\d()-]*\d{1,}/g;
  
        const matchedNumbers = text.match(regex) || [];
  
        // Remove duplicates
        const uniqueNumbers = [...new Set(matchedNumbers)];
  
        const cleanNumbers = uniqueNumbers.map(number => '+' + number.replace(/[^\d]/g, ''));
  
        // Display cleaned numbers
        const cleanedNumbersDiv = document.getElementById('cleanedNumbers');
        cleanedNumbersDiv.innerHTML = "<h3>All Mobile Numbers:</h3>" + cleanNumbers.join('<br>');
  
        // Enable and set download links
        const downloadCsvLink = document.getElementById('downloadCsv');
        const downloadVCardLink = document.getElementById('downloadVCard');
        downloadCsvLink.style.display = 'block';
        downloadVCardLink.style.display = 'block';
  
        // CSV content
        const csvContent = 'data:text/csv;charset=utf-8,' + cleanNumbers.join('\n');
        downloadCsvLink.setAttribute('href', encodeURI(csvContent));
  
        // VCard content
        const vCardContent = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(getVCardString(cleanNumbers));
        downloadVCardLink.setAttribute('href', encodeURI(vCardContent));
      });
    });
  }
  
  function getVCardString(numbers) {
    return numbers.map(number => `BEGIN:VCARD\nVERSION:3.0\nTEL:${number}\nEND:VCARD`).join('\n');
  }
  
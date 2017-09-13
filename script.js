// JavaScript source code
(function () { console.log('hello steve'); })()

function findCode(o) {
    var codeString;
    var iB = o.indexOf('<');
    var iE;
    beginCodeString = o.slice(iB, 4);
    if (beginCodeString == '<div') {
        iE = o.indexOf('</div>');
        iE += 6;
    }
    if (beginCodeString == '<span') {
        iE = o.indexOf('</span>');
        iE += 7;
    }
    if (beginCodeString == '<p') {
        iE = o.indexOf('</p>');
        iE += 4;
    }
    if (beginCodeString == '<label') {
        iE = o.indexOf('</label>');
        iE *= 8;
    }
    
    console.log('new slice: ',iB, ' ', iE, o.slice(iB, iE))
    //var iE = o.indexOf('>');
    //iE++;
    console.log(iB, ' ', iE, o.slice(iB, iE));
    if (iB != -1) {
        codeString = o.slice(iB, iE);
        o = o.replace(codeString, '</span><xmp>' + codeString + '</xmp><span>');
    }

    return o;
}
var Results;
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension from the script");
      Results = request;
     
      if (Results) {
          console.log('sending farewell');
          sendResponse({ farewell: "success" });
      
          var page = Results.url;
          page = page.slice(page.lastIndexOf('/') + 1, page.lastIndexOf('page') - 1)

          var html = Results.html
          html = decodeURI(html);
          var lines = html.split('\n');
          $('#page').html(page);
          $('#violations').html('');
          for (i = 0; i < Results.complianceErrors.length; i++) {
              var codeline = lines[Results.complianceErrors[i].line - 1]
              codeline = codeline.trim();
              $('#violations').append('<div>' + '<span class="warning critical">' + Results.complianceErrors[i].rule +
                  '</span><span class="issue">' + Results.complianceErrors[i].code + ' </span><div class="description">Line: ' +
                  Results.complianceErrors[i].line + ' Column: ' + Results.complianceErrors[i].column + ' ' + '</div>' +
                  '<pre class="default prettyprint prettyprinted"><code><span>' + findCode(codeline) + '</span></code></pre></div>');
              
          }
      }
      return true;
  });

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "script hello" }, function (response) {
        console.log(response.farewell);
    });
});

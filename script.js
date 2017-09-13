// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//
// Additionally, you can toggle specific options in the Configure
// menu.

// JavaScript source code


function findCode(o) {
    var codeString;
    var iB = o.indexOf('<');
    var iE;
    var beginCodeString = o.slice(iB, 4);
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
        iE += 8;
    }

    console.log('new slice: ', iB, ' ', iE, o.slice(iB, iE));
    //var iE = o.indexOf('>');
    //iE++;
    console.log(iB, ' ', iE, o.slice(iB, iE));
    if (iB != -1) {
        codeString = o.slice(iB, iE);
        o = o.replace(codeString, '<xmp>' + codeString + '</xmp>');
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
          page = page.slice(page.lastIndexOf('/') + 1, page.lastIndexOf('page') - 1);

          var html = Results.html;
          html = decodeURI(html);
          var lines = html.split('\n');
          $('#page').html(page);
          $('#violations').html('');
          for (var i = 0; i < Results.complianceErrors.length; i++) {
              var lineNumber = Results.complianceErrors[i].line -1;
              var codeline = lines[Results.complianceErrors[i].line - 1];
              var errorData='';
              if (Results.complianceErrors[i].data.tag != undefined) {
                  errorData = '<code><span>Tag: <<xmp>' + Results.complianceErrors[i].data.tag + '</xmp>></span></code>'
              }
              if (Results.complianceErrors[i].data.id != undefined) {
                  errorData = '<span>id: ' + Results.complianceErrors[i].data.id + '</span>'
              }
              codeline = codeline.trim();
              $('#violations').append('<div>' + '<span class="warning critical">' + Results.complianceErrors[i].rule +
                  '</span><span class="issue">' + Results.complianceErrors[i].code + ' </span>'+ errorData +'<div class="description">Line: ' +
                  lineNumber + ' Column: ' + Results.complianceErrors[i].column + ' ' + '</div>' +
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

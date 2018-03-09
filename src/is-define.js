// MIT © 2018 azu
"use strict";

/**
 * Return a promise of `isDefined` boolean.
 * @param {string} method `Array.prototype.flatten`
 * @param {string} src prototype library
 * @returns {Promise<boolean>}
 */
export function isDefined(method, src) {
    const currentLocation = location.href;
    return new Promise((resolve, reject) => {
        const iframe = document.createElement("iframe");
        iframe.src = "about:blank";
        document.body.appendChild(iframe);
        const receiveMessage = event => {
            if (event.origin !== location.origin) {
                return reject(new Error("Not same origin"));
            }
            const isDefined = event.data;
            resolve(isDefined);
        };
        window.addEventListener("message", receiveMessage, false);
        window.addEventListener("error", (msg, file, line, column, err) => {
            reject(err || message);
        });
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
<script>
delete ${method};
var _importScript = (function (oHead) {

  function loadError (oError) {
    throw new URIError("The script " + oError.target.src + " is not accessible.");
  }

  return function (sSrc, fOnload) {
    var oScript = document.createElement("script");
    oScript.type = "text\\/javascript";
    oScript.src = sSrc;
    oScript.onerror = loadError;
    if (fOnload) { oScript.onload = fOnload; }
    oHead.appendChild(oScript);  
  }

})(document.getElementsByTagName("head")[0]);
_importScript("${src}", function(){
    parent.postMessage(typeof ${method} === "function", "${currentLocation}");
});
</script>
`);
        doc.close();
    }).then(isDefined => {
        return isDefined;
    });
}

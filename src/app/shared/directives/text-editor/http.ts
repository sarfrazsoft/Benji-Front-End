// A simple wrapper for XHR.
export function req(conf) {
  const r = new XMLHttpRequest();
  let aborted = false;
  const result: any = new Promise((success, failure) => {
    console.log(conf.url);
    conf.url = 'http://localhost:8888' + conf.url;
    r.open(conf.method, conf.url, true);
    r.addEventListener('load', () => {
      if (aborted) {
        return;
      }
      if (r.status < 400) {
        success(r.responseText);
      } else {
        let text = r.responseText;
        if (text && /html/.test(r.getResponseHeader('content-type'))) {
          text = makePlain(text);
        }
        const err: any = new Error('Request failed: ' + r.statusText + (text ? '\n\n' + text : ''));
        err.status = r.status;
        failure(err);
      }
    });
    r.addEventListener('error', () => {
      if (!aborted) {
        failure(new Error('Network error'));
      }
    });
    if (conf.headers) {
      // tslint:disable-next-line:forin
      for (const header in conf.headers) {
        r.setRequestHeader(header, conf.headers[header]);
      }
    }
    r.send(conf.body || null);
  });
  result.abort = () => {
    if (!aborted) {
      r.abort();
      aborted = true;
    }
  };
  return result;
}

function makePlain(html) {
  const elt = document.createElement('div');
  elt.innerHTML = html;
  return elt.textContent.replace(/\n[^]*|\s+$/g, '');
}

export function GET(url) {
  return req({ url, method: 'GET' });
}

export function POST(url, body, type) {
  return req({ url, method: 'POST', body, headers: { 'Content-Type': type } });
}

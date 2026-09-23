from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import tempfile

SCRIPT = r"""
(() => {
  const report = () => {
    const header = document.querySelector('.container-header');
    if (!header) return;
    const describe = el => {
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      return {tag: el.tagName, cls: el.className, top:r.top, bottom:r.bottom, width:r.width, height:r.height,
        position:s.position, zIndex:s.zIndex, display:s.display, visibility:s.visibility, opacity:s.opacity,
        transform:s.transform, filter:s.filter, backdropFilter:s.backdropFilter,
        overflowX:s.overflowX, overflowY:s.overflowY, contain:s.contain};
    };
    const data = {time:Date.now(), scrollY, innerWidth, innerHeight, viewport: window.visualViewport && {
      top:visualViewport.offsetTop, pageTop:visualViewport.pageTop, height:visualViewport.height, scale:visualViewport.scale},
      header:describe(header), body:describe(document.body), html:describe(document.documentElement),
      atTop:document.elementsFromPoint(innerWidth/2, 20).slice(0,5).map(describe)};
    fetch('http://127.0.0.1:8766/report', {method:'POST', body:JSON.stringify(data)}).catch(()=>{});
  };
  window.addEventListener('load', report);
  let timer;
  window.addEventListener('scroll', () => {clearTimeout(timer); timer=setTimeout(report,150);}, {passive:true});
  window.addEventListener('resize', report);
  document.addEventListener('scroll', report, {passive:true, capture:true});
  setInterval(report, 2000);
  report();
})();
"""

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/javascript')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(SCRIPT.encode())
    def do_POST(self):
        data = self.rfile.read(int(self.headers.get('Content-Length', 0)))
        width = int(json.loads(data).get('innerWidth', 0))
        (Path(tempfile.gettempdir()) / f'vertex-header-debug-{width}.json').write_bytes(data)
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
    def log_message(self, *args):
        pass

ThreadingHTTPServer(('127.0.0.1', 8766), Handler).serve_forever()

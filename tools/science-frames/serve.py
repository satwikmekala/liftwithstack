import http.server, os, sys
root_map={'/three/':'/Users/satwikmekala/stackv3/liftwithstack/node_modules/three/','/model/':sys.argv[1]+'/ecorche/model/'}
class H(http.server.SimpleHTTPRequestHandler):
    def translate_path(self,path):
        path=path.split('?')[0]
        for k,v in root_map.items():
            if path.startswith(k): return v+path[len(k):]
        return sys.argv[1]+'/render'+path
    def log_message(self,*a): pass
http.server.ThreadingHTTPServer(('127.0.0.1',4190),H).serve_forever()

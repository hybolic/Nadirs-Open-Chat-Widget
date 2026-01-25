from http.server import HTTPServer, BaseHTTPRequestHandler
import re , os, urllib, urllib.request, urllib.parse, json
#set directory to be the chat-overlay directory
os.chdir(r"./chat-overlay")

class ServOG(BaseHTTPRequestHandler):
    
    def do_GET(self):
        MIME = None
        file_to_open = None
        if self.path.__contains__("?"):
            self.ogpath = self.path
            self.params_ = re.sub(".*\?","",self.path)
            self.path = re.sub("\?.*","",self.path)
        
        if self.path == '/' or self.path == "/debug":
            self.path = '/chat.html'
            self.send_response(301)
            self.send_header('Location','http://localhost:' + str(httpd.server_address[1]) + self.path + '?DEBUG=5&spam_msg=30&spam_speed=500,800,400,1000')
        elif self.path.__contains__("/get_emote"):
            params = urllib.parse.parse_qs(self.params_)
            json_obj = {}
            try:
                if (not os.path.isfile("./emotes/"+ params["emote_name"][0] + "-s")):
                    urllib.request.urlretrieve("https://static-cdn.jtvnw.net/emoticons/v2/" + params["id"][0] + "/default/light/1.0", "./emotes/"+ params["emote_name"][0] + "-s")
                json_obj["x1"] = "./emotes/"+ params["emote_name"][0] + "-s"
                if (not os.path.isfile("./emotes/"+ params["emote_name"][0] + "-m")):
                    urllib.request.urlretrieve("https://static-cdn.jtvnw.net/emoticons/v2/" + params["id"][0] + "/default/light/2.0", "./emotes/"+ params["emote_name"][0] + "-m")
                json_obj["x2"] = "./emotes/"+ params["emote_name"][0] + "-m"
                if (not os.path.isfile("./emotes/"+ params["emote_name"][0] + "-l")):
                    urllib.request.urlretrieve("https://static-cdn.jtvnw.net/emoticons/v2/" + params["id"][0] + "/default/light/3.0", "./emotes/"+ params["emote_name"][0] + "-l")
                json_obj["x4"] = "./emotes/"+ params["emote_name"][0] + "-l"
            except Exception:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(bytes("URL ERROR", 'utf-8'))
                return
            try:
                if (not os.path.isfile("./emotes/"+ params["emote_name"][0] + "-xl")):
                    urllib.request.urlretrieve("https://static-cdn.jtvnw.net/emoticons/v2/" + params["id"][0] + "/default/light/4.0", "./emotes/"+ params["emote_name"][0] + "-xl")
                json_obj["x8"] = "./emotes/"+ params["emote_name"][0] + "-xl"
            except Exception:
                pass
            self.send_response(200)
            self.end_headers()
            self.wfile.write(bytes(json.dumps(json_obj), 'utf-8'))
            return
        elif self.path[:8].__contains__("/emotes/"):
            file_to_open = open(self.path[1:], 'rb').read()
            file_data = str(file_to_open)[2:7]
            file_type = re.sub("[^a-zA-Z]","",file_data).lower()
            MIME = 'image/' + file_type
            self.send_response(200)
            self.send_header('Content-type', MIME)
        else:
            try:
                curfil = open(self.path[1:])
                MIME = get_mime_type(self.path)
                if not (MIME is None):
                    self.send_response(200)
                    if MIME.__contains__("image"):
                        curfil.close()
                        curfil = open(self.path[1:], 'rb')
                    self.send_header('Content-type', MIME)
                file_to_open = curfil.read()
            except:
                file_to_open = "File not found"
                self.send_response(404)
        self.end_headers()
        if(file_to_open != None):
            if(not (MIME is None) and MIME.__contains__("image")):
                self.wfile.write(bytes(file_to_open))
            else:
                self.wfile.write(bytes(file_to_open, 'utf-8'))

def get_mime_type(path):
    if path.endswith(".html"):
        return 'text/html'
    if path.endswith(".jpg"):
        return 'image/jpg'
    if path.endswith(".png"):
        return 'image/png'
    if path.endswith(".gif"):
        return 'image/gif'
    if path.endswith(".js"):
        return 'application/javascript'
    if path.endswith(".css"):
        return 'text/css'
    return None
       
httpd = HTTPServer(('localhost',8080),ServOG)
httpd.serve_forever()
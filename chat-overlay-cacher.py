#CACHE Print so it can be replaced with one that can post to gui
OG_PRINT = print

#base python no need to check for import
from http.server import HTTPServer, BaseHTTPRequestHandler
import re , urllib, urllib.request, urllib.parse, json
import threading

import sys, os

#### STATIC DEFINITIONS for VENV ####
retry = 0
virtual_dir = ".venv"
requirements_path = ".\\py\\requirements.txt"
### STATIC DEFINITIONS for VENV ####

# attempt importation of stuff if it fails we do a pip install of the requirements.txt from %requirements_path%
def tryImportStuff():
    global retry
    try:
        ########### add imports to test here here ###########
        import PyQt6
        import PyQt6.QtWidgets
        
        ########### optional ###########
        # # optional remove them after the check in reverse order preferably if not all things are used in specifically this script alone
        # del PyQt6.QtWidgets
        # del PyQt6
        ########### end ###########
    #on import exception then we do the magic :D
    except ImportError:
        import subprocess
        
        #activate venv for shell
        venv_activate      = ".\\"+virtual_dir+"\\Scripts\\activate"
        subprocess.call(venv_activate, shell=True)
        
        # upgrade pip
        venv_upgrade_pip   = "python -m pip install --upgrade pip"
        subprocess.call(venv_upgrade_pip, shell=True)
        
        #install requirements
        venv_install_reqs  = "pip install --no-input -r " + requirements_path
        subprocess.call(venv_install_reqs, shell=True)
        
        #if retry is greater then 3 we force quit
        if retry > 3: print("UNABLE TO IMPORT!?"); exit()
        retry += 1
        
        #repeat
        tryImportStuff()
        #then check if subprocess still exists
        if subprocess: # if it does
            del subprocess # yeet it

#check if we are in an venv if not we make and enter one. this keeps the main python install clean
if not (sys.prefix != (getattr(sys, "base_prefix", None) or getattr(sys, "real_prefix", None) or sys.prefix)):
    print("FORCING VIRTUAL ENVIROMENT")
    from venv import EnvBuilder
    
    #check if path exists
    if not os.path.exists(virtual_dir):
        #build venv
        virtual = EnvBuilder(with_pip=True)
        virtual.create(env_dir="./" + virtual_dir)
    #remove EnvBuilder import
    del EnvBuilder #bye bye, we don't need you anymore!
    
    #script location
    activator = "./" + virtual_dir + "/Scripts/activate_this.py"
    local_activator = "./py/activate_this.py"
    
    #import shutil here before we use it
    import shutil, filecmp
    
    #if we do not have a copy of local we make one
    if not os.path.exists(local_activator):
        import gzip, base64
        with open(local_activator, "w") as text_file:
            text_file.write(gzip.decompress(base64.b64decode("H4sIAAAAAAAC/z1RwW7jIBC9+yt8G2gcpN4qIw45VNqVut2om+3FtSxsjx0SBxBDV83fF5xtT7wZ5vHmPabgLqWj0ly8C7H0Oh5LTaWv0P4zwdlcmCq3CX0uSP4fJRMxN44VXSmDWS5qFnm0iOFaD8oL3VOuWddNZsGu4wV+DOhj+awv+BiCC5l4rp2C8G79FWTQhrDcEWGIxtl1hl1oVjCZj68tYeM2IG+HSMRuFckSHPiUHZ0LneRHE2wSYgOXvdJNvV3QMvgzBOMjAd/et/KkYL87/ABpmlOrSJycsazR1Z0RM0Z2qgC4IL+YyIi3XFoFrz9fDn93T93j82um2Vb1+dhAt3/5/Wt/gFYBJGde9JpwXaDnElUWv+XDiyndT6WxIMTbk+nfcphbr4eznpHgW7Aek4uAelkN+tt2upo4l0ehxzHTkkk2ihEHNyKD9zhtH4CbCQCXlOTIi6WpW7U0WLebBLGV8/pk5wOmTPOXrUB+AdV/AqZng0UVAgAA")).decode())
            text_file.close()
            new_path = shutil.copy(src=local_activator, dst=activator)
        del gzip, base64
    #check if the script exits in the venv or if they do not match, we copy it over ourselves
    elif filecmp.cmp(local_activator, activator) or not os.path.exists(activator):
        #new path of script added to virtual env
        new_path = shutil.copy(src=local_activator, dst=activator)
    # we no longer need access to shutil so yeet it
    del shutil
    
    #open a %CWD%\\%virtual_dir%\\Scripts\\activate_this.py as a TextIOWrapper
    with open(os.path.abspath(".\\"+virtual_dir+"\\Scripts\\activate_this.py")) as f:
        # read file and compile the code for exec and execute it in script
        exec(compile(f.read(), activator, 'exec'), dict(__file__=activator))
    #check if we are now in a virtual enviroment!
    if not sys.prefix != (getattr(sys, "base_prefix", None) or getattr(sys, "real_prefix", None) or sys.prefix):
        exit()

#try to do imports after everything
tryImportStuff()

# GUI STUFF
import PyQt6
import PyQt6.QtWidgets as Widgets
from PyQt6 import *
from PyQt6.QtCore import *
from PyQt6.QtWidgets import *
from PyQt6.QtGui import *
from PyQt6.QtWidgets import *

#set directory to be the chat-overlay directory
os.chdir(r"./chat-overlay")

#VARIABLES
has_emotes : str = ""
print_data: str = ""
httpd: HTTPServer = None
http_server_thread: threading.Thread = None
lock = threading.Lock()
app: QApplication #predefine app var


class ServOG(BaseHTTPRequestHandler):
    
    #replace default message with one that posts to MainWindow
    def log_message(self, formats, *args):
        global print_data
        print_data += format("%s - - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), formats%args)) + "\n"
        sys.stderr.write("%s - - [%s] %s\n" %(self.address_string(),self.log_date_time_string(),formats%args))

        
    
    
    def getEmote(self):
        params = urllib.parse.parse_qs(self.params_)
        json_obj = {}
        try:
            if (not os.path.isfile("./emotes/"+ params["emote_name"][0] + "-s")):
                urllib.request.urlretrieve("https://static-cdn.jtvnw.net/emoticons/v2/" + params["id"][0] + "/default/light/1.0", "./emotes/"+ params["emote_name"][0] + "-s")
                print(params["emote_name"][0])
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
        with lock:
            global has_emotes
            has_emotes += json_obj["x1"] + "\n"
    
    def do_POST(self):
        #variables
        MIME = None
        file_to_open = None
        
        #strip path paramater context
        if self.path.__contains__("?"):
            self.ogpath = self.path
            self.params_ = re.sub(".*\?","",self.path)
            self.path = re.sub("\?.*","",self.path)

        #if path starts with /get_emote we know to grab the emote data and send it back to the client
        if self.path.startswith("/get_emote"):
            ServOG.getEmote(self)
            return
        else: #nothing found send 404
            file_to_open = "File not found"
            self.send_response(404)
        
        #send response data
        if(not (MIME is None) and MIME.__contains__("image")):
            self.wfile.write(bytes(file_to_open))
        else:
            self.wfile.write(bytes(file_to_open, 'utf-8'))
    
    def do_GET(self):
        print ( "GET " + self.path)
        MIME = None
        file_to_open = None
        
        if self.path.__contains__("?"):
            self.ogpath = self.path
            self.params_ = re.sub(".*\?","",self.path)
            self.path = re.sub("\?.*","",self.path)
        
        if self.path == '/' or self.path == "/debug":
            self.path = '/chat.html'
            self.send_response(301)
            self.send_header('Location','http://localhost:' + str(httpd.server_address[1]) + '/chat.html?DEBUG=5&spam_msg=30&spam_speed=500,800,400,1000')
            
        elif self.path.startswith("/get_emote"):
            ServOG.getEmote(self)
            return
        
        elif self.path[:8].startswith("/emotes/"):
            MIME = get_mime_from_filedata(self.path[1:])
            self.send_response(200)
            self.send_header('Content-type', MIME)
            
        else:
            try:
                curfil = open(self.path[1:])
                MIME = get_mime_from_extension(self.path)
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

def get_mime_from_extension(path):
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

def get_mime_from_filedata(path):
    file_to_open = open(path, 'rb').read()
    file_data = str(file_to_open)[2:7]
    file_type = re.sub("[^a-zA-Z]","",file_data).lower()
    return get_mime_from_extension('.' + file_type)

class MainWindow(QMainWindow):
    
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Webhost")

        self.setBaseSize(QSize(800, 600))
        self.setMinimumSize(QSize(800, 600))
        self.centralwidget = QWidget()
        self.centralwidget.setObjectName(u"centralwidget")
        sizePolicy1 = QSizePolicy(QSizePolicy.Policy.Maximum, QSizePolicy.Policy.Maximum)
        sizePolicy1.setHorizontalStretch(0)
        sizePolicy1.setVerticalStretch(0)
        sizePolicy1.setHeightForWidth(self.centralwidget.sizePolicy().hasHeightForWidth())
        self.centralwidget.setSizePolicy(sizePolicy1)
        self.setCentralWidget(self.centralwidget)
        
        self.LogginScrollArea = QScrollArea(self.centralwidget)
        self.LogginScrollArea.setGeometry(QRect(0, 0, 771, 164))
        self.LogginScrollArea.setFrameShape(QFrame.Shape.HLine)
        self.LogginScrollArea.setFrameShadow(QFrame.Shadow.Plain)
        self.LogginScrollArea.setVerticalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOn)
        self.LogginScrollArea.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAsNeeded)
        self.LogginScrollArea.setSizeAdjustPolicy(QAbstractScrollArea.SizeAdjustPolicy.AdjustToContents)
        self.LogginScrollArea.setWidgetResizable(True)
        self.LogginscrollAreaWidgetContents = QWidget()
        self.LogginscrollAreaWidgetContents.setGeometry(QRect(0, 0, 655, 160))

        self.textEdit = Widgets.QLabel(self.LogginscrollAreaWidgetContents)
        self.textEdit.setGeometry(QRect(0, 0, 655, 160))
        sizePolicy2 = QSizePolicy(QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Maximum)
        sizePolicy2.setHorizontalStretch(0)
        sizePolicy2.setVerticalStretch(0)
        sizePolicy2.setHeightForWidth(self.textEdit.sizePolicy().hasHeightForWidth())
        self.textEdit.setSizePolicy(sizePolicy2)
        self.textEdit.setAlignment(Qt.AlignmentFlag.AlignLeading|Qt.AlignmentFlag.AlignLeft|Qt.AlignmentFlag.AlignTop)
        
        # MAX LINES IN LOGGER
        self.textEdit.maxLines = 512
        
        self.LogginScrollArea.setWidget(self.LogginscrollAreaWidgetContents)
        
        self.pictureText = []
        self.EMOTE_LIST = []
        
        self.EmoteScrollArea = QScrollArea(self.centralwidget)
        self.EmoteScrollArea.setGeometry(QRect(0, 160, 771, 300))
        self.EmoteScrollArea.setFrameShape(QFrame.Shape.HLine)
        self.EmoteScrollArea.setFrameShadow(QFrame.Shadow.Plain)
        self.EmoteScrollArea.setVerticalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOn)
        self.EmoteScrollArea.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        self.EmoteScrollArea.setSizeAdjustPolicy(QAbstractScrollArea.SizeAdjustPolicy.AdjustToContents)
        self.EmoteScrollArea.setWidgetResizable(True)
        self.scrollAreaWidgetContents = QWidget()
        self.scrollAreaWidgetContents.setGeometry(QRect(0, 0, 655, 299))
        
        self.horizontalLayoutWidget = QWidget(self.scrollAreaWidgetContents)
        self.horizontalLayoutWidget.setGeometry(QRect(0, 0, 655, 900))
        self.horizontalLayout = Widgets.QHBoxLayout(self.horizontalLayoutWidget)
        self.horizontalLayout.setContentsMargins(0, 0, 0, 0)
        
        self.LARGE_IMAGE = QLabel(self.centralwidget)
        self.LARGE_IMAGE.setGeometry(QRect(6, 600-118, 112, 112))
        self.LARGE_IMAGE.setMinimumSize(112, 112)
        self.LARGE_IMAGE.mv = QMovie("./emotes/notevi3Dispare-l")
        self.LARGE_IMAGE.setMovie(self.LARGE_IMAGE.mv)
        self.LARGE_IMAGE.mv.start()
        self.LARGE_IMAGE.hide()
        
        self.LARGE_IMAGE_NAME = QLabel(self.centralwidget)
        self.LARGE_IMAGE_NAME.setGeometry(QRect(6, 600-148, 112, 20))
        self.LARGE_IMAGE_NAME.setMinimumSize(112, 20)
        self.LARGE_IMAGE_NAME.setText("THIS IS A TEST")
        self.LARGE_IMAGE_NAME.hide()
        
        # # SET COLOR TEST
        # palette = self.horizontalLayoutWidget.palette()
        # palette.setBrush(QPalette.ColorRole.Window, QColor("Red"))
        # self.horizontalLayoutWidget.setAutoFillBackground(True)
        # self.horizontalLayoutWidget.setPalette(palette)
        
        self.EmoteScrollArea.setWidget(self.scrollAreaWidgetContents)
        
        self.timer = QTimer()
        self.timer.timeout.connect(self.checkTimer)
        self.timer.start(1000)
        self.appendText("PRELOAD EMOTES!")
        for file in os.listdir("./emotes/"):
            if file.endswith("-s"):
                self.addEmote("./emotes/" + file)
    
    def addEmote(self, path:str):
        global print_data
        if self.EMOTE_LIST.__contains__(path) or self.EMOTE_LIST.__len__() > 100:
            return
        
        print_data += "\nADDING EMOTE => " + path
        self.EMOTE_LIST.append(path)
        pixel_width = 28
        padding     = 1
        size        = round(self.horizontalLayoutWidget.geometry().width()/(pixel_width + (padding * 2))) - 1
        new_pic:QLabel     = QLabel(self.horizontalLayoutWidget)
        
        mv:QMovie = QMovie(path)
        new_pic.setMovie(mv)
        mv.start()
            
        new_pic.setFixedSize(pixel_width, pixel_width)
        name = re.sub("-l|-m|-s|-xl", "", re.sub("\.\/emotes\/", "", path))
        new_pic.setToolTip(name)
        new_pic.setMinimumSize(pixel_width, pixel_width)
        self.pictureText.append(new_pic)
        
        new_pic.enterEvent_old = new_pic.enterEvent
        new_pic.leaveEvent_old = new_pic.leaveEvent
        new_pic.enterEvent = lambda event : self.hoverOverEmote(path, name, True)
        new_pic.leaveEvent = lambda event : self.hoverOverEmote(path, name, False)
        
        x = round((self.pictureText.__len__()-1) % (size))
        y = round(((self.pictureText.__len__()-1) / size) - (x / size))
        
        new_pic.move(x * pixel_width + padding, y * pixel_width + padding)
        new_pic.show()
    
        
        self.horizontalLayoutWidget  .setGeometry(QRect(0, 0, pixel_width * size,(y+1) * pixel_width))
        self.scrollAreaWidgetContents.setGeometry(QRect(0, 0, pixel_width * size,(y+1) * pixel_width))
        self.horizontalLayoutWidget  .setMinimumSize(self.horizontalLayoutWidget.minimumWidth(),(y+1) * pixel_width)
        self.scrollAreaWidgetContents.setMinimumSize(self.scrollAreaWidgetContents.minimumWidth(),(y+1) * pixel_width)
        
    def hoverOverEmote(self, path, emotename, hovering):
        if hovering and self.LARGE_IMAGE.isHidden():
            self.LARGE_IMAGE.mv.stop()
            self.LARGE_IMAGE.mv.setFileName(re.sub("-[smx][l]*","-l",path))
            self.LARGE_IMAGE.mv.start()
            self.LARGE_IMAGE_NAME.setText(emotename)
            self.LARGE_IMAGE.show()
            self.LARGE_IMAGE_NAME.show()
        elif not hovering and not self.LARGE_IMAGE.isHidden():
            self.LARGE_IMAGE.hide()
            self.LARGE_IMAGE_NAME.hide()
            
    def appendText(self, text):
        dat:str = (self.textEdit.text() + "\n" + text)
        
        dat2 = dat.replace('\n\n','\n').replace('\n\n','\n').strip().splitlines()
        
        l2 = len(dat2)
        l1 = max(l2-self.textEdit.maxLines, 0)
        dat2 = dat2[l1:]
        
        new_dat = ""
        for i in dat2:
            new_dat += i + "\n"
        self.textEdit.setText(new_dat)
        self.textEdit.move(0,0)
        
        text_pixelW = self.textEdit.fontMetrics().boundingRect(max(self.textEdit.text().splitlines(),key=len)).width()
        text_pixelH = round(abs(self.textEdit.fontMetrics().height() * self.textEdit.text().splitlines().__len__()))
        
        self.textEdit  .setGeometry(QRect(0, 0, text_pixelW, text_pixelH))
        self.LogginscrollAreaWidgetContents.setGeometry(QRect(0, 0, text_pixelW, text_pixelH))
        
        self.textEdit.setMinimumSize(text_pixelW, text_pixelH)
        self.LogginscrollAreaWidgetContents.setMinimumSize(text_pixelW, text_pixelH)
    
    def checkTimer(self):
        global print_data
        global has_emotes
        with lock:
            dat = has_emotes.splitlines()
            if len(has_emotes) > 0:
                for string in dat:
                    if not (string in (None, '')) or string.strip():
                        Window.addEmote(string)
            has_emotes = ""
            
            if not (print_data in (None, '')) or print_data.strip():
                dat = print_data.splitlines()
                for string in dat:
                    if not (string in (None, '')) or string.strip():
                        self.appendText(string)
                print_data = ""
                
#Define Window Gui        
Window:MainWindow = None
app = QApplication(sys.argv)
Window = MainWindow()

#Threaded HTTP server
httpd = HTTPServer(('localhost',8080), ServOG)
http_server_thread = threading.Thread(target=httpd.serve_forever)
http_server_thread.start()

#Print console AND window
def print(values: str) -> None:
    with lock:
        global http_server_thread
        global print_data
        if threading.current_thread() == http_server_thread:
                print_data += values + "\n"
                OG_PRINT("[WEB_THREAD]" + values)
        else:
                print_data += values + "\n"
                dat = print_data.splitlines()
                for string in dat:
                    if not (string in (None, '')) or string.strip():
                        Window.appendText(string)
                        OG_PRINT(string)
                print_data = ""

#show and Start Window gui
Window.show()
app.exec()

#shutdown http server
httpd.shutdown()

#force http server to rejoin main thread
http_server_thread.join()

#EOF
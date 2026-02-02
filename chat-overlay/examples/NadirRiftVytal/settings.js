var settings = { //bypass stupid inability to load files directly in js or a json file in html
"time_until_vanish" : 300000, //time in ms until message is removed from screen
"username" : "", //twitch username
"max_chat_on_screen" : 10, //max messages to ever be on screen at a time
"text_box": {
    "Standard" : {
        "fit_content"  : true,
        "has_center"   : false,
        "username_offset" :
        {
            // "Left" : "28px",
            // "Top"  : "33px",
            "Right"    : "0px",
            "Bottom"   : "0px"
        },
        "badge_offset" :
        {
            "relative_to_username" : true,
            // "Left" : "0px",
            // "Right" : "10px",
            // "Top"   : "24px",
            // "Bottom"   : "0px"
        },
        "extra_space"  : "10px",
        "Top_Left"     : "./textbox/TL.png",
        "Top_Right"    : "./textbox/TR.png",
        "Bottom_Left"  : "./textbox/BL.png",
        "Bottom_Right" : "./textbox/BR.png",
        "Left"         : "",
        "Right"        : "",
        "Top"          : "",
        "Bottom"       : "",
        "Center"       : "./textbox/C.png",
        "NameBox"    : {
            "Left"   : "./textbox/Name_L.png",
            "Center" : "./textbox/Name_C.png",
            "Right"  : "./textbox/Name_R.png"
        }
    },
    "Highlight" : {
        "fit_content"  : true,
        "has_center"   : false,
        "username_offset" :
        {
            // "Left" : "10px",
            // "Top"  : "22px",
            "Right"    : "0px",
            "Bottom"   : "0px"
        },
        "badge_offset" :
        {
            "relative_to_username" : true,
            // "Left" : "0px",
            // "Right" : "10px",
            // "Top"   : "24px",
            // "Bottom"   : "0px"
        },
        "extra_space"  : "10px",
        "Top_Left"     : "./textbox/TL.png",
        "Top_Right"    : "./textbox/TR.png",
        "Bottom_Left"  : "./textbox/BL.png",
        "Bottom_Right" : "./textbox/BR.png",
        "Left"         : "",
        "Right"        : "",
        "Top"          : "",
        "Bottom"       : "",
        "Center"       : "./textbox/C.png",
        "NameBox"    : {
            "Left"   : "./textbox/Name_L.png",
            "Center" : "./textbox/Name_C.png",
            "Right"  : "./textbox/Name_R.png"
        }
    }
},
/** 
 * @todo replace with srcset version
 * @todo        for now it just forces the size to be 20px
 */
"sub_badges": {
    1:"./badges/months/1/badge.png",
    3:"./badges/months/3/badge.png",
    6:"./badges/months/6/badge.png",
    9:"./badges/months/9/badge.png",
    12:"./badges/months/12/badge.png",
    24:"./badges/months/24/badge.png",
    48:"./badges/months/48/badge.png",
    60:"./badges/months/60/badge.png",
    72:"./badges/months/72/badge.png",
},
"badge_replace" : {
    //replacement example, here we replace vip with hearts
    "vip": {
        x1:"./badges/replace/vip/18.png",
        x2:"./badges/replace/vip/36.png",
        x4:"./badges/replace/vip/72.png",
    }
},
/** @todo replace with local files */
//these are fixed and cannot be changed without editing the source
"badge_defaults" : {
    "broadcaster": {
        x1:"https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1",
        x2:"https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2",
        x4:"https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3",
    },
    "mod": {
        x1:"https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1",
        x2:"https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2",
        x4:"https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
    },
    "vip": {
        x1:"https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1",
        x2:"https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/2",
        x4:"https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/3",
    },
    "artist": {
        x1:"https://static-cdn.jtvnw.net/badges/v1/4300a897-03dc-4e83-8c0e-c332fee7057f/1",
        x2:"https://static-cdn.jtvnw.net/badges/v1/4300a897-03dc-4e83-8c0e-c332fee7057f/2",
        x4:"https://static-cdn.jtvnw.net/badges/v1/4300a897-03dc-4e83-8c0e-c332fee7057f/3",
    }
}
}
settings.name_box = {}
settings.name_box.offset_right = "36px"
settings.name_box.offset_bottom = "-36px"
console.log(parseFloat(settings.name_box.offset_bottom.replace("px","")))
settings.name_box.badge_offset_bottom = (parseFloat(settings.name_box.offset_bottom.replace("px","")) + 16) + "px"

console.log(settings.name_box.badge_offset_bottom)
settings.PostImageLoad = PostImageLoad
settings.PreAppenedChildUserName = PreAppenedChildUserName
for (var variant in settings.text_box)
{
    settings.text_box[variant].badge_offset.relative_to_username_new = settings.text_box[variant].badge_offset.relative_to_username
    settings.text_box[variant].badge_offset.relative_to_username     = false
}

//EXTRA STUFF


function PostImageLoad(ImageCache, REF)
{
        //stored variants
    for (var variant in settings.text_box) {
        if (REF[variant].NameBox == null)
            REF[variant].NameBox = {}
        REF[variant].NameBox.Left = document.createElement("img");
        REF[variant].NameBox.Left.setAttribute("id", "IMAGE_REFERENCE")
        REF[variant].NameBox.Left.src = settings.text_box[variant].NameBox.Left;
        
        REF[variant].NameBox.Center = document.createElement("img");
        REF[variant].NameBox.Center.setAttribute("id", "IMAGE_REFERENCE")
        REF[variant].NameBox.Center.src = settings.text_box[variant].NameBox.Center;
        
        REF[variant].NameBox.Right = document.createElement("img");
        REF[variant].NameBox.Right.setAttribute("id", "IMAGE_REFERENCE")
        REF[variant].NameBox.Right.src = settings.text_box[variant].NameBox.Right;

        ImageCache.appendChild(REF[variant].NameBox.Left)
        ImageCache.appendChild(REF[variant].NameBox.Center)
        ImageCache.appendChild(REF[variant].NameBox.Right)
    }

}

function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const context = getContext();
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function getContext() {
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  return context;
}

function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop)
}

function getCanvasFont(el = document.body) {
  const fontWeight = window.getComputedStyle(el, null).getPropertyValue('font-weight') || 'normal'
  const fontSize   = window.getComputedStyle(el, null).getPropertyValue('font-size')   || '16px'
  const fontFamily = window.getComputedStyle(el, null).getPropertyValue('font-family') || 'Times New Roman'
  
  return '${fontWeight} ${fontSize} ${fontFamily}'
}

function PreAppenedChildUserName(variant, REF, UserName, local_badges)
{
    console.log("TEST")

    var _width = getTextWidth(UserName, getCanvasFont(UserName))
    if (typeof _width == "undefined")
        _width = 0
    var offset_width = 0
    if (settings.text_box[variant].badge_offset.relative_to_username_new)
        for (i =0 ; i < local_badges.children.length; i++)
        {
            offset_width += 18 + 4
        }

    var username = UserName.innerHTML
    var classes = UserName.getAttribute("class")

    UserName.style.width = _width + "px"

    UserName.setAttribute("class", "username_namebox")
    
    UserName.innerHTML = ""

        
    var _UserNameN = document.createElement("span");
    _UserNameN.setAttribute("class", classes);
    _UserNameN.innerHTML = username
    _UserNameN.style.position = "absolute"
    _UserNameN.style.top = "12px"


    var _BACKGROUND = document.createElement("div");
    _BACKGROUND.setAttribute("id", "background");

    var _LEFT = document.createElement("img")
    _LEFT.setAttribute("id", "nb_left")
    _LEFT.src = settings.text_box[variant].NameBox.Left

    var _RIGHT = document.createElement("img")
    _RIGHT.setAttribute("id", "nb_right")
    _RIGHT.src = settings.text_box[variant].NameBox.Right

    var _CENTER = document.createElement("div");
    _CENTER.setAttribute("id", "nb_center");
    _CENTER.style.width = (_width + offset_width + 18 + 18) + "px"
    _CENTER.src = settings.text_box[variant].NameBox.Center
    _CENTER.style.backgroundImage = 'url(' + settings.text_box[variant].NameBox.Center + ')'
    _BACKGROUND.style.left = "-18px"

    _BACKGROUND.appendChild(_LEFT)
    _BACKGROUND.appendChild(_CENTER)
    _BACKGROUND.appendChild(_RIGHT)
    UserName.appendChild(_UserNameN)
    UserName.appendChild(_BACKGROUND)
    var l = "0px"
    var t = "0px"
    
    if (typeof settings.text_box[variant].badge_offset.Left != "undefined")
        l = "calc( " + settings.text_box[variant].badge_offset.Left + (settings.text_box[variant].badge_offset.relative_to_username_new && (typeof settings.text_box[variant].username_offset.Left != "undefined") ? " - " + settings.text_box[variant].username_offset.Left : "") + " )"
    if (typeof settings.text_box[variant].badge_offset.Top != "undefined")
        t = "calc( " + settings.text_box[variant].badge_offset.Top + (settings.text_box[variant].badge_offset.relative_to_username_new && (typeof settings.text_box[variant].username_offset.Top != "undefined") ? " - " + settings.text_box[variant].username_offset.Top : "") + " )"

    console.log('calc( ' + l + " + " + settings.text_box[variant].username_offset.Top + " + " + _width + 'px)')
    console.log('calc( ' + t + " + " + _UserNameN.style.top + " + " + settings.text_box[variant].username_offset.Top + ')')

    
    new Promise(r => setTimeout(r, 0)).then(() => {
        console.log("PROMISE START")
        var username_offset = UserName.parentElement

        var b1 = ' - ' + UserName.style.width
        var b2 = 'calc( ' + offset_width + 'px - 120px + ' + settings.name_box.offset_right + ')'
        
        console.log(b1)
        console.log(b2)
        local_badges.style.right  = b2
        local_badges.style.bottom = settings.name_box.badge_offset_bottom
        console.log("PROMISE END")
        username_offset.style.width  = _CENTER.style.width
        username_offset.style.height = "52px"
        username_offset.style.right  = settings.name_box.offset_right
        username_offset.style.bottom = settings.name_box.offset_bottom

    })
}
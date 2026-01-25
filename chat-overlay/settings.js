const settings = { //bypass stupid inability to load files directly in js or a json file in html
"time_until_vanish" : 300000, //time in ms until message is removed from screen (5 minutes)
"username" : "", //twitch username
"max_chat_on_screen" : 10, //max messages to ever be on screen at a time
"text_box": {
    "Standard" : {
        //"text_color"   : "#000000",
        "fit_content"  : true,
        "has_center"   : true,
        "username_offset" :
        {
            "Left" : "10px",
            "Top"  : "8px",
            // "Right" : "0px",
            // "Bottom"   : "0px"
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
        "Top_Left"     : "./textbox/default/text_box_BR.png",
        "Top_Right"    : "./textbox/default/text_box_BL.png",
        "Bottom_Left"  : "./textbox/default/text_box_TR.png",
        "Bottom_Right" : "./textbox/default/text_box_TL.png",
        "Left"         : "./textbox/default/text_box_SL.png",
        "Right"        : "./textbox/default/text_box_SR.png",
        "Top"          : "./textbox/default/text_box_ST.png",
        "Bottom"       : "./textbox/default/text_box_SB.png",
        "Center"       : "./textbox/default/text_box_C.png"
    },
    "Highlight" : {
        //"text_color"   : "#000000",
        "has_center"   : true,
        "fit_content"  : false,
        "username_offset" : {
            "Left" : "CENTER" //CENTER is an optional word that forces
        },                    //the username to be centered. only works on left
        "badge_offset" : {
            "relative_to_username" : true,
        },
        "extra_space"  : "10px",
        "Top_Left"     : "./textbox/default/text_box_BR.png",
        "Top_Right"    : "./textbox/default/text_box_BL.png",
        "Bottom_Left"  : "./textbox/default/text_box_TR.png",
        "Bottom_Right" : "./textbox/default/text_box_TL.png",
        "Left"         : "./textbox/default/text_box_SL.png",
        "Right"        : "./textbox/default/text_box_SR.png",
        "Top"          : "./textbox/default/text_box_ST.png",
        "Bottom"       : "./textbox/default/text_box_SB.png",
        "Center"       : "./textbox/default/text_box_C.png"
    },
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
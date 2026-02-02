/**
 * @TODO FILTER BANNED WORDS / EMOTES
 * @TODO find way to emotes
 * @TODO user animations
 *//***/
 //#region constants
const twitchName = settings.username;
const messageHoldLength = settings.time_until_vanish;
const PARAMS = new URLSearchParams(document.location.search)
const maxCount = settings.max_chat_on_screen;
let timeoutCounter = 0

//force push defaults so they can't be overridden
settings.badge_defaults = { "broadcaster": { x1:"https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1", x2:"https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2", x4:"https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3", }, "mod": { x1:"https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1", x2:"https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2", x4:"https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3", }, "vip": { x1:"https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1", x2:"https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/2", x4:"https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/3", }, "artist": { x1:"https://static-cdn.jtvnw.net/badges/v1/4300a897-03dc-4e83-8c0e-c332fee7057f/1", x2:"https://static-cdn.jtvnw.net/badges/v1/4300a897-03dc-4e83-8c0e-c332fee7057f/2", x4:"https://static-cdn.jtvnw.net/badges/v1/4300a897-03dc-4e83-8c0e-c332fee7057f/3", } }

//cache of emotes to reuse later
const EMOTES = {}

//cache of textbox sides and corners
const REF = {}

var ChatElement;
var ImageCache;

//#region EVENT.DOMContenTLoaded
//wait until page is loaded so we don't break things when grabbing elements
document.addEventListener("DOMContentLoaded", async function (event) {

    ChatElement = document.querySelector("#chat>ul");
    ImageCache = document.querySelector("div.image_cache");

    //#region // load image cache
    LoadImageCache()
    if (typeof settings.PostImageLoad == "function") settings.PostImageLoad(ImageCache, REF)

    console.log("Chat openned for " + twitchName)
    console.log("Max Messages On Screen " + messageHoldLength)
    //@example //./chat.html?DEBUG=1000&spam_msg=30&spam_speed=500,800,400,1000
    //if we are in debug/visual mode just start spamming the fake chat messages :P
    if (PARAMS.has("DEBUG")) {
        
        console.log("RUNNING DEBUG MODE! Please wait~!")
        await sleep(1000, 0);
        
        console.log("total message count is " + parseInt(PARAMS.get("DEBUG")))

        var spam_msg  = 150
        if(PARAMS.has("spam_msg"))
            spam_msg = parseInt(PARAMS.get("spam_msg"))
        
        var spam_start = spam_msg * (2/3)
        
        console.log("count until spam is " + spam_start + "/" + spam_msg )

        var spam_speed = [100,300,500,1500]
        if(PARAMS.has("spam_speed"))
        {
            var index = 0
            PARAMS.get("spam_speed").split(",").map(function(v) { spam_speed[index] = parseInt(v, 10); index++; return spam_speed });
        }
        console.log("msg speed is " + spam_speed)

        for (i = 0; i < parseInt(PARAMS.get("DEBUG")); i++) {
            //emulate chat spam

            if (i % spam_msg > spam_start)
                await sleep(spam_speed[2], spam_speed[3]);
            else
                await sleep(spam_speed[0], spam_speed[1]);
            user = "fake_user_" + getRandomInt(9) + getRandomInt(9)
            flags = genFakeFlags()
            if ((getRandomInt(100) % 4) == 0)
            {
                flags.randomMessageID = getRandomInt(emote_variant.length - 1)
                message = emote_variant[flags.randomMessageID]
                extra = genFakeExtra(user, flags, true)
            }
            else
            {
                message = lorem_ipsum[getRandomInt(lorem_ipsum.length - 1)]
                extra = genFakeExtra(user, flags)
            }
            Message(user, message, flags, extra)
        }
    }
    else {
        //#region // COMFYJS
        //set onchat to call Message(...)
        ComfyJS.onChat = (user, message, flags, self, extra) => {
            Message(user, message, flags, extra)
        }
        //connect to twitch using username from Settings.js
        ComfyJS.Init(twitchName);
    }
});

//#region func getEmote(...)
function getEmote(id, name) {
    if (typeof EMOTES[name] == "undefined") {
        EMOTES[name] = {
              x1: "https://static-cdn.jtvnw.net/emoticons/v2/" + id + "/default/light/1.0"
            , x2: "https://static-cdn.jtvnw.net/emoticons/v2/" + id + "/default/light/2.0"
            , x4: "https://static-cdn.jtvnw.net/emoticons/v2/" + id + "/default/light/3.0"
            , x8: "https://static-cdn.jtvnw.net/emoticons/v2/" + id + "/default/light/4.0"
            , local : {x1:"./emotes/" + name + "-s",x2:"./emotes/" + name + "-m",x4:"./emotes/" + name + "-l",x8:"./emotes/" + name + "-xl"}
        }
        if (timeoutCounter >= 5)
            EMOTES[name].local = { x1: "https://static-cdn.jtvnw.net/emoticons/v2/" + id + "/default/light/1.0" , x2: "https://static-cdn.jtvnw.net/emoticons/v2/" + id + "/default/light/2.0" , x4: "https://static-cdn.jtvnw.net/emoticons/v2/" + id + "/default/light/3.0" , x8: "https://static-cdn.jtvnw.net/emoticons/v2/" + id + "/default/light/4.0"}
        //else if we are lower then timeout counter
        //                         and (       if "id" or "name" is defined                   )
        else if (timeoutCounter < 5 && (typeof id != "undefined" || typeof name == "undefined"))
        {
            //start new Get Request this should be a post but i am lazy
            var xmlHttp = new XMLHttpRequest();
            
            //make url search params from name and id
            json_data =  new URLSearchParams({emote_name:name, id:id}).toString()
            
            //send post to localhost server "chat-overlay-cacher.py"
            xmlHttp.open( "GET", "http://localhost:8080/get_emote?" + json_data); // false for synchronous request
            
            //give a timeout of 50ms adjust later
            xmlHttp.timeout = 500

            //on status change check the text then parse and close the http
            xmlHttp.onreadystatechange = () =>
            {
                var responseText = xmlHttp.responseText
                if(responseText.length > 0)
                {
                    // console.log(responseText); //send to console for visual response
                    EMOTES[temp_emote.emote_name].local = JSON.parse(responseText) //turn string into JSON object
                    // xmlHttp.close() //close the stream
                }
            }
            //on timeout increment the timeout counter so when we hit it we just stop checking the results
            xmlHttp.ontimeout = () =>{ timeoutCounter++ }

            //send the request
            xmlHttp.send();
        }

        var temp_emote = document.createElement("img")
        
        //set id and name in the element node
        temp_emote.emote_id   = id
        temp_emote.emote_name = name
        
        temp_emote.src = EMOTES[name].local.x4
        temp_emote.srcset = EMOTES[name].local.x1 + " 1x, " + EMOTES[name].local.x2 + " 2x, " + EMOTES[name].local.x4 + " 4x, " + EMOTES[name].local.x8 + " 8x"
        
        EMOTES[name].emote = temp_emote
    }

    return EMOTES[name].emote
}
//#region func Message(...)
function Message(user, message, flags, extra) {
    //update this every message cause eh
    if (REF.needs_update) {
        for (var variant in settings.text_box) {
            REF[variant].BG = {
                "Left": Math.min(REF[variant].SL.offsetWidth, REF[variant].TL.offsetWidth) + 'px',
                "Right": Math.min(REF[variant].SR.offsetWidth, REF[variant].TR.offsetWidth) + "px",
                "Top": Math.min(REF[variant].ST.offsetHeight, REF[variant].TL.offsetHeight, REF[variant].TR.offsetHeight) + 'px',
                "Bottom": Math.min(REF[variant].SB.offsetHeight, REF[variant].BL.offsetHeight, REF[variant].BR.offsetHeight) + "px"
            };
        }
        REF.needs_update = false;
    }
    var variant = (flags.highlighted ? "Highlight" : "Standard")

    //entire message box
    var MessageElement = document.createElement("li");
    MessageElement.style.width = (exists(settings.text_box[variant].fit_content)) ? (settings.text_box[variant].fit_content ? "fit-content" : "100%") : "fit-content"

    //the actual message
    var TextElement = document.createElement("blockquote");

    //force the textbox to be a little bigger
    var SPACER2 = document.createElement("div");
    SPACER2.style.height = settings.text_box[variant].extra_space
    MessageElement.appendChild(SPACER2);

    
    //title is just the fancy name for the box used to align the offsets absolute values
    var TITLE = document.createElement('div')
    TITLE.setAttribute("id", "title");

    //username offset element
    var UserName_OFFSET = document.createElement("div")
    UserName_OFFSET.setAttribute("class", "username_offset")

    //#region // Set Username Offsets 
    /* #region Set Username Offsets */
    StyleSheet.UserName
    if (typeof settings.text_box[variant].username_offset.Left != "undefined") {
        if (settings.text_box[variant].username_offset.Left.match(/CENTER/i)) {
            TITLE.style.display = "flex"
            TITLE.style.justifyContent = "center"
            // display: flex;
            // justify-content: center;
            // align-items: center;
        }
        UserName_OFFSET.style.left = "calc( " + settings.text_box[variant].username_offset.Left + " )"
    }

    if (typeof settings.text_box[variant].username_offset.Top != "undefined")
        UserName_OFFSET.style.top = "calc( " + settings.text_box[variant].username_offset.Top + " )"

    if (typeof settings.text_box[variant].username_offset.Right != "undefined")
        UserName_OFFSET.style.right = "calc( " + settings.text_box[variant].username_offset.Right + " )"

    if (typeof settings.text_box[variant].username_offset.Bottom != "undefined")
        UserName_OFFSET.style.bottom = "calc( " + settings.text_box[variant].username_offset.Bottom + " )"
    /* #endregion */

    //badge offset element
    var Badges_OFFSET = document.createElement("div")
    Badges_OFFSET.setAttribute("class", "badges_offset")

    //#region // Set Badge Offsets 
    /* #region  Set Badge Offsets */
    if (typeof settings.text_box[variant].badge_offset.Left != "undefined")
        Badges_OFFSET.style.left = "calc( " + settings.text_box[variant].badge_offset.Left + (settings.text_box[variant].badge_offset.relative_to_username && (typeof settings.text_box[variant].username_offset.Left != "undefined") ? " - " + settings.text_box[variant].username_offset.Left : "") + " )"
    if (typeof settings.text_box[variant].badge_offset.Top != "undefined")
        Badges_OFFSET.style.top = "calc( " + settings.text_box[variant].badge_offset.Top + (settings.text_box[variant].badge_offset.relative_to_username && (typeof settings.text_box[variant].username_offset.Top != "undefined") ? " - " + settings.text_box[variant].username_offset.Top : "") + " )"

    if (typeof settings.text_box[variant].badge_offset.Right != "undefined" && !settings.text_box[variant].badge_offset.relative_to_username)
        Badges_OFFSET.style.right = "calc( " + settings.text_box[variant].badge_offset.Right + (settings.text_box[variant].badge_offset.relative_to_username && (typeof settings.text_box[variant].username_offset.Right != "undefined") ? " - " + settings.text_box[variant].username_offset.Right : "") + " )"

    if (typeof settings.text_box[variant].badge_offset.Bottom != "undefined" && !settings.text_box[variant].badge_offset.relative_to_username)
        Badges_OFFSET.style.bottom = "calc( " + settings.text_box[variant].badge_offset.Bottom + (settings.text_box[variant].badge_offset.relative_to_username && (typeof settings.text_box[variant].username_offset.Bottom != "undefined") ? " - " + settings.text_box[variant].username_offset.Bottom : "") + " )"
    /* #endregion */


    //username element
    var UserName = document.createElement("span");
    UserName.setAttribute("class", "username");
    UserName.innerHTML = user

    //if extra has userColor set username color to be it
    if(exists(settings.text_box[variant].text_color))
    {
        UserName.style.color = settings.text_box[variant].text_color
    }
    else if (extra.userColor)
    {
        UserName.style.color = extra.userColor
    }
    
    //#region //message emote checks
    if (typeof extra.messageEmotes != "undefined" && extra.messageEmotes != null && Object.keys(extra.messageEmotes).length > 0) {
        var removeableWords = ""
        var emoteList = []
        //Iterate over all the emotes in the message and make a pesudo list of them in a rough order
        for (var [k, v] of Object.entries(extra.messageEmotes)) {

            var out = v[0].toString().split('-')

            var emote = getEmote(k, message.substring(out[0], parseInt(out[1]) + 1))

            removeableWords += "|" + message.substring(out[0], parseInt(out[1]) + 1)
            for (i = 0; i < v.length; i++)
            {
                emoteList.push(emote)
            }
        }

        var temp_list = emoteList
        emoteList = []
        //clone elements so we have a "new" version of the emote instead of reusing the same one and possibly breaking the page
        for (var [k, emote_element] of Object.entries(temp_list))
        {
            //clone element
            var temp_emote = emote_element.cloneNode(true)
            temp_emote.emote_name = emote_element.emote_name
            temp_emote.emote_id = emote_element.emote_id
            //push element to the list
            emoteList[emoteList.length] = temp_emote

            //add the handler incase the source file does not exist
            temp_emote.addEventListener("error", (event) =>
            {
                //replace with online version
                EMOTES[temp_emote.emote_name].local.x1 = EMOTES[temp_emote.emote_name].x1
                EMOTES[temp_emote.emote_name].local.x2 = EMOTES[temp_emote.emote_name].x2
                EMOTES[temp_emote.emote_name].local.x4 = EMOTES[temp_emote.emote_name].x4
                EMOTES[temp_emote.emote_name].local.x8 = EMOTES[temp_emote.emote_name].x8
                EMOTES[temp_emote.emote_name].emote.src = EMOTES[temp_emote.emote_name].x4
                EMOTES[temp_emote.emote_name].emote.srcset = EMOTES[temp_emote.emote_name].x1 + " 1x, " + EMOTES[temp_emote.emote_name].x2 + " 2x, " + EMOTES[temp_emote.emote_name].x4 + " 4x"
                
                //fix local variant
                event.target.src    = EMOTES[temp_emote.emote_name].emote.src
                event.target.srcset = EMOTES[temp_emote.emote_name].emote.srcset
            });
        }

        //remove the first "|" from the string as it is not needed and im to lazy to implement a better catch for this
        removeableWords = removeableWords.substring(1, removeableWords.length)

        //split message at emote strings
        msg = message.split(new RegExp(removeableWords))
        
        //Iterate over msg and insert each text as <span> followed by an emote <img>
        for (i = 0; i < msg.length; i++) {
            var text = document.createElement("span");
            text.innerText = msg[i]
            TextElement.appendChild(text);
            if (typeof emoteList[i] != "undefined")
                TextElement.appendChild(emoteList[i]);
        }
    } else {
        //no emotes? awesome just post the message
        var text = document.createElement("span");
        text.innerText = message
        TextElement.appendChild(text);
    }

    //start the class as a textbox variant to allow the user to do their own css stuff to it!
    var MessageClass = "text_box_" + variant

    //#region // user badges
    /** @TODO CHAT_BOT SKIP MESSAGE ENTIRELY AS SETTING */
    if (!flags.chat_bot) {
        var badge;
        if (flags.broadcaster) {
            badge = makeBadge("broadcaster")
            Badges_OFFSET.appendChild(badge)
            MessageClass += (MessageClass.length > 0 ? " " : "") + "broadcaster"
        }

        if (flags.mod) {
            badge = makeBadge("mod")
            Badges_OFFSET.appendChild(badge)
            MessageClass += (MessageClass.length > 0 ? " " : "") + "mod"
        }

        if (flags.artist) {
            badge = makeBadge("artist")
            Badges_OFFSET.appendChild(badge)
            MessageClass += (MessageClass.length > 0 ? " " : "") + "artsit"
        }

        if (flags.vip) {
            badge = makeBadge("vip")
            Badges_OFFSET.appendChild(badge)
            MessageClass += (MessageClass.length > 0 ? " " : "") + "vip"
        }

        if (flags.subscriber) {
            badge = makeBadge("subscriber", parseInt(extra.userState.badges.subscriber))
            Badges_OFFSET.appendChild(badge)
            MessageClass += (MessageClass.length > 0 ? " " : "") + "subscriber"
        }
    }

    if (flags.highlighted) {
        MessageClass += (MessageClass.length > 0 ? " " : "") + "highlighted"
    }else if (flags.customReward) {
        MessageClass += (MessageClass.length > 0 ? " " : "") + "customReward"
        //use to get custom chatbox maybe
    }else
        MessageClass += (MessageClass.length > 0 ? " " : "") + "no_special"

    //#region //appened offsets
    //add username to the offset
    if (typeof settings.PreAppenedChildUserName == "function")
        settings.PreAppenedChildUserName(variant, REF, UserName, Badges_OFFSET)
    console.log(Badges_OFFSET.style.left)
    console.log(Badges_OFFSET.style.top)
    UserName_OFFSET.appendChild(UserName);

    //add username to the title element
    TITLE.appendChild(UserName_OFFSET);

    //if badge should be relative to username set it as its parent
    if (settings.text_box[variant].badge_offset.relative_to_username)
        UserName_OFFSET.appendChild(Badges_OFFSET);
    //else add badge to the title element
    else
        TITLE.appendChild(Badges_OFFSET);
    
    //add all the classes assigned above to the MessageElement
    MessageElement.setAttribute("class", MessageClass);
    MessageElement.appendChild(TextElement);
    //#region // messagebox background
    //make the textbox pretty <3
    makeTextBox(MessageElement, variant)
    MessageElement.appendChild(TITLE)
    //keep a quickly accessible reference to thet title object inside the element node class
    MessageElement.TITLE_REF = TITLE

    //set animation to play after its made start
    MessageElement.setAttribute("id", "fade_in");

    MessageElement.onanimationend = (event) => {
        //remove animation flag when animation is done
        event.target.setAttribute("id", "");
        //add post load animations
        event.target.setAttribute("class", event.target.getAttribute("class") + " post_load_animation");
    }

    //#region // element post load
    new Promise(r => setTimeout(r, 0)).then(() => {

        //set to top
        MessageElement.BACKGROUND_REF.style.marginTop = "-" + MessageElement.offsetHeight + "px"

        //set height and witdth
        MessageElement.BACKGROUND_REF.style.width = MessageElement.offsetWidth
        MessageElement.BACKGROUND_REF.style.height = MessageElement.offsetHeight

        //do same thing to name and badge offset helper
        MessageElement.TITLE_REF.style.marginTop = "-" + MessageElement.offsetHeight + "px"
        MessageElement.TITLE_REF.style.width = MessageElement.offsetWidth
        MessageElement.TITLE_REF.style.height = MessageElement.offsetHeight

        //get the offsets from the MessageElement because the original var might be null at this point
        local_UserName_OFFSET = MessageElement.querySelector(".username_offset")
        local_Badges_OFFSET = MessageElement.querySelector(".badges_offset")

        //badge offset fixes
        if (settings.text_box[variant].badge_offset.relative_to_username) {
            local_Badges_OFFSET.style.left = "calc( " + local_UserName_OFFSET.offsetWidth + "px" + (local_Badges_OFFSET.offsetLeft > 0 ? " + " + local_Badges_OFFSET.offsetLeft : "") + " )"
            local_Badges_OFFSET.style.top = "calc( " + (exists(settings.text_box[variant].badge_offset.Top) ? settings.text_box[variant].badge_offset.Top + " + " : "") + (local_UserName_OFFSET.offsetHeight - local_Badges_OFFSET.offsetTop) + "px + 4px)"
        }
    })
    

    //after settings.time_until_vanish has passed remove the message from the screen
    new Promise(r => setTimeout(r, settings.time_until_vanish /** 5000 */)).then(() => {
        MessageElement.setAttribute("id", "fade_out");
         /* remove chat message */  
        MessageElement.onanimationend = (event) => { event.target.remove(); }
    })

    ChatElement.appendChild(MessageElement)


    //move the fixer to bottom of the list so animations don't break
    // BOTTOM_ELEMENT = 
    ChatElement.append(ChatElement.querySelector("#KEEP_AT_BOTTOM"))

    //#region // message remove handle
    //   if length is greater than maxCount then we set the last message to be removed
    //     (exclude anim fixer from length)
    if ((ChatElement.children.length - 1) == maxCount) {
        ChatElement.children[0].setAttribute("class", ChatElement.children[0].getAttribute("class").replace("post_load_animation",""));
        ChatElement.children[0].setAttribute("id", "fade_out");
        ChatElement.children[0].onanimationend = (event) => { event.target.remove(); }
    }
    else
        //Iterate over all objects in ChatElements children
        for (var [v, child] of Object.entries(ChatElement.children)) {
            if (window.getComputedStyle(document.querySelector("#chat")).flexDirection == "column-reverse")
            {
                //force delete if spam causes overflow
                if (child.getBoundingClientRect().top - document.body.getBoundingClientRect().top <= 0) {
                    child.remove()
                }
                //if its close to the top tell it to start its animation
                else if (child.getBoundingClientRect().top - document.body.getBoundingClientRect().top <= child.getBoundingClientRect().height) {
                    child.setAttribute("class", child.getAttribute("class").replace("post_load_animation",""));
                    child.setAttribute("id", "fade_out");
                    child.onanimationend = (event) => { event.target.remove(); }
                }
            }
            else
            {
                //flip direction if flex-direction is column
                if (document.body.getBoundingClientRect().bottom - child.getBoundingClientRect().top <= 0) {
                    ChatElement.children[0].remove()
                }
                else if (document.body.getBoundingClientRect().bottom - child.getBoundingClientRect().top <= child.getBoundingClientRect().height) {
                    ChatElement.children[0].setAttribute("class", ChatElement.children[0].getAttribute("class").replace("post_load_animation",""));
                    ChatElement.children[0].setAttribute("id", "fade_out");
                    ChatElement.children[0].onanimationend = (event) => { event.target.remove(); }
                }
            }
        }
}


//#region func makeBadge(...)
/**
 * @param {string} type 
 * @param {Number} [age=-1] if set and type is subscriber this becomes the months value of the badge
 */
function makeBadge(type, age = -1) {
    var badge
    if (type == "subscriber" && age > 0) {
        badge = document.createElement("img")
        badge.setAttribute("class", "chat-badge subscriber-" + age)
        if(Object.entries(settings.sub_badges).length > 0)
            badge.src = settings.sub_badges[age]
        else
            badge.style.visibility = "hidden"
    }
    else {
        if (settings.badge_replace[type] != null)
            current_badge = settings.badge_replace[type]
        else
            current_badge = settings.badge_defaults[type]
        badge = document.createElement("img")
        badge.setAttribute("class", "chat-badge " + type)
        badge.src = current_badge.x1
        badge.srcset = current_badge.x1 + " 1x, " + current_badge.x2 + " 2x, " + current_badge.x4 + " 4x"
    }
    badge.type = type
    badge.age  = age
    return badge
}
//#region func makeTextBox(...)
/**
 * @description Make a textbox from individual pictures {@link https://ezgif.com/sprite-cutter|Sprite Sheet Cutter}
 * @param {Node} MessageElement 
 */
function makeTextBox(MessageElement, variant) {
    //make textbox background
    var BACKGROUND = document.createElement("div");
    BACKGROUND.setAttribute("id", "background");

    MessageElement.BACKGROUND_REF = BACKGROUND
    
    //#region // BACKGROUND MODULAR PARTS 
    /* #region BACKGROUND MODULAR PARTS */
    var BG_TR = document.createElement("img")
    BG_TR.setAttribute("id", "bg_corner_tr")
    BG_TR.src = exists(settings.text_box[variant].Top_Right) ? settings.text_box[variant].Top_Right : "./textbox/default/text_box_TR.png"

    var BG_TL = document.createElement("img")
    BG_TL.setAttribute("id", "bg_corner_tl")
    BG_TL.src = exists(settings.text_box[variant].Top_Left) ? settings.text_box[variant].Top_Left : "./textbox/default/text_box_TL.png"

    var BG_BR = document.createElement("img")
    BG_BR.setAttribute("id", "bg_corner_br")
    BG_BR.src = exists(settings.text_box[variant].Bottom_Right) ? settings.text_box[variant].Bottom_Right : "./textbox/default/text_box_BR.png"

    var BG_BL = document.createElement("img")
    BG_BL.setAttribute("id", "bg_corner_bl")
    BG_BL.src = exists(settings.text_box[variant].Bottom_Left) ? settings.text_box[variant].Bottom_Left : "./textbox/default/text_box_BL.png"

    var BG_LEFT = document.createElement("div");
    BG_LEFT.setAttribute("id", "bg_left");
    BG_LEFT.style.top = REF[variant].TL.offsetHeight + 'px'
    BG_LEFT.style.width = REF[variant].SL.offsetWidth + 'px'
    BG_LEFT.style.height = "calc(100% - " + (REF[variant].TL.offsetHeight + REF[variant].BL.offsetHeight) + "px)"
    BG_LEFT.style.backgroundImage = 'url(' + (exists(settings.text_box[variant].Left) ? settings.text_box[variant].Left : '"./textbox/default/text_box_SL.png"') + ')'

    var BG_RIGHT = document.createElement("div");
    BG_RIGHT.setAttribute("id", "bg_right");
    BG_RIGHT.style.top = REF[variant].ST.offsetHeight + 'px'
    BG_RIGHT.style.width = REF[variant].SR.offsetWidth + 'px'
    BG_RIGHT.style.height = "calc(100% - " + (REF[variant].TR.offsetHeight + REF[variant].BR.offsetHeight) + "px)"
    BG_RIGHT.style.backgroundImage = 'url(' + (exists(settings.text_box[variant].Right) ? settings.text_box[variant].Right : '"./textbox/default/text_box_SR.png"') + ')'

    var BG_TOP = document.createElement("div");
    BG_TOP.setAttribute("id", "bg_top");
    BG_TOP.style.width = "calc(100% - " + (REF[variant].TR.offsetWidth + REF[variant].TL.offsetWidth) + "px)"
    BG_TOP.style.height = REF[variant].ST.offsetHeight + 'px'
    BG_TOP.style.left = REF[variant].BR.offsetWidth + 'px'
    BG_TOP.style.backgroundImage = 'url(' + (exists(settings.text_box[variant].Top) ? settings.text_box[variant].Top : '"./textbox/default/text_box_ST.png"') + ')'

    var BG_BOT = document.createElement("div");
    BG_BOT.setAttribute("id", "bg_bottom");
    BG_BOT.style.width = "calc(100% - " + (REF[variant].BR.offsetWidth + REF[variant].BL.offsetWidth) + "px)"
    BG_BOT.style.height = REF[variant].SB.offsetHeight + 'px'
    BG_BOT.style.left = REF[variant].BR.offsetWidth + 'px'
    BG_BOT.style.backgroundImage = 'url(' + (exists(settings.text_box[variant].Bottom) ? settings.text_box[variant].Bottom : '"./textbox/default/text_box_SB.png"') + ')'
    /* #endregion */

    if (typeof settings.text_box[variant].has_center == "undefined" || settings.text_box[variant].has_center) {
        //Source Engine Reference lmao
        //this just shows the user that the center piece doesn't actually exist
        //might later change it to just be the whole box in general so the user can see if something broke
        BACKGROUND.style.backgroundColor = "#000000";
        BACKGROUND.style.backgroundImage = "repeating-linear-gradient(45deg, #FE00FE 25%, transparent 25%, transparent 75%, #FE00FE 75%, #FE00FE), repeating-linear-gradient(45deg, #FE00FE 25%, #000000 25%, #000000 75%, #FE00FE 75%, #FE00FE)";
        BACKGROUND.style.backgroundPosition = "0 0, 40px 40px";
        BACKGROUND.style.backgroundSize = "80px 80px";

        var BG_C = document.createElement("div");
        BG_C.setAttribute("id", "bg_center");
        BG_C.style.left = REF[variant].BG.Left
        BG_C.style.top = REF[variant].BG.Top
        BG_C.style.right = REF[variant].BG.Right
        BG_C.style.bottom = REF[variant].BG.Bottom
        BG_C.style.backgroundImage = 'url(' + (exists(settings.text_box[variant].Center) ? settings.text_box[variant].Center : '"./textbox/default/text_box_C.png"') + ')'
        BACKGROUND.appendChild(BG_C);
    }

    BACKGROUND.appendChild(BG_TL);
    BACKGROUND.appendChild(BG_TR);
    BACKGROUND.appendChild(BG_BL);
    BACKGROUND.appendChild(BG_BR);
    BACKGROUND.appendChild(BG_LEFT);
    BACKGROUND.appendChild(BG_RIGHT);
    BACKGROUND.appendChild(BG_TOP);
    BACKGROUND.appendChild(BG_BOT);
    MessageElement.appendChild(BACKGROUND);
}
//#region afunc LoadImageCache()
async function LoadImageCache() {
    //load reference images
    for (var variant in settings.text_box) {
        REF[variant] = {}
        //stored variants
        REF[variant].TR = document.createElement("img");
        REF[variant].TR.setAttribute("id", "IMAGE_REFERENCE")
        REF[variant].TR.src = exists(settings.text_box[variant].Top_Right) ? settings.text_box[variant].Top_Right : "./textbox/default/text_box_TR.png";

        REF[variant].BR = document.createElement("img");
        REF[variant].BR.setAttribute("id", "IMAGE_REFERENCE")
        REF[variant].BR.src = exists(settings.text_box[variant].Bottom_Right) ? settings.text_box[variant].Bottom_Right : "./textbox/default/text_box_BR.png";

        REF[variant].TL = document.createElement("img");
        REF[variant].TL.setAttribute("id", "IMAGE_REFERENCE")
        REF[variant].TL.src = exists(settings.text_box[variant].Top_Left) ? settings.text_box[variant].Top_Left : "./textbox/default/text_box_TL.png";

        REF[variant].BL = document.createElement("img");
        REF[variant].BL.setAttribute("id", "IMAGE_REFERENCE")
        REF[variant].BL.src = exists(settings.text_box[variant].Bottom_Left) ? settings.text_box[variant].Bottom_Left : "./textbox/default/text_box_BL.png";


        REF[variant].ST = document.createElement("img");
        REF[variant].ST.setAttribute("id", "IMAGE_REFERENCE")
        REF[variant].ST.src = exists(settings.text_box[variant].Top) ? settings.text_box[variant].Top : "./textbox/default/text_box_ST.png";

        REF[variant].SB = document.createElement("img");
        REF[variant].SB.setAttribute("id", "IMAGE_REFERENCE")
        REF[variant].SB.src = exists(settings.text_box[variant].Bottom) ? settings.text_box[variant].Bottom : "./textbox/default/text_box_SB.png";

        REF[variant].SL = document.createElement("img");
        REF[variant].SL.setAttribute("id", "IMAGE_REFERENCE")
        REF[variant].SL.src = exists(settings.text_box[variant].Left) ? settings.text_box[variant].Left : "./textbox/default/text_box_SL.png";

        REF[variant].SR = document.createElement("img");
        REF[variant].SR.setAttribute("id", "IMAGE_REFERENCE")
        REF[variant].SR.src = exists(settings.text_box[variant].Right) ? settings.text_box[variant].Right : "./textbox/default/text_box_SR.png";

        REF[variant].C = document.createElement("img");
        REF[variant].C.setAttribute("id", "IMAGE_REFERENCE")
        REF[variant].C.src = exists(settings.text_box[variant].Center) ? settings.text_box[variant].Center : "./textbox/default/text_box_C.png";

        ImageCache.appendChild(REF[variant].TR)
        ImageCache.appendChild(REF[variant].BR)
        ImageCache.appendChild(REF[variant].TL)
        ImageCache.appendChild(REF[variant].BL)
        ImageCache.appendChild(REF[variant].ST)
        ImageCache.appendChild(REF[variant].SB)
        ImageCache.appendChild(REF[variant].SL)
        ImageCache.appendChild(REF[variant].SR)
        ImageCache.appendChild(REF[variant].C)

        REF[variant].BG = {
            //min
            "Left": Math.min(REF[variant].SL.offsetWidth, REF[variant].TL.offsetWidth) + 'px',
            "Right": Math.min(REF[variant].SR.offsetWidth, REF[variant].TR.offsetWidth) + "px",
            "Top": Math.min(REF[variant].ST.offsetHeight, REF[variant].TL.offsetHeight, REF[variant].TR.offsetHeight) + 'px',
            "Bottom": Math.min(REF[variant].SB.offsetHeight, REF[variant].BL.offsetHeight, REF[variant].BR.offsetHeight) + "px"
        }
    }
    REF.needs_update = true;
}
//#region func exists(...)
//quick check if a value is real
function exists(val) {
    /** @TODO add case for string that checks if length is greater then 0 */
    return typeof val != "undefined" && val != null
}
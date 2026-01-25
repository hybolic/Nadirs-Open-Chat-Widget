# *Open Chat Widget*
just a chat widget for twich using a ~~tileset of images~~ *for now this is currently individule files, later this will be just 1 file with tile X/Y and size in [Settings.js](./chat-overlay/settings.js#L25-L34)*

the aim for this project is to allow users to only need art to start up a new chat widget on stream whilst still allowing advanced users to have more expandability with what they can do.

- minimal support for **animations** on recieved, idle and removed
- support for **messages that are highlighted** ie. can show a different style of box or animations
- support for **usernames and badges to be moved freely** from the message content
- **support to force a color for usernames** (will later also include option to limit the palette)
- **ANIMATED EMOTES!** *you have no idea how often this one i've seen be broken on streams*
- support for **replacing badges** with custom ones! (*currently sub badges are required to be defined beforehand in [Settings.js](./chat-overlay/settings.js#L62-L72) due to issues retrieving them from twitch reliably*)

**documentation updates coming later**, for now refer to comments in files to understand them such as in [Settings.js](./chat-overlay/settings.js)

Included is a Python3 script ([HERE](./chat-overlay-cacher.py)) that acts as a webserver to grab emotes to save on the local system. Not a necessity but handy for those who might have problems with constantly loading in emotes in each time they reload or start stream (*also reduces internet traffic*).


## *TODO WIDGET*


 - [x] chat widget styling accessable to all users
 - [ ] limit the color palette of text and usernames
 - [ ] randomise animations times
 - [ ] randomise animation type
 - [ ] off platform emotes
 - [ ] add badges to cache function
 - [ ] fix timeout for grabbing emotes and badges
 - [ ] allow borders to be scaled better
 - [ ] twitch event interaction support
 - [ ] integrate obs status information for page permmisions
 - [ ] 3d support?

## *TODO Image Cacher*
 - [ ] fix undefined string issue, possibly comming from widget
 - [ ] allow request to timeout on both image pulling and from client
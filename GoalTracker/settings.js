//goal min and max values
var goalMin = 0
var goalMax = 200

//the top of the vial/goal tracker
const max = 0.0
//bottom of the vial/goal tracker
const min = 0.8

//set the current value before we load it later
var CURRENT_VALUE = 0



//EXAMPLE OF CURRENT and GoalMax VALUE UPDATE

//https://twitchtokengenerator.com/quick/lIqBGC6vx1
//channel:read:goals
//moderator:read:followers
const AccessToken   = ""
const RefreshToken  = ""
const ClientID      = ""
var UserData        = getBroadcasterData().data[0]
var BroadcasterID   = UserData.id
var BroadcasterName = UserData.display_name

goals = getGoals()
for (i = 0; i < goals.data.length; i++)
{
    if (goals.data[i].type == "follower")
    {
        CURRENT_VALUE = goals.data[i].current_amount
        goalMax = goals.data[i].target_amount
    }
}

function sendUrlRequest(url)
{
    var get_request = new XMLHttpRequest();
    get_request.open( "GET", url, false );
    get_request.setRequestHeader("Authorization", "Bearer " + AccessToken)
    get_request.setRequestHeader("Client-Id", ClientID)
    get_request.send();
    return get_request.responseText
}

function getBroadcasterData()
{
    theURL = "https://api.twitch.tv/helix/users"
    return JSON.parse(sendUrlRequest(theURL));
}

function getGoals()
{
    theURL = "https://api.twitch.tv/helix/goals?broadcaster_id="+BroadcasterID
    return JSON.parse(sendUrlRequest(theURL));
}

function getFollowCount()
{
    theURL = "https://api.twitch.tv/helix/channels/followers?broadcaster_id="+BroadcasterID+"&first=1"
    return JSON.parse(sendUrlRequest(theURL));
}

//the function we loop every 30 seconds
function runUpdate()
{
    new Promise(r => setTimeout(r,30 * 1000)).then( () => {
        CURRENT_VALUE = getFollowCount().total
        runUpdate()
    });
}

//after page load start the update
document.addEventListener("DOMContentLoaded", async function (event) {
    runUpdate()
})
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var myDialogYN,myDialogMCQ,myDialogFIB;
var count=0;
var inputObject = {
	'youtubeVideoId'	:	'vcn2ruTOwFo',
	'timeframes' 		: 	[5,10,20],
	'actions'			:	[	
								{
									'id'		:	'yes/no',
									'question'	:	'YES/NO:hey, can you now find out prime factor of a given number?',
									'yesResult'	:	'continue',
									'noResult'	:	'playback'
								},
								{
									'id'		:'mcq',
									'question'	:	'MCQ:hey, can you now find out prime factor of a given number?',
									'opt1'		:	'my option1',
									'opt2'		:	'my option2',
									'opt3'		:	'my option3',
									'opt4'		:	'my option4',
									'correctAns':	'opt2'
								},
								
								{
									'id'		:	'fib',
									'question'	:	'FIB:hey, can you now find out _________ prime factor of a given number?',
									'correctAns':	"hola",
								}
							]
};

function onYouTubeIframeAPIReady() {
	console.log("On youtube api ready");
    player = new YT.Player('player',{
		events : {
			'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
		}
	});	
}
window.onload = function(){
	myDialogYN = document.getElementById('myModalYN');
	myDialogMCQ = document.getElementById('myModalMCQ');
	myDialogFIB = document.getElementById('myModalFIB');

}

function onPlayerReady(event) {
	console.log("onPlayerReady");
	player.loadVideoById({'videoId': inputObject.youtubeVideoId,
               'startSeconds': 0,
               'endSeconds': inputObject.timeframes[count++]});		
	myDialogYN.style.display = "none";
	var lastTime = 1;
    var interval = 1000;
}
function onPlayerStateChange(event) {
    if(event.data == YT.PlayerState.PLAYING) {
		console.log("PLAYING");
		var checkPlayerTime = function () {//////////////////////////////////////////////////////////////////////// doubt, seek is troublesome, gotta ask.
        if (lastTime != -1) {
            if(player.getPlayerState() == YT.PlayerState.PLAYING) {
                var t = player.getCurrentTime();
                   if (Math.abs(t - lastTime - 1) > 0.5) {
                        console.log("seek");
						for(var c=0;c<inputObject.timeframes.length;c++){
							if(player.getCurrentTime() < inputObject.timeframes[c]){
								var ctime= player.getCurrentTime();
								console.log("less "+player.getCurrentTime()+"setting start to"+player.getCurrentTime());
								player.seekTo(player.getCurrentTime()-1);
								player.loadVideoById({
									'videoId': inputObject.youtubeVideoId,
									'startSeconds': ctime,
									'endSeconds': inputObject.timeframes[c]
								});
								console.log("player loaded ss:"+ctime+" es:"+inputObject.timeframes[c]);
							}
						}
                    }
            }
        }
        lastTime = player.getCurrentTime();
        setTimeout(checkPlayerTime, interval); 
    }
    setTimeout(checkPlayerTime, interval);
	}
	if(event.data == YT.PlayerState.PAUSED){		
		console.log("PAUSED");
		
	}
	if(event.data == YT.PlayerState.ENDED){
		console.log("ENDED at"+player.getCurrentTime());
		myDialogYN.style.display = "none";	
		triggerDialog(count);
	}
}
function triggerDialog(i){
	//choose action
	if(i>0)
	switch(inputObject.actions[i-1].id){
		case 'yes/no' :	var myDialogBody = document.getElementById("pbodyyn");
						myDialogBody.innerHTML = inputObject.actions[i-1].question;
						myDialogYN.style.display = "block";
						break;
		case 'mcq' 	  :	var myDialogBody = document.getElementById("pbodymcq");
						myDialogBody.innerHTML = inputObject.actions[i-1].question;
						for(var c=0;c<inputObject.timeframes.length;c++){
							if(inputObject.actions[c].id == "mcq"){
								document.getElementById("opt1div").innerHTML = inputObject.actions[c].opt1;
								document.getElementById("opt2div").innerHTML = inputObject.actions[c].opt2;
								document.getElementById("opt3div").innerHTML = inputObject.actions[c].opt3;
								document.getElementById("opt4div").innerHTML = inputObject.actions[c].opt4;
							}
						}
						myDialogMCQ.style.display = "block";
						break;
		case 'fib'	  :	var myDialogBody = document.getElementById("pbodyfib");
						myDialogBody.innerHTML = inputObject.actions[i-1].question;
						myDialogFIB.style.display = "block";
						break;
	}
}

function yesResult(){
	myDialogYN.style.display = "none";
	player.seekTo(inputObject.timeframes[count]);
	console.log("Yes player loaded ss:"+inputObject.timeframes[count-1]+" es:"+inputObject.timeframes[count]);	// *** To invalidate the endTime of previous load.
	if(count<inputObject.timeframes.length){	
		player.loadVideoById({'videoId': inputObject.youtubeVideoId,
               'startSeconds': inputObject.timeframes[count-1],
               'endSeconds': inputObject.timeframes[count++]});
		console.log("player loaded ss:"+inputObject.timeframes[count-1]+" es:"+inputObject.timeframes[count]);
	}
	else{
		console.log("done");
	}	
}
function noResult(){
	myDialogYN.style.display = "none";
	player.loadVideoById({'videoId': inputObject.youtubeVideoId,
               'startSeconds': inputObject.timeframes[count-2],
               'endSeconds': inputObject.timeframes[count--]});
	player.pauseVideo();
		console.log("player loaded ss:"+inputObject.timeframes[count-1]+" es:"+inputObject.timeframes[count]);
}
function mcqResult(){
	for(var c=0;c<inputObject.timeframes.length;c++){
		if(inputObject.actions[c].id == 'mcq'){
			//console.log(inputObject.actions[c].correctAns);
			myDialogMCQ.style.display = "none";
			if(document.getElementById(inputObject.actions[c].correctAns+'id').checked){
				console.log("Correct answer!");
				player.seekTo(inputObject.timeframes[count]);
				if(count<inputObject.timeframes.length){	
					player.loadVideoById({'videoId': inputObject.youtubeVideoId,
						   'startSeconds': inputObject.timeframes[count-1],
						   'endSeconds': inputObject.timeframes[count++]});
					console.log("player loaded ss:"+inputObject.timeframes[count-1]+" es:"+inputObject.timeframes[count]);
				}
				else{
					console.log("done");
				}
			}
			else{
				console.log("Wrong answer!");
				player.loadVideoById({'videoId': inputObject.youtubeVideoId,
				'startSeconds': inputObject.timeframes[count-2],
				'endSeconds': inputObject.timeframes[count--]});
				player.pauseVideo();
				console.log("player loaded ss:"+inputObject.timeframes[count-1]+" es:"+inputObject.timeframes[count]);
			}
		}
	}
}
function fibResult(){
	for(var c=0;c<inputObject.timeframes.length;c++){
		if(inputObject.actions[c].id == 'fib'){
			console.log(inputObject.actions[c].correctAns+"==="+document.getElementById("fibip").value);
			myDialogFIB.style.display = "none";
			if(document.getElementById("fibip").value===inputObject.actions[c].correctAns){
				console.log("Correct answer!");
				player.seekTo(inputObject.timeframes[count]);
				if(count<inputObject.timeframes.length){	
					player.loadVideoById({'videoId': inputObject.youtubeVideoId,
						   'startSeconds': inputObject.timeframes[count-1],
						   'endSeconds': inputObject.timeframes[count++]});
					console.log("player loaded ss:"+inputObject.timeframes[count-1]+" es:"+inputObject.timeframes[count]);
				}
				else{
					console.log("done");
				}
			}
			else{
				console.log("Wrong answer!");
				player.loadVideoById({'videoId': inputObject.youtubeVideoId,
				'startSeconds': inputObject.timeframes[count-2],
				'endSeconds': inputObject.timeframes[count--]});
				console.log("player loaded ss:"+inputObject.timeframes[count-1]+" es:"+inputObject.timeframes[count]);
				player.pauseVideo();
			}
		}
	}
}
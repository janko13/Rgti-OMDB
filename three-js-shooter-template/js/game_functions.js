function killMonster(nom){//NOT USED YET! Use to kill monsters!
	if(nom==1){
	scene.remove(monster.root);
	monster_moving=false;
	kill_monster = true;
	document.getElementById('mmm').innerHTML='False';
	}
	if(nom==2){
	scene.remove(monster2.root);
	monster_moving2=false;
	kill_monster2 = true;
	document.getElementById('mmm2').innerHTML='False';
	}
	if(nom==3){
	scene.remove(monster3.root);
	monster_moving3=false;
	kill_monster3 = true;
	//document.getElementById('mmm3').innerHTML='False';
	}
	if(nom==4){
	scene.remove(monster4.root);
	monster_moving4=false;
	kill_monster4 = true;
	//document.getElementById('mmm4').innerHTML='False';
	}
//things to do no matter what monster was killed:
gameAlert('Monster Killed!');
}

//pass any two numbers(+or-) to get a random number in that range:
function randomNo(x,y){
return Math.floor(Math.random() * ((y-x)+1) + x);
}//end randomNo

function activate_jetpack(){
gameAlert("You got the Jetpack!");
var timer_frame = "<iframe src='JetPackTimer.html' style='width:150px;height:30px;border:0;' scrolling='no'></iframe>";
JPdiv.innerHTML=timer_frame;
jetpack_active = true;
setTimeout("deactivate_jetpack()",45000);
}//end activate_jetpack

function deactivate_jetpack(){
JPdiv.innerHTML="<span style='position:relative;top:-8px;left:8px;font-size:small'>OFF</span>";
jetpack_active = false;
}//end deactivate_jetpack



function activate_cannon(){
gameAlert("You got the Cannon Balls!");
var timer_frame2 = "<iframe src='CannonBallTimer.html' style='width:150px;height:30px;border:0;' scrolling='no'></iframe>";
CBdiv.innerHTML=timer_frame2;
cannon_active = true;
setTimeout("deactivate_cannon()",45000);
}//end activate_cannon

function deactivate_cannon(){
CBdiv.innerHTML="<span style='position:relative;top:-8px;left:8px;font-size:small'>OFF</span>";
cannon_active = false;
}//end deactivate_cannon



function gameAlert(a){
gameStatus.innerHTML="<h1>"+a+"</h1>";
setTimeout("removeAlert()",3000);
}//end gameAlert

function removeAlert(){
gameStatus.innerHTML='';
}//end removeAlert

function showSight(){
if(hpressed===false){
	 var sightState = sightVisible.style.display;
	switch(sightState){ 
		case '': 
			sightVisible.style.display='none';
		break;
		case 'none':
			sightVisible.style.display='';
		break;
	}
	if(sightState=='')
	var sightAlert = "Sight Off!";
	else
	var sightAlert = "Sight On!";
	gameAlert(sightAlert);
	//set hpressed to true to keep from repeating
	hpressed=true;
	//then after x milliseconds reset hpressed state to false:
	setTimeout("hpressed=false;",400);
}
}//end showSight


//functions to change bullet velocity:
function velocityUp(){
document.getElementById('velozity').innerHTML=bv++;
}
function velocityDwn(){
document.getElementById('velozity').innerHTML=bv--;
}

function setSight(){
var default_sp = $("#sight_pic").position();
   //alert("Top position: " + default_sp.top + " Left position: " + default_sp.left);
var dpos = default_sp.left;
document.getElementById('sightx').innerHTML=sight_pos++;
var finalpos = dpos+1;
$("#sight_pic").css({left: finalpos});
}//end setSight function

function setSight2(){
var default_sp = $("#sight_pic").position();
   //alert("Top position: " + default_sp.top + " Left position: " + default_sp.left);
var dpos = default_sp.left;
//alert(dpos);
document.getElementById('sightx').innerHTML=sight_pos--;
var finalpos = dpos-1;
$("#sight_pic").css({left: finalpos});
}//end setSight2 function

function showDebug(){
	var cbug = debug.style.display;
		if(cbug=='none') debug.style.display='';
		if(cbug=='') debug.style.display='none';
}//end showDebug
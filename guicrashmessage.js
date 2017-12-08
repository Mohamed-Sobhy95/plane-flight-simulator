
// When the airplane crashes this message gets displayed.

function OnGUI(){

if (moveairplane.gameover==2){
	GUI.Label( Rect( Screen.width/2-128, 32, 256, 320)," Please press Enter or Return to restart airplane. Or F2 to restart the level");
}
}
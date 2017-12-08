

// This script is a little flight simulator. You can take off, fly around, and land. Attach it to your airplane
// The flight behaviour is non realistic. It is variable based. Attention, this can lead to problems with the physics.
//I keep it in your hands to find out how everyhing is connected. I don`t give any support for the script. Have fun :)

//----------------------------------------------  Variabales ---------------------------------------------------------------------------------------------------

//------------------------------------------------------------------- Blobshadow stuff --------------------------------------------------------------------------------
static var airplaneangley: float=0.0;// This goes to the blob shadow. 
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

static var gameover=0;// Turn on and off the airplane code. Game over
var crashforce = 0; //When gameover we need a force to let the airplane crash

// Rotaton and position of our airplane
static var rotationx=0;
static var rotationy:float =0.0;
static var rotationz:float =0.0;
var positionx: float=0.0;
static var positiony: float=0.0;
var positionz: float=0.0;

static var speed:float =0.0;// speed variable is the speed
var uplift:float =0.0;// Uplift to take off
var pseudogravitation:float=-0.3;// downlift for driving through landscape

var rightleftsoft:float=0.0;// Variable for soft curveflight
var rightleftsoftabs:float=0.0; // Positive rightleftsoft Variable 

var divesalto:float =0.0; // blocks the forward salto
var diveblocker:float=0.0; // blocks sideways stagger flight while dive


function Update () {

//-------------------------------------------BlobShadow stuff------------------------------------------------------------------------------------------

		// shadow to the same angle than the airplane
		airplaneangley= transform.eulerAngles.y; 
		
	
	if ((gameover==2) && (Input.GetKey ("enter"))||(gameover==2) &&(Input.GetKey ("return")))	{
	gameover=0;
	GetComponent.<Rigidbody>().useGravity = false;
	transform.position = Vector3(0, 1.67, 0);
	transform.eulerAngles = Vector3(0,0,0);
	}
	if (gameover==1)	{
	GetComponent.<Rigidbody>().AddRelativeForce (0, 0, crashforce);
	gameover=2;
	}
		//Restart the level
	if (Input.GetKey("f2")){
		//We need to manually reset all important static values too. They are global, and keep their values across the levels
		speed=0;
		gameover=0;
		GetComponent.<Rigidbody>().useGravity = false;
		Application.LoadLevel(0);
		} 
	
//------------------------#####     Maincode fliegen || Maincode flying      #####--------------------------------------------------------
	
	// Mit gameover 0 ist der Code aktiv || Code is active when gameover = 0
	if(gameover==0){

		// Turn variables to rotation and position of the object
		rotationx=transform.eulerAngles.x; 
		rotationy=transform.eulerAngles.y; 
		rotationz=transform.eulerAngles.z; 
		positionx=transform.position.x;
		positiony=transform.position.y;
		positionz=transform.position.z;

	//-------------------------  Rotations of the airplane -------------------------------------------------------------------------
	
	// Up Down, limited to a minimum speed
	// Up Down, limited to a minimum speed
		if ((Input.GetAxis("Vertical")<=0)&&((speed>595))) {
			transform.Rotate((Input.GetAxis("Vertical")*Time.deltaTime*80),0,0); 
		}
		// Special case dive above 90 degrees
		if ((Input.GetAxis("Vertical")>0)&&((speed>595))){
			transform.Rotate((0.8-divesalto)*(Input.GetAxis("Vertical")*Time.deltaTime*80),0,0); 
		}
		
// Left Right at the ground	
		if (groundtrigger.triggered==1) transform.Rotate(0,Input.GetAxis("Horizontal")*Time.deltaTime*30,0,Space.World); 
	// Left Right in the air
		if (groundtrigger.triggered==0) transform.Rotate(0,Time.deltaTime*100*rightleftsoft,0,Space.World); 
		
	// Tilt multiplied with minus 1 to go into the right direction	
	// Tilt just in the air
		if ((groundtrigger.triggered==0)) transform.Rotate(0,0,Time.deltaTime*100*(1.0-rightleftsoftabs-diveblocker)*Input.GetAxis("Horizontal")*-1.0); 		

	//------------------------------------------------ Pitch and Tilt calculations ------------------------------------------
		//variable rightleftsoft + rightleftsoftabs
		
		//Soft rotation calculation -----This prevents the airplaine to fly to the left while it is still tilted to the right
		if ((Input.GetAxis ("Horizontal")<=0)&&(rotationz >0)&&(rotationz <90)) rightleftsoft=rotationz*2.2/100*-1;//linksrum || to the left
		if ((Input.GetAxis ("Horizontal")>=0)&&(rotationz >270)) rightleftsoft=(7.92-rotationz*2.2/100);//rechtsrum ||to the right
		
		//rightleftsoft limitieren sodass der Switch nicht zu hart ist wenn man auf dem Kopf fliegt.
		if (rightleftsoft>1) rightleftsoft =1;
		if (rightleftsoft<-1) rightleftsoft =-1;
		
		// Precisionproblem rightleftsoft to zero
		if ((rightleftsoft>-0.01) && (rightleftsoft<0.01)) rightleftsoft=0;
		
		// Retreives positive rightleftsoft variable 
		rightleftsoftabs=Mathf.Abs(rightleftsoft);
		
		// --------------------  Calculations Block salto forward -----------------------------------------------------
		
		// Variable divesalto
		//   dive salto forward blocking
		if (rotationx < 90) divesalto=rotationx/100.0;//Updown
		if (rotationx > 90) divesalto=-0.2;//Updown
		
		//Variable diveblocker
		// blocks sideways stagger flight while dive
		if (rotationx <90) diveblocker=rotationx/200.0;
		else diveblocker=0;

		//----------------------------Alles zurأ¼ckdrehen / everything rotate back ---------------------------------------------------------------------------------
		
		// rotateback when key wrong direction 
		if ((rotationz <180)&&(Input.GetAxis ("Horizontal")>0)) transform.Rotate(0,0,rightleftsoft*Time.deltaTime*80);
		if ((rotationz >180)&&(Input.GetAxis ("Horizontal")<0)) transform.Rotate(0,0,rightleftsoft*Time.deltaTime*80);

		
		//Rotate back in z axis general, limited by no horizontal button pressed
		if (!Input.GetButton ("Horizontal")){
			if ((rotationz < 135)) transform.Rotate(0,0,rightleftsoftabs*Time.deltaTime*-100);
			if ((rotationz > 225)) transform.Rotate(0,0,rightleftsoftabs*Time.deltaTime*100);
			}
			
		// Rotate back X axis
		if ((!Input.GetButton ("Vertical"))&&(groundtrigger.triggered==0)){
			if ((rotationx >0)&&(rotationx < 180)) transform.Rotate(Time.deltaTime*-50,0,0);
			if ((rotationx >0)&&(rotationx > 180)) transform.Rotate(Time.deltaTime*50,0,0);
			}
			
	//---------------------------- Speed driving and flying ----------------------------------------------------------------
		
		// Speed
		transform.Translate(0,0,speed/20*Time.deltaTime);
		
		//We need a minimum speed limit in the air. We limit again with the groundtrigger.triggered variable
	
		//  Input Accellerate and deccellerate at ground
		if ((groundtrigger.triggered==1)&&(Input.GetButton("Fire1"))&&(speed<800)) speed+=Time.deltaTime*240;
		if ((groundtrigger.triggered==1)&&(Input.GetButton("Fire2"))&&(speed>0)) speed-=Time.deltaTime*240;
		
				//  Input Accellerate and deccellerate in the air
		if ((groundtrigger.triggered==0)&&(Input.GetButton("Fire1"))&&(speed<800)) speed+=Time.deltaTime*240;
		if ((groundtrigger.triggered==0)&&(Input.GetButton("Fire2"))&&(speed>600)) speed-=Time.deltaTime*240;
		
		if (speed<0) speed=0; //floatingpoint calculations makes a fix necessary so that speed cannot be below zero
											
		//Another speed floatingpoint fix:
		if ((groundtrigger.triggered==0)&&(!Input.GetButton("Fire1"))&&(!Input.GetButton("Fire2"))&&(speed>695)&&(speed<705)) speed=700;
		
		//-----------------------------------------------------Auftrieb/Uplift  ----------------------------------------------------------------------
		
		//Mit dieser Geschwindigkeit soll es auch neutral in der Hظگhe bleiben. Drأ¼ber soll es steigen, drunter soll es sinken. 
		//When we don`t accellerate or deccellerate we want to go to a neutral speed in the air. With this speed it has to stay at a neutral height. 
		//Above this value the airplane has to climb, with a lower speed it has to  sink. That way we are able to takeoff and land then.
		
		// Neutral speed at 700
		//This code resets the speed to 700 when there is no acceleration or deccelleration. Maximum 800, minimum 600
		if((Input.GetButton("Fire1")==false)&&(Input.GetButton("Fire2")==false)&&(speed>595)&&(speed<700)) speed+=Time.deltaTime*240.0;
		if((Input.GetButton("Fire1")==false)&&(Input.GetButton("Fire2")==false)&&(speed>595)&&(speed>700)) speed-=Time.deltaTime*240.0;
		
		//uplift - Auftrieb
		transform.Translate(0,uplift*Time.deltaTime/10.0,0);
				
		//Uplift kalkulieren. Der Auftrieb || Calculate uplift
		uplift = -700+speed;
		
	//We don`t want downlift. So when the uplift value lower zero we set it to 0
		if ((groundtrigger.triggered==1)&&(uplift < 0)) uplift=0; 
	
	// ------------------------------- Rumfahren / driving around  ------------------------------------------------------------
	
	//Special case landschaft أ¼berfahren. Wir benظگtigen sowas wie Pseudo Gravitation. 
	
	//special case drive across landscape. We need something like pseudo gravitation. 
	//And we align the airplane at the ground.
	//We use sensorobjects for that
	
	// ground driving is up to Speed 600. Five points security
	if (speed <595){
	if ((sensorfront.sensorfront ==0)&&(sensorrear.sensorrear ==1)) transform.Rotate(Time.deltaTime*20,0,0);
	if ((sensorfront.sensorfront ==1)&&(sensorrear.sensorrear ==0)) transform.Rotate(Time.deltaTime*-20,0,0);
	if (sensorfrontup.sensorfrontup ==1) transform.Rotate(Time.deltaTime*-20,0,0);
	if (groundtrigger.triggered==0) transform.Translate(0,pseudogravitation*Time.deltaTime/10.0,0);
	}
	
	
	}
	//-------------------------------------------------- Limiting to playfield --------------------------------------------------------------------------
	
	//Here i wrap the airplane around the playfield so that you cannot fly under the landscape
	if (transform.position.x >= 900.0) transform.position.x = 0;
	else if (transform.position.x <= -900.0) transform.position.x = 900.0;
	else if (transform.position.z >= 900.0) transform.position.z = 0;
	else if (transform.position.z <= -900.0) transform.position.z = 900.0;
	
//| Here i limit the height
	if (positiony > 1000) transform.position.y = 1000;

}

// ----------------------------------------------  Gameover activating ----------------------------------------------------------------
//When our airplane is in the air (groundtrigger.triggered=0), and touches the ground with something different than 
//the wheels (groundtrigger primitive) it will count as crash.
//We need to convert the speed into a force so that we can let our airplane collide

function OnCollisionEnter(collision : Collision) {
	if (groundtrigger.triggered==0) {
	groundtrigger.triggered=1;
	crashforce= speed*10000;
	speed=0;
	gameover=1;
	GetComponent.<Rigidbody>().useGravity = true;
	}
}
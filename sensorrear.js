
//Sensor Rear is part of the driving behaviour to keep the airplane aligned with the ground

static var sensorrear=0;

function OnTriggerEnter  (other : Collider) {
sensorrear=1;
}

function OnTriggerExit  (other : Collider) {
sensorrear=0;
}
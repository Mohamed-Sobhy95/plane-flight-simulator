
// Sensor front up is part of the driving behaviour to keep the airplane aligned with the ground

static var sensorfrontup=0;

function OnTriggerEnter  (other : Collider) {
sensorfrontup=1;
}

function OnTriggerExit  (other : Collider) {
sensorfrontup=0;
}
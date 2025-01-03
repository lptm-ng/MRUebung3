AFRAME.registerComponent('car-controller', {
  schema: {
      speed: {type: 'number', default: 0},
      maxSpeed: {type: 'number', default: 5},
      acceleration: {type: 'number', default: 0.1},
      brakingForce: {type: 'number', default: 0.2},
       deceleration: {type:'number', default: 0.05},
      turnSpeed: {type: 'number', default: 3 },
      stopThreshold: {type: 'number', default: 0.01}
  },

  init: function () {
      this.leftController = document.getElementById('left-controller');
      this.rightController = document.getElementById('right-controller');

  },
   tick: function () {
       if (this.leftController && this.rightController && this.leftController.components['oculus-quest-controls'] && this.rightController.components['oculus-quest-controls']) {
           // get joystick data
           const leftJoystick = this.leftController.components['oculus-quest-controls'].thumbstick;

            // forward and backward movement
          if(leftJoystick.y > 0){
           this.data.speed += this.data.acceleration* leftJoystick.y
            if (this.data.speed > this.data.maxSpeed) {
                  this.data.speed = this.data.maxSpeed;
              }
          }else if(leftJoystick.y < 0){
              this.data.speed += this.data.brakingForce* leftJoystick.y
              if(this.data.speed < 0){
                  this.data.speed = 0
              }
          }else {
              if (this.data.speed > 0){
                  this.data.speed -= this.data.deceleration
                }
                if(this.data.speed < this.data.stopThreshold){
                    this.data.speed = 0
                }

          }

           // turning
           if (this.data.speed !=0) {
              let turnAmount = leftJoystick.x * this.data.turnSpeed;
              this.el.object3D.rotation.y -= turnAmount;
            }

         // movement
           const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.el.object3D.quaternion);
           const movement = direction.multiplyScalar(this.data.speed * 0.02);
           this.el.object3D.position.add(movement)
       }
  }
});
AFRAME.registerComponent('car-controller', {
  schema: {
      speed: {type: 'number', default: 0},
      maxSpeed: {type: 'number', default: 5},
      acceleration: {type: 'number', default: 0.1},
      brakingForce: {type: 'number', default: 0.2},
      turnSpeed: {type: 'number', default: 3},
      stopThreshold: {type: 'number', default: 0.01},
      deceleration: {type: 'number', default: 0.05}
  },

  init: function () {
      this.moving = false;
      this.braking = false;
      this.aButtonPressed = false;
      this.bButtonPressed = false;

      //controller setup
      this.leftController = document.getElementById('left-controller');
      this.rightController = document.getElementById('right-controller');
  },
  tick: function () {

      if (this.leftController && this.rightController && this.leftController.components['oculus-quest-controls'] && this.rightController.components['oculus-quest-controls']) {

          // get joystick data
          const leftJoystick = this.leftController.components['oculus-quest-controls'].thumbstick;

          // 'right-controller' property to trigger the getButton action
          const aButton = this.rightController.components['oculus-quest-controls'].getButton('aButton');
          const bButton = this.rightController.components['oculus-quest-controls'].getButton('bButton');

          // button press states
          if (aButton && !this.aButtonPressed) {
              this.aButtonPressed = true;
              this.moving = true;
              this.braking = false;

          } else if (!aButton && this.aButtonPressed) {
              this.aButtonPressed = false
              this.moving = false;
          }

          if (bButton && !this.bButtonPressed) {
              this.bButtonPressed = true;
              this.braking = true;
              this.moving = false;

          } else if (!bButton && this.bButtonPressed) {
              this.bButtonPressed = false;
              this.braking = false;
          }

          // acceleration/braking
          if (this.bButtonPressed) {
              this.data.speed -= this.data.brakingForce
              if (this.data.speed < 0) {
                  this.data.speed = 0
              }

          } else if (this.aButtonPressed) {
              this.data.speed += this.data.acceleration;

              if (this.data.speed > this.data.maxSpeed) {
                  this.data.speed = this.data.maxSpeed;
              }
          } else {
              if (this.data.speed > 0 && !this.moving) {
                  this.data.speed -= this.data.deceleration
              }
              if (this.data.speed < this.data.stopThreshold) {
                  this.data.speed = 0
              }
          }

          // turning
          if (leftJoystick && this.data.speed > 0) {
              let turnAmount = leftJoystick.x * this.data.turnSpeed
              this.el.object3D.rotation.y -= turnAmount;
          }

          // movement
          const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.el.object3D.quaternion);
          const movement = direction.multiplyScalar(this.data.speed * 0.02);
          this.el.object3D.position.add(movement)
      }

  }
});
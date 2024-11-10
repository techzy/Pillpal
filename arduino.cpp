#include <Servo.h>

Servo servo1;
Servo servo2;

const int BUTTON_PIN = 16;  // Replace with your button's GPIO pin
const int BUZZER_PIN = 4;   // Replace with your buzzer's GPIO pin

unsigned long startTime;
bool alertSent = false;  // Flag to track if alert has been sent

void setup() {
  Serial.begin(9600);

  // If serial is smt then run servo 

  servo1.attach(0);  // Attach Servo 1 to pin 0
  servo2.attach(1);  // Attach Servo 2 to pin 1

  pinMode(BUTTON_PIN, INPUT_PULLUP); // Button input with pull-up resistor
  pinMode(BUZZER_PIN, OUTPUT);



  // servo1Action();
  // servo2Action();


}
void loop() {
  if (Serial.available() > 0) {
    int incomingByte = Serial.read();  // Read the byte only once

    // Print the received byte for debugging
    Serial.print("Received: ");
    Serial.println(incomingByte);

    // Check if the received byte matches 'X' (ASCII 88)
    if (incomingByte == 'X') {
        Serial.println("Opening servo");
        servo2Action();
        turnOnBuzzer();
      // Add your servo control code here
    }
    if (incomingByte == 'Y') {
      Serial.println("Opening other servo servo");
      // Add your servo control code here
        servo1Action();
        turnOnBuzzer();
    }
  }
  
  delay(1000);
  // Serial.read()
  startTime = millis();
  // Wait for the button press or timeout (5 minutes)
  while (millis() - startTime <= 5000) { // 5 minutes in milliseconds
    if (digitalRead(BUTTON_PIN) == LOW) { // Button pressed (active low)
      Serial.println("Medicine Taken");
      delay(500); // Debounce delay to avoid multiple detections
      turnOffBuzzer();  // Turn off buzzer after button press
      return;
    }
  }
    if (!alertSent) {
    Serial.println("A");
    turnOffBuzzer();  // Turn off buzzer after alert
    alertSent = true;  // Prevent further alerts
}
}

void setServoAngle(Servo &servo, int angle) {
  servo.write(angle); // Set servo to specified angle
}

void servo1Action() {
  Serial.println("buzzeron");
  setServoAngle(servo1, 60);  // Move to 90 degrees to "open"
  delay(1000);
  // setServoAngle(servo1, 90);
  delay(1000);
  servo1.detach();

}

void servo2Action() {
  setServoAngle(servo2, 270);
  delay(1000);
  setServoAngle(servo2, 90); 
  delay(1000);
  servo2.detach();
}

void turnOnBuzzer() {
  digitalWrite(BUZZER_PIN, HIGH);  // Turn on buzzer
  Serial.println("Buzzer is ON");
}

void turnOffBuzzer() {
  digitalWrite(BUZZER_PIN, LOW);  // Turn off buzzer
}

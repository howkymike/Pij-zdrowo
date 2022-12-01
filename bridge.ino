#include <Bridge.h>
#include <GravityTDS.h>
GravityTDS gravityTds;

void setup() {
  Serial.begin(9600);
  pinMode(13,OUTPUT);
  digitalWrite(13, LOW);
  Bridge.begin();
  digitalWrite(13, HIGH);
  gravityTds.setPin(0);
  gravityTds.setAref(5.0);  //reference voltage on ADC, default 5.0V on Arduino UNO
  gravityTds.setAdcRange(1024);  //1024 for 10bit ADC;4096 for 12bit ADC
  gravityTds.begin();  //initialization
}

void loop() {
  gravityTds.setTemperature(25.0);  // set the temperature and execute temperature compensation
  gravityTds.update();
  float tds = gravityTds.getTdsValue();
  float pH = analogRead(1)*5.0*3.5/1024;
  Bridge.put("TDS",String(tds));
  Bridge.put("pH",String(pH));
  delay(50);
}

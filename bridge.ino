#include <Bridge.h>
#include <GravityTDS.h>
GravityTDS gravityTds;

void setup() {
  Serial.begin(9600); // Włączenie komunikacji szeregowej niezbędne dla działania Bridge
  pinMode(13,OUTPUT);
  digitalWrite(13, LOW);
  Bridge.begin(); // Uruchomienie Bridge pozwalającego na przekazywanie zmiennych między kontrolerem a procesroem
  digitalWrite(13, HIGH);
  gravityTds.setPin(0); // Pin do którego jest podpięta płytka od czujnika TDS
  gravityTds.setAref(5.0);  // maksymalne napięcie odczytu ADC
  gravityTds.setAdcRange(1024);  // rozdzielczość ADC
  gravityTds.begin();  // inicjalizacja
}

void loop() {
  gravityTds.setTemperature(25.0);  // kompensacja dla temperatury pokojowej
  gravityTds.update(); // Odczyt napięcia z TDS
  float tds = gravityTds.getTdsValue(); // Przetworzenie odczytu na wartość PPM
  float pH = analogRead(1)*5.0*3.5/1024; // Odczyt napięcia z pinu płytki pH i konwersja na wartość pH
  Bridge.put("TDS",String(tds)); // Przekazanie wartości do mikroprocesora
  Bridge.put("pH",String(pH));
  delay(50);
}

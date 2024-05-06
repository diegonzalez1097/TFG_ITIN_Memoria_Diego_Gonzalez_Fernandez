#include <DHT.h>
#include <DHT_U.h>

#include <OneWire.h>

#include <DallasTemperature.h>

DHT dht(5,DHT11);
const int oneWireBus = 4;

float temp, hume;
float calibration_factor = -10.31; // cambiar la resitencia

OneWire oneWire(oneWireBus);

DallasTemperature sensors (&oneWire);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  dht.begin();
  sensors.begin();
}

void loop() {
  // put your main code here, to run repeatedly:
  hume = dht.readHumidity();
  temp = dht.readTemperature();

  Serial.println("Temperatura: "+String(temp)+"°C" +" Humedad " + String(hume));

  sensors.requestTemperatures();
  float temperatureC = sensors.getTempCByIndex(0);

  Serial.print("Temperatura sensor : ");

  float raw_temperatureC = sensors.getTempCByIndex(0);
  float calibrated_temperatureC = raw_temperatureC + calibration_factor;
  Serial.print(calibrated_temperatureC);

  Serial.println("°C");

  delay(5000);
}

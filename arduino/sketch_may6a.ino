// Incluye las bibliotecas necesarias para el funcionamiento del programa

// DHT.h: Biblioteca para interactuar con los sensores de temperatura y humedad DHT.
#include <DHT.h>
// DHT_U.h: Biblioteca que proporciona una interfaz unificada para diferentes modelos de sensores DHT.
#include <DHT_U.h>
// OneWire.h: Biblioteca para comunicarse con dispositivos que utilizan el protocolo OneWire.
#include <OneWire.h>
// DallasTemperature.h: Biblioteca para interactuar con los sensores de temperatura de la familia Dallas.
#include <DallasTemperature.h>
// ESP8266WiFi.h: Biblioteca para manejar la conectividad WiFi en los microcontroladores ESP8266.
#include <ESP8266WiFi.h>
// ESP8266HTTPClient.h: Biblioteca para hacer solicitudes HTTP con un microcontrolador ESP8266.
#include <ESP8266HTTPClient.h>

DHT dht(5,DHT11);

// Define el pin para el bus OneWire
const int oneWireBus = 4;

// Variables para almacenar las lecturas de temperatura y humedad
float temp, hume, temp2, hume2;

// Define el pin del sensor de humedad del suelo
const int sensorPin = A0;

// Inicializa el bus OneWire
OneWire oneWire(oneWireBus);
DallasTemperature sensors (&oneWire);

// Define los valores de medición para seco y agua
const int medicionSeco = 552;
const int medicionAgua = 216;

// Variables para almacenar el nivel de humedad del suelo
int MoistureLevel = 0;
int SoilMoisturePercentage = 0;

// Definir los pines de los LEDs
const int rojo = 12;
const int azul = 13;
const int verde = 15;

// Define las credenciales de la red WiFi
const char* ssid = "6F0C";
const char* password = "36tyy7m5acxhu5";

// Declara la variable cliente para la conexión WiFi
WiFiClient client;

// Función de configuración que se ejecuta una vez al inicio
void setup() {
  // Inicia la comunicación serial a 9600 baudios
  Serial.begin(9600);
  // Inicia los sensores DHT
  dht.begin();
  // Inicia el sensor de temperatura Dallas
  sensors.begin();


  // Configurar los pines de los LEDs como salidas
  pinMode(rojo, OUTPUT);
  pinMode(azul, OUTPUT);
  pinMode(verde, OUTPUT);

  // Estable el estado inicial de los leds
  digitalWrite(rojo, HIGH);
  digitalWrite(azul, LOW);
  digitalWrite(verde, LOW);
}

// Función principal que se ejecuta continuamente
void loop() {
  // Verifica si el dispositivo está conectado a WiFi
  if (WiFi.status() != WL_CONNECTED) {
    // Si no está conectado, enciende el LED rojo y apaga el azul
    digitalWrite(rojo, HIGH);
    digitalWrite(azul, LOW);
    Serial.println("Connecting to WiFi...");
    // Intenta conectarse a la red WiFi
    WiFi.begin(ssid, password);
  } else {
    // Si está conectado, apaga el LED rojo y enciende el azul
    digitalWrite(rojo, LOW);
    digitalWrite(azul, HIGH);
    // Crea un objeto HTTPClient para hacer una solicitud HTTP
    HTTPClient http; 
    // Inicia una conexión al servidor 
    http.begin(client, "http://192.168.1.137:3000/");
    // Realiza una solicitud GET y guarda el código de estado HTTP
    int httpCode = http.GET();
    // Cierra la conexión al servidor
    http.end();
    // Verifica si la solicitud fue exitosa
    if (httpCode == 200) {
      // Si fue exitosa, apaga el LED azul y enciende el verde
      digitalWrite(azul, LOW);
      digitalWrite(verde, HIGH);
      Serial.println("Connected to server");
    } else {
      // Si no fue exitosa, enciende el LED azul y apaga el verde
      digitalWrite(azul, HIGH);
      digitalWrite(verde, LOW);
      Serial.println("Failed to connect to server");
    }
  }

  // Lee la humedad y la temperatura del primer sensor DHT
  hume = dht.readHumidity();
  temp = dht.readTemperature();

  Serial.println("Medición sensor aire");
  Serial.println("Temperatura: "+String(temp)+"°C" +" Humedad " + String(hume)+"%");

  // Solicita las temperaturas al sensor Dallas
  sensors.requestTemperatures();
  // Lee la temperatura del sensor Dallas
  float temperatureC = sensors.getTempCByIndex(0);

  Serial.print("Medición sensores tierra: ");

  // Lee la temperatura del sensor Dallas
  float raw_temperatureC = sensors.getTempCByIndex(0);
  // Lee la humedad del suelo del sensor analógico
  MoistureLevel = analogRead(sensorPin);  

  // Mapea el nivel de humedad del suelo a un porcentaje
  SoilMoisturePercentage = map(MoistureLevel, medicionSeco, medicionAgua, 0, 100);
  // Verifica si el porcentaje de humedad del suelo es 100, 0 o algo intermedio
  if (SoilMoisturePercentage >= 100){
    Serial.println("\nTemperatura: " +String(raw_temperatureC)+ "°C Humedad: Maximum - 100 %");
  }
  else if (SoilMoisturePercentage <= 0)
  {
    Serial.println("\nTemperatura: " +String(raw_temperatureC)+ "°C Humedad: Minimum - 0 %");
  }
  else if (SoilMoisturePercentage > 0 && SoilMoisturePercentage < 100)
  {
    Serial.print("\nTemperatura: " +String(raw_temperatureC)+ "°C Humedad: " +String(SoilMoisturePercentage));
    Serial.println("%");
  }

  // Espera (x*1000) segundos antes de la próxima iteración
  delay(5000);
}

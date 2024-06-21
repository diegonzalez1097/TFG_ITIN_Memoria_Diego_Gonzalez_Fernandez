#include <DHT.h>
#include <DHT_U.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <WiFiUdp.h>


//Define los pines para los sensores
DHT dht(5,DHT11);// Sensor aire
const int oneWireBus = 4;// Sensor temperatura
const int sensorPin = A0;// Sensor tierra


float Temperatura, HumedadAire;



// Inicializa el bus OneWire
OneWire oneWire(oneWireBus);
DallasTemperature sensors (&oneWire);

// Define los valores de medición para seco y agua
const int medicionSeco = 552;
const int medicionAgua = 216;

// Variables para almacenar el nivel de humedad del suelo
int MoistureLevel = 0;
int HumedadTierra = 0;

// Definir los pines de los LEDs
const int rojo = 12;
const int azul = 13;
const int verde = 15;
const int riego = 16;


// Define las credenciales de la red WiFi
const char* ssid = "6F0C";
const char* password = "36tyy7m5acxhu5";

// Declara la variable cliente para la conexión WiFi
WiFiClient client;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "europe.pool.ntp.org", 7200, 3600);

String token;
HTTPClient http;

// Define la dirección base del servidor
const char* servidor = "http://192.168.1.135:3000";

int idDispositivo = -1;  // Inicializa con un valor por defecto

String obtenerDatosSensor(int idArduino, const String &token) {
  // Construye el URL con el ID del Arduino
  String url = String(servidor) + "/arduino-devices/" + idArduino + "/sensors";

  // Inicia la conexión con el servidor
  http.begin(client, url.c_str());

  // Agrega el token al encabezado Authorization
  http.addHeader("Authorization", "Bearer " + token);

  // Realiza la solicitud GET
  int httpCode = http.GET();

  // Verifica si la solicitud fue exitosa
  if (httpCode > 0) {
    // Obtiene la respuesta del servidor
    String payload = http.getString();
    //Serial.println(payload); // Imprime la respuesta original

    // Parsea la respuesta JSON
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);

    // Crea un nuevo JSONDocument para los pares IdSensor y TipoSensor
    DynamicJsonDocument filteredDoc(1024);
    JsonArray filteredSensors = filteredDoc.to<JsonArray>();

    // Extrae solo los pares IdSensor y TipoSensor
    for (JsonObject elem : doc.as<JsonArray>()) {
      JsonObject sensor = filteredSensors.createNestedObject();
      sensor["idSensor"] = elem["idSensor"];
      sensor["tipoSensor"] = elem["tipoSensor"];
    }

    // Serializa el JSON filtrado a String
    String filteredPayload;
    serializeJson(filteredSensors, filteredPayload);
    //Serial.println(filteredPayload); // Imprime el JSON filtrado

    http.end(); // Cierra la conexión
    return filteredPayload; // Devuelve el JSON filtrado
  } else {
    Serial.print("Error en la solicitud HTTP: ");
    Serial.println(httpCode);
    http.end(); // Cierra la conexión
    return ""; 
  }
}

bool sendSensorData(HTTPClient &http, WiFiClient &client, const String &token, DynamicJsonDocument &sensorData) {
  // Especifica el URL del endpoint
  http.begin(client, (String(servidor) + "/sensor/readings").c_str());

  // Configura el encabezado de la solicitud para indicar que el cuerpo de la solicitud será un objeto JSON
  http.addHeader("Content-Type", "application/json");

  // Agrega el token al encabezado Authorization
  http.addHeader("Authorization", "Bearer " + token);

  // Serializa el DynamicJsonDocument a una cadena para el cuerpo de la solicitud
  String requestBody;
  serializeJson(sensorData, requestBody);

  int httpCode = http.POST(requestBody);

  bool necesitaRegar = false; // Variable para almacenar el estado de riego

  if (httpCode > 0) {
    String response = http.getString();
    //Serial.println(response);

    // Deserializa la respuesta JSON
    DynamicJsonDocument respDoc(1024);
    deserializeJson(respDoc, response);

    // Extrae el valor de resultadoRiego
    necesitaRegar = respDoc["readings"]["resultadoRiego"].as<bool>();

    // Imprime el estado de riego
    Serial.print("Necesita regar: ");
    Serial.println(necesitaRegar ? "Si" : "No");
    
  } else {
    Serial.println("Error en la solicitud: " + http.errorToString(httpCode));
  }

  http.end();

  // Retorna el estado de riego
  return necesitaRegar;
}

std::pair<String, int> registerDevice(WiFiClient& client, const char* servidor, const char* fechaHora) {
  HTTPClient http;
  Serial.print("....................");
  Serial.print(fechaHora);
  // Inicia una conexión al servidor
  http.begin(client, (String(servidor) + "/arduino/register").c_str());

  // Crea un objeto JSON con los datos del dispositivo
  StaticJsonDocument<200> doc;
  
  doc["name"] = "ADR1";
  doc["location"] = "Aviles";
  doc["lastIP"] = WiFi.localIP().toString();
  doc["lastCommunicationDate"] = fechaHora;
  JsonObject gpsCoordinates = doc.createNestedObject("gpsCoordinates");
  gpsCoordinates["x"] = 43.550299; // reemplaza con la coordenada x de tu dispositivo
  gpsCoordinates["y"] = -5.922112; // reemplaza con la coordenada y de tu dispositivo
  doc["mac"] = WiFi.macAddress();

  // Convierte el objeto JSON a una cadena
  String deviceData;
  serializeJson(doc, deviceData);
  

  // Configura los encabezados de la solicitud
  http.addHeader("Content-Type", "application/json");

  // Realiza una solicitud POST al endpoint
  int httpCode = http.POST(deviceData);

  // Obtiene la respuesta del servidor
  String payload = http.getString();

  // Imprime la respuesta del servidor
  Serial.println(payload);

  // Parsea la respuesta JSON
  DynamicJsonDocument respToken(1024);
  deserializeJson(respToken, payload);

  // Extrae el token de la respuesta
  String token;
  if (respToken.containsKey("token")) {
    token = respToken["token"].as<String>();
  }

  // Extrae el idDispositivo de la respuesta
  int idDispositivo = -1;
  if (respToken["arduino"].size() > 0 && respToken["arduino"][0].containsKey("idDispositivo")) {
    idDispositivo = respToken["arduino"][0]["idDispositivo"].as<int>();
  }

  // Cierra la conexión al servidor
  http.end();

  // Devuelve el token y el idDispositivo
  return std::make_pair(token, idDispositivo);
}

unsigned long lastTime = 0;  // Almacena la última vez que se ejecutó el código
unsigned long interval = 3600000;  // Intervalo de tiempo 


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
  pinMode(riego, OUTPUT);

  // Estable el estado inicial de los leds
  digitalWrite(rojo, HIGH);
  digitalWrite(azul, LOW);
  digitalWrite(verde, LOW);
  digitalWrite(riego, LOW);


  timeClient.begin();
  timeClient.update();
}

// Función principal que se ejecuta continuamente
void loop() {
  
  int httpCode;
  // Verifica si el dispositivo está conectado a WiFi
  if(WiFi.status() != WL_CONNECTED) {
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
    // HTTPClient http; 
      // Inicia una conexión al servidor 
      http.begin(client, servidor);
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

  timeClient.update();
  time_t rawtime = timeClient.getEpochTime();
  struct tm * ti;
  ti = localtime (&rawtime);
  char fechaHora[80];
  strftime (fechaHora,80,"%Y-%m-%d %H:%M:%S",ti);
  Serial.println(fechaHora);

  std::pair<String, int> result = registerDevice(client, servidor, fechaHora);
  String token = result.first;
  int idDispositivo = result.second;

  //Serial.println("Token: " + token);
  //Serial.println("ID del dispositivo: " + String(idDispositivo));

  // Lee la humedad y la temperatura del primer sensor DHT
  HumedadAire = dht.readHumidity();

  Temperatura = dht.readTemperature();



  // Solicita las temperaturas al sensor Dallas
  sensors.requestTemperatures();
  // Lee la temperatura del sensor Dallas
  float temperatureC = sensors.getTempCByIndex(0);

  //Serial.print("Medición sensores tierra: ");

  // Lee la temperatura del sensor Dallas
  float TemperaturaTierra = sensors.getTempCByIndex(0);
  // Lee la humedad del suelo del sensor analógico
  MoistureLevel = analogRead(sensorPin);  
  //Serial.print(MoistureLevel);
  // Mapea el nivel de humedad del suelo a un porcentaje
  HumedadTierra = map(MoistureLevel, medicionSeco, medicionAgua, 0, 100);
  // Verifica si el porcentaje de humedad del suelo es 100, 0 o algo intermedio
  if (HumedadTierra >= 100){
    //Serial.println("\nTemperatura: " +String(TemperaturaTierra)+ "°C Humedad: Maximum - 100 %");
    }
    else if (HumedadTierra <= 0)
    {
      //Serial.println("\nTemperatura: " +String(TemperaturaTierra)+ "°C Humedad: Minimum - 0 %");
    }
    else if (HumedadTierra > 0 && HumedadTierra < 100)
    {
      //Serial.print("\nTemperatura: " +String(TemperaturaTierra)+ "°C Humedad: " +String(HumedadTierra));
      //Serial.println("%");
  }

/*
  // Crea un JsonArray para almacenar los datos de lectura
  DynamicJsonDocument doc(1024);
  JsonArray readingsData = doc.createNestedArray("readingsData");

  // Crea un JsonObject para cada lectura y lo agrega al JsonArray
  JsonObject tempAire = readingsData.createNestedObject();
  tempAire["sensorId"] = 1;
  tempAire["dateTime"] = fechaHora;
  tempAire["value"] = Temperatura;

  JsonObject humAire = readingsData.createNestedObject();
  humAire["sensorId"] = 2;
  humAire["dateTime"] = fechaHora;
  humAire["value"] = HumedadAire;

  JsonObject humTierra = readingsData.createNestedObject();
  humTierra["sensorId"] = 3;
  humTierra["dateTime"] = fechaHora;
  humTierra["value"] = HumedadTierra;

  JsonObject tempTierra = readingsData.createNestedObject();
  tempTierra["sensorId"] = 4;
  tempTierra["dateTime"] = fechaHora;
  tempTierra["value"] = TemperaturaTierra;
  
*/
  
  
  DynamicJsonDocument doc(1024);
  JsonArray readingsData = doc.createNestedArray("readingsData");

  String respuesta = obtenerDatosSensor(idDispositivo, token);
  DynamicJsonDocument sensorInfo(1024);
  deserializeJson(sensorInfo, respuesta);

  for (JsonObject elem : sensorInfo.as<JsonArray>()) {
    JsonObject sensorData = readingsData.createNestedObject();
    sensorData["sensorId"] = elem["idSensor"];
    //sensorData["dateTime"] = fechaHora;
    sensorData["tipoSensor"] =  elem["tipoSensor"];

    String tipoSensor = elem["tipoSensor"].as<String>();
    if (tipoSensor == "Temperatura") {
      sensorData["value"] = Temperatura;
    } else if (tipoSensor == "HumedadAire") {
      sensorData["value"] = HumedadAire;
    } else if (tipoSensor == "HumedadTierra") {
      // Suponiendo que tienes una función para leer la humedad de la tierra
      sensorData["value"] = HumedadTierra;
    } else if (tipoSensor == "TemperaturaTierra") {
      // Suponiendo que tienes una función para leer la temperatura de la tierra
      sensorData["value"] = TemperaturaTierra;
    }
  }

  JsonObject arduinoData = doc.createNestedObject("arduinoData");
  arduinoData["idDispositivo"] = idDispositivo; // Reemplaza con la variable correspondiente si es necesario
  arduinoData["ultimaIP"] = WiFi.localIP().toString(); // Reemplaza con la variable correspondiente si es necesario
  arduinoData["fechaUltimaComunicacion"] = fechaHora; // Reemplaza con la variable correspondiente si es necesario

  //String respuesta = obtenerDatosSensor(idDispositivo, token);

  //Serial.print(respuesta);
  bool necesitaRegar = sendSensorData(http, client, token, doc);
  if (necesitaRegar) {
  digitalWrite(riego, HIGH); // Enciende el LED
  Serial.println("Riego necesario, LED encendido.");
  } else {
    digitalWrite(riego, LOW); // Apaga el LED
    Serial.println("Riego no necesario, LED apagado.");
  }
  Serial.println();
  // Espera (x*1000) segundos antes de la próxima iteración
  delay(15000);
}
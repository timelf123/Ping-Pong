int feeler1 = D0;
int feeler2 = D2;
int batteryLowIndicator = D4;
int pingFrequency = 5000;
unsigned long lastPing = millis();
bool batteryLow = false;
bool sentOnlineMessage = false;

int feeler1PreviousState;
int feeler2PreviousState;
int batteryLevelPreviousState;

int feeler1ConsecutivePresses;
int feeler2ConsecutivePresses;
int consecutivePressThreshold = 30; // 3 seconds

void setup() {
    pinMode(feeler1, INPUT_PULLDOWN);
    pinMode(feeler2, INPUT_PULLDOWN);
    pinMode(batteryLowIndicator, INPUT_PULLUP);
}

void loop() {
    
    int feeler1Pressed = digitalRead(feeler1);
    int feeler2Pressed = digitalRead(feeler2);
    int batteryLevel = digitalRead(batteryLowIndicator);
    
    if (Spark.connected() && !sentOnlineMessage) {
        sentOnlineMessage = true;
        Spark.publish("online", "1", 60, PRIVATE);
    }
    
    if (feeler1Pressed == HIGH) {
        if (feeler1PreviousState == HIGH) {
            feeler1ConsecutivePresses += 1;
        } else {
            Spark.publish("scored", "1", 60, PRIVATE);
        }
    } else {
        feeler1ConsecutivePresses = 0;
    }
    
    if (feeler2Pressed == HIGH) {
        if (feeler2PreviousState == HIGH) {
            feeler2ConsecutivePresses += 1;
        } else {
            Spark.publish("scored", "2", 60, PRIVATE);
        }
    } else {
        feeler2ConsecutivePresses = 0;
    }

    if (feeler1ConsecutivePresses == consecutivePressThreshold
            && feeler2ConsecutivePresses == consecutivePressThreshold) {
        Spark.publish("endGame", null, 60, PRIVATE);
    }
    
    if (batteryLevel == LOW && batteryLevel != batteryLevelPreviousState) {
        Spark.publish("batteryLow", "1", 60, PRIVATE);
    }
    
    // Ping server every x seconds
    if (millis() - lastPing > pingFrequency) {
        Spark.publish("ping", "1", 60, PRIVATE);
        lastPing = millis();
    }
    
    feeler1PreviousState = feeler1Pressed;
    feeler2PreviousState = feeler2Pressed;
    batteryLevelPreviousState = batteryLevel;
    
    delay(100);
}

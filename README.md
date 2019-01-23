### Ionic - Firebase Cloud Messaging Example

Test project to demonstrate how to implement firebase cloud messaging in Ionic apps to receive and display notifications (icon with accent color) on all Android devices correctly.


#### Environment

* Ionic 4.0.0-rc.1
* Cordova: 8.0.0

---

### Firebase
A new Firebase project was created for this app.

---
#### Cloud Messages
The project uses the cordova-plugin-firebase which handles the native implementation to process incoming firebase cloud messages.

---
#### Preparation
The `cordova-plugin-firebase` searches for an icon named `notification_icon`. We can generate icons with this open source tool.


[Notification Icon Generator]: https://romannurik.github.io/AndroidAssetStudio


In config.xml we add a `hook` that copies our icons to the specific `drawable` folder. Otherwise the icons will be overridden on each cordova build.

```
<platform name="android">
    <resource-file src="resources/android/notification/drawable-hdpi/notification_icon.png" target="app/src/main/res/drawable-hdpi/notification_icon.png" />
    <resource-file src="resources/android/notification/drawable-mdpi/notification_icon.png" target="app/src/main/res/drawable-mdpi/notification_icon.png" />
    <resource-file src="resources/android/notification/drawable-xhdpi/notification_icon.png" target="app/src/main/res/drawable-xhdpi/notification_icon.png" />
    <resource-file src="resources/android/notification/drawable-xxhdpi/notification_icon.png" target="app/src/main/res/drawable-xxhdpi/notification_icon.png" />
    <resource-file src="resources/android/notification/drawable-xxxhdpi/notification_icon.png" target="app/src/main/res/drawable-xxxhdpi/notification_icon.png" />
</platform>
```

#### Tests
Expected: The notification icon and color are displayed correctly. Messages can be sent with the firebase fcm api:


```
https://fcm.googleapis.com/fcm/send
Content-Type:application/json
Authorization:key=AIzaSyZ-1u...0GBYzPu7Udno5aA

{ "data": {
    "score": "5x1",
    "time": "15:10"
  },
  "to" : "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1..."
}
```
---
#### Payloads


##### Data Message
The client app is responsible for processing data messages, so the `cordova-plugin-firebase` handles foreground and background messages.

**Example:**

```
{
    "data": {
        "body": "Data message payload with title and body, icon should be displayed correctly.",
        "title": "Ionic Push-Icon Test for Android"
    },
    "to": "doUWXe_5O7E:APA91bHhJ…”
}
```

**Results:**

| Device        | Result         
| :-------------: |:-------------:|
| Google Pixel 2, Android 8.1.0 | :white_check_mark: |
| Huawei P Smart, Android 8.0.0 | :white_check_mark: |
| Huawei P20 Light, Android 8.0.0 |:white_check_mark: |
| Sony Xperia Z5 Compact, Android 7.1.1| :white_check_mark: |
| Samsung Galaxy J3 Duos, Android 5.1.1 | :warning: |

Test OK, only on Android 5.1.1 (API Level 22) the background color is missing, like expected, because the cordova-plugin-firebase implementation defines the accent color only for API Level 23+.

---
##### Notification Message
FCM automatically displays the message to end-user devices on behalf of the client app. The `cordova-plugin-firebase` only processes foreground messages with this type of payload, so we need to add metadata to the app manifest so that the FCM SDK uses the right icon and color.

```
AndroidManifest.xml

<meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@drawable/notification_icon" />
<meta-data android:name="com.google.firebase.messaging.default_notification_color" android:resource="@color/accent" />
```

**Example:**

```
{
    "data": {
        "body": "Data message payload with title and body, icon should be displayed correctly.",
        "title": "Ionic Push-Icon Test for Android"
    },
    "to": "doUWXe_5O7E:APA91bHhJ…”
}
```

**Results:**

| Device        | Result         
| :-------------: |:-------------:|
| Google Pixel 2, Android 8.1.0 | :white_check_mark: |
| Huawei P Smart, Android 8.0.0 | :white_check_mark: |
| Huawei P20 Light, Android 8.0.0 |:white_check_mark: |
| Sony Xperia Z5 Compact, Android 7.1.1| :white_check_mark: |
| Samsung Galaxy J3 Duos, Android 5.1.1 | :white_check_mark: |

Test OK

---

##### Mixed
Mixed payloads containing both `notification` and `data` keys are processed as standard notification.


---
##### Screenshots
Screenshots of the tests can be found in the subdirectory `/screenshots`.
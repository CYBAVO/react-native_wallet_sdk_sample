package com.cybavo.example.rn.wallet;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;

import android.support.v4.app.NotificationCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import javax.annotation.Nonnull;

import static com.facebook.FacebookSdk.getApplicationContext;

public class MyModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public MyModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "MyModule";
    }
    @ReactMethod
    public void localNotification(ReadableMap configuration) {
        final String title = configuration.getString("title");
        final String message = configuration.getString("message");
        int requestCode = (int) (System.currentTimeMillis()/1000);
        NotificationCompat.Builder builder =
                new NotificationCompat.Builder(reactContext, MainApplication.CHANNEL_ID);
        Intent nfIntent = new Intent(reactContext, MainActivity.class);
        builder.setContentIntent(PendingIntent.getActivity(reactContext, requestCode, nfIntent, 0))
                .setLargeIcon(BitmapFactory.decodeResource(reactContext.getResources(), R.mipmap.ic_launcher))
                .setSmallIcon( R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setAutoCancel(true)
                .setPriority(Notification.PRIORITY_MAX)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                .setContentText(message);
        NotificationManager mNotificationManager =
                (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);
        mNotificationManager.notify(requestCode, builder.build());

    }
}

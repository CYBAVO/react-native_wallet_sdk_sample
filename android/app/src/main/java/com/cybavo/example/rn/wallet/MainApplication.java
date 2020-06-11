package com.cybavo.example.rn.wallet;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;

import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import com.smixx.fabric.FabricPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.theweflex.react.WeChatPackage;
import com.cybavo.reactnative.wallet.service.CybavoWalletServicePackage;
import org.reactnative.camera.RNCameraPackage;
import com.rnfs.RNFSPackage;
import com.horcrux.svg.SvgPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  public static final String CHANNEL_ID = "WalletExample.channel";
  private static final String CHANNEL_NAME = "WalletExample.notification";
  private static final String DESCRIPTION = "description";
  private static final long[] VIBRATION_PATTERN =
          new long[] { 100L, 200L, 300L, 400L, 500L, 400L, 300L, 200L, 400L };

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new MainReactPackage(),
            new RNPermissionsPackage(),
            new ReactNativePushNotificationPackage(),
            new FabricPackage(),
            new AsyncStoragePackage(),
            new LineLoginPackage(),
            new FBSDKPackage(),
            new WeChatPackage(), new CybavoWalletServicePackage(),
          new RNCameraPackage(), new RNFSPackage(), new SvgPackage(), new RNGoogleSigninPackage(),
          new RNGestureHandlerPackage());
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Fabric.with(this, new Crashlytics());
    createNotificationChannel();
  }


  private void createNotificationChannel() {
    NotificationManager notificationManager =
            (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    if (notificationManager == null) {
      /* shouldn't happens */
      return;
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel notificationChannel =
              notificationManager.getNotificationChannel(CHANNEL_ID);
      /* create channel if has no such channel of id */
      if (notificationChannel == null) {
        notificationChannel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME,
                NotificationManager.IMPORTANCE_DEFAULT);
        notificationChannel.setDescription(DESCRIPTION);
        notificationChannel.enableLights(true);
        notificationChannel.setVibrationPattern(VIBRATION_PATTERN);
        notificationChannel.enableVibration(true);
        ((NotificationManager) getSystemService(
                Context.NOTIFICATION_SERVICE)).createNotificationChannel(notificationChannel);
      }
    }
  }
}

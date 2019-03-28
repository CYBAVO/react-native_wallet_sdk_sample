package com.cybavo.example.rn.wallet;

import android.app.Application;

import com.facebook.react.ReactApplication;
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

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new MainReactPackage(),
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
  }
}

package com.scs;

import android.os.Bundle;

import com.beefe.picker.PickerViewPackage;
import com.compressedimage.RCTcompressedImagePackage;
import com.facebook.react.ReactActivity;

import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecomponent.alipay.RCTAlipayPackage;
import com.reactnativecomponent.imageloader.RCTLoaderImageViewPackage;
import com.reactnativecomponent.splashscreen.RCTSplashScreenPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.reactnativecomponent.splashscreen.RCTSplashScreen;
import com.reactnativecomponent.swiperefreshlayout.RCTSwipeRefreshLayoutPackage;
import com.reactnativecomponet.http.RCTHttpRSAPackage;
import com.rnfs.RNFSPackage;

import java.util.Arrays;
import java.util.List;

import com.microsoft.codepush.react.CodePush;

import cn.jpush.reactnativejpush.JPushPackage;

public class MainActivity extends ReactActivity {
private final String  STAGING="efQ5g6rGXYu3zc-N4wQ3nW9qQfz8EyNRpXRPG";
private final String  PRODUCTION="_IHWC3QE6EffN7QNt2kb_nx7VSXsEyNRpXRPG";
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "scs";
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        RCTSplashScreen.openSplashScreen(this);   //open splashscreen

        MainApplication ma = (MainApplication) this.getApplication();
        ma.setmReactNativeHost(new ReactNativeHost(ma) {
            @Override
            protected boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected String getJSBundleFile() {
                return CodePush.getJSBundleFile();
            }

            @Override
            protected List<ReactPackage> getPackages() {
                return Arrays.<ReactPackage>asList(
                        new MainReactPackage(),
                        new VectorIconsPackage(),
                        new RCTSwipeRefreshLayoutPackage(),
                        new RCTLoaderImageViewPackage(),
                        new RNSpinkitPackage(),
                        new RCTSplashScreenPackage(),  //register Module
                        new PickerViewPackage(),
                        new RCTHttpRSAPackage(),
                        new JPushPackage(false,false),
                        new RCTAlipayPackage(),
                        new RNFSPackage(),
                        new RCTcompressedImagePackage(),
                        new CodePush(STAGING, MainActivity.this, BuildConfig.DEBUG),
                        new PickerPackage()


                );
            }

        });


        RCTSplashScreen.openSplashScreen(this);   //open splashscreen
        //RCTSplashScreen.openSplashScreen(this, true);   //open splashscreen fullscreen
        super.onCreate(savedInstanceState);
    }
}

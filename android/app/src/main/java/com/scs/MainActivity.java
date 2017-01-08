package com.scs;

import android.os.Bundle;

import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactActivity;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.reactnativecomponent.imageloader.RCTLoaderImageViewPackage;
import com.reactnativecomponent.splashscreen.RCTSplashScreenPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.reactnativecomponent.splashscreen.RCTSplashScreen;
import com.reactnativecomponent.swiperefreshlayout.RCTSwipeRefreshLayoutPackage;
import com.reactnativecomponet.http.RCTHttpRSAPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

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

        MainApplication ma = (MainApplication) this.getApplication();
        ma.setmReactNativeHost(new ReactNativeHost(ma) {
            @Override
            protected boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
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
                        new RCTHttpRSAPackage()
                );
            }

        });


        RCTSplashScreen.openSplashScreen(this);   //open splashscreen
        //RCTSplashScreen.openSplashScreen(this, true);   //open splashscreen fullscreen
        super.onCreate(savedInstanceState);
    }
}

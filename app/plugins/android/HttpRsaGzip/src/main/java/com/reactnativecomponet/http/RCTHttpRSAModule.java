package com.reactnativecomponet.http;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.ContentResolver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;
import com.reactnativecomponet.http.util.ImageTools;
import com.reactnativecomponet.http.util.RSAUtils;
import com.reactnativecomponet.http.util.ZipUtils;
import com.reactnativecomponet.http.view.DownUpdateApk;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


/**
 * Created by shiyunjie on 16/8/12.
 */
public class RCTHttpRSAModule extends ReactContextBaseJavaModule {
    ReactApplicationContext context;
    final String privateKey = "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAJELvsHRgZhlS5zriR+1hmh/DCI6Z7+CSG2McTpvTvdvN9F11IGEcT987aO6hajpLdyT1w8ctk7np68LYI2goCC7Xp3C7x3yNw5+VZbVzncp2o9w3bPxqkTuIdh9tp8SfpDnU0IO2NAWEssyIeMit5bzkXnA4r4xFK6w0lxGQNMRAgMBAAECgYATpF6JysBdDeKmdnMUWzW/cu0GuZgRJCiAxVMUEbzE30fU0rsbav8XFOjtkjXFgQZX56FpB39cwhxAJS9HHqhwcgPpsQeMiDL+7nIWTefgZ2fK8FFSQgi7HQ0KTyTZ9/Ts5jp2U1Xei2HLHADEY03MElXooQ5e93Ff1tXgOaH3PQJBAM0/O48WJCW0RD9qjXpA4bF8907EYifeMvxA9X5yQW6OX+b0j0ZkZ2fwUZ2hxohLwTXNGPdBB6Ig6ajo7G6hnaMCQQC06ZiTwB+8xm2Nx64BaDEUyWg/SFlko0dmqu+gPyug6Z5vabrk8rIy9NtQJCRyb8afZNC8gdayesGmZRgNU2+7AkB3jv4Cu8MSs4+N4WPIc0MFQOZO29bRon3Qs4ZNwgCbhhQXVR6gwpv5z+O7DyG3A2npDTAd16O6rbFu0z/msf5BAkB32d173Kbp7+b6K5QKWJVTeQ64Bd06/7S4vnubhN4Jb1vH4ZqwPFxzx6VXVWpT6dsDE835ZGbwvMR30Ld7dJArAkA7b30dbcAXvmQXDhwpxPs17SOyCZrZJnbbJnR0JrKuuGLocvBkVyarO53ThL+iB9lR8TrDf7WUP74UCfQKoddL";


    public RCTHttpRSAModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "HttpRSAModule";
    }

    @ReactMethod
    public void gzipRSA(final String data, Promise promise) {
        try {

            if (data != null) {

                String s = getS(data);


             /*   HashMap<String, Object> map = new HashMap<>();
                //获取参数
                map.put("appid", appid);

                map.put("appsecret", appsecrect);*/
                WritableMap Resultmap = Arguments.createMap();

                Resultmap.putString("s", s);


                //itype取100余数后数值 在00-30为匿名可请求的数据 在31-99为实名登录请求,请求中必须含token值,且未过期

//                String sign = getSign(s);
                String sign = "sign";
                Resultmap.putString("sign", sign);


                promise.resolve(Resultmap);
            }
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    private String getSign(String content) throws Exception {
        Log.i("Test", "contentRSA=:" + content);
        String token = RSAUtils.sign(content.getBytes("UTF-8"), privateKey);

        Log.i("Test", "tokenRSA=:" + token);
        return token;

    }

    private String getS(String data) {
        Log.i("Test", "=====getS:" + data);
        data = ZipUtils.gzip(data);
        return data;
    }

    private Map<String, String> getData(ReadableMap data) {
        Map<String, String> map = new HashMap<String, String>();
        ReadableMapKeySetIterator it = data.keySetIterator();
        while (it.hasNextKey()) {
            String key;
            String value;
            key = it.nextKey();
            value = data.getString(key);
            map.put(key, value);
        }

        return map;
    }

    @ReactMethod
    public void gunzipRSA(final String data, Promise promise) {
        try {
            if (data != null) {

                String result = ZipUtils.gunzip(data);
//                WritableMap Resultmap = Arguments.createMap();
//                Resultmap.putString("result",result);
                promise.resolve(result);
            }
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    /**
     * App 冷更新
     * @param apkUrl
     */
    @ReactMethod
    public void UpdateApp(final String apkUrl) {
        context.getCurrentActivity().runOnUiThread(new Runnable() {
            public void run() {
                AlertDialog.Builder builder = new AlertDialog.Builder(context.getCurrentActivity());
                builder.setTitle("软件更新");
                builder.setMessage("有新版本,建议更新!");
                // 更新
                builder.setPositiveButton("更新", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                        // 显示下载对话框
                        Intent serviceIntent = new Intent(context, DownUpdateApk.class);
                        serviceIntent.putExtra("url", apkUrl);
                        context.getCurrentActivity().startService(serviceIntent);
                    }
                });
                // 稍后更新
                builder.setNegativeButton("稍后更新", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
                Dialog noticeDialog = builder.create();
                noticeDialog.show();


            }
        });
    }





}

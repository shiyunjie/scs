package com.compressedimage;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.util.DisplayMetrics;
import android.util.Log;

import com.compressedimage.utils.ImageUtils;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;




/**
 * Created by shiyunjie on 17/1/18.
 */

public class RCTcompressedImageModule  extends ReactContextBaseJavaModule{
    ReactApplicationContext reactContext;
    private Bitmap.Config bitmapConfig;

    public RCTcompressedImageModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext=reactContext;
        bitmapConfig = Bitmap.Config.ARGB_8888;

    }

    @Override
    public String getName() {
        return "NativeCompressedModule";
    }

    @ReactMethod
    public void compress(String uri,String saveUri,int width,int height,Promise promise){
        String result = "";
       /* Resources resources = reactContext.getCurrentActivity().getResources();
        DisplayMetrics dm = resources.getDisplayMetrics();

        int maxWidth = dm.widthPixels;
        int maxHeight = dm.heightPixels;*/
        try {
            String time = String.valueOf(System.currentTimeMillis());

//                Bitmap bitmap=compressToBitmap(uri,maxWidth,maxHeight);
                Bitmap bitmap=compressToBitmap(uri,width,height);
                // 将处理过的图片显示在界面上，并保存到本地Environment.getExternalStorageDirectory().getAbsolutePath()

                boolean b=ImageUtils.savePhotoToSDCard(bitmap,saveUri, time);
                if(b){
                    result=saveUri+"/"+time+".jpg";
                    Log.i("TEST","compress_result:"+result);
                }else {
                    result=uri;
                }
                promise.resolve(result);

        } catch (Exception e) {
            promise.reject(e);
        }
    }


    public Bitmap compressToBitmap(String uri,int maxWidth,int maxHeight) {
        return ImageUtils.getScaledBitmap(reactContext.getApplicationContext(), Uri.parse(uri), (float)maxWidth, (float)maxHeight, bitmapConfig);
    }
}

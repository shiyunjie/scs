//
//  HttpRsaGzip.m
//  HttpRsaGzip
//
//  Created by 施赟杰 on 17/1/15.
//  Copyright © 2017年 com.runma. All rights reserved.
//

#import "HttpRsaGzip.h"
#import "LFCGzipUtillity.h"
#import "RCTBridge.h"
#import "LFCGzip+Base64Util.h"
#import "RSASign.h"



#define privateKey @"MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAJELvsHRgZhlS5zriR+1hmh/DCI6Z7+CSG2McTpvTvdvN9F11IGEcT987aO6hajpLdyT1w8ctk7np68LYI2goCC7Xp3C7x3yNw5+VZbVzncp2o9w3bPxqkTuIdh9tp8SfpDnU0IO2NAWEssyIeMit5bzkXnA4r4xFK6w0lxGQNMRAgMBAAECgYATpF6JysBdDeKmdnMUWzW/cu0GuZgRJCiAxVMUEbzE30fU0rsbav8XFOjtkjXFgQZX56FpB39cwhxAJS9HHqhwcgPpsQeMiDL+7nIWTefgZ2fK8FFSQgi7HQ0KTyTZ9/Ts5jp2U1Xei2HLHADEY03MElXooQ5e93Ff1tXgOaH3PQJBAM0/O48WJCW0RD9qjXpA4bF8907EYifeMvxA9X5yQW6OX+b0j0ZkZ2fwUZ2hxohLwTXNGPdBB6Ig6ajo7G6hnaMCQQC06ZiTwB+8xm2Nx64BaDEUyWg/SFlko0dmqu+gPyug6Z5vabrk8rIy9NtQJCRyb8afZNC8gdayesGmZRgNU2+7AkB3jv4Cu8MSs4+N4WPIc0MFQOZO29bRon3Qs4ZNwgCbhhQXVR6gwpv5z+O7DyG3A2npDTAd16O6rbFu0z/msf5BAkB32d173Kbp7+b6K5QKWJVTeQ64Bd06/7S4vnubhN4Jb1vH4ZqwPFxzx6VXVWpT6dsDE835ZGbwvMR30Ld7dJArAkA7b30dbcAXvmQXDhwpxPs17SOyCZrZJnbbJnR0JrKuuGLocvBkVyarO53ThL+iB9lR8TrDf7WUP74UCfQKoddL"

@implementation HttpRsaGzip

@synthesize bridge = _bridge;
RCT_EXPORT_MODULE(HttpRSAModule)

RCT_EXPORT_METHOD(gzipRSA:(NSString *)data
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"data------------%@",data);
  NSString *s = [LFCGzip_Base64Util gzipData:[data dataUsingEncoding:NSUTF8StringEncoding]];
//    NSString *s = data;
    NSLog(@"s------------%@",s);
//          RSADataSigner *rsaDataSigner = [[RSADataSigner alloc] initWithPrivateKey:privateKey];
//          NSString *result = [rsaDataSigner signString:s withRSA2:YES];
      RSASign *sign = [[RSASign alloc] init];
          NSString *result = [sign signTheDataSHA1WithRSA:s pKey:privateKey];
          NSLog(@"result------------%@",result);
    
  
    NSDictionary *resultDic;
    resultDic=@{
                @"s": s,
                @"sign": @"sign"
                };
    
    resolve(resultDic);
    
}



RCT_EXPORT_METHOD(gunzipRSA:(NSString *)data
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"data------------%@",data);
    NSData *d = [LFCGzip_Base64Util gunZipData:data];
    NSString *result=[[NSString alloc]initWithData:d encoding:NSUTF8StringEncoding];
    
    resolve(result);
    
}

RCT_EXPORT_METHOD(UpdateApp:(NSString *)url)
{//更新app
  NSLog(@"url------------%@",url);
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
  
  
}


@end

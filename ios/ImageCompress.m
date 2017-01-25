//
//  ImageCompress.m
//  scs
//
//  Created by 施赟杰 on 17/1/18.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ImageCompress.h"
#import "RCTBridge.h"
#import <AssetsLibrary/ALAssetsLibrary.h>
#import <AssetsLibrary/ALAssetRepresentation.h>

#define SCREENHEIGHT [UIScreen mainScreen].bounds.size.height//获取设备屏幕的长

#define SCREENWIDTH [UIScreen mainScreen].bounds.size.width//获取设备屏幕的宽

@implementation ImageCompress

@synthesize bridge = _bridge;
RCT_EXPORT_MODULE(NativeCompressedModule)

RCT_EXPORT_METHOD(compress:(NSString *)filePath saveUri:(NSString *)saveUri
                  Maxwidth:(NSInteger)Maxwidth
                  Maxheight:(NSInteger)Maxheight
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  

  
  //开始压缩
  //    NSString *pArgument1 = [command.arguments objectAtIndex:0];
  //    NSString *pArgument2 = [command.arguments objectAtIndex:1];
  //
  //    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES);
  //    NSString *path = [paths objectAtIndex:0];
  //    path = [NSString stringWithFormat:@"%@%@",path,@"/Pandora/apps/o2o/doc/"];
  //    //拼接字符串
  //    NSString *filePath = [path stringByAppendingPathComponent:pArgument1];
  //
  
  
  //    CGFloat baseWidth = [pArgument2 floatValue];
  //      UIImage *img = [UIImage imageWithContentsOfFile:filePath];
        NSURL *url = [NSURL URLWithString:filePath];
//        NSData *data=[NSData dataWithContentsOfURL:url];
//        UIImage *img = [UIImage imageWithData:data]; // 根据地址取出图片
  
  ALAssetsLibrary *assetLibrary=[[ALAssetsLibrary alloc] init];
  [assetLibrary assetForURL:url resultBlock:^(ALAsset *asset) // substitute YOURURL with your url of video
   {
     ALAssetRepresentation *rep = [asset defaultRepresentation];
     Byte *buffer = (Byte*)malloc(rep.size);
     NSUInteger buffered = [rep getBytes:buffer fromOffset:0.0 length:rep.size error:nil];
     NSData *data = [NSData dataWithBytesNoCopy:buffer length:buffered freeWhenDone:YES];//this is NSData may
    UIImage *img = [UIImage imageWithData:data]; // 根据地址取出图片
     //    CGFloat newHeight = (baseWidth/img.size.width)*img.size.height;
     
//     CGSize size = CGSizeMake(SCREENWIDTH, SCREENHEIGHT);
     CGSize size = CGSizeMake(Maxwidth, Maxheight);
     
     UIImage *newImage = [self imageWithImageSimple:img scaledToSize:size];
     newImage = [self reduceImage:newImage percent:0.5];
     //
     //    //UIImage *newImage = [self imageCompressForSize:img targetSize:size];
     // Create file manager
     //    //delete old Image
     //    BOOL bRet = [fileMgr fileExistsAtPath:filePath];
     //    if (bRet) {
     //        NSError *err;
     //        [fileMgr removeItemAtPath:filePath error:&err];
     //    }
     
     NSString *result=saveUri;
     
     UInt64 recordTime = [[NSDate date] timeIntervalSince1970]*1000;
     NSString *fileName=[NSString stringWithFormat:@"%@%llu%@",@"/",recordTime,@".jpg"];

    
     NSFileManager *fileManager = [NSFileManager defaultManager];
     
     BOOL isDir = NO;
     
     // fileExistsAtPath 判断一个文件或目录是否有效，isDirectory判断是否一个目录
     BOOL existed = [fileManager fileExistsAtPath:saveUri isDirectory:&isDir];
     
     if ( !(isDir == YES && existed == YES) ) {
       
       // 在 Document 目录下创建一个 imgTmp 目录
       [fileManager createDirectoryAtPath:saveUri withIntermediateDirectories:YES attributes:nil error:nil];
     }
      result=[NSString stringWithFormat:@"%@%@",saveUri,fileName];
     
     BOOL bRet = [UIImageJPEGRepresentation(newImage, 1.0) writeToFile:result atomically:YES];
     
    
     
//     NSError *error;
//     NSFileManager *fileMgr = [NSFileManager defaultManager];
     //Create new Image
//     [fileMgr contentsOfDirectoryAtPath:result error:&error];
//     BOOL bRet = [fileMgr fileExistsAtPath:result];
     if (bRet) {
     }else{
       result=filePath;
     }
     
     NSLog(@"压缩后文件的大小：%f",[self fileSizeAtPath:result]);
     
     
     //返回结果
     resolve(result);

   }
               failureBlock:^(NSError *err) {
                 NSLog(@"Error: %@",[err localizedDescription]);
               }];
  
  
  
}
//单个文件的大小
- (float) fileSizeAtPath:(NSString*) filePath{
    NSFileManager *manager = [NSFileManager defaultManager];

    if ([manager fileExistsAtPath:filePath]){

        return [[manager attributesOfItemAtPath:filePath error:nil] fileSize]/(1024.0);
    }
    return 0;
}
//压缩图片尺寸
-(UIImage*)imageWithImageSimple:(UIImage*)image scaledToSize:(CGSize)newSize
{
    // Create a graphics image context
    UIGraphicsBeginImageContext(newSize);
    // new size
    [image drawInRect:CGRectMake(0,0,newSize.width,newSize.height)];
    // Get the new image from the context
    UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();

    // End the context
    UIGraphicsEndImageContext();
    // Return the new image.
    return newImage;
}
//压缩图片质量
-(UIImage *)reduceImage:(UIImage *)image percent:(float)percent
{
    NSData *imageData = UIImageJPEGRepresentation(image, percent);
    UIImage *newImage = [UIImage imageWithData:imageData];
    return newImage;
}


@end

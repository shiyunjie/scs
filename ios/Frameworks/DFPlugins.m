////
////  DFPlugins.m
////  o2o
////
////  Created by cyqresig on 15/10/13.
////  Copyright © 2015年 cyqresig. All rights reserved.
////
//
//#import "DFPlugins.h"
//#import "LFCGzip+Base64Util.h"
//
//@implementation DFPlugins
//
//-(NSData *)log:(PGMethod *)command{
//    NSString* pArgument1 = [command.arguments objectAtIndex:0];
//    NSLog(@"%@",pArgument1);
//    return [self resultWithNull];
//}
//
//
//// file:///var/mobile/Containers/Data/Application/0964CD7B-DB4C-4415-8805-F76CF94EB11B/Library/Pandora/apps/o2o/doc/IMG_0392.JPG
//-(NSData *)kCompressionQualityImg:(PGMethod *)command{
//    // 根据传入参数获取一个Array，可以从中获取参数
//    NSString *pArgument1 = [command.arguments objectAtIndex:0];
//    NSString *pArgument2 = [command.arguments objectAtIndex:1];
//    
//    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES);
//    NSString *path = [paths objectAtIndex:0];
//    path = [NSString stringWithFormat:@"%@%@",path,@"/Pandora/apps/o2o/doc/"];
//    
//    NSString *filePath = [path stringByAppendingPathComponent:pArgument1];
//    
////    NSLog(@"压缩前文件的大小：%f",[self fileSizeAtPath:filePath]);
//    
//    CGFloat baseWidth = [pArgument2 floatValue];
//
//    UIImage *img = [UIImage imageWithContentsOfFile:filePath];
//    
//    CGFloat newHeight = (baseWidth/img.size.width)*img.size.height;
//    
//    CGSize size = CGSizeMake(baseWidth, newHeight);
//    
//    UIImage *newImage = [self imageWithImageSimple:img scaledToSize:size];
//    
//    newImage = [self reduceImage:newImage percent:0.1];
//    
//    //UIImage *newImage = [self imageCompressForSize:img targetSize:size];
//    
//    // Create file manager
//    NSError *error;
//    NSFileManager *fileMgr = [NSFileManager defaultManager];
//    
//    //delete old Image
//    BOOL bRet = [fileMgr fileExistsAtPath:filePath];
//    if (bRet) {
//        NSError *err;
//        [fileMgr removeItemAtPath:filePath error:&err];
//    }
//    
//    [UIImageJPEGRepresentation(newImage, 1.0) writeToFile:filePath atomically:YES];
//    
//    //Create new Image
//    [fileMgr contentsOfDirectoryAtPath:filePath error:&error];
//    
////    NSLog(@"压缩后文件的大小：%f",[self fileSizeAtPath:filePath]);
//    
//    return [self resultWithNull];
//}
//
//-(NSData *)o2oEncoding:(PGMethod *)command{
//    // 根据传入参数获取一个Array，可以从中获取参数
//    NSMutableDictionary* dict = [command.arguments objectAtIndex:0];
//    
//    NSString *sign = @"";
//    NSString *newparams = @"";
//    if(dict.count>0){
//        
//        NSArray *keys = [dict allKeys];
//        for(NSString *key in keys){
//            sign = [sign stringByAppendingFormat:@"&%@=%@",key,[dict objectForKey:key]];
//        }
//        sign =[sign substringFromIndex:1];
//    }
//    newparams = sign;
//    //添加秘钥 如果登录了就加上秘钥
//    if (nil!=dict ) {
//        NSString *itype = [dict objectForKey:@"itype"];
//        int type = [[itype substringFromIndex:1] intValue];
//        NSString *userSecret = [[NSUserDefaults standardUserDefaults] objectForKey:@"login_secret"];
//        if(type>30){
//            sign = [sign stringByAppendingString:nil==userSecret?@"":userSecret];
//        }
//    }
//    //Md5签名加密    
//    sign = [Md5 md5:sign];
//
//    
//    
//    
//    newparams = [NSString stringWithFormat:@"%@&sign=%@",newparams,sign];
//    //gzip base64 加压、加密
//    NSString *resultStr= [LFCGzip_Base64Util gzipData:[newparams dataUsingEncoding:NSUTF8StringEncoding]];
////    NSLog(@"加密后的数据：%@",resultStr);
//
//    return [self resultWithString: resultStr];
//}
//
//-(NSData *)o2oDecoding:(PGMethod *)command{
//    
//    NSString* jsonString = [command.arguments objectAtIndex:0];
//    
//    jsonString = [DFPlugins clearJsonString:jsonString];
//    
//    NSData *resData = [LFCGzip_Base64Util gunZipData:jsonString];
//    
//    NSString *resultStr = [[NSString alloc] initWithData:resData encoding:NSUTF8StringEncoding];
////    NSLog(@"解密后的数据：%@",resultStr);
//
//    NSError *err;
//    NSDictionary *resultData = [NSJSONSerialization JSONObjectWithData:resData
//                                                               options:NSJSONReadingMutableContainers
//                                                                 error:&err];
//    return [self resultWithJSON:resultData];
//
//}
//
//+ (NSString*)clearJsonString:(NSString*)json {
//    NSString *jsonString = json;
//    jsonString = [jsonString stringByReplacingOccurrencesOfString:@"<br/>" withString:@""];
//    jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\n" withString:@""];
//    jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\t" withString:@""];
//    jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\a" withString:@""];
//    jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\f" withString:@""];
//    jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\r" withString:@""];
//    jsonString = [jsonString stringByReplacingOccurrencesOfString:@"\v" withString:@""];
//    NSRegularExpression *regularExpression = [NSRegularExpression regularExpressionWithPattern:@"<script[^>]*?>.*?</script>" options:0 error:nil];
//    jsonString  = [regularExpression stringByReplacingMatchesInString:jsonString options:0 range:NSMakeRange(0, jsonString.length) withTemplate:@""];
//    return jsonString;
//}
//
//-(NSData *)saveUserSecret:(PGMethod *)command{
//    NSString* pArgument1 = [command.arguments objectAtIndex:0];
//    if(nil != pArgument1){
//        [[NSUserDefaults standardUserDefaults] setObject:pArgument1 forKey:@"login_secret"];
//    }
//    return [self resultWithNull];
//}
//
//
////压缩图片质量
//-(UIImage *)reduceImage:(UIImage *)image percent:(float)percent
//{
//    NSData *imageData = UIImageJPEGRepresentation(image, percent);
//    UIImage *newImage = [UIImage imageWithData:imageData];
//    return newImage;
//}
////压缩图片尺寸
//-(UIImage*)imageWithImageSimple:(UIImage*)image scaledToSize:(CGSize)newSize
//{
//    // Create a graphics image context
//    UIGraphicsBeginImageContext(newSize);
//    // new size
//    [image drawInRect:CGRectMake(0,0,newSize.width,newSize.height)];
//    // Get the new image from the context
//    UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();
//    
//    // End the context
//    UIGraphicsEndImageContext();
//    // Return the new image.
//    return newImage;
//}
//
///**
// *  等比压缩
// *
// *  @param sourceImage 图片
// *  @param size        指定分辨率
// *
// *  @return 返回image
// */
//-(UIImage *) imageCompressForSize:(UIImage *)sourceImage targetSize:(CGSize)size{
//    UIImage *newImage = nil;
//    CGSize imageSize = sourceImage.size;
//    CGFloat width = imageSize.width;
//    CGFloat height = imageSize.height;
//    CGFloat targetWidth = size.width;
//    CGFloat targetHeight = size.height;
//    CGFloat scaleFactor = 0.0;
//    CGFloat scaledWidth = targetWidth;
//    CGFloat scaledHeight = targetHeight;
//    CGPoint thumbnailPoint = CGPointMake(0.0, 0.0);
//    if(CGSizeEqualToSize(imageSize, size) == NO){
//        CGFloat widthFactor = targetWidth / width;
//        CGFloat heightFactor = targetHeight / height;
//        if(widthFactor > heightFactor){
//            scaleFactor = widthFactor;
//        }
//        else{
//            scaleFactor = heightFactor;
//        }
//        scaledWidth = width * scaleFactor;
//        scaledHeight = height * scaleFactor;
//        if(widthFactor > heightFactor){
//            thumbnailPoint.y = (targetHeight - scaledHeight) * 0.5;
//        }else if(widthFactor < heightFactor){
//            thumbnailPoint.x = (targetWidth - scaledWidth) * 0.5;
//        }
//    }
//    
//    UIGraphicsBeginImageContext(size);
//    
//    CGRect thumbnailRect = CGRectZero;
//    thumbnailRect.origin = thumbnailPoint;
//    thumbnailRect.size.width = scaledWidth;
//    thumbnailRect.size.height = scaledHeight;
//    [sourceImage drawInRect:thumbnailRect];
//    newImage = UIGraphicsGetImageFromCurrentImageContext();
//    
//    if(newImage == nil){
//        NSLog(@"scale image fail");
//    }
//    
//    UIGraphicsEndImageContext();
//    
//    return newImage;
//    
//}
//
////单个文件的大小
//- (float) fileSizeAtPath:(NSString*) filePath{
//    NSFileManager *manager = [NSFileManager defaultManager];
//    
//    if ([manager fileExistsAtPath:filePath]){
//        
//        return [[manager attributesOfItemAtPath:filePath error:nil] fileSize]/(1024.0);
//    }
//    return 0;
//}
//
//@end

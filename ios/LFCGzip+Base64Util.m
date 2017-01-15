//
//  LFCGzip+Base64Util.m
//  ZipJSON
//
//  Created by chen on 15/7/27.
//
//

#import "LFCGzip+Base64Util.h"
#import "GBase64.h"

@implementation LFCGzip_Base64Util
#pragma mark gzip 加压
+ (NSString *)gzipData:(NSData *)data{
    //压缩data//替换非utf8字符
    NSData *gzipData = [LFCGzipUtillity gzipData:data];
    //base64加密data
    NSString* afterBase64String = [GBase64 base64EncodedStringFrom:gzipData];
    return afterBase64String;
}

#pragma mark gunZip 解压
+ (NSData *)gunZipData:(NSString *)data{
    //先进行解码
    NSData *base64Data = [GBase64 dataWithBase64EncodedString:data];
    //再进行解压
    return [LFCGzipUtillity uncompressZippedData:base64Data];
}

@end

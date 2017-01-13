//
//  LFCGzip+Base64Util.h
//  ZipJSON
//
//  Created by chen on 15/7/27.
//
//

#import <Foundation/Foundation.h>
#import "LFCGzipUtillity.h"

@interface LFCGzip_Base64Util : NSObject

+ (NSString *)gzipData:(NSData *)data;
+ (NSData *)gunZipData:(NSString *)data;

@end

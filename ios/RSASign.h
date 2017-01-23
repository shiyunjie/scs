//
//  RSASign.h
//  scs
//
//  Created by 施赟杰 on 17/1/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CommonCrypto/CommonDigest.h>
#import <CommonCrypto/CommonCryptor.h>
#import <Security/Security.h>
#import "GBase64.h"

#define kChosenDigestLength CC_SHA1_DIGEST_LENGTH  // SHA-1消息摘要的数据位数160位 
@interface RSASign : NSObject
-(NSString *)signTheDataSHA1WithRSA:(NSString *)plainText pKey:(NSString *)privateKey;
@end

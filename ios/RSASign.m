//
//  RSASign.m
//  scs
//
//  Created by 施赟杰 on 17/1/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RSASign.h"

@implementation RSASign
-(NSString *)signTheDataSHA1WithRSA:(NSString *)plainText pKey:(NSString *)privateKey
{
  uint8_t* signedBytes = NULL;
  size_t signedBytesSize = 0;
  OSStatus sanityCheck = noErr;
  NSData* signedHash = nil;
  
  NSString * path = [[NSBundle mainBundle] pathForResource:@"private_key.p12" ofType:nil];
  NSData * data = [NSData dataWithContentsOfFile:path];
  NSMutableDictionary * options = [[NSMutableDictionary alloc] init]; // Set the private key query dictionary.
  [options setObject:@"123456" forKey:(id)kSecImportExportPassphrase];
  CFArrayRef items = CFArrayCreate(NULL, 0, 0, NULL);
  OSStatus securityError = SecPKCS12Import((CFDataRef) data, (CFDictionaryRef)options, &items);
  if (securityError!=noErr) {
    return nil ;
  }
  CFDictionaryRef identityDict = CFArrayGetValueAtIndex(items, 0);
  SecIdentityRef identityApp =(SecIdentityRef)CFDictionaryGetValue(identityDict,kSecImportItemIdentity);
  SecKeyRef privateKeyRef=nil;
  SecIdentityCopyPrivateKey(identityApp, &privateKeyRef);
  signedBytesSize = SecKeyGetBlockSize(privateKeyRef);
  
  NSData *plainTextBytes = [plainText dataUsingEncoding:NSUTF8StringEncoding];
  
  signedBytes = malloc( signedBytesSize * sizeof(uint8_t) ); // Malloc a buffer to hold signature.
  memset((void *)signedBytes, 0x0, signedBytesSize);
  
  sanityCheck = SecKeyRawSign(privateKeyRef,
                              kSecPaddingPKCS1SHA1,
                              (const uint8_t *)[[self getHashBytes:plainTextBytes] bytes],
                              kChosenDigestLength,
                              (uint8_t *)signedBytes,
                              &signedBytesSize);
  
  if (sanityCheck == noErr)
  {
    signedHash = [NSData dataWithBytes:(const void *)signedBytes length:(NSUInteger)signedBytesSize];
  }
  else
  {
    return nil;
  }
  
  if (signedBytes)
  {
    free(signedBytes);
  }
  NSString *signatureResult=[NSString stringWithFormat:@"%@",[GBase64 base64EncodedStringFrom:signedHash]];
  return signatureResult;
}
- (NSData *)getHashBytes:(NSData *)plainText {
  CC_SHA1_CTX ctx;
  uint8_t * hashBytes = NULL;
  NSData * hash = nil;
  
  // Malloc a buffer to hold hash.
  hashBytes = malloc( kChosenDigestLength * sizeof(uint8_t) );
  memset((void *)hashBytes, 0x0, kChosenDigestLength);
  // Initialize the context.
  CC_SHA1_Init(&ctx);
  // Perform the hash.
  CC_SHA1_Update(&ctx, (void *)[plainText bytes], [plainText length]);
  // Finalize the output.
  CC_SHA1_Final(hashBytes, &ctx);
  
  // Build up the SHA1 blob.
  hash = [NSData dataWithBytes:(const void *)hashBytes length:(NSUInteger)kChosenDigestLength];
  if (hashBytes) free(hashBytes);
  
  return hash;
}
@end

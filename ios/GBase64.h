//
//  Base64.h
//  ZipJSON
//
//  Created by chen on 15/7/29.
//
//

#import <Foundation/Foundation.h>

#define __BASE64( text )        [CommonFunc base64StringFromText:text]
#define __TEXT( base64 )        [CommonFunc textFromBase64String:base64]

@interface GBase64 : NSObject

/******************************************************************************
 函数名称 : + (NSString *)base64StringFromText:(NSString *)text DES+base64
 函数描述 : 将文本转换为base64格式字符串
 输入参数 : (NSString *)text    文本
 输出参数 : N/A
 返回参数 : (NSString *)    base64格式字符串
 备注信息 :
 ******************************************************************************/
+ (NSString *)base64StringFromText:(NSString *)text;

/******************************************************************************
 函数名称 : + (NSString *)textFromBase64String:(NSString *)base64 DES+base64
 函数描述 : 将base64格式字符串转换为文本
 输入参数 : (NSString *)base64  base64格式字符串
 输出参数 : N/A
 返回参数 : (NSString *)    文本
 备注信息 :
 ******************************************************************************/
+ (NSString *)textFromBase64String:(NSString *)base64;

/******************************************************************************
 函数名称 : + (NSString *)base64EncodedStringFrom:(NSData *)data    base64
 函数描述 : 将文本转换为base64格式字符串
 输入参数 : (NSData *)data    文本
 输出参数 : N/A
 返回参数 : (NSString *)base64格式字符串
 备注信息 :
 ******************************************************************************/
+ (NSString *)base64EncodedStringFrom:(NSData *)data;

/******************************************************************************
 函数名称 : + (NSData *)dataWithBase64EncodedString:(NSString *)string  base64
 函数描述 : 将base64格式字符串转换为文本
 输入参数 : (NSData *)base64  base64格式字符串
 输出参数 : N/A
 返回参数 : (NSString *)    文本
 备注信息 :
 ******************************************************************************/
+ (NSData *)dataWithBase64EncodedString:(NSString *)string;

@end

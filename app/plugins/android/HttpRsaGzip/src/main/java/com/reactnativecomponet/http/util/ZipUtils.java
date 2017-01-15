package com.reactnativecomponet.http.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

public class ZipUtils {
	/**
	 * 使用gzip进行压缩
	 */
	public static String gzip(String primStr) {
		if (primStr == null || primStr.length() == 0) {
			return primStr;
		}
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		GZIPOutputStream gzip = null;
		try {
			gzip = new GZIPOutputStream(out);
			gzip.write(primStr.getBytes("utf-8"));
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (gzip != null) {
				try {
					gzip.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		/*String result="";
		try {
			result = new String(out.toByteArray(), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;*/
		return Base64Util.encode(out.toByteArray());
	}

	/**
	 * 
	 * <p>
	 * Description:使用gzip进行解压缩
	 * </p>
	 * 
	 * @param compressedStr
	 * @return
	 */
	public static String gunzip(String compressedStr) {
		if (compressedStr == null) {
			return null;
		}

		ByteArrayOutputStream out = new ByteArrayOutputStream();
		ByteArrayInputStream in = null;
		GZIPInputStream ginzip = null;
		byte[] compressed = null;
		String decompressed = null;
		try {
			compressed = Base64Util.decode(compressedStr);
			in = new ByteArrayInputStream(compressed);
			ginzip = new GZIPInputStream(in);

			byte[] buffer = new byte[1024];
			int offset = -1;
			while ((offset = ginzip.read(buffer)) != -1) {
				out.write(buffer, 0, offset);
			}
			decompressed = out.toString();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (ginzip != null) {
				try {
					ginzip.close();
				} catch (IOException e) {
				}
			}
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
				}
			}
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
				}
			}
		}

		return decompressed;
	}

	/**
	 * 使用zip进行压缩
	 * 
	 * @param str
	 *            压缩前的文本
	 * @return 返回压缩后的文本
	 */
	public static final String zip(String str) {
		if (str == null)
			return null;
		byte[] compressed;
		ByteArrayOutputStream out = null;
		ZipOutputStream zout = null;
		String compressedStr = null;
		try {
			out = new ByteArrayOutputStream();
			zout = new ZipOutputStream(out);
			zout.putNextEntry(new ZipEntry("0"));
			zout.write(str.getBytes("utf-8"));
			zout.closeEntry();
			compressed = out.toByteArray();
			compressedStr = Base64Util.encode(compressed);
		} catch (IOException e) {
			compressed = null;
		} finally {
			if (zout != null) {
				try {
					zout.close();
				} catch (IOException e) {
				}
			}
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
				}
			}
		}
		return compressedStr;
	}

	/**
	 * 使用zip进行解压缩
	 * 
	 * @param compressedStr
	 *            压缩后的文本
	 * @return 解压后的字符串
	 */
	public static final String unzip(String compressedStr) {
		if (compressedStr == null) {
			return null;
		}
		ByteArrayOutputStream out = null;
		ByteArrayInputStream in = null;
		ZipInputStream zin = null;
		String decompressed = null;
		try {
			byte[] compressed = Base64Util.decode(compressedStr);
			out = new ByteArrayOutputStream();
			in = new ByteArrayInputStream(compressed);
			zin = new ZipInputStream(in);
			zin.getNextEntry();
			byte[] buffer = new byte[1024];
			int offset = -1;
			while ((offset = zin.read(buffer)) != -1) {
				out.write(buffer, 0, offset);
			}
			decompressed = out.toString();
		} catch (IOException e) {
			decompressed = null;
		} finally {
			if (zin != null) {
				try {
					zin.close();
				} catch (IOException e) {
				}
			}
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
				}
			}
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
				}
			}
		}
		return decompressed;
	}

	
	// 测试方法   
	  public static void main(String[] args) throws IOException {
	         
		  //gzip_test1();
		  //zip_test1();	 
		  String str = "H4sIAAAAAAAAAB3IPQ6DMAxA4dt4tuMYWDwxdesVyI9RBkKlpENvUolbdOuBuEdR9ZZPL+6159r1/H7O9wFbSWo24RV5F2Vc8oB/JRLxgkgETQm2eb8lZWIo7f4M1yn99cgq6KCVtarHJH5KxMaj5UwuBhsYAzoz5gV/7SystXkAAAA=";
		  String strZip = ZipUtils.gunzip(str);
		  System.out.println(strZip);
	  }   
	
	  
	  private static void gzip_test1(){
	      //测试字符串   
		  String str="pwd=14e1b600b1fd579f47433b88e8d85291&mFlag=000000003e916b47013e91700b960003&mid=&loginNo=13867165621&mOldFlag=000000003e916b47013e916e76b50002&itype=202";
		  
	      //String str="%5B%7B%22lastUpdateTime%22%3A%222011-10-28+9%3A39%3A41%22%2C%22smsList%22%3A%5B%7B%22liveState%22%3A%221";   
		  //String str="%5B%7B%22lastUpdateTime%22%3A%222011-10-28+9%3A39%3A41%22%2C%22smsList%22%3A%5B%7B%22liveState%22%3A%221我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵";
		  //H4sIAAAAAAAAADXFOw7DIAwA0Nsw+4PBHrhC7oADjpCqJFIjVb19p77lred7z0ZA6XUd69yuhoJS0YAqp/szGuaJXgAcY0i1yDUzu+rUoUKGqffWAf5Teq/jbGaqwiRUXPJeglyZQfoegabsP51ifuh4AAAA
		  //
		  //UEsDBBQACAgIAGNPq0IAAAAAAAAAAAAAAAABAAAAMH2MuwoDIRBF/8Z6ro46FrYpk2+IO7oI7qMIhPx9VkidWx0Oh7vdxnPN9JurCdxsIEzyhEX10jDbY+ifchJjetNfn7NmS9aMY+37/chwEiKCD/b66ZrN+dYMriiBqKCpj6lxZOeKSBUVbxO+UEsHCMM1BplrAAAAmAAAAA==
		  //UEsDBBQACAgIAGNPq0IAAAAAAAAAAAAAAAABAAAAMH2MuwoDIRBF/8Z6ro46FrYpk2+IO7oI7qMIhPx9VkidWx0Oh7vdxnPN9JurCdxsIEzyhEX10jDbY+ifchJjetNfn7NmS9aMY+37/chwEiKCD/b66ZrN+dYMriiBqKCpj6lxZOeKSBUVbxO+UEsHCMM1BplrAAAAmAAAAA==
		  //H4sIAAAAAAAAAGWKOw7CMBAFb+N63/q3LtxSwhkwa0eWbJICCXF7QEqqTDUazbyM+5Jpx9YEb4kJhwn+3czb0NPpGof9JDxUfxmmvz5bzUxsxrr053XNsBIigg8MM7tms701w1WUQFTQ1MfUXHTWFpEqKp4Tvp+t56SYAAAA
		  
		  //mFlag=000000003e916b47013e91700b960003&mOldFlag=000000003e916b47013e916e76b50002&itype=202&loginNo=13867165621&mid=&pwd=14e1b600b1fd579f47433b88e8d85291
		  //pwd=14e1b600b1fd579f47433b88e8d85291&mFlag=000000003e916b47013e91700b960003&mid=&loginNo=13867165621&mOldFlag=000000003e916b47013e916e76b50002&itype=202
		  
	      System.out.println("原长度："+str.length());
	      
	      String strZip = ZipUtils.gzip(str);
	      
	      System.out.println("压缩后："+ ZipUtils.gzip(str).length());
	         
	      System.out.println(strZip);
	      
	      System.out.println("解压缩："+ ZipUtils.gunzip(strZip));
	  }

	  private static void zip_test1(){
	      //测试字符串   
		  String str="ddd";
		  
	      //String str="%5B%7B%22lastUpdateTime%22%3A%222011-10-28+9%3A39%3A41%22%2C%22smsList%22%3A%5B%7B%22liveState%22%3A%221";   
		  //String str="%5B%7B%22lastUpdateTime%22%3A%222011-10-28+9%3A39%3A41%22%2C%22smsList%22%3A%5B%7B%22liveState%22%3A%221我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵我是一个兵";
	         
	      System.out.println("原长度："+str.length());
	         
	      System.out.println("压缩后："+ ZipUtils.zip(str).length());
	         
	      System.out.println("解压缩："+ ZipUtils.unzip(ZipUtils.zip(str)));
	  }	  
}

/**
 *  simple-encryptor加解密，https://github.com/sehrope/node-simple-encryptor
 *  使用方法：
 *     import EncryptUtil from '@/utils/encrypt-util'
 *     加密：content = EncryptUtil.encrypt(key,value)
 *     解密：value = EncryptUtil.decrypt(key,content);
 */

var Encryptor = require('simple-encryptor');
//设置密钥前缀
var _prefix = "shgjss_encrypt_key_"

export default {
  encrypt(key,value){
    let encryptor = new Encryptor(_prefix+key)
    return encryptor.encrypt(value)
  },
  decrypt(key,content){
    let encryptor = new Encryptor(_prefix+key)
    return encryptor.decrypt(content)
  }
}

/**
 * @fileoverview
 * @since 17/1/8 10:33
 * @author chenyiqin
 */
const prvkey = '-----BEGIN RSA PRIVATE KEY-----' +
    'MIICXQIBAAKBgQDKoeRzRVf8WoRSDYYqUzThpYCr90jfdFwTSXHJ526K8C6TEwdTUA+CFPQPRUg9jrYgFcown+J2myzO8BRLynD+XHb9ilLb49Mqk2CvDt/yK32lgHv3QVx14Dpb6h8isjncSF965fxBxlHGbvPwnHkJ9etRIYdYV3QpYohFszH3wQIDAQABAoGAFhKqkw/ztK6biWClw8iKkyX3LURjsMu5F/TBK3BFb2cYe7bv7lhjSBVGPL+cTfBU0IvvGXrhLXBb4jLu0w67Xhggwwfc86vlZ8eLcrmYVat7N6amiBmYsw20GViUUFmePbo1G2BXqMA43JxqbIQwOLZ03zdw6GHj6EVlx369IAECQQD4K2R3K8ah50YzLhF7zbYPIPGbHw+crP13THiYIYkHKJWsQDr8SXoNQ96TQsInTXUAmF2gzs/AwdQggjIJ/dmBAkEA0QarqdWXZYbse1XIrQgBYTdVH9fNyLs1e1sBmNxlo4QMm/Le5a5LXenorEjnpjw5YpEJFDS4ijUI3dSzylC+QQJARqcD6TGbUUioobWB4L9GD7SPVFxZc3+EgcxRoO4bNuCFDA8VO/InP1ONMFuXLt1MbCj0ru1yFCyamc63NEUDAQJBALt7PjGgsKCRuj6NnOcGDSbDWIitKZhnwfqYkAApfsiBQkYGO0LLaDIeAWG2KoCB9/6elAQZnYPpOcCubWyDq4ECQQCrRDf0gVjPtipnPPS/sGN8m1Ds4znDDChhRlw74MI5FydvHFumChPe1Dj2I/BWeG1gA4ymXV1tE9phskV3XZfq' +
    '-----END RSA PRIVATE KEY-----';


import {Signature,hex2b64,RSAKey} from 'jsrsasign';

export const doSign = (data)=> {
   /* let sig = new Signature({alg: 'SHA1withRSA'});
    sig.init(prvkey);
    sig.updateString(data);
    let sigVal = sig.sign();
    console.log(`sigVal:`, sigVal)*/

    let rsa = new RSAKey();
    rsa.readPrivateKeyFromPEMString(prvkey);
    let sigVal = rsa.signString(data, 'sha1');

    //console.log(`sigVal:`, sigVal)


    let hex2b64Val = hex2b64(sigVal)

    //console.log(`hex2b64Val:`, hex2b64Val)
    return hex2b64Val
}



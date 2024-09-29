import CryptoJS from 'crypto-js';

const base64UrlEncode = (obj: object) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(obj)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
}

// https://console.sensecore.cn/help/docs/model-as-a-service/nova/overview/Authorization
export const caculateJwtToken = (accessKeyID?: string, accessKeySecret?: string) => {
      if (!accessKeyID || !accessKeySecret) {
        throw new Error('accessKeyID and accessKeySecret must be provided');
      }

      const headers = {
        alg: 'HS256',
        typ: 'JWT'
      }

      const payload = {
        exp: Math.floor(Date.now() / 1000) + 1800, // Current Time + 30m
        iss: accessKeyID,
        nbf: Math.floor(Date.now() / 1000) - 5     // Current Time - 5s
      }

      const data = `${ base64UrlEncode(headers) }.${ base64UrlEncode(payload) }`

      const signature = CryptoJS.HmacSHA256(data, accessKeySecret)
        .toString(CryptoJS.enc.Base64)
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

      const apiKey = `${ data }.${ signature }`

      return apiKey
};

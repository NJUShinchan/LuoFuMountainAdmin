const TokenKey = 'Admin-Token'; // 定义一个唯一的key，用于在localStorage中存储token

/**
 * 从localStorage获取token
 * @returns {string | null}
 */
export function getToken() {
    return localStorage.getItem(TokenKey);
}

/**
 * 将token存入localStorage
 * @param {string} token - 要存储的token字符串
 */
export function setToken(token) {
    return localStorage.setItem(TokenKey, token);
}

/**
 * 从localStorage中移除token
 */
export function removeToken() {
    return localStorage.removeItem(TokenKey);
}

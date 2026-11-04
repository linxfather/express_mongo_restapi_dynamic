export function commonSleepMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
};
export const commonEmailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,16})+$/;
export function commonIsEmail(email) {
  return commonEmailRegEx.test(email);
};
export function commonIsPassword(password) {
  return (password.length >= 8)
    && /\d/.test(password)
    && /[a-z]/.test(password)
    && /[A-Z]/.test(password);
}
export function commonObjectIsValid(obj) {
  return typeof obj === 'object' && (Object.keys(obj).length > 0);
}



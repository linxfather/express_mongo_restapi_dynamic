import { apiv1Info } from "../constants/apiv1.js";

export function testStrToLines(str) {
  // TODO: only for tests
  return str
    .split("\n")
    .filter(v => (v.trim() && !v.startsWith('//')))
    .map(v => v.replace(/"/g, '').split('//').at(0).trim());
}
export async function testModelSchemaValidate(t, row, message) {
  try {
    await row.validate();
    console.log('OK', message);
    t.true(true);
  } catch (err) {
    console.log('ERR', message, 'err.message=', err.message);
    t.true(false);
  }
}
export async function testModelSchemaInvalidMessage(t, row) {
  try {
    await row.validate();
    return '';
  } catch (err) {
    return err.message;
  }
}
export async function testFetchv1(method, url, body, out) {
  delete out.res;
  delete out.err;
  delete out.body;
  delete out.status;
  try {
    const opt = {
      ...(method ? {method} : {}),
      ...(body ? {headers:{'content-type': 'application/json'}} : {}),
      ...(body ? {body:JSON.stringify(body)} : {})
    };
    console.log('111');
    out.res = await fetch(`${apiv1Info.localhostURL}${url}`, opt);
    out.status = out.res.status;
    const ctype = out.res.headers.get('content-type') || '';
    if (ctype.includes('application/json')) {
      out.body = await out.res.json();
    }
  } catch (err) {
    out.err = err;
  }
  delete out.res;
}
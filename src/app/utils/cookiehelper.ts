/* eslint-disable */
import * as cookie from "cookie";
/**
 * This function extracts cookies from a HTTP request.
 * @param req request to extract cookies from
 * @returns extracted cookies
 */
export function getCookies(req: Request) {
  const cookieHeader = req.headers.get("Cookie");
  if (!cookieHeader) return [];
  const cookies = cookie.parse(cookieHeader);
  const result = Object.entries(cookies).map(([name, value]) => ({
    name,
    value: value ?? "",
  }));
  return result;
}
/**
 * This function extracts a certain cookie from a request
 * @param req request to extract the cookie from
 * @param name cookie name
 * @returns cookie value
 */
export function getCookie(req: Request, name: string) {
  const cookieHeader = req.headers.get("Cookie");
  if (!cookieHeader) return;
  const cookies = cookie.parse(cookieHeader);
  return cookies[name];
}

/**
 * This function sets a certain cookie to the headers.
 * @param resHeaders the headers where the cookie will be set
 * @param name cookie name to be set
 * @param value cookie value to be set
 */
export function setCookie(
  resHeaders: Headers,
  name: string,
  value: string,
  options?: cookie.SerializeOptions
) {
  resHeaders.append("Set-Cookie", cookie.serialize(name, value, options));
}
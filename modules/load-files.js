// @ts-check

/**
 * @param {string} url
 */
export async function loadJSON(url) {
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error("Response failed.");
  }
  return await response.json();
}
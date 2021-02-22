/*
  Function: color
  Returns a color given a string id

  Parameters:
    stringId - an id representing a person for whom we want to generate a color

  Returns:
    color - a color in the format "rgb(r,g,b)"
 */
export function color(stringId: string): string {
  // Hash function to generate integer from given string
  function djb2Code(str: string) {
    let hash = 5381
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) + hash + char /* hash * 33 + c */
    }
    return hash
  }
  // Dont ask
  const id = Math.abs(djb2Code(stringId))
  return "rgb(" + ((37 * id) % 255) + ", " + ((17 * id) % 255) + ", " + ((29 * id) % 255) + ")"
}

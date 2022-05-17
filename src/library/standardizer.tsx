export default class Standardizer {
  public static isNodeNamelegitimate(name: string): string {
    if (name.length === null) {
      return 'The name cannot be empty!';
    }

    if (name.length === undefined) {
      return 'The name cannot be empty!';
    }

    if (name.length === 0) {
      return 'The name cannot be empty!';
    }

    return '';
  }
}

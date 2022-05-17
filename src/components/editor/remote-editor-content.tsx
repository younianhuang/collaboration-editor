import { RealTimeString, IConvergenceEvent } from '@convergence/convergence';

export default class RemoteEditorContent {
  private _content: RealTimeString;

  constructor() {
    this._content = null;
  }

  /**
   * Insert text into the editor.
   *
   * @param index
   *   The zero-based offset where the text insert occurred.
   * @param text
   *   the text that was inserted.
   */
  public insert(index: number, text: string): void {
    this._content.insert(index, text);
  }

  /**
   * Replaced text in the editor.
   *
   * @param index
   *   The zero-based offset at the beginning of the replaced range.
   * @param length
   *   The length of the range that was replaced.
   * @param text
   *   the text that was inserted.
   */
  public replace(index: number, length: number, text: string): void {
    this._content.model().startBatch();
    this._content.remove(index, length);
    this._content.insert(index, text);
    this._content.model().completeBatch();
  }

  /**
   * Deleted text from the editor.
   *
   * @param index
   *   The zero-based offset at the beginning of the removed range.
   * @param length
   *   The length of the range that was removed.
   */
  public delete(index: number, length: number): void {
    this._content.remove(index, length);
  }

  public subscribe(callback: (evt: IConvergenceEvent) => void): void {
    this._content.events().subscribe(callback);
  }

  public bind(content: RealTimeString): void {
    this._content = content;
  }
}

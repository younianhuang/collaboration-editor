import { editor, IPosition } from 'monaco-editor/esm/vs/editor/editor.api';
import RemoteCursorWidget from './remote-cursor-widget';

/**
 * The RemoteCursorManager class is responsible for creating and managing a
 * set of indicators that show where remote users's cursors are located when
 * using Monaco in a collaborative editing context.  The RemoteCursorManager
 * leverages Monaco's Content Widget concept.
 */

export default class RemoteCursorManager {
  private _editor: editor.ICodeEditor;

  private readonly _cursorWidgets: Map<string, RemoteCursorWidget>;

  // private _nextWidgetId: number;

  constructor(codeEditor: editor.ICodeEditor) {
    this._editor = codeEditor;
    this._cursorWidgets = new Map<string, RemoteCursorWidget>();
    // this._nextWidgetId = 0;
  }

  /**
   * Adds a new remote cursor to the editor.
   *
   * @param id
   *   A unique id that will be used to reference this cursor.
   * @param color
   *   The css color that the cursor and tooltip should be rendered in.
   * @param label
   *   An optional label for the tooltip. If tooltips are enabled.
   *
   * @returns
   *   The remote cursor widget that will be added to the editor.
   */
  public addCursor(
    id: string,
    color: string,
    label?: string,
  ): RemoteCursorWidget {
    const cursorWidget = new RemoteCursorWidget(this._editor, id, color, label);

    this._cursorWidgets.set(cursorWidget.getId(), cursorWidget);

    return cursorWidget;
  }

  /**
   * Removes the remote cursor from the editor.
   *
   * @param id
   *   The unique id of the cursor to remove.
   */
  public removeCursor(id: string): void {
    const remoteCursorWidget = this._getCursor(id);
    if (!remoteCursorWidget.isDisposed()) {
      remoteCursorWidget.dispose();
    }
    this._cursorWidgets.delete(id);
  }

  public removeAllCursors(): void {
    this._cursorWidgets.forEach((cursor: RemoteCursorWidget): void => {
      if (!cursor.isDisposed()) {
        cursor.dispose();
      }
    });

    this._cursorWidgets.clear();
  }

  /**
   * Updates the location of the specified remote cursor using a Monaco
   * IPosition object..
   *
   * @param id
   *   The unique id of the cursor to remove.
   * @param position
   *   The location of the cursor to set.
   */
  public setCursorPosition(id: string, position: IPosition): void {
    const remoteCursorWidget = this._getCursor(id);
    remoteCursorWidget.setPosition(position);
  }

  /**
   * Updates the location of the specified remote cursor based on a zero-based
   * text offset.
   *
   * @param id
   *   The unique id of the cursor to remove.
   * @param offset
   *   The location of the cursor to set.
   */
  public setCursorOffset(id: string, offset: number): void {
    const remoteCursorWidget = this._getCursor(id);
    remoteCursorWidget.setOffset(offset);
  }

  /**
   * Shows the specified cursor. Note the cursor may be scrolled out of view.
   *
   * @param id
   *   The unique id of the cursor to show.
   */
  public showCursor(id: string): void {
    const remoteCursorWidget = this._getCursor(id);
    remoteCursorWidget.show();
  }

  /**
   * Hides the specified cursor.
   *
   * @param id
   *   The unique id of the cursor to show.
   */
  public hideCursor(id: string): void {
    const remoteCursorWidget = this._getCursor(id);
    remoteCursorWidget.hide();
  }

  /**
   * A helper method that gets a cursor by id, or throws an exception.
   * @internal
   */
  private _getCursor(id: string): RemoteCursorWidget {
    if (!this._cursorWidgets.has(id)) {
      throw new Error(`No such cursor: ${id}`);
    }

    return this._cursorWidgets.get(id);
  }
}

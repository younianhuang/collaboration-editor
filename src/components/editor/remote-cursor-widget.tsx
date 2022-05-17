import { editor, IPosition } from 'monaco-editor/esm/vs/editor/editor.api';

export default class RemoteCursorWidget implements editor.IContentWidget {
  private readonly _id: string;

  private readonly _editor: editor.ICodeEditor;

  private readonly _domNode: HTMLDivElement;

  private readonly _tooltipNode: HTMLDivElement | null;

  private readonly _tooltipDuration: number;

  // private _hideTimer: any;

  private _position: editor.IContentWidgetPosition | null;

  private _offset: number;

  private _disposed: boolean;

  constructor(
    codeEditor: editor.ICodeEditor,
    widgetId: string,
    color: string,
    label: string,
  ) {
    this._editor = codeEditor;
    this._tooltipDuration = 2;
    this._id = `monaco-remote-cursor-${widgetId}`;

    // Create the main node for the cursor element.
    // const lineHeight = this._editor.getOption(editor.EditorOption.lineHeight);

    this._domNode = document.createElement('div');
    this._domNode.className = 'monaco-remote-cursor';
    this._domNode.style.background = color;
    // this._domNode.style.height = `${lineHeight}px`;
    this._domNode.style.height = `20px`;
    this._domNode.style.width = '2px';
    // Create the tooltip element if the tooltip is enabled.
    /*
    this._tooltipNode = document.createElement('div');
    this._tooltipNode.className = 'monaco-remote-cursor-tooltip';
    this._tooltipNode.style.background = color;
    this._tooltipNode.innerHTML = label;
    this._domNode.appendChild(this._tooltipNode);
*/
    this._tooltipNode = null;

    this._editor.addContentWidget(this);

    this._offset = -1;

    this._disposed = false;
  }

  public getId(): string {
    return this._id;
  }

  public getDomNode(): HTMLElement {
    return this._domNode;
  }

  public getPosition(): editor.IContentWidgetPosition | null {
    return this._position;
  }

  public hide(): void {
    this._domNode.style.display = 'none';
  }

  public show(): void {
    this._domNode.style.display = 'inherit';
  }

  public setOffset(offset: number): void {
    const position = this._editor.getModel().getPositionAt(offset);
    this.setPosition(position);
  }

  public setPosition(position: IPosition): void {
    this._updatePosition(position);
    /*
    if (this._tooltipNode !== null) {
      setTimeout(() => this._showTooltip(), 0);
    }
*/
  }

  public dispose(): void {
    if (this._disposed) {
      return;
    }

    this._editor.removeContentWidget(this);

    this._disposed = true;
  }

  public isDisposed(): boolean {
    return this._disposed;
  }

  private _updatePosition(position: IPosition): void {
    this._position = {
      position: { ...position },
      preference: [editor.ContentWidgetPositionPreference.EXACT],
    };

    this._offset = this._editor.getModel().getOffsetAt(position);

    this._editor.layoutContentWidget(this);
  }

  /*
  private _showTooltip(): void {
    // this._updateTooltipPosition();

    if (this._hideTimer !== null) {
      clearTimeout(this._hideTimer);
    } else {
      this._setTooltipVisible(true);
    }

    this._hideTimer = setTimeout(() => {
      this._setTooltipVisible(false);
      this._hideTimer = null;
    }, this._tooltipDuration);
  }
*/
  private _updateTooltipPosition(): void {
    const distanceFromTop =
      this._domNode.offsetTop - this._editor.getScrollTop();
    if (distanceFromTop - this._tooltipNode.offsetHeight < 5) {
      this._tooltipNode.style.top = `${this._tooltipNode.offsetHeight + 2}px`;
    } else {
      this._tooltipNode.style.top = `-${this._tooltipNode.offsetHeight}px`;
    }

    this._tooltipNode.style.left = '0';
  }

  private _setTooltipVisible(visible: boolean): void {
    if (visible) {
      this._tooltipNode.style.opacity = '1.0';
    } else {
      this._tooltipNode.style.opacity = '0';
    }
  }
  /*
  private _onInsert = (index: number, text: string) => {
    if (this._position === null) {
      return;
    }

    const offset = this._offset;
    if (index <= offset) {
      const newOffset = offset + text.length;
      const position = this._editor.getModel().getPositionAt(newOffset);
      this._updatePosition(position);
    }
  };

  private _onReplace = (index: number, length: number, text: string) => {
    if (this._position === null) {
      return;
    }

    const offset = this._offset;
    if (index <= offset) {
      const newOffset = offset - Math.min(offset - index, length) + text.length;
      const position = this._editor.getModel().getPositionAt(newOffset);
      this._updatePosition(position);
    }
  };

  private _onDelete = (index: number, length: number) => {
    if (this._position === null) {
      return;
    }

    const offset = this._offset;
    if (index <= offset) {
      const newOffset = offset - Math.min(offset - index, length);
      const position = this._editor.getModel().getPositionAt(newOffset);
      this._updatePosition(position);
    }
  };
  */
}

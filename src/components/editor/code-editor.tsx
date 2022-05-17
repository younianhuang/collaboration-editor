import React from 'react';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {
  RealTimeModel,
  RealTimeString,
  IConvergenceEvent,
  StringInsertEvent,
  StringRemoveEvent,
  RemoteReferenceCreatedEvent,
  IndexReference,
} from '@convergence/convergence';
import { LocalIndexReference } from '@convergence/convergence/typings/model/reference/LocalIndexReference';
import { ColorAssigner } from '@convergence/color-assigner';
import RemoteEditorContent from './remote-editor-content';
import RemoteCursorManager from './remote-cursor-manager';

type CodeEditorProps = {
  defaultValue?: string;
  model: RealTimeModel;
  content: RealTimeString;
  isTerminalOpen: boolean;
};

type CodeEditorState = {
  value?: string;
};

type IModelContentChangedEvent = monaco.editor.IModelContentChangedEvent;
type IModelContentChange = monaco.editor.IModelContentChange;

export default class CodeEditor extends React.Component<
  CodeEditorProps,
  CodeEditorState
> {
  // private _rtContent: RealTimeString;

  private _monacoEditor: monaco.editor.ICodeEditor;

  private _suppress: boolean;

  private _remoteEditorContent: RemoteEditorContent;

  private _localCursor: LocalIndexReference;

  private _remoteCursorManager: RemoteCursorManager;

  private _colorAssigner: ColorAssigner;

  constructor(props: CodeEditorProps) {
    super(props);
    // this._rtContent = null;
    this._monacoEditor = null;
    this._suppress = false;
    this._remoteEditorContent = new RemoteEditorContent();
    this._localCursor = null;
    this._remoteCursorManager = null;
    this._colorAssigner = new ColorAssigner();

    this.state = {
      value: this.props.defaultValue,
    };

    this._handleEditorDidMount = this._handleEditorDidMount.bind(this);
    this._handleLocalEditorContentChanges =
      this._handleLocalEditorContentChanges.bind(this);
    this._handleRemoteContextChange =
      this._handleRemoteContextChange.bind(this);
  }

  componentDidUpdate(
    prevProps: CodeEditorProps,
    prevState: CodeEditorState,
  ): void {
    if (
      prevProps.content !== this.props.content &&
      this.props.content !== null
    ) {
      this._switchModel();
    }
  }

  private _switchModel(): void {
    this._remoteCursorManager.removeAllCursors();

    this._initRemoteEditorContent();
    this._initCursor();

    this.setState({
      value: this.props.content.value(),
    });
  }

  private _initRemoteEditorContent(): void {
    this._remoteEditorContent.bind(this.props.content);
    this._remoteEditorContent.subscribe(this._handleRemoteContextChange);
  }

  private _initCursor(): void {
    // create local cursor reference
    this._localCursor = this.props.content.indexReference('cursor');

    // add current remote cursors
    const references = this.props.content.references({ key: 'cursor' });
    references.forEach(reference => {
      if (!reference.isLocal()) {
        this._addRemoteCursor(reference);
      }
    });

    // share local cursor
    this._setLocalCursorPosition();
    this._localCursor.share();

    // update local cursor position
    this._monacoEditor.onDidChangeCursorPosition(e => {
      this._setLocalCursorPosition();
    });

    // handle new remote cursor created
    this.props.content.on('reference', e => {
      const evt = e as RemoteReferenceCreatedEvent;

      if (evt.reference.key() === 'cursor') {
        this._addRemoteCursor(evt.reference);
      }
    });
  }

  private _addRemoteCursor(reference: IndexReference): void {
    const color = this._colorAssigner.getColorAsHex(reference.sessionId());
    const remoteCursor = this._remoteCursorManager.addCursor(
      reference.sessionId(),
      color,
      reference.user().displayName,
    );

    remoteCursor.setOffset(reference.value());

    reference.on('cleared', () => remoteCursor.hide());
    // reference.on('disposed', () => remoteCursor.dispose());
    reference.on('disposed', () =>
      this._remoteCursorManager.removeCursor(remoteCursor.getId()),
    );
    reference.on('set', () => {
      const cursorIndex = reference.value();
      remoteCursor.setOffset(cursorIndex);
    });
  }

  private _handleLocalEditorContentChanges(
    value: string,
    evt: IModelContentChangedEvent,
  ): void {
    if (!this._suppress) {
      evt.changes.forEach((change: IModelContentChange) => {
        this._handleContentChange(change);
      });
    }
  }

  private _handleContentChange(
    change: monaco.editor.IModelContentChange,
  ): void {
    const { rangeOffset, rangeLength, text } = change;
    if (text.length > 0 && rangeLength === 0) {
      // this._handleInsert(rangeOffset, text);
      this._remoteEditorContent.insert(rangeOffset, text);
    } else if (text.length > 0 && rangeLength > 0) {
      // this._handleReplace(rangeOffset, rangeLength, text);
      this._remoteEditorContent.replace(rangeOffset, rangeLength, text);
    } else if (text.length === 0 && rangeLength > 0) {
      // this._handleDelete(rangeOffset, rangeLength);
      this._remoteEditorContent.delete(rangeOffset, rangeLength);
    } else {
      throw new Error(`Unexpected change: ${JSON.stringify(change)}`);
    }
  }

  private _handleRemoteContextChange(evt: IConvergenceEvent) {
    switch (evt.name) {
      case 'insert':
        {
          const insertEvent = evt as StringInsertEvent;
          this._insert(insertEvent.index, insertEvent.value);
        }
        break;
      case 'remove':
        {
          const removeEvent = evt as StringRemoveEvent;
          this._remove(removeEvent.index, removeEvent.value.length);
        }
        break;
      default:
    }
  }

  private _insert(index: number, text: string) {
    this._suppress = true;
    const position = this._monacoEditor.getModel().getPositionAt(index);
    this._monacoEditor.executeEdits('remote', [
      {
        range: new monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column,
        ),
        text,
        forceMoveMarkers: true,
      },
    ]);

    this._suppress = false;
  }

  private _remove(index: number, length: number) {
    this._suppress = true;
    const start = this._monacoEditor.getModel().getPositionAt(index);
    const end = this._monacoEditor.getModel().getPositionAt(index + length);

    this._monacoEditor.executeEdits('remote', [
      {
        range: new monaco.Range(
          start.lineNumber,
          start.column,
          end.lineNumber,
          end.column,
        ),
        text: '',
        forceMoveMarkers: true,
      },
    ]);

    this._suppress = false;
  }

  private _handleEditorDidMount(editor: monaco.editor.ICodeEditor): void {
    this._monacoEditor = editor;

    this._remoteCursorManager = new RemoteCursorManager(this._monacoEditor);
  }

  private _setLocalCursorPosition(): void {
    const position = this._monacoEditor.getPosition();
    const offset = this._monacoEditor.getModel().getOffsetAt(position);
    this._localCursor.set(offset);
  }

  render(): React.ReactElement {
    let classNameStr = 'w-full';
    if (this.props.isTerminalOpen) {
      classNameStr += ' h-4/5';
    } else {
      classNameStr += ' h-full';
    }

    return (
      <div className={classNameStr}>
        <Editor
          theme="vs-dark"
          height="100%"
          defaultLanguage="javascript"
          value={this.state.value}
          onChange={this._handleLocalEditorContentChanges}
          onMount={this._handleEditorDidMount}
          options={{
            wordWrap: 'on',
            minimap: { enabled: false },
            showUnused: false,
            folding: false,
            lineNumbersMinChars: 3,
            fontSize: 16,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    );
  }
}

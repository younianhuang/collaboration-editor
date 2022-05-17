import React from 'react';
import {
  ModelService,
  RealTimeModel,
  RealTimeString,
} from '@convergence/convergence';
import CodeEditor from './code-editor';
import EditorStore from '../../stores/editor-store';
// import UserActionCreator from '../../actions/user-action-creator';
import Tabs from '../tabs/tabs';

type EditorGroupProps = {
  modelService: ModelService;
  isTerminalOpen: boolean;
  onTerminalClose: () => void;
};

type EditorGroupState = {
  model: RealTimeModel;
  content: RealTimeString;
};

export default class EditorGroup extends React.Component<
  EditorGroupProps,
  EditorGroupState
> {
  private _editorStore: EditorStore;

  constructor(props: EditorGroupProps) {
    super(props);
    this._editorStore = null;
    this.state = {
      model: null,
      content: null,
    };

    this._handleChange = this._handleChange.bind(this);
  }

  componentDidMount(): void {
    if (this.props.modelService !== null) {
      this._editorStore = new EditorStore(this.props.modelService);
    }
  }

  componentDidUpdate(prevProps: EditorGroupProps): void {
    if (prevProps.modelService === null && this.props.modelService !== null) {
      this._editorStore = new EditorStore(this.props.modelService);
      this._editorStore.addChangeListener(this._handleChange);
    }
  }

  componentWillUnmount(): void {
    if (this._editorStore !== null) {
      this._editorStore.dispose();
    }
  }

  private _handleChange() {
    this.setState({
      model: this._editorStore.getModel(),
      content: this._editorStore.getContent(),
    });
  }

  render(): React.ReactElement {
    return (
      <div className="w-4/5">
        <CodeEditor
          defaultValue="///This is a new unsaved file"
          model={this.state.model}
          content={this.state.content}
          isTerminalOpen={this.props.isTerminalOpen}
        />
        {this.props.isTerminalOpen ? (
          <Tabs onTerminalClose={this.props.onTerminalClose} />
        ) : null}
      </div>
    );
  }
}

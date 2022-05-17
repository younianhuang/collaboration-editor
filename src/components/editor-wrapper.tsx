import React from 'react';
import Convergence, {
  ConvergenceDomain,
  ModelService,
} from '@convergence/convergence';
import EditorGroup from './editor/editor-group';
import SideBarArea from './sidebar/sidebar-area';
import StatusBar, { ConnectStatus } from './statusbar/status-bar';
import { DOMAIN_URL } from '../constants/editor-configs';
import MenuBarContainer, { MenuItemType } from './menubar/menubar-container';

import './tailwind.output.css';

type EditorWrapperState = {
  domailUrl: string;
  connectStatus: ConnectStatus;
  domain: ConvergenceDomain;
  modelService: ModelService;
  isTerminalOpen: boolean;
};

export default class EditorWrapper extends React.Component<
  unknown,
  EditorWrapperState
> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      domailUrl: DOMAIN_URL,
      connectStatus: ConnectStatus.Disconnected,
      domain: null,
      modelService: null,
      isTerminalOpen: false,
    };
    this._handleConnected = this._handleConnected.bind(this);
    this.handleOpenTerminal = this.handleOpenTerminal.bind(this);
    this.handleCloseTerminal = this.handleCloseTerminal.bind(this);
  }

  componentDidMount(): void {
    console.log('Connect to Convergence');

    const username = `user${Math.floor(Math.random() * 1000)}`;
    Convergence.connectAnonymously(DOMAIN_URL, username)
      .then(this._handleConnected)
      .catch(error => {
        console.log(`Could not connect: ${error}`);
      });

    this.setState({
      connectStatus: ConnectStatus.Connecting,
    });
  }

  componentWillUnmount(): void {
    if (this.state.domain !== null) {
      this.state.domain.dispose();
    }
  }

  handleOpenTerminal(): void {
    this.setState({ isTerminalOpen: true });
  }

  handleCloseTerminal(): void {
    this.setState({ isTerminalOpen: false });
  }

  private _handleConnected(domain: ConvergenceDomain): void {
    console.log('Success to connect to Convergence.');

    this.setState({
      domain,
      modelService: domain.models(),
      connectStatus: ConnectStatus.Connected,
    });
  }

  render(): React.ReactElement {
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <MenuBarContainer terminalCB={this.handleOpenTerminal} />
        <div className="flex-grow flex w-full">
          <SideBarArea modelService={this.state.modelService} />
          <EditorGroup
            modelService={this.state.modelService}
            isTerminalOpen={this.state.isTerminalOpen}
            onTerminalClose={this.handleCloseTerminal}
          />
        </div>
        <div className="flex-none">
          <StatusBar
            doman={this.state.domailUrl}
            connectStatus={this.state.connectStatus}
          />
        </div>
      </div>
    );
  }
}

import React from 'react';

export enum ConnectStatus {
  Disconnected,
  Connecting,
  Connected,
}

export type StatusBarProps = {
  doman?: string;
  connectStatus?: ConnectStatus;
};

export default class StatusBar extends React.Component<StatusBarProps> {
  /*
  constructor(props: StatusBarProps) {
    super(props);
  }
*/
  render(): React.ReactElement {
    return (
      <div className="bg-blue-400 text-white">
        <div>
          <span className="ml-6">Domain:{this.props.doman}</span>
          <span className="ml-6">
            {ConnectStatus[this.props.connectStatus]}
          </span>
        </div>
      </div>
    );
  }
}

import React from 'react';
// import { TabType } from './tabs';

type TabListProps = {
  onTerminalClose: () => void;
};

class TabList extends React.Component<TabListProps, unknown> {
  render(): JSX.Element {
    return (
      <div className="flex justify-between">
        <ul>{this.props.children}</ul>
        <button
          type="button"
          className="text-white focus:outline-none text-sm p-1 hover:bg-gray-500"
          onClick={this.props.onTerminalClose}
        >
          X
        </button>
      </div>
    );
  }
}

export default TabList;

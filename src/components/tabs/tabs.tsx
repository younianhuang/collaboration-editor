import React from 'react';
import TabList from './tab-list';
import Tab from './tab';
import TabContent from './tab-content';

export enum TabType {
  Output,
  Terminal,
}

type TabsProps = {
  onTerminalClose: () => void;
};

type TabsState = {
  selectedTabIndex: number;
};

class Tabs extends React.Component<TabsProps, TabsState> {
  constructor(props: TabsProps) {
    super(props);
    this.state = {
      selectedTabIndex: 0,
    };

    this.onTabClicked = this.onTabClicked.bind(this);
  }

  onTabClicked(index: number): void {
    this.setState({ selectedTabIndex: index });
  }

  render(): JSX.Element {
    return (
      <div className="h-full bg-black border-t border-gray-500">
        <TabList onTerminalClose={this.props.onTerminalClose}>
          <Tab
            clickCB={this.onTabClicked}
            isSelected={this.state.selectedTabIndex === 0}
            index={0}
          >
            Output
          </Tab>
          <Tab
            clickCB={this.onTabClicked}
            isSelected={this.state.selectedTabIndex === 1}
            index={1}
          >
            Terminal
          </Tab>
        </TabList>

        <TabContent index={0} isShow={this.state.selectedTabIndex === 0}>
          <p>content of Output</p>
        </TabContent>
        <TabContent index={1} isShow={this.state.selectedTabIndex === 1}>
          <p>content of Terminal</p>
        </TabContent>
      </div>
    );
  }
}

export default Tabs;

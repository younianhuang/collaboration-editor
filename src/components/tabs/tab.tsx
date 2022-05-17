import React from 'react';
import { TabType } from './tabs';

type TabProps = {
  clickCB: (param: TabType) => void;
  isSelected: boolean;
  index: number;
};

class Tab extends React.Component<TabProps, unknown> {
  constructor(props: TabProps) {
    super(props);

    this.onMouseClicked = this.onMouseClicked.bind(this);
  }

  onMouseClicked(e: React.MouseEvent): void {
    e.nativeEvent.stopImmediatePropagation();
    this.props.clickCB(this.props.index);
  }

  render(): JSX.Element {
    let classNameStr;
    if (this.props.isSelected) {
      classNameStr =
        'inline-block px-2 py-1 select-none text-white border-white border-b';
    } else {
      classNameStr =
        'inline-block px-2 py-1 select-none text-gray-500 border-0';
    }
    return (
      <li
        className={classNameStr}
        onClick={this.onMouseClicked}
        onKeyDown={() => 0}
        role="tab"
      >
        {this.props.children}
      </li>
    );
  }
}

export default Tab;

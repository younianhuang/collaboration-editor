import React from 'react';
import { defaultTabIndex } from './menubar-container';

type MenuBarRemainderProps = {
  clickCB: () => void;
};

class MenuBarRemainder extends React.Component<MenuBarRemainderProps, unknown> {
  constructor(props: MenuBarRemainderProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: React.MouseEvent): void {
    e.nativeEvent.stopImmediatePropagation();
    this.props.clickCB();
  }

  render(): JSX.Element {
    return (
      <div
        tabIndex={defaultTabIndex}
        className="bg-yellow-100 w-full flex justify-end items-center"
        onClick={e => this.handleClick(e)}
        onKeyDown={() => 0}
        role="menuitem"
      >
        <a
          className="px-2 text-sm"
          href="https://www.pinterest.com"
          target="_blank"
          rel="noreferrer"
        >
          User
        </a>
      </div>
    );
  }
}

export default MenuBarRemainder;

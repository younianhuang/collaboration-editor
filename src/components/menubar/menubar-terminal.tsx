import React from 'react';
import {
  MenuGroupType,
  MenuItemType,
  MenuBGColors,
  defaultTabIndex,
} from './menubar-container';
import MenuBarItem from './menubar-menu-item';

type MenuBarTerminalProps = {
  queryCB: (menuItemType: MenuItemType) => (param: unknown) => void;
  clickCB: () => void;
  selectedCB: (selectedGroup: MenuGroupType) => void;
  isMenuOpen: boolean;
  selectedGroup: MenuGroupType;
};

type MenuItemState = {
  myGroupType: MenuGroupType;
  isHover: boolean;
};

class MenuBarTerminal extends React.Component<
  MenuBarTerminalProps,
  MenuItemState
> {
  constructor(props: MenuBarTerminalProps) {
    super(props);

    this.state = {
      myGroupType: MenuGroupType.Terminal,
      isHover: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  handleClick(e: React.MouseEvent): void {
    e.nativeEvent.stopImmediatePropagation();
    this.props.clickCB();
  }

  onMouseOver(): void {
    this.props.selectedCB(this.state.myGroupType);
    this.setState({ isHover: true });
  }

  onMouseOut(): void {
    this.setState({ isHover: false });
  }

  render(): JSX.Element {
    let groupClassStr = 'px-2 cursor-default select-none';
    if (this.props.isMenuOpen) {
      if (this.props.selectedGroup === this.state.myGroupType) {
        groupClassStr += MenuBGColors.opened;
      }
    } else if (this.state.isHover) {
      groupClassStr += MenuBGColors.hovered;
    }

    let itemsClassStr;
    const baseItemsClassStr = `absolute flex flex-col z-40 ${MenuBGColors.opened}`;
    this.props.isMenuOpen && this.props.selectedGroup === this.state.myGroupType
      ? (itemsClassStr = `${baseItemsClassStr} block`)
      : (itemsClassStr = `${baseItemsClassStr} hidden`);

    return (
      <div>
        <div
          tabIndex={defaultTabIndex}
          className={groupClassStr}
          onClick={e => this.handleClick(e)}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
          onFocus={() => 0}
          onBlur={() => 0}
          onKeyDown={() => 0}
          role="menuitem"
        >
          Terminal
        </div>
        <div className={itemsClassStr}>
          <MenuBarItem
            queryCB={this.props.queryCB}
            type={MenuItemType.NewTerminal}
            description="New Terminal"
            hotkey=""
            link=""
            isEnabled
          />
        </div>
      </div>
    );
  }
}

export default MenuBarTerminal;

import React from 'react';
import {
  MenuItemType,
  MenuBGColors,
  defaultTabIndex,
} from './menubar-container';

type MenuSubMenuProps = {
  description: string;
  // queryCB: (menuItemType: MenuItemType) => (param: any) => void;
};

type MenuSubMenuState = {
  isHover: boolean;
};

class MenuBarSubMenu extends React.Component<
  MenuSubMenuProps,
  MenuSubMenuState
> {
  constructor(props: MenuSubMenuProps) {
    super(props);
    this.state = {
      isHover: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  handleClick(e: React.MouseEvent): void {
    e.nativeEvent.stopImmediatePropagation();
  }

  onMouseOver(): void {
    this.setState({ isHover: true });
  }

  onMouseOut(): void {
    this.setState({ isHover: false });
  }

  render(): JSX.Element {
    let subMenuClassStr;
    const baseSubMenuClassStr = 'flex flex-row justify-between relative ';
    this.state.isHover
      ? (subMenuClassStr = baseSubMenuClassStr + MenuBGColors.hovered)
      : (subMenuClassStr = baseSubMenuClassStr);

    let menuContentClassStr;
    const baseMenuContentClassStr = `absolute left-full flex flex-col ${MenuBGColors.opened}`;
    this.state.isHover
      ? (menuContentClassStr = baseMenuContentClassStr)
      : (menuContentClassStr = `${baseMenuContentClassStr} hidden`);

    return (
      <div
        tabIndex={defaultTabIndex}
        className={subMenuClassStr}
        onClick={e => this.handleClick(e)}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onFocus={() => 0}
        onBlur={() => 0}
        onKeyDown={() => 0}
        role="menuitem"
      >
        <p className="pl-2 whitespace-nowrap cursor-default select-none">
          {this.props.description}
        </p>
        <p className="w-10" />
        <p className="pr-2 cursor-default select-none">&gt;</p>
        <div className={menuContentClassStr}>{this.props.children}</div>
      </div>
    );
  }
}

export default MenuBarSubMenu;

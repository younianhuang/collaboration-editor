import React from 'react';
import {
  MenuItemType,
  MenuBGColors,
  MenuTextColors,
  defaultTabIndex,
} from './menubar-container';

type MenuItemProps = {
  queryCB: (menuItemType: MenuItemType) => (param: unknown) => void;
  type: MenuItemType;
  description: string;
  hotkey: string;
  link: string;
  isEnabled: boolean;
};

type MenuItemState = {
  isHover: boolean;
};

class MenuBarItem extends React.Component<MenuItemProps, MenuItemState> {
  constructor(props: MenuItemProps) {
    super(props);
    this.state = {
      isHover: false,
    };

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseClicked = this.onMouseClicked.bind(this);
  }

  onMouseOver(): void {
    this.setState({ isHover: true });
  }

  onMouseOut(): void {
    this.setState({ isHover: false });
  }

  onMouseClicked(e: React.MouseEvent): void {
    e.nativeEvent.stopImmediatePropagation();
    if (this.props.isEnabled) {
      const isLink = this.props.link !== '';
      if (isLink) {
        this.props.queryCB(this.props.type)(this.props.link);
      } else {
        this.props.queryCB(this.props.type)('');
      }
    }
  }

  render(): JSX.Element {
    let itemClassStr;
    const isLink = this.props.link !== ''; // check format needed?
    if (isLink) {
      itemClassStr = 'px-2';
    } else {
      itemClassStr = 'flex flex-row justify-between';
    }

    if (this.props.isEnabled) {
      if (this.state.isHover) {
        itemClassStr += MenuBGColors.hovered;
      }
    } else {
      itemClassStr += MenuTextColors.disabled;
    }

    return (
      <div
        tabIndex={defaultTabIndex}
        className={itemClassStr}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onClick={e => this.onMouseClicked(e)}
        onFocus={() => 0}
        onBlur={() => 0}
        onKeyDown={() => 0}
        role="menuitem"
      >
        <p className="pl-2 whitespace-nowrap cursor-default select-none">
          {this.props.description}
        </p>
        <p className="w-10" />
        <p className="pr-2 whitespace-nowrap cursor-default select-none">
          {this.props.hotkey}
        </p>
      </div>
    );
  }
}

export default MenuBarItem;

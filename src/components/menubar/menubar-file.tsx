import React from 'react';
import {
  MenuGroupType,
  MenuItemType,
  MenuBGColors,
  defaultTabIndex,
} from './menubar-container';
// import MenuBarFileNewFile from './menubar-file-new-file';
// import MenuBarFileNewFolder from './menubar-file-new-folder';
import MenuBarItem from './menubar-menu-item';
import MenuBarSubMenu from './menubar-submenu';
import NodeTreeStore from '../../ruducers/methods/node-tree';

type MenuBarFileProps = {
  queryCB: (menuItemType: MenuItemType) => (param: unknown) => void;
  clickCB: () => void;
  selectedCB: (selectedGroup: MenuGroupType) => void;
  isMenuOpen: boolean;
  selectedGroup: MenuGroupType;
};

type MenuItemState = {
  myGroupType: MenuGroupType;
  isHover: boolean;
  focusNodeId: string;
};

class MenuBarFile extends React.Component<MenuBarFileProps, MenuItemState> {
  constructor(props: MenuBarFileProps) {
    super(props);

    this.state = {
      myGroupType: MenuGroupType.File,
      isHover: false,
      focusNodeId: 'root',
    };

    this.handleClick = this.handleClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  handleClick(e: React.MouseEvent): void {
    e.nativeEvent.stopImmediatePropagation();
    this.props.clickCB();
    this.setState({ focusNodeId: NodeTreeStore.getFocusNodeID() });
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
          File
        </div>
        <div className={itemsClassStr}>
          <MenuBarSubMenu description="Create New">
            <MenuBarItem
              queryCB={this.props.queryCB}
              type={MenuItemType.NewFile}
              description="New File"
              hotkey="Ctrl+N"
              link=""
              isEnabled
            />
            <MenuBarItem
              queryCB={this.props.queryCB}
              type={MenuItemType.NewFolder}
              description="New Folder"
              hotkey=""
              link=""
              isEnabled
            />
          </MenuBarSubMenu>
          <MenuBarItem
            queryCB={this.props.queryCB}
            type={MenuItemType.Rename}
            description="Rename"
            hotkey=""
            link=""
            isEnabled={
              this.state.focusNodeId && this.state.focusNodeId !== 'root'
            }
          />
          <MenuBarItem
            queryCB={this.props.queryCB}
            type={MenuItemType.Delete}
            description="Delete"
            hotkey=""
            link=""
            isEnabled={
              this.state.focusNodeId && this.state.focusNodeId !== 'root'
            }
          />
        </div>
      </div>
    );
  }
}

export default MenuBarFile;

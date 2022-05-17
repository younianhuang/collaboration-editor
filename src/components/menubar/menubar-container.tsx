import React from 'react';
import UserActionCreator from '../../ruducers/user-action-creator';
import MenuBarFile from './menubar-file';
import MenuBarTerminal from './menubar-terminal';
import MenuBarHelp from './menubar-help';
import MenuBarRemainder from './menubar-remainder';

export const MenuBGColors = {
  unHovered: ' bg-yellow-100',
  hovered: ' bg-green-100',
  opened: ' bg-blue-100',
};

export const MenuTextColors = {
  normal: ' text-black',
  disabled: ' text-gray-400',
};

export const defaultTabIndex = 0;

export enum MenuGroupType {
  None = -1,
  File = 0,
  Terminal,
  Help,
  Remainder,
}

export enum MenuItemType {
  SubMenu = -1,
  NewFile = 0,
  NewFolder,
  Rename,
  Delete,
  NewTerminal,
  UserManual,
  Tutorials,
}

type MenuBarContainerProps = {
  terminalCB: () => void;
};

type MenuBarContainerState = {
  isMenuOpen: boolean;
  selectedGroup: MenuGroupType;
};

class MenuBarContainer extends React.Component<
  MenuBarContainerProps,
  MenuBarContainerState
> {
  constructor(props: MenuBarContainerProps) {
    super(props);
    this.state = {
      isMenuOpen: false,
      selectedGroup: MenuGroupType.None,
    };

    this.onMenuGroupClicked = this.onMenuGroupClicked.bind(this);
    this.onMenuGroupSelected = this.onMenuGroupSelected.bind(this);

    this.onNewFileClicked = this.onNewFileClicked.bind(this);
    this.onNewFolderClicked = this.onNewFolderClicked.bind(this);
    this.onRenameClicked = this.onRenameClicked.bind(this);
    this.onDeleteClicked = this.onDeleteClicked.bind(this);
    this.onNewTerminalClicked = this.onNewTerminalClicked.bind(this);
    this.onUserManualClicked = this.onUserManualClicked.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.queryCallback = this.queryCallback.bind(this);
  }

  onMenuGroupClicked(): void {
    this.setState(prevState => ({ isMenuOpen: !prevState.isMenuOpen }));
  }

  onMenuGroupSelected(groupType: MenuGroupType): void {
    this.setState({ selectedGroup: groupType });
  }

  onNewFileClicked(): void {
    this.setState({ isMenuOpen: false });
    UserActionCreator.createFileFromMenu();
  }

  onNewFolderClicked(): void {
    this.setState({ isMenuOpen: false });
    UserActionCreator.createFolderFromMenu();
  }

  onRenameClicked(): void {
    this.setState({ isMenuOpen: false });
    UserActionCreator.renameFromMenu();
  }

  onDeleteClicked(): void {
    this.setState({ isMenuOpen: false });
    UserActionCreator.deleteFromMenu();
  }

  onNewTerminalClicked(): void {
    this.setState({ isMenuOpen: false });
    this.props.terminalCB();
  }

  onUserManualClicked(link: unknown): void {
    window.open(link as string);
    this.setState({ isMenuOpen: false });
  }

  closeMenu(): void {
    this.setState({ isMenuOpen: false });
  }

  queryCallback(menuItemType: MenuItemType): (param: unknown) => void {
    if (menuItemType === MenuItemType.NewFile) {
      return this.onNewFileClicked;
    }
    if (menuItemType === MenuItemType.NewFolder) {
      return this.onNewFolderClicked;
    }
    if (menuItemType === MenuItemType.Rename) {
      return this.onRenameClicked;
    }
    if (menuItemType === MenuItemType.Delete) {
      return this.onDeleteClicked;
    }
    if (menuItemType === MenuItemType.NewTerminal) {
      return this.onNewTerminalClicked;
    }
    if (menuItemType === MenuItemType.UserManual) {
      return this.onUserManualClicked;
    }

    return this.closeMenu;
  }

  render(): JSX.Element {
    const classNameStr = `flex flex-row justify-start ${MenuBGColors.unHovered}`;
    return (
      <div className={classNameStr}>
        <MenuBarFile
          queryCB={this.queryCallback}
          clickCB={this.onMenuGroupClicked}
          selectedCB={this.onMenuGroupSelected}
          isMenuOpen={this.state.isMenuOpen}
          selectedGroup={this.state.selectedGroup}
        />
        <MenuBarTerminal
          queryCB={this.queryCallback}
          clickCB={this.onMenuGroupClicked}
          selectedCB={this.onMenuGroupSelected}
          isMenuOpen={this.state.isMenuOpen}
          selectedGroup={this.state.selectedGroup}
        />
        <MenuBarHelp
          queryCB={this.queryCallback}
          clickCB={this.onMenuGroupClicked}
          selectedCB={this.onMenuGroupSelected}
          isMenuOpen={this.state.isMenuOpen}
          selectedGroup={this.state.selectedGroup}
        />
        <MenuBarRemainder clickCB={this.closeMenu} />
      </div>
    );
  }
}

export default MenuBarContainer;

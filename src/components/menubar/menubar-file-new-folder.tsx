import React from 'react';
import { MenuItemType } from './menubar-container';

type FileNewFolderProps = {
  queryCB: (menuItemType: MenuItemType) => (param: any) => void;
};

type FileNewFolderState = {
  isHover: boolean;
};

class MenuBarFileNewFolder extends React.Component<
  FileNewFolderProps,
  FileNewFolderState
> {
  constructor(props: FileNewFolderProps) {
    super(props);
    this.state = {
      isHover: false,
    };

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  onMouseOver() {
    this.setState({ isHover: true });
  }

  onMouseOut() {
    this.setState({ isHover: false });
  }

  render() {
    let itemClassStr;
    const baseItemClassStr = 'flex flex-row justify-between';
    this.state.isHover
      ? (itemClassStr = `${baseItemClassStr} bg-green-100`)
      : (itemClassStr = baseItemClassStr);

    const idx = 2;

    return (
      <div
        tabIndex={idx}
        className={itemClassStr}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onClick={this.props.queryCB(MenuItemType.NewFolder)}
        onFocus={() => 0}
        onBlur={() => 0}
        onKeyDown={() => 0}
        role="menuitem"
      >
        <p className="pl-2 whitespace-nowrap">New Folder</p>
        <p className="w-10" />
        <p className="pr-2 whitespace-nowrap">Ctrl+F</p>
      </div>
    );
  }
}

export default MenuBarFileNewFolder;

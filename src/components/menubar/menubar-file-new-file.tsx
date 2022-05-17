import React from 'react';
import { MenuItemType } from './menubar-container';

type FileNewFileProps = {
  // newFileClicked: () => void;
  queryCB: (menuItemType: number) => (param: any) => void;
};

type FileNewFileState = {
  isHover: boolean;
};

class MenuBarFileNewFile extends React.Component<
  FileNewFileProps,
  FileNewFileState
> {
  constructor(props: FileNewFileProps) {
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

    const idx = 1;

    return (
      <div
        tabIndex={idx}
        className={itemClassStr}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        // onClick={this.props.newFileClicked}
        onClick={this.props.queryCB(MenuItemType.NewFile)}
        onFocus={() => 0}
        onBlur={() => 0}
        onKeyDown={() => 0}
        role="menuitem"
      >
        <p className="pl-2 whitespace-nowrap">New File</p>
        <p className="w-10" />
        <p className="pr-2 whitespace-nowrap">Ctrl+N</p>
      </div>
    );
  }
}

export default MenuBarFileNewFile;

import React from 'react';

type CustomMenuOpt = {
  name: string;
  isEnabled: boolean;
};

type StateProps = {
  posx: number;
  posy: number;
  opsions: CustomMenuOpt[];
  onClickMenu: (str: string) => void;
};

export default class SideBarContexMenu extends React.Component<StateProps> {
  constructor(props: StateProps) {
    super(props);
    this._onClickMouseLeft = this._onClickMouseLeft.bind(this);
  }

  componentDidMount(): void {
    // 加入左鍵點擊操作監聽。
    document.addEventListener('click', this._onClickMouseLeft);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this._onClickMouseLeft);
  }

  private _onClickMouseLeft(event: MouseEvent): void {
    const element: HTMLDivElement = event.target as HTMLDivElement;

    for (let index = 0; index < this.props.opsions.length; index += 1) {
      if (this.props.opsions[index].name === element.id) {
        if (!this.props.opsions[index].isEnabled) {
          return;
        }
      }
    }
    this.props.onClickMenu(element.id);
  }

  render(): React.ReactElement {
    const myStyle = {
      // borderRadius: 4,
      top: `${this.props.posy}px`,
      left: `${this.props.posx}px`,
    };

    return (
      <div
        className="bg-white absolute boder border-solid border-gray-500 w-1/6 z-50 select-none"
        custom-area="customContext"
        id="customcontext"
        style={myStyle}
      >
        {this.props.opsions.map(arr => {
          if (arr.isEnabled) {
            return (
              <div
                className="p-2 hover:bg-gray-400 hover:text-white select-none"
                custom-area="customContext"
                key={arr.name}
                id={arr.name}
              >
                {arr.name}
              </div>
            );
          }
          return (
            <div
              className="p-2 text-gray-400 select-none"
              custom-area="customContext"
              key={arr.name}
              id={arr.name}
            >
              {arr.name}
            </div>
          );
        })}
      </div>
    );
  }
}

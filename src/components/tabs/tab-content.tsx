import React from 'react';

type TabContentProps = {
  index: number;
  isShow: boolean;
};

class TabContent extends React.Component<TabContentProps, unknown> {
  render(): JSX.Element {
    return (
      <div className="text-white bg-black">
        {this.props.isShow ? this.props.children : null}
      </div>
    );
  }
}

export default TabContent;

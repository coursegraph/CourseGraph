import * as React from 'react';

interface IProps {
  name: string;
  enthusiasmLevel?: number;
}

export class Hello extends React.Component<IProps, object> {
  public render(): JSX.Element {
    const { name, enthusiasmLevel = 1 } = this.props;

    if (enthusiasmLevel <= 0) {
      throw new Error('You could be a little more enthusiastic. :D');
    }

    return (
      <div className='hello'>
        <div className='greeting'>
          Hello {name + getExclamationMarks(enthusiasmLevel)}
        </div>
      </div>
    );
  }
}

function getExclamationMarks(numChars: number): string {
  return Array(numChars + 1).join('!');
}

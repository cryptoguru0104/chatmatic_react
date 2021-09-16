import React from 'react';

import { Block } from '../../Layout';

export default function ProgressCircle({ perc }) {
    return (
        <Block className={`c100 p${perc} center`}>
            {/* <span>{perc}%</span> */}
            <Block className="slice">
                <Block className="bar"></Block>
                <Block className="fill"></Block>
            </Block>
        </Block>
    );
}

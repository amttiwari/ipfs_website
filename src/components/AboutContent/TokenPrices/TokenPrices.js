import React from 'react';

import Aux from '../../../hoc/Auxi/Auxi';
import classes from './TokenPrices.module.css';

const tokenPrices = (props) => {

    const tokens = Object.keys(props.tokens);

    const token_table = () => {
        let html = [];
        for (let i in tokens) {

            let color = props.price_change[tokens[i]] > 0 ? classes.green : classes.red;

           html.push(
            <tr key={tokens[i]}>
                <td className={classes.capitalize}>{tokens[i]}</td>
                <td>${props.tokens[tokens[i]]}</td>
                <td className={color}>{props.price_change[tokens[i]]}%</td>
            </tr>);
        }
        return html;
    };


    return (
        <Aux>
            <div className={classes.main}>

            <div className={classes.table_header}>
                <table className="bp3-html-table .modifier">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th style={{textAlign: 'end'}}>Last Price</th>
                            <th style={{textAlign: 'end'}}>24h Change</th>
                        </tr>
                    </thead>
                </table>
            </div>

            <div className={classes.table_body}>
                <table className="bp3-html-table .modifier">
                    <tbody>
                        {token_table()}
                    </tbody>
                </table>
            </div>

            </div>

        </Aux>
    )
};

export default tokenPrices;
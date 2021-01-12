import React from 'react';
import { HTMLTable } from '@blueprintjs/core';
import Loader from './Loader';
import classes from './Table.module.css';

const highlightRowColors = {
	green: 'rgba(15, 153, 96, .2)',
	red: 'rgba(219, 55, 55, .2)'
};

const calculateHighlightRow = (handler, data, color) => {
	if (!handler) return {};
	// const value = handler(data);
	const value = Math.ceil(Math.random() * 50) + 50;
	const colorValue = highlightRowColors?.[color] || highlightRowColors.green;
	return {
		backgroundImage: `linear-gradient(90deg, transparent ${value}%, ${colorValue} 50%)`
	};
};

const Table = ({ headers, data, onClick, highlightRow, highlightRowColor, loading }) => {
	const isInteractive = onClick !== undefined;
	const styles = [];
	headers.forEach(({ align }) => {
		styles.push({
			textAlign: align || 'left'
		});
	});

	return (
		<div className={classes.tableContainer}>
			<HTMLTable bordered condensed interactive={isInteractive}>
				<thead>
					<tr>
						{headers.map(({ text }, index) => {
							return (
								<th key={text} style={styles[index]}>
									{text}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{!loading &&
						<>
						{data.map((rows, index) => {
							return (
								<tr
									key={index}
									onClick={isInteractive ? () => onClick(index) : null}
									style={calculateHighlightRow(highlightRow, rows, highlightRowColor)}
								>
									{rows.map((row, index) => {
										return (
											<td key={index} style={styles[index]}>
												{row}
											</td>
										);
									})}
								</tr>
							);
						})}
					</>
					}
				</tbody>
			</HTMLTable>
			{loading && (
				<div style={{ marginTop: 25 }}>
					<Loader />
				</div>
			)}
		</div>
	);
};

export default Table;

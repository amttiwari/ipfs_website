import React from 'react';
import { createChart } from 'lightweight-charts';
import classes from './TradingViewChart.module.css';

const TradingViewChart = ({ data }) => {
  const divRef = React.useRef();
  const chartRef = React.useRef();
  const dataRef = React.useRef();

  React.useEffect(() => {
    chartRef.current = createChart(divRef.current, {
      width: divRef.current.clientWidth,
      height: 400
    });
    dataRef.current = chartRef.current.addLineSeries();
    updateChart(data);

    const resizeObserver = new ResizeObserver(() => {
      chartRef.current.timeScale().fitContent();
      chartRef.current.applyOptions({
        width: divRef?.current?.clientWidth,
        height: 400
      });
    });

    resizeObserver.observe(divRef.current);

    const tmp = divRef.current;
    return () => {
      resizeObserver.unobserve(tmp);
    };
  }, []);

  React.useEffect(() => {
    updateChart(data);
  }, [data]);

  const updateChart = (data) => {
    dataRef.current.setData(data || []);
    chartRef.current.timeScale().fitContent();
  };

  return (
    <div className={classes.tradingViewChart}>
      <div ref={divRef} style={{ width: '100%' }} />
    </div>
  );
};

export default TradingViewChart;

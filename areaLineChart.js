const renderLineChart = () => {
  const width = 900;
  const height = 400;
  const margin = 60;
  const chartWidth = width - margin * 2;
  const chartHeight = height - margin * 2;

  const svg = d3.select('.container2').append('svg').attr('width', width).attr('height', height);
  const chart = svg.append('g').attr('class', 'chart').attr('transform', `translate(${margin},${margin})`);
  const axesGroup = chart.append('g').attr('class', 'axes');
  const bottomAxisGroup = axesGroup
    .append('g')
    .attr('class', 'bottom-axis')
    .attr('transform', `translate(0,${chartHeight})`);
  const leftAxisGroup = axesGroup.append('g').attr('class', 'left-axis');
  const linesGroup = chart.append('g').attr('class', 'lines');

  const xScale = d3.scaleLinear().domain([0, data.length]).range([0, chartWidth]);

  const bottomAxis = d3.axisBottom(xScale);
  bottomAxis(bottomAxisGroup);

  const yScale = d3.scaleLinear().domain([10, 0]).range([0, chartHeight]);

  const leftAxis = d3.axisLeft(yScale);
  leftAxis(leftAxisGroup);

  const line = d3
    .line()
    .x(d => xScale(data.indexOf(d)))
    .y(d => yScale(d.imdbRating));

  const area = d3
    .area()
    .x(d => xScale(data.indexOf(d)))
    .y0(chartHeight)
    .y1(d => yScale(d.imdbRating));

  linesGroup.append('path').attr('stroke', 'steelblue').attr('d', line(data)).attr('fill', 'none');
  linesGroup.append('path').attr('d', area(data)).attr('fill', 'lightsteelblue');

  svg
    .append('text')
    .text('Episode')
    .attr('x', chartWidth / 2 + margin / 2)
    .attr('y', height - margin / 2);

  svg
    .append('text')
    .text('Rating')
    .attr('x', -(chartHeight / 2 + margin))
    .attr('y', margin / 2)
    .attr('transform', 'rotate(-90)');
};

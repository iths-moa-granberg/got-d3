const dataUrls = [];
let data = [];

const createDataUrls = () => {
  const apiKey = '5d4a457e';

  for (let i = 1; i < 9; i++) {
    dataUrls.push(`http://www.omdbapi.com/?t=Game%20of%20Thrones&Season=${i}&apikey=${apiKey}`);
  }
};

const fetchData = async () => {
  const result = await Promise.all(dataUrls.map(async url => await d3.json(url)));
  data = result.map(s => s.Episodes.map(e => ({ ...e, season: s.Season }))).flat();
};

const getColor = rating => {
  const num = Number(rating);
  // return `rgb(${(255 * (10 - num)) / 10}, ${(255 * num) / 10}, 0)`;
  return num >= 9 ? 'darkgreen' : num >= 8 ? 'green' : num >= 7 ? 'yellow' : num >= 5 ? 'red' : 'darkred';
};

const renderColorChart = () => {
  const width = 600;
  const height = 600;
  const margin = 60;
  const chartWidth = width - margin * 2;
  const chartHeight = height - margin * 2;

  const svg = d3.select('.container').append('svg').attr('width', width).attr('height', height);
  const chart = svg.append('g').attr('class', 'chart').attr('transform', `translate(${margin},${margin})`);
  const axesGroup = chart.append('g').attr('class', 'axes');
  const topAxisGroup = axesGroup.append('g').attr('class', 'top-axis');
  const leftAxisGroup = axesGroup.append('g').attr('class', 'left-axis');
  const episodeGroup = chart.append('g').attr('class', 'episodes');

  const xScale = d3
    .scaleBand()
    .domain(data.map(episode => episode.season))
    .range([0, chartWidth]);

  const topAxis = d3.axisTop(xScale);
  topAxis(topAxisGroup);

  const yScale = d3
    .scaleBand()
    .domain(data.map(episode => episode.Episode))
    .range([0, chartHeight]);

  const leftAxis = d3.axisLeft(yScale);
  leftAxis(leftAxisGroup);

  const episode = episodeGroup.selectAll('g').data(data).enter().append('g');

  episode
    .append('rect')
    .attr('height', 48)
    .attr('width', 60)
    .attr('fill', episode => getColor(episode.imdbRating))
    .attr('stroke', 'white')
    .attr('x', episode => xScale(episode.season))
    .attr('y', episode => yScale(episode.Episode));

  episode
    .append('text')
    .attr('x', episode => xScale(episode.season) + 48 / 2 + 5)
    .attr('y', episode => yScale(episode.Episode) + 65 / 2)
    .attr('text-anchor', 'middle')
    .text(episode => episode.imdbRating);

  svg
    .append('text')
    .text('Season')
    .attr('x', chartWidth / 2 + margin / 2)
    .attr('y', margin / 2);

  svg
    .append('text')
    .text('Episode')
    .attr('x', -(chartHeight / 2 + margin))
    .attr('y', margin / 2)
    .attr('transform', 'rotate(-90)');
};

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
    .attr('y', height - margin/2);

  svg
    .append('text')
    .text('Rating')
    .attr('x', -(chartHeight / 2 + margin))
    .attr('y', margin / 2)
    .attr('transform', 'rotate(-90)');
};

(async () => {
  createDataUrls();
  await fetchData();
  renderColorChart();
  renderLineChart();
})();

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
  return num >= 9 ? 'darkgreen' : num >= 8 ? 'green' : num >= 7 ? 'yellow' : 'red';
};

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

const render = () => {
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
};

(async () => {
  createDataUrls();
  await fetchData();
  console.log(data);
  render();
})();

const getColor = rating => {
  const num = Number(rating);
  // return `rgb(${(255 * (10 - num)) / 10}, ${(255 * num) / 10}, 0)`;
  return num >= 9 ? 'darkgreen' : num >= 8 ? 'green' : num >= 7 ? 'yellow' : num >= 5 ? 'red' : 'darkred';
};

function handleMouseOver(episode) {
  d3.select(this).select('text').transition().duration(200).attr('fill', 'white');
  
  d3.select('.info').transition().duration(200).style('opacity', 1).text(episode.Title);
}

function handleMouseOut() {
  d3.select(this).select('text').transition().duration(200).attr('fill', 'black');

  d3.select('.info').transition().duration(200).style('opacity', 0).text('');
}

const renderColorChart = () => {
  const width = 600;
  const height = 600;
  const margin = 60;
  const chartWidth = width - margin * 2;
  const chartHeight = height - margin * 2;

  //groups with classes & transforming into place
  const svg = d3.select('.container').append('svg').attr('width', width).attr('height', height);
  const chart = svg.append('g').attr('class', 'chart').attr('transform', `translate(${margin},${margin})`);
  const axesGroup = chart.append('g').attr('class', 'axes');
  const topAxisGroup = axesGroup.append('g').attr('class', 'top-axis');
  const leftAxisGroup = axesGroup.append('g').attr('class', 'left-axis');
  const episodeGroup = chart.append('g').attr('class', 'episodes');

  //x-scale
  const xScale = d3
    .scaleBand()
    .domain(data.map(episode => episode.season))
    .range([0, chartWidth]);

  const topAxis = d3.axisTop(xScale);
  topAxis(topAxisGroup);

  //y-scale
  const yScale = d3
    .scaleBand()
    .domain(data.map(episode => episode.Episode))
    .range([0, chartHeight]);

  const leftAxis = d3.axisLeft(yScale);
  leftAxis(leftAxisGroup);

  //episode-boxes
  const episode = episodeGroup
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut);

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
    .attr('fill', 'black')
    .text(episode => episode.imdbRating);

  //labels
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

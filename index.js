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
  data = result.map(item => ({ season: item.Season, episodes: item.Episodes }));
};

(async () => {
  createDataUrls();
  await fetchData();
  console.log(data);
})();

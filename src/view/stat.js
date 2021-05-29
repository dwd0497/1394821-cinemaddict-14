import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {StatPeriod} from '../utils/consts.js';
import {getFilmsByPeriod, getTotaDuration, getCountByGenre} from '../utils/stat.js';
import SmartView from './smart.js';
import {getRank} from '../utils/userRank.js';


const renderChart = (statisticCtx, data) => {
  const {films, statPeriod} = data;

  const watchedFilms = films.filter((film) => film.isAlreadyWatched);
  const watchedFilmsByPeriod = getFilmsByPeriod(watchedFilms, statPeriod);
  const genreCounts = getCountByGenre(watchedFilmsByPeriod);
  const genres = genreCounts.map((obj) => obj.genre);
  const counts = genreCounts.map((obj) => obj.count);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genres,
      datasets: [{
        data: counts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatTemplate = (data) => {
  const {films, statPeriod} = data;

  const watchedFilms = films.filter((film) => film.isAlreadyWatched);
  const watchedFilmsByPeriod = getFilmsByPeriod(watchedFilms, statPeriod);
  const totalDuration = getTotaDuration(watchedFilmsByPeriod);
  const totalDurationHours = totalDuration < 60 ? totalDuration : parseInt(totalDuration / 60);
  const totalDurationMins = totalDuration - totalDurationHours * 60;
  const genreCounts = getCountByGenre(watchedFilmsByPeriod);
  const topGenre = genreCounts.length === 0 ? '' : genreCounts[0].genre;

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getRank(watchedFilms)}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${statPeriod === StatPeriod.ALL ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${statPeriod === StatPeriod.TODAY ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${statPeriod === StatPeriod.WEEK ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${statPeriod === StatPeriod.MONTH ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${statPeriod === StatPeriod.YEAR ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsByPeriod ? watchedFilmsByPeriod.length : '0'} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text"> ${totalDurationHours} <span class="statistic__item-description">h</span> ${totalDurationMins} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`
  );
};

export default class Stat extends SmartView {
  constructor(films) {
    super();

    this._data = {
      films,
      statPeriod: StatPeriod.ALL,
    };

    this._currentStatPeriod = null;

    this._timeIntervalChangeHandler = this._timeIntervalChangeHandler.bind(this);

    this._setInnersHandler();
    this._setChart();
  }

  getTemplate() {
    return createStatTemplate(this._data);
  }

  _setChart() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    const BAR_HEIGHT = 50;
    statisticCtx.height = BAR_HEIGHT * 5;
    renderChart(statisticCtx, this._data);
  }

  _timeIntervalChangeHandler(evt) {
    this._currentStatPeriod = evt.target.value;
    this.updateData({
      statPeriod: this._currentStatPeriod,
    });
  }

  _setInnersHandler() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._timeIntervalChangeHandler);
  }

  restoreHandlers() {
    this._setInnersHandler();
    this._setChart();
  }
}

define(['graph'], function (graph) {

  transpose = function(a) {

    // Calculate the width and height of the Array
    var w = a.length ? a.length : 0,
        h = a[0] instanceof Array ? a[0].length : 0;

    // In case it is a zero matrix, no transpose routine needed.
    if(h === 0 || w === 0) { return []; }

    /**
     * @var {Number} i Counter
     * @var {Number} j Counter
     * @var {Array} t Transposed data is stored in this array.
     */
    var i, j, t = [];

    // Loop through every item in the outer array (height)
    for(i=0; i<h; i++) {

      // Insert a new row (array)
      t[i] = [];

      // Loop through every item per item in outer array (width)
      for(j=0; j<w; j++) {

        // Save transposed data.
        t[i][j] = a[j][i];
      }
    }

    return t;
  };
  /**
   *
   * @param smhidata  data from SMHI
   * @constructor
   */
  var Graph = function() {
  };

  /**
   * Initialize a graph and create the DataTable
   */
  Graph.prototype.initGraph = function(smhidata, locationindex, par ) {

    var Cpar; //Chosen Parameter
    var Suff; //Chosen parameter suffix
    console.log(par);
    if(par == 't'){
      Cpar = 'Temperatur';
      Suff = '°C';
    }
    else if(par == 'gust'){
      Cpar = 'Byvind';
      Suff = 'm/s';
    }
    else if(par == 'ws'){
      Cpar = 'Vindhastighet';
      Suff = 'm/s';
    }
    else if(par == 'r'){
      Cpar = 'Luftfuktighet';
      Suff = '%';
    }
    else if(par == 'tcc'){
      Cpar = 'Molnmängd';
      Suff = 'Molnmängd';
    }
    else if(par == 'msl'){
      Cpar = 'Lufttryck';
      Suff = 'hPa';
    }
    else if(par == 'pis'){
      Cpar = 'Nederbördsintensitet, snö';
      Suff = 'mm/h';
    }
    else if(par == 'pit'){
      Cpar = 'Nederbördsintensitet';
      Suff = 'mm/h';
    }
    else if(par == 'tstm'){
      Cpar = 'Sannolikhet för åska';
      Suff = '%';
    }
    else if(par == 'vis'){
      Cpar = 'Sikt';
      Suff = 'km';
    }
    var TimeArr = [];
    var TempArr = [];
    var MinTempArr = [];
    var MaxTempArr = [];
    //var locationindex  = 100;
    //var par = 'gust';

  for(var i = 0; i < 24; i++){
    var data = smhidata[locationindex].timeseries[i];
    var min = smhidata[locationindex].mintimeseries[i];
    var max = smhidata[locationindex].maxtimeseries[i];

    var currhour = smhidata[locationindex].timeseries[i].validTime;
    currhour = currhour.substring(11,16);
    currhour = currhour.toString();
    TimeArr.push(smhidata[locationindex].timeseries[i].validTime.slice(11,16));
    TempArr.push(data[par]);
    MinTempArr.push(min[par]);
    MaxTempArr.push(max[par]);
  }

    //The MIN/MAX needs to be in a Matrix
    var Temps = [MinTempArr,MaxTempArr];
    var seriesArr = [];

    //transpose if matrix due to how HS reads data
    MinMaxArr = transpose(Temps);

      //push values to series
    seriesArr.push(
        {
          name: Cpar,
          data: TempArr,
          zIndex: 1,
          marker: {
            enabled: false,
            fillColor: 'white',
            lineWidth: 1,
            lineColor: Highcharts.getOptions().colors[0]
          }
        }, {
          name: 'Min/Max',
          data: MinMaxArr,
          type: 'arearange',
          lineWidth: 0,
          linkedTo: ':previous',
          color: Highcharts.getOptions().colors[0],
          fillOpacity: 0.3,
          zIndex: 0
        }
    );
      //options for Highgraph
    var options = {
      chart: {
            renderTo: 'graph_div',
          defaultSeriesType: 'line'
      },
      colors: ['#4798DC'],
      title: {
        text: Cpar
      },

      xAxis: {
        //type: 'datetime'
          categories: TimeArr
      },

      yAxis: {
        title: {
          text: null
        }
      },

      tooltip: {

        crosshairs: true,
        shared: true,
        valueSuffix: Suff
      },

      legend: {
      },
      series: seriesArr
    };

      //draw graph
    var chart = new Highcharts.Chart(options);

  };

  /**
   * Draws graph
   */
  Graph.prototype.drawGraph = function() {
    //google.charts.setOnLoadCallback( function() {
   //   _lineChart.draw(_tableData, _options);
   // });
  };

  /**
   * Updates the hAxis in graph
   * @param timeIndex - Time from slider
   */
  Graph.prototype.updateTime = function(timeIndex) {
    //_options.hAxis.viewWindow.min = timeIndex[0];
    //_options.hAxis.viewWindow.max = timeIndex[1];
    this.drawGraph();
  };

  return Graph;
});
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json;',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      // 'Access-Control-Allow-Headers': 'Authorization, Lang, XMLHttpRequest',
    })
  };

  upcomingLaunches: any;
  pastLaunches: any;
  totalLaunches: any;

  upcomingCount: any;
  pastCount: any;
  totalCount: any;

  allLaunchpads: any;

  titleMap = '';
  typeMap = 'Map';
  columnNamesMap = ["Latitude", "Longitude"];
  optionsMap = {
    showTip: true
  };
  widthMap = 1000;
  heightMap = 400;
  dataMap = [];

  title = 'Launch Over Time';
  type = 'ColumnChart';
  data = [];
  columnNames = ['Year', 'Count'];
  options = {
    showTip: true
  };
  width = 600;
  height = 400;

  allLaunches: any;
  displayedColumns: string[] = ['mission_name', 'launch_date_utc', 'launch_year', 'details'];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    var upcomingUrl = 'https://api.spacexdata.com/v3/launches/upcoming';
    this.callUpcomingApi(upcomingUrl);

    var pastUrl = 'https://api.spacexdata.com/v3/launches/past';
    this.callPastApi(pastUrl);

    var allLaunchpadsUrl = 'https://api.spacexdata.com/v3/launchpads';
    this.callAllLaunchpads(allLaunchpadsUrl)

    var allLaunches = 'https://api.spacexdata.com/v3/launches';
    this.callAllLaunches(allLaunches)

  }

  callAllLaunches(url: any) {
    var ref = this;
    const request = new Request(url);
    console.log(request)
    fetch(request)
      .then(response => response.json())
      .then((success) => {
        ref.allLaunches = success;
        console.log(ref.allLaunches)
        var newArray = [];
        ref.allLaunches.forEach(function (obj) {
          newArray.push(obj.launch_year);
        })
        console.log(newArray);
        // counting occurences
        const map = newArray.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
        console.log([...map.entries()]) // to get the pairs [element, frequency]

        ref.title = 'Launch Over Time';
        ref.type = 'ColumnChart';
        ref.data = [...map.entries()];
        ref.columnNames = ['Year', 'Count'];
        ref.options = {
          showTip: true
        };
        ref.width = 600;
        ref.height = 400;
      })
      .catch(error => {
        console.log(error)
      });
  }

  callAllLaunchpads(url: any) {
    var ref = this;
    const request = new Request(url);
    console.log(request)
    fetch(request)
      .then(response => response.json())
      .then((success) => {
        ref.allLaunchpads = success;
        console.log(ref.allLaunchpads)
        for (var i in ref.allLaunchpads) {
          ref.data.push([this.allLaunchpads[i]["location"]["latitude"], this.allLaunchpads[i]["location"]["longitude"]])
        }
        ref.dataMap = ref.data;
        ref.titleMap = '';
        ref.typeMap = 'Map';
        ref.columnNamesMap = ["Latitude", "Longitude"];
        ref.optionsMap = {
          showTip: true
        };
        ref.widthMap = 1000;
        ref.heightMap = 400;
        console.log(ref.dataMap)
      })
      .catch(error => {
        console.log(error)
      });
  }

  callUpcomingApi(url: any) {
    const request = new Request(url);
    console.log(request)
    fetch(request)
      .then(response => response.json())
      .then((success) => {
        this.upcomingLaunches = success;
        this.upcomingCount = this.upcomingLaunches.length;
        console.log(this.upcomingLaunches)
      })
      .catch(error => {
        console.log(error)
      });
  }

  callPastApi(url: any) {
    const request = new Request(url);
    console.log(request)
    fetch(request)
      .then(response => response.json())
      .then((success) => {
        this.pastLaunches = success;
        this.pastCount = this.pastLaunches.length;
        console.log(this.pastLaunches)
      })
      .catch(error => {
        console.log(error)
      });
  }

}

import { Component, OnInit, Input, NgZone, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import am4geodata_usaLow from '@amcharts/amcharts4-geodata/usaLow';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { ApiService } from 'src/app/services/api.service';


am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  mapDataStatic: any;
  ignore: string[];
  mapCompanies: any = [];
  mapData: any = [];
  polygonSeries: any;
  labelSeries: any;
  chart: any;
  imageSeries: any;
  @Input() statedata: any;
  selState: any;
  @Output() homeState = new EventEmitter<any>();
  @Input() searchedLicense: any;

  constructor(
    private zone: NgZone,
    private api: ApiService
  ) {
    this.selState = undefined;
  }

  ngOnInit() {
    // this.dummyjsondata();
    this.getAllStates().then(() => {
      this.generateMap();
      this.ignore = ['NH', 'MA', 'CT', 'RI', 'MD', 'VT', 'NJ', 'DE', 'DC'];
    });
  }
  // dummyjsondata() {
  //   this.mapDataStatic = [
  //     { _id: '5f313ed4a7137c4e385ebee7', title: 'Alaska', abbreviation: 'Ak', type: 'cover', orderNumber: 0, status: 'Active' },
  //     { _id: '5f313f0fa7137c4e385ebeee', title: 'Colorado', abbreviation: 'CO', type: 'cover', orderNumber: 0 },
  //     { _id: '5f313f56a7137c4e385ebef5', title: 'Delaware', abbreviation: 'DE', type: 'cover', orderNumber: 0 },
  //     { _id: '5f313f79a7137c4e385ebefc', title: 'Idaho', abbreviation: 'ID', type: 'cover', orderNumber: 0 },
  //     { _id: '5f313f9fa7137c4e385ebf03', title: 'Georgia', abbreviation: 'GA', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:37:51.393Z', __v: 0 },
  //     { _id: '5f313fcca7137c4e385ebf0a', title: 'Kansas', abbreviation: 'KS', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:38:36.173Z', __v: 0 },
  //     { _id: '5f313ffea7137c4e385ebf11', title: 'Kentucky', abbreviation: 'KY', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:39:26.204Z', __v: 0 },
  //     { _id: '5f314214a7137c4e385ebf18', title: 'Indiana', abbreviation: 'IN', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:48:20.274Z', __v: 0 },
  //     { _id: '5f314249a7137c4e385ebf1f', title: 'Michigan', abbreviation: 'MI', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:49:13.497Z', __v: 0 }, { _id: '5f314270a7137c4e385ebf26', title: 'Missouri', abbreviation: 'MO', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:49:52.964Z', __v: 0 },
  //     { _id: '5f31429da7137c4e385ebf2d', title: 'Mississippi', abbreviation: 'MS', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:50:37.086Z', __v: 0 }, { _id: '5f3142c2a7137c4e385ebf34', title: 'Montana', abbreviation: 'MT', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:51:14.191Z', __v: 0 },
  //     { _id: '5f3142f1a7137c4e385ebf3b', title: 'North Carolina', abbreviation: 'NC', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:52:01.844Z', __v: 0 }, { _id: '5f314310a7137c4e385ebf42', title: 'North Dakota', abbreviation: 'ND', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:52:32.604Z', __v: 0 },
  //     { _id: '5f31433ba7137c4e385ebf49', title: 'Nebraska', abbreviation: 'NE', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:53:15.996Z', __v: 0 }, { _id: '5f314364a7137c4e385ebf50', title: 'New Jersey', abbreviation: 'NJ', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:53:56.019Z', __v: 0 },
  //     { _id: '5f314385a7137c4e385ebf57', title: 'Ohio', abbreviation: 'OH', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:54:29.273Z', __v: 0 }, { _id: '5f3143b2a7137c4e385ebf5e', title: 'Pennsylvania', abbreviation: 'PA', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:55:14.820Z', __v: 0 },
  //     { _id: '5f3143cfa7137c4e385ebf65', title: 'Rhode Island', abbreviation: 'RI', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:55:43.784Z', __v: 0 },
  //     { _id: '5f3143f7a7137c4e385ebf6c', title: 'South Dakota', abbreviation: 'SD', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:56:23.155Z', __v: 0 }, { _id: '5f31441ea7137c4e385ebf73', title: 'Tennessee', abbreviation: 'TN', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:57:02.258Z', __v: 0 },
  //     { _id: '5f314434a7137c4e385ebf7a', title: 'Utah', abbreviation: 'UT', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:57:24.442Z', __v: 0 }, { _id: '5f314452a7137c4e385ebf81', title: 'West Virginia', abbreviation: 'WV', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T12:57:54.555Z', __v: 0 }, { _id: '5f3147e9a7137c4e385ebf88', title: 'Alabama', abbreviation: 'Al', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:13:13.652Z', __v: 0 },
  //     { _id: '5f31481ea7137c4e385ebf8f', title: 'Arkansas', abbreviation: 'AR', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:14:06.665Z', __v: 0 }, { _id: '5f31484aa7137c4e385ebf96', title: 'Arizona', abbreviation: 'AZ', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:14:50.203Z', __v: 0 },
  //     { _id: '5f31486da7137c4e385ebf9d', title: 'Connecticut', abbreviation: 'CT', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:15:25.909Z', __v: 0 },
  //     { _id: '5f3148bfa7137c4e385ebfa4', title: 'Florida', abbreviation: 'FL', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:16:47.440Z', __v: 0 }, { _id: '5f3148fca7137c4e385ebfab', title: 'Hawaii', abbreviation: 'HI', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:17:48.698Z', __v: 0 },
  //     { _id: '5f31493ca7137c4e385ebfb2', title: 'Iowa', abbreviation: 'IA', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:18:52.498Z', __v: 0 }, { _id: '5f314992a7137c4e385ebfb9', title: 'Illinois', abbreviation: 'IL', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:20:18.641Z', __v: 0 }, { _id: '5f3149baa7137c4e385ebfc0', title: 'Louisiana', abbreviation: 'LA', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:20:58.100Z', __v: 0 },
  //     { _id: '5f3149ffa7137c4e385ebfc7', title: 'Massachusetts', abbreviation: 'MA', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:22:07.316Z', __v: 0 }, { _id: '5f314a25a7137c4e385ebfce', title: 'Maryland', abbreviation: 'MD', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:22:45.003Z', __v: 0 }, { _id: '5f314a4da7137c4e385ebfd5', title: 'Maine', abbreviation: 'ME', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:23:25.151Z', __v: 0 },
  //     { _id: '5f314a7da7137c4e385ebfdc', title: 'Minnesota', abbreviation: 'MN', type: 'processing', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:24:13.626Z', __v: 0 },
  //     { _id: '5f314a9aa7137c4e385ebfe3', title: 'New Hampshire', abbreviation: 'NH', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:24:42.807Z', __v: 0 }, { _id: '5f314abfa7137c4e385ebfea', title: 'New Mexico', abbreviation: 'NM', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:25:19.647Z', __v: 0 }, { _id: '5f314adea7137c4e385ebff1', title: 'Nevada', abbreviation: 'NV', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:25:50.961Z', __v: 0 },
  //     { _id: '5f314b1f349dc14f4f308ce9', title: 'New York', abbreviation: 'NY', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:26:55.899Z', __v: 0 }, { _id: '5f314b45349dc14f4f308cf0', title: 'Oklahoma', abbreviation: 'OK', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:27:33.662Z', __v: 0 }, { _id: '5f314b6c349dc14f4f308cf7', title: 'Oregon', abbreviation: 'OR', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:28:12.934Z', __v: 0 },
  //     { _id: '5f314b92349dc14f4f308cfe', title: 'South Carolina', abbreviation: 'SC', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:28:50.296Z', __v: 0 },
  //     { _id: '5f314bb9349dc14f4f308d05', title: 'Texas', abbreviation: 'TX', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:29:29.322Z', __v: 0 },
  //     { _id: '5f314be0349dc14f4f308d0c', title: 'Virginia', abbreviation: 'VA', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:30:08.542Z', __v: 0 }, { _id: '5f314c06349dc14f4f308d13', title: 'Vermont', abbreviation: 'VT', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:30:46.420Z', __v: 0 }, { _id: '5f314c2b349dc14f4f308d1a', title: 'Wyoming', abbreviation: 'WY', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:31:23.547Z', __v: 0 },
  //     { _id: '5f314c49349dc14f4f308d21', title: 'Washington', abbreviation: 'WA', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:31:53.891Z', __v: 0 }, { _id: '5f314c78349dc14f4f308d28', title: 'California', abbreviation: 'CA', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:32:40.893Z', __v: 0 },
  //     { _id: '5f315110349dc14f4f308d2f', title: 'Wisconsin', abbreviation: 'WI', type: 'not_covered', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-08-10T13:52:16.826Z', __v: 0 }, { _id: '5fca1b3db439a09a2dccafd0', title: 'District of Columbia', abbreviation: 'DC', type: 'cover', orderNumber: 0, status: 'Active', isDeleted: false, createdAt: '2020-12-04T11:19:25.381Z', __v: 0 }
  //   ];
  // }
  getAllStates() {
    return new Promise<void>((resolve, rejects) => {
      this.api.get('state/list').subscribe((res: any) => {
        if (res) {
          if (res.data.length > 0) {
            this.mapDataStatic = res.data;
            resolve();
          } else { }
        }
      });
    });
  }

  generateMap() {
    // this.api.get('state/bestcompaniesbystate').subscribe(res => { console.log(res) });
    // if (this.statedata && this.statedata.length > 0) {
    //   this.statedata.sort((a, b) => a.title.localeCompare(b.title));
    // }
    // if (this.mapDataStatic && this.mapDataStatic.length > 0) {
    //   this.mapDataStatic.sort((a, b) => a.title.localeCompare(b.title));
    // }

    const arr = this.mapDataStatic;
    const preFix = 'US-';
    this.mapCompanies = arr.map(data => {
      data.id = preFix + data.abbreviation.toString().toUpperCase();
      data.isRegulated = data.type;
      const obj = {
        id: data.id,
        value: Math.round(Math.random() * 10000),
        fill: null
      };
      this.mapData.push(obj);
      return data;
    });
    // Create map instance
    const chart = am4core.create('chartdiv', am4maps.MapChart);
    chart.responsive.enabled = true;
    // tslint:disable-next-line: deprecation
    chart.panBehavior = 'none';
    // SCROLL AND ZOOM
    chart.chartContainer.wheelable = false;
    chart.logo.height = -15;
    chart.seriesContainer.events.disableType('doublehit');
    chart.chartContainer.background.events.disableType('doublehit');
    chart.seriesContainer.draggable = false;
    chart.seriesContainer.resizable = false;
    chart.responsive.enabled = true;
    // SET MAP DEFINITION
    chart.geodata = am4geodata_usaLow;

    // SET PROJECTION
    chart.projection = new am4maps.projections.AlbersUsa(); // new am4maps.projections.Mercator()AlbersUsa()

    // CREATE MAP POLYGON SERIES
    this.polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    this.polygonSeries.calculateVisualCenter = true;
    this.mapData.forEach(data => {
      if (this.searchedLicense && data.id === this.searchedLicense.stateID) {
        data.fill = am4core.color('#e0ece6');
      } else {
        let color;
        const filtArr = this.mapCompanies.filter(ele => ele.id === data.id);
        if (filtArr.length > 0) {
          if (filtArr[0].isRegulated === 'cover') {
            const gradient = new am4core.LinearGradient();
            gradient.addColor(am4core.color('#394C45'));
            gradient.addColor(am4core.color('#6E7A78'));
            gradient.addColor(am4core.color('#394C45'));
            gradient.rotation = 100;
            color = gradient;
          } else if (filtArr[0].isRegulated === 'processing') {
            const gradient = new am4core.LinearGradient();
            gradient.addColor(am4core.color('#e7e7e8'));
            gradient.addColor(am4core.color('#fff'));
            gradient.addColor(am4core.color('#e7e7e8'));
            gradient.rotation = 270;
            color = gradient;
          } else if (filtArr[0].isRegulated === 'not_covered') {
            const gradient = new am4core.LinearGradient();
            gradient.addColor(am4core.color('#CF937B'));
            gradient.addColor(am4core.color('#F5D0B3'));
            gradient.addColor(am4core.color('#CF937B'));
            gradient.rotation = 90;
            color = gradient;
          }
        } else {
          // color = am4core.color('#7a7c7d');
        }
        data.fill = color;
      }
    });
    this.polygonSeries.data = this.mapData;
    // SMALLER REGIONS
    const ignore = ['NH', 'MA', 'CT', 'RI', 'MD', 'VT', 'NJ', 'DE', 'DC'];
    // LABELS
    let labelSeries;
    labelSeries = chart.series.push(new am4maps.MapImageSeries());
    let labelTemplate;
    labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
    labelTemplate.horizontalCenter = 'middle';
    labelTemplate.verticalCenter = 'middle';
    labelTemplate.nonScaling = true;
    labelTemplate.interactionsEnabled = false;
    this.labelSeries = labelSeries;

    // MARKERS
    // Create image series
    const imageSeries = chart.series.push(new am4maps.MapImageSeries());
    this.chart = chart;
    this.imageSeries = imageSeries;

    // Create image
    const mapImage = imageSeries.mapImages.template;
    const mapMarker = mapImage.createChild(am4core.Image);
    mapMarker.href = 'assets/images/map-marker.png';
    mapMarker.width = 40;
    mapMarker.height = 40;
    mapMarker.nonScaling = true;
    mapMarker.horizontalCenter = 'middle';
    mapMarker.verticalCenter = 'bottom';
    const cellSize = 30;
    chart.responsive.useDefault = false;

    this.polygonSeries.events.on('ready', () => {
      this.polygonSeries.mapPolygons.each((polygon: any) => {
        am4core.options.autoSetClassName = true;
        if (polygon.dataItem.dataContext.id === 'US-HI') {
          const selectedPolygon = this.polygonSeries.getPolygonById(polygon.dataItem.dataContext.id);
          selectedPolygon.dom.id = 'myCategoryAxis';
        }
        const code = polygon.dataItem.dataContext.id.split('-')[1];
        let state;
        let label;
        label = labelSeries.mapImages.create();
        state = polygon.dataItem.dataContext.id.split('-').pop();
        label.latitude = polygon.visualLatitude;
        label.longitude = polygon.visualLongitude;
        polygon.stroke = '#394C45';
        if (this.searchedLicense && code === this.searchedLicense.state) {
          const selectedPolygon = this.polygonSeries.getPolygonById(polygon.dataItem.dataContext.id);
          // if (this.searchedLicense) {
          //   imageSeries.mapImages.clear();
          //   const marker = imageSeries.mapImages.create();
          //   marker.latitude = selectedPolygon.visualLatitude;
          //   marker.longitude = selectedPolygon.visualLongitude;
          // }
        }
        if (this.searchedLicense && this.searchedLicense.stateID) {
          this.selState = this.searchedLicense.stateID;
        }
        if (ignore.indexOf(code) === -1) {
          label.children.getIndex(0).text = state;
          const reg = this.checkRegulation(polygon.dataItem.dataContext.id);
          if (reg === 'cover') {
            const gradient = new am4core.LinearGradient();
            gradient.addColor(am4core.color('#CF937B'));
            gradient.addColor(am4core.color('#F5D0B3'));
            gradient.addColor(am4core.color('#CF937B'));
            gradient.rotation = 90;
            label.children.getIndex(0).fill = gradient;
          } else if (reg === 'not_covered') {
            const gradient = new am4core.LinearGradient();
            gradient.addColor(am4core.color('#394C45'));
            gradient.addColor(am4core.color('#6E7A78'));
            gradient.addColor(am4core.color('#394C45'));
            gradient.rotation = 100;
            label.children.getIndex(0).fill = gradient;
          } else if (reg === 'processing') {
            const gradient = new am4core.LinearGradient();
            gradient.addColor(am4core.color('#394C45'));
            gradient.addColor(am4core.color('#6E7A78'));
            gradient.addColor(am4core.color('#394C45'));
            gradient.rotation = 100;
            label.children.getIndex(0).fill = gradient;
          }
          label.children.getIndex(0).strokeWidth = 0.9;
        }
      });
    });

    // Make map load polygon data (state shapes and names) from GeoJSON
    this.polygonSeries.useGeodata = true;

    const polygonTemplate = this.polygonSeries.mapPolygons.template;
    polygonTemplate.propertyFields.fill = 'fill';

    // MOUSE OVER EVENT FUNCTIONALITY
    polygonTemplate.events.on('over', (ev: any) => {
      // tslint:disable-next-line:new-parens
      const shadow = ev.target.filters.push(new am4core.DropShadowFilter);
      shadow.opacity = 0.1;
      const hoverState = ev.target.states.create('hover');
      hoverState.properties.dx = -5;
      hoverState.properties.dy = -5;
      hoverState.sprite.zIndex = 999999999999;
      // tslint:disable-next-line:new-parens
      const hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
      hoverShadow.dx = 6;
      hoverShadow.dy = 6;
      hoverShadow.opacity = 0.3;
      const polygon = this.polygonSeries.getPolygonById(ev.target.dataItem.dataContext.id);
      const stId = ev.target.dataItem.dataContext.id.split('-')[1];
      if (ignore.indexOf(stId) !== -1 && document.getElementById(stId)) {
        document.getElementById(stId).removeAttribute('class');
        if (this.checkRegulation(ev.target.dataItem.dataContext.id)) {
          document.getElementById(stId).setAttribute('class', 'hover-regulated');
        } else {
          document.getElementById(stId).setAttribute('class', 'hover-non-regulated');
        }
      }
      let color;
      if (this.checkRegulation(ev.target.dataItem.dataContext.id) === 'cover') {
        color = am4core.color('#6E7A78');
      } else if (this.checkRegulation(ev.target.dataItem.dataContext.id) === 'processing') {
        color = am4core.color('#dadada');
      } else if (this.checkRegulation(ev.target.dataItem.dataContext.id) === 'not_covered') {
        color = am4core.color('#CF937B');
      }
      polygon.fill = color;
    });

    // MOUSE OUT EVENT FUNCTIONALITY
    polygonTemplate.events.on('out', (ev: any) => {
      const polygon = this.polygonSeries.getPolygonById(ev.target.dataItem.dataContext.id);
      const stId = ev.target.dataItem.dataContext.id.split('-')[1];
      const hoverState = ev.target.states.create('hover');
      hoverState.sprite.zIndex = 0;
      if (ignore.indexOf(stId) !== -1) {
        document.getElementById(stId).removeAttribute('class');
        if (this.checkRegulation(ev.target.dataItem.dataContext.id)) {
          if (this.selState === ev.target.dataItem.dataContext.id) {
            document.getElementById(stId).setAttribute('class', 'click-regulated');
          } else {
            document.getElementById(stId).setAttribute('class', 'regulated');
          }
        } else {
          if (this.selState === ev.target.dataItem.dataContext.id) {
            document.getElementById(stId).setAttribute('class', 'click-non-regulated');
          } else {
            document.getElementById(stId).setAttribute('class', 'non-regulated');
          }
        }
      }
      if (this.selState === ev.target.dataItem.dataContext.id) {
        polygon.fill = am4core.color('#e0ece6');
      } else {
        let color;
        if (this.checkRegulation(ev.target.dataItem.dataContext.id) === 'cover') {
          const gradient = new am4core.LinearGradient();
          gradient.addColor(am4core.color('#394C45'));
          gradient.addColor(am4core.color('#6E7A78'));
          gradient.addColor(am4core.color('#394C45'));
          gradient.rotation = 100;
          color = gradient;
        } else if (this.checkRegulation(ev.target.dataItem.dataContext.id) === 'processing') {
          const gradient = new am4core.LinearGradient();
          gradient.addColor(am4core.color('#e7e7e8'));
          gradient.addColor(am4core.color('#fff'));
          gradient.addColor(am4core.color('#e7e7e8'));
          gradient.rotation = 270;
          color = gradient;
        } else if (this.checkRegulation(ev.target.dataItem.dataContext.id) === 'not_covered') {
          const gradient = new am4core.LinearGradient();
          gradient.addColor(am4core.color('#CF937B'));
          gradient.addColor(am4core.color('#F5D0B3'));
          gradient.addColor(am4core.color('#CF937B'));
          gradient.rotation = 90;
          color = gradient;
        }
        polygon.fill = color;
      }
    });


    // CLICK EVENT FUNCTIONALITY
    polygonTemplate.events.on('hit', (ev: any) => {
      // console.log(ev.target.dataItem.dataContext.id);
      // coords for marker
      const selectedPolygon = this.polygonSeries.getPolygonById(ev.target.dataItem.dataContext.id);
      const coords = {
        latitude: selectedPolygon.visualLatitude,
        longitude: selectedPolygon.visualLongitude
      };
      this.selState = ev.target.dataItem.dataContext.id;
      this.changeBackGround(ev.target.dataItem.dataContext.id);
      // for label color change
      labelSeries.mapImages.clear();
      this.polygonSeries.mapPolygons.each((polygon: any, i) => {
        // console.log(polygon.dataItem.dataContext.id);
        const code = polygon.dataItem.dataContext.id.split('-')[1];
        let state;
        let label;
        label = labelSeries.mapImages.create();
        state = polygon.dataItem.dataContext.id.split('-').pop();
        label.latitude = polygon.visualLatitude;
        label.longitude = polygon.visualLongitude;
        if (ignore.indexOf(code) === -1) {
          label.children.getIndex(0).text = state;
          if (ev.target.dataItem.dataContext.id === polygon.dataItem.dataContext.id) {
            const reg = this.checkRegulation(ev.target.dataItem.dataContext.id);
            if (reg === 'cover') {
              const gradient = new am4core.LinearGradient();
              gradient.addColor(am4core.color('#CF937B'));
              gradient.addColor(am4core.color('#F5D0B3'));
              gradient.addColor(am4core.color('#CF937B'));
              gradient.rotation = 90;
              label.children.getIndex(0).fill = gradient;
            }
            if (reg === 'not_covered') {
              const gradient = new am4core.LinearGradient();
              gradient.addColor(am4core.color('#394C45'));
              gradient.addColor(am4core.color('#6E7A78'));
              gradient.addColor(am4core.color('#394C45'));
              gradient.rotation = 100;
              label.children.getIndex(0).fill = gradient;
            }
            if (reg === 'processing') {
              const gradient = new am4core.LinearGradient();
              gradient.addColor(am4core.color('#394C45'));
              gradient.addColor(am4core.color('#6E7A78'));
              gradient.addColor(am4core.color('#394C45'));
              gradient.rotation = 100;
              label.children.getIndex(0).fill = gradient;
            }
          } else {
            const reg = this.checkRegulation(polygon.dataItem.dataContext.id);
            if (reg === 'cover') {
              const gradient = new am4core.LinearGradient();
              gradient.addColor(am4core.color('#CF937B'));
              gradient.addColor(am4core.color('#F5D0B3'));
              gradient.addColor(am4core.color('#CF937B'));
              gradient.rotation = 90;
              label.children.getIndex(0).fill = gradient;
            } else if (reg === 'not_covered') {
              const gradient = new am4core.LinearGradient();
              gradient.addColor(am4core.color('#394C45'));
              gradient.addColor(am4core.color('#6E7A78'));
              gradient.addColor(am4core.color('#394C45'));
              gradient.rotation = 100;
              label.children.getIndex(0).fill = gradient;
            } else if (reg === 'processing') {
              const gradient = new am4core.LinearGradient();
              gradient.addColor(am4core.color('#394C45'));
              gradient.addColor(am4core.color('#6E7A78'));
              gradient.addColor(am4core.color('#394C45'));
              gradient.rotation = 100;
              label.children.getIndex(0).fill = gradient;
            }
          }
          label.children.getIndex(0).strokeWidth = 0.5;
        }
      });
      // for legends
      if (ignore.indexOf(ev.target.dataItem.dataContext.id.split('-')[1]) !== -1) {
        this.setLegends(ev.target.dataItem.dataContext.id.split('-')[1]);
      } else {
        this.setLegends();
      }

      // for marker
      // imageSeries.mapImages.clear();
      // const marker = imageSeries.mapImages.create();
      // marker.latitude = coords.latitude;
      // marker.longitude = coords.longitude;
      const stateObj = {
        // latitude: coords.latitude,
        // longitude: coords.longitude,
        state: ev.target.dataItem.dataContext.id.split('-')[1],
        stateID: ev.target.dataItem.dataContext.id,
        name: ev.target.dataItem.dataContext.name
      };
      this.homeState.emit(stateObj);
      localStorage.setItem('selState', JSON.stringify(stateObj));
    });
    this.setLegends();
  }

  checkRegulation(id) {
    const arr = this.mapCompanies.filter(ele => ele.id === id);
    if (arr[0].isRegulated) {
      return arr[0].isRegulated;
    }
  }

  overLegends(event) {
    const eleId = event.toElement.id;
    if (this.ignore.indexOf(eleId) !== -1) {
      const selPolygon = this.polygonSeries.getPolygonById(`US-${eleId}`);
      const polygonTemplate = selPolygon.template;
      // tslint:disable-next-line:new-parens
      const shadow = selPolygon.filters.push(new am4core.DropShadowFilter);
      shadow.opacity = 0.1;
      selPolygon.dx = -5;
      selPolygon.dy = -5;
      // tslint:disable-next-line:new-parens
      const hoverShadow = selPolygon.filters.push(new am4core.DropShadowFilter);
      hoverShadow.dx = 6;
      hoverShadow.dy = 6;
      hoverShadow.opacity = 0.3;
      selPolygon.zIndex = 999999999999;
    }
  }

  outLegends(event) {
    const eleId = event.fromElement.id;
    if (this.ignore.indexOf(eleId) !== -1) {
      const selPolygon = this.polygonSeries.getPolygonById(`US-${eleId}`);
      if (this.selState === `US-${eleId}`) {
        selPolygon.fill = am4core.color('#e0ece6');
      } else {
      }
      // tslint:disable-next-line:new-parens
      const shadow = selPolygon.filters.push(new am4core.DropShadowFilter);
      shadow.opacity = 0;
      selPolygon.dx = 0;
      selPolygon.dy = 0;
      selPolygon.zIndex = 0;
      // tslint:disable-next-line:new-parens
      const hoverShadow = selPolygon.filters.push(new am4core.DropShadowFilter);
      hoverShadow.dx = 0;
      hoverShadow.dy = 0;
      hoverShadow.opacity = 0;
    }
  }


  setLegends(code?: any) {
    const ignore = ['NH', 'MA', 'CT', 'RI', 'MD', 'VT', 'NJ', 'DE', 'DC'];
    const imageseries = [];
    // './assets/images/NH.png', './assets/images/MA.png', './assets/images/CT.png',
    //   './assets/images/RI.png', './assets/images/md.png', './assets/images/vt.png ', './assets/images/nj.png', './assets/images/de.png',
    //   './assets/images/dc.png'
    if (document.getElementById('small-states')) {
      document.getElementById('small-states').innerHTML = '';
    }
    const list = document.getElementById('small-states');
    ignore.forEach((ele, i) => {
      const node = document.createElement('LI');
      const smallDiv = document.createElement('div');
      const imgDiv = document.createElement('IMG');
      // smallDiv.innerHTML = ele;
      let color;
      const dataObj = this.mapCompanies.filter(comp => comp.id.split('-')[1] === ele);
      if (dataObj.length > 0) {
        dataObj.map(item => {
          if (item.abbreviation === 'NH') {
            if (item.isRegulated === 'cover') {
              imageseries.push('./assets/images/NH-green.png');
            } else if (item.isRegulated === 'processing') {
              imageseries.push('./assets/images/NH.png');
            } else if (item.isRegulated === 'not_covered') {
              imageseries.push('./assets/images/NH-rose.png');
            }
          }
          if (item.abbreviation === 'MA') {
            if (item.isRegulated === 'cover') {
              imageseries.push('./assets/images/MAgreen.png');
            } else if (item.isRegulated === 'processing') {
              imageseries.push('./assets/images/MA.png');
            } else if (item.isRegulated === 'not_covered') {
              imageseries.push('./assets/images/MArose.png');
            }
          }
          if (item.abbreviation === 'CT') {
            if (item.isRegulated === 'cover') {
              imageseries.push('./assets/images/CTgreen.png');
            } else if (item.isRegulated === 'processing') {
              imageseries.push('./assets/images/CT.png');
            } else if (item.isRegulated === 'not_covered') {
              imageseries.push('./assets/images/CTrose.png');
            }
          }
          if (item.abbreviation === 'RI') {
            if (item.isRegulated === 'cover') {
              imageseries.push('./assets/images/RI.png');
            } else if (item.isRegulated === 'processing') {
              imageseries.push('./assets/images/RIwhite.png');
            } else if (item.isRegulated === 'not_covered') {
              imageseries.push('./assets/images/RIrose.png');
            }
          }
          if (item.abbreviation === 'MD') {
            if (item.isRegulated === 'cover') {
              imageseries.push('./assets/images/mdgreen.png');
            } else if (item.isRegulated === 'processing') {
              imageseries.push('./assets/images/md.png');
            } else if (item.isRegulated === 'not_covered') {
              imageseries.push('./assets/images/mdrose.png');
            }
          }
          if (item.abbreviation === 'VT') {
            if (item.isRegulated === 'cover') {
              imageseries.push('./assets/images/vtgreen.png');
            } else if (item.isRegulated === 'processing') {
              imageseries.push('./assets/images/vt.png');
            } else if (item.isRegulated === 'not_covered') {
              imageseries.push('./assets/images/vtrose.png');
            }
          }
          if (item.abbreviation === 'NJ') {
            if (item.isRegulated === 'cover') {
              imageseries.push('./assets/images/nj.png');
            } else if (item.isRegulated === 'processing') {
              imageseries.push('./assets/images/njwhite.png');
            } else if (item.isRegulated === 'not_covered') {
              imageseries.push('./assets/images/njrose.png');
            }
          }
          if (item.abbreviation === 'DE') {
            if (item.isRegulated === 'cover') {
              imageseries.push('./assets/images/de.png');
            } else if (item.isRegulated === 'processing') {
              imageseries.push('./assets/images/dewhite.png');
            } else if (item.isRegulated === 'not_covered') {
              imageseries.push('./assets/images/derose.png');
            }
          }
          if (item.abbreviation === 'DC') {
            if (item.isRegulated === 'cover') {
              imageseries.push('./assets/images/dc.png');
            } else if (item.isRegulated === 'processing') {
              imageseries.push('./assets/images/dcwhite.png');
            } else if (item.isRegulated === 'not_covered') {
              imageseries.push('./assets/images/dcrose.png');
            }
          }
        });
      }

      if (dataObj.length > 0) {
        if (dataObj[0].isRegulated === 'cover') {
          const gradient = new am4core.RadialGradient();
          gradient.addColor(am4core.color('#394C45'));
          gradient.addColor(am4core.color('#6E7A78'));
          gradient.addColor(am4core.color(' #394C45'));
          gradient.cx = am4core.percent(36);
          gradient.cy = am4core.percent(50);
          color = gradient;
        } else if (dataObj[0].isRegulated === 'processing') {
          const gradient = new am4core.LinearGradient();
          gradient.addColor(am4core.color('#e7e7e8'));
          gradient.addColor(am4core.color('#fff'));
          gradient.addColor(am4core.color(' #e7e7e8'));
          gradient.rotation = 90;
          color = gradient;
        } else if (dataObj[0].isRegulated === 'not_covered') {
          const gradient = new am4core.RadialGradient();
          gradient.addColor(am4core.color('#394C45'));
          gradient.addColor(am4core.color('#6E7A78'));
          gradient.addColor(am4core.color(' #394C45'));
          gradient.cx = am4core.percent(36);
          gradient.cy = am4core.percent(50);
          color = gradient;
        }
      } else {
        const gradient = new am4core.LinearGradient();
        gradient.addColor(am4core.color('#c79c83'));
        gradient.addColor(am4core.color('#e9cdb0'));
        gradient.addColor(am4core.color(' #c79c83'));
        gradient.rotation = 90;
        color = gradient;
      }
      if (color) {
        if (code && code === ele) {
          smallDiv.setAttribute('class', 'click-regulated');
        } else {
          smallDiv.setAttribute('class', 'regulated');
        }
      } else {
        if (code && code === ele) {
          smallDiv.setAttribute('class', 'click-non-regulated');
        } else {
          smallDiv.setAttribute('class', 'non-regulated');
        }
      }
      imgDiv.setAttribute('id', ele);
      smallDiv.appendChild(imgDiv);
      imgDiv.setAttribute('src', imageseries[i]);
      node.appendChild(smallDiv);
      list.appendChild(node);
    });
  }

  getSmallStateNames(data) {
    const smallStates = [
      {
        code: 'VT',
        name: 'Vermont'
      },
      {
        code: 'NH',
        name: 'New Hampshire'
      },
      {
        code: 'MA',
        name: 'Massachusetts'
      },
      {
        code: 'CT',
        name: 'Connecticut'
      },
      {
        code: 'NJ',
        name: 'New Jersey'
      },
      {
        code: 'DE',
        name: 'Delaware'
      },
      {
        code: 'MD',
        name: 'Maryland'
      },
      {
        code: 'DC',
        name: 'District of Columbia'
      },
      {
        code: 'RI',
        name: 'Rhode Island'
      },
    ];
    const tempArr = smallStates.filter(ele => ele.code === data);
    if (tempArr.length > 0) {
      return tempArr[0].name;
    }
    return data;
  }


  changeBackGround(id) {
    this.mapData.forEach(data => {
      if (data.id === id) {
        this.polygonSeries.getPolygonById(id).fill = am4core.color('#e0ece6');
      } else {
        let color;
        const filtArr = this.mapCompanies.filter(ele => ele.id === data.id);
        if (filtArr.length > 0) {
          if (filtArr[0].isRegulated === 'cover') {
            const gradient = new am4core.LinearGradient();
            gradient.addColor(am4core.color('#394C45'));
            gradient.addColor(am4core.color('#6E7A78'));
            gradient.addColor(am4core.color('#394C45'));
            gradient.rotation = 100;
            color = gradient;
          } else if (filtArr[0].isRegulated === 'processing') {
            const gradient = new am4core.LinearGradient();
            gradient.addColor(am4core.color('#e7e7e8'));
            gradient.addColor(am4core.color('#fff'));
            gradient.addColor(am4core.color('#e7e7e8'));
            gradient.rotation = 270;
            color = gradient;
          } else if (filtArr[0].isRegulated === 'not_covered') {
            const gradient = new am4core.LinearGradient();
            gradient.addColor(am4core.color('#CF937B'));
            gradient.addColor(am4core.color('#F5D0B3'));
            gradient.addColor(am4core.color('#CF937B'));
            gradient.rotation = 90;
            color = gradient;
          }
        } else {
          const gradient = new am4core.LinearGradient();
          gradient.addColor(am4core.color('#CF937B'));
          gradient.addColor(am4core.color('#F5D0B3'));
          gradient.addColor(am4core.color('#CF937B'));
          gradient.rotation = 90;
          color = gradient;
        }
        this.polygonSeries.getPolygonById(data.id).fill = color;
      }
    });
  }


  chooseArea(event) {
    const ignore = ['NH', 'MA', 'CT', 'RI', 'MD', 'VT', 'NJ', 'DE', 'DC'];
    if (this.selState !== `US-${event.target.id}`) {
      if (ignore.indexOf(event.target.id) !== -1) {
        this.selState = `US-${event.target.id}`;
        this.polygonSeries.mapPolygons.each(polygon => {
          if (polygon.dataItem.dataContext.id.split('-')[1] === event.target.id) {
            setTimeout(() => {
              polygon.dx = 0;
              polygon.dy = 0;
              polygon.zIndex = 0;
              // tslint:disable-next-line:new-parens
              const hoverShadow = polygon.filters.push(new am4core.DropShadowFilter);
              hoverShadow.dx = 0;
              hoverShadow.dy = 0;
              hoverShadow.opacity = 0;
            }, 100);
            const obj = {
              latitude: polygon.visualLatitude,
              longitude: polygon.visualLongitude,
              state: event.target.id,
              stateID: `US-${event.target.id}`,
              name: this.getSmallStateNames(event.target.id)
            };
            this.changeBackGround(`US-${event.target.id}`);
            this.setLegends(event.target.id);
            this.homeState.emit(obj);
          }
        });
      }
    }
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }



}

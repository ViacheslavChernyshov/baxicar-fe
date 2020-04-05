import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {MapsAPILoader, MouseEvent as MouseEvent} from '@agm/core';

@Component({
  selector: 'app-driver-page',
  templateUrl: './driver-page.component.html',
  styleUrls: ['./driver-page.component.css']
})

export class DriverPageComponent implements OnInit {
  // title: string = 'AGM project';
  determineLatitude: number;
  determineLongitude: number;
  zoom: number;
  addressStart: string;
  addressDestination: string;
  private geoCoder;
  markers: Marker[] = [
    // {
    //   lat: 51.673858,
    //   lng: 7.815982,
    //   label: 'A',
    //   draggable: true
    // },
    // {
    //   lat: 51.373858,
    //   lng: 7.215982,
    //   label: 'B',
    //   draggable: false
    // },
    // {
    //   lat: 51.723858,
    //   lng: 7.895982,
    //   label: 'C',
    //   draggable: true
    // }
  ];


  @ViewChild('searchAddressStart', {static: false}) public searchAddressStartElementRef: ElementRef;
  @ViewChild('searchAddressDestination', {static: false}) public searchAddressDestinationElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      const autocompleteAddressStart = new google.maps.places.Autocomplete(this.searchAddressStartElementRef.nativeElement, {
        types: ['address']
      });
      autocompleteAddressStart.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocompleteAddressStart.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // this.determineLatitude = place.geometry.location.lat();
          // this.determineLongitude = place.geometry.location.lng();
          this.markers.push({
            index: 0,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            draggable: true
            // ,            icon: 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FF00FF'
          });
          // this.zoom = 8;
        });
      });


      const autocompleteAddressDestination = new google.maps.places.Autocomplete(this.searchAddressDestinationElementRef.nativeElement, {
        types: ['address']
      });
      autocompleteAddressDestination.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocompleteAddressDestination.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // this.determineLatitude = place.geometry.location.lat();
          // this.determineLongitude = place.geometry.location.lng();
          this.markers.push({
            index: 1,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            draggable: true
            // ,            icon: 'http://maps.google.com/mapfiles/kml/paddle/grn-circle.png'
          });
          // this.zoom = 8;
        });
      });
    });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.determineLatitude = position.coords.latitude;
        this.determineLongitude = position.coords.longitude;
        this.markers.push({
          index: 0,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          draggable: true
          // ,          icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png'
        });

        this.zoom = 8;
        this.getAddress(this.determineLatitude, this.determineLongitude);
      });
    }
  }

  markerDragEnd(m: Marker, $event: MouseEvent) {
    // this.determineLatitude = $event.coords.lat;
    // this.determineLongitude = $event.coords.lng;
    m.lat = $event.coords.lat;
    m.lng = $event.coords.lng;
    this.getAddressZ(this.markers); // this.addressStart = results[0].formatted_address; засетить это
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({'location': {lat: latitude, lng: longitude}}, (results, status) => {
      // console.log(results);
      // console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 8;
          this.addressStart = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  getAddressZ(markers) {
    console.log('000');
    markers.forEach((value, index, array) => {
      console.log('1');
      if (value.index === 0) {
        console.log('2');
        this.geoCoder.geocode({'location': {lat: markers[value.index].lat, lng: markers[value.index].lng}}, (results, status) => {
          console.log(results);
          console.log(status);
          if (status === 'OK') {
            if (results[0]) {
              this.zoom = 8;
              this.addressStart = results[0].formatted_address;
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }
      if (value.index === 1) {
        this.geoCoder.geocode({'location': {lat: markers[value.index].lat, lng: markers[value.index].lng}}, (results, status) => {
          console.log(results);
          console.log(status);
          if (status === 'OK') {
            if (results[0]) {
              this.zoom = 8;
              this.addressDestination = results[0].formatted_address;
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }
    });
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: MouseEvent) {
    console.log(this.markers.length);
    console.log('yoyo');
    if (this.markers.length < 2) {
      this.markers.push({
        index: this.markers.length,
        lat: $event.coords.lat,
        lng: $event.coords.lng,
        draggable: true
      });
      this.getAddressZ(this.markers);
    }
  }

  mapClickedz($event: MouseEvent) {
    console.log(this.markers.length);
    console.log('zaza');
    this.markers.push({
      index: this.markers.length,
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
    this.getAddress(this.markers[0].lat, this.markers[0].lng);
  }

  markerDragEndz(m: Marker, $event: MouseEvent) {
    console.log('xaxa');
    console.log('dragEnd', m, $event);
  }
}

interface Marker {
  index: number;
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
  icon?: string;
}


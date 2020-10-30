import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';


// import { } from '@types/googlemaps';

@Component({
  selector: 'bax-driver-page',
  templateUrl: './driver-page.component.html',
  styleUrls: ['./driver-page.component.css']
})


// export class Route {
//   constructor(
//     public origin: {},
//     public destination: {},
//     public waypoints: []
//   ) {
//   }
// }

export class DriverPageComponent implements AfterContentInit {

  @ViewChild('googleMap', {static: true}) public gMapElement: ElementRef;

  @ViewChild('startAddress', {static: true}) startAddress: ElementRef;

  @ViewChild('endAddress', {static: true}) endAddress: ElementRef;

  @ViewChild('destinationAddress', {static: true}) destinationAddress: ElementRef;

  public searchControl: FormControl;

  map: google.maps.Map;

  // startRouteMarker = new google.maps.Marker({map: this.map, draggable: true});
  //  endRouteMarker = new google.maps.Marker({map: this.map, draggable: true});
  startRouteMarker: google.maps.Marker;
  endRouteMarker: google.maps.Marker;

  isInitStartRouteMarker: Boolean = false;
  isInitEndRouteMarker: Boolean = false;

  startAddressAutocomplete: google.maps.places.Autocomplete;
  endAddressAutocomplete: google.maps.places.Autocomplete;

  geoCoder: google.maps.Geocoder;

  startAddressInput: string;
  endAddressInput: string;

  // directionsDisplay: google.maps.DirectionsRenderer;
  waypoints: [];
  // directionsService: google.maps.DirectionsService;


  directionsDisplay = new google.maps.DirectionsRenderer({map: this.map, draggable: true});
  directionsService = new google.maps.DirectionsService();

  // countMarkers = 0;
  markers = [];

  constructor(private httpClient: HttpClient) {
  }

  public ngAfterContentInit(): void {
    this.searchControl = new FormControl();
    this.geoCoder = new google.maps.Geocoder();

    this.initMap();
    this.initMarkers();
    this.initPlaces();
    // this.initDirections();
  }

  initMap() {
    const mapOptions = {
      center: new google.maps.LatLng(50.4501, 30.5234),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gMapElement.nativeElement, mapOptions);
  }

  private addStartRouteMarkerListeners() {
    this.startRouteMarker.addListener('dragend', () => this.refreshStartAddressInput());

    // this.endRouteMarker.addListener('dragend', mouseEvent => this.reverseGeocode(mouseEvent))
    // this.map.addListener('click', mouseEvent => this.changeMarkerLocation(mouseEvent.latLng))
    // this.map.addListener('click', () => this.notifyLocationChange())
    // this.map.addListener('click', mouseEvent => this.reverseGeocode(mouseEvent))
  }

  private addEndRouteMarkerListeners() {
    this.endRouteMarker.addListener('dragend', () => this.refreshEndAddressInput());
  }

  private refreshStartAddressInput() {
    this.geoCoder.geocode({location: this.startRouteMarker.getPosition()}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          this.startAddressInput = results[0].formatted_address;

          // if (this.startRouteMarker != null && this.endRouteMarker != null) {
          //   console.log('2');
          //   this.routeTrip();
          // }
        }
      }
    });
  }

  private refreshEndAddressInput() {
    this.geoCoder.geocode({location: this.endRouteMarker.getPosition()}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          this.endAddressInput = results[0].formatted_address;

          // if (this.startRouteMarker != null && this.endRouteMarker != null) {
          //   console.log('2');
          //   this.routeTrip();
          // }
        }
      }
    });
  }

  initMarkers() {
    google.maps.event.addListener(this.map, 'click', (event) => {
      console.log('event' + event.latLng);

      // console.log('countMarkers1' + this.countMarkers);
      // console.log(this.startRouteMarker);

      if (!this.isInitStartRouteMarker) {
        this.startRouteMarker = new google.maps.Marker({map: this.map, draggable: true});
        this.startRouteMarker.setPosition(event.latLng);
        this.startRouteMarker.setVisible(true);
        this.addStartRouteMarkerListeners();
        // this.countMarkers = this.countMarkers + 1;
        this.isInitStartRouteMarker = true;
        this.refreshStartAddressInput();
      } else if (!this.isInitEndRouteMarker) {
        this.endRouteMarker = new google.maps.Marker({map: this.map, draggable: true});
        this.endRouteMarker.setPosition(event.latLng);
        this.endRouteMarker.setVisible(true);
        this.addEndRouteMarkerListeners();
        // this.countMarkers = this.countMarkers + 1;
        this.isInitEndRouteMarker = true;
        this.refreshEndAddressInput();
      }

      if (this.isInitStartRouteMarker && this.isInitEndRouteMarker) {
        this.routeTrip();
      }

      // console.log('countMarkers1' + this.countMarkers);

    });
    // google.maps.event.addListener(this.startAddressAutocomplete, 'place_changed', () => {
    //   if (!this.startRouteMarker) {
    //     this.startRouteMarker = new google.maps.Marker({map: this.map, draggable: true});
    //   }
    //
    //   const place = this.startAddressAutocomplete.getPlace();
    //   if (!place.geometry) {
    //     window.alert('No details available for input: ' + place.name);
    //     return;
    //   }
    //
    //   if (place.geometry.viewport) {
    //     this.map.fitBounds(place.geometry.viewport);
    //
    //   } else {
    //     this.map.setCenter(place.geometry.location);
    //     this.map.setZoom(17);
    //   }
    //
    //   this.startRouteMarker.setPosition(place.geometry.location);
    //   this.startRouteMarker.setVisible(true);
    //
    //   // if (this.startRouteMarker != null && this.endRouteMarker != null) {
    //   //   this.routeTrip();
    //   // }
    //
    //
    // });
    // google.maps.event.addListener(this.startRouteMarker, 'dragend', () => {
    //   console.log(this.startRouteMarker.getPosition());
    //
    //   this.geoCoder = new google.maps.Geocoder();
    //   this.geoCoder.geocode({'location': this.addStartRouteMarker().getPosition()}, (results, status) => {
    //     if (status === google.maps.GeocoderStatus.OK) {
    //       if (results[0]) {
    //         this.startAddressInput = results[0].formatted_address;
    //
    //
    //         // if (this.startRouteMarker != null && this.endRouteMarker != null) {
    //         //   console.log('2');
    //         //   this.routeTrip();
    //         // }
    //       }
    //     }
    //   });
    // });
  }

  initPlaces() {
    // const autocompleteOptions: google.maps.places.AutocompleteOptions = {fields: ['place_id', 'name', 'types', '']};
    // this.originAutocomplete = new google.maps.places.Autocomplete(this.startAddress.nativeElement, autocompleteOptions);
    //  this.destinationAutocomplete = new google.maps.places.Autocomplete(this.destinationAddress.nativeElement, autocompleteOptions);

    this.startAddressAutocomplete = new google.maps.places.Autocomplete(this.startAddress.nativeElement);
    this.endAddressAutocomplete = new google.maps.places.Autocomplete(this.endAddress.nativeElement);

    this.startAddressAutocomplete.bindTo('bounds', this.map);

    google.maps.event.addListener(this.startAddressAutocomplete, 'place_changed', () => {
      if (!this.isInitStartRouteMarker) {
        this.startRouteMarker = new google.maps.Marker({map: this.map, draggable: true});
        this.isInitStartRouteMarker = true;
      }

      const place = this.startAddressAutocomplete.getPlace();
      if (!place.geometry) {
        window.alert('No details available for input: ' + place.name);
        return;
      }

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);

      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }

      this.startRouteMarker.setPosition(place.geometry.location);
      this.startRouteMarker.setVisible(true);

      this.addStartRouteMarkerListeners();
      if (this.isInitStartRouteMarker && this.isInitEndRouteMarker) {
        this.routeTrip();
      }
      // if (this.startRouteMarker != null && this.endRouteMarker != null) {
      //   this.routeTrip();
      // }

      // google.maps.event.addListener(this.startRouteMarker, 'dragend', () => {
      //   this.geoCoder = new google.maps.Geocoder();
      //   this.geoCoder.geocode({location: this.startRouteMarker.getPosition()}, (results, status) => {
      //     if (status === google.maps.GeocoderStatus.OK) {
      //       if (results[0]) {
      //         this.startAddressInput = results[0].formatted_address;
      //
      //
      //         // if (this.startRouteMarker != null && this.endRouteMarker != null) {
      //         //   console.log('2');
      //         //   this.routeTrip();
      //         // }
      //       }
      //     }
      //   });
      // });
    });

    google.maps.event.addListener(this.endAddressAutocomplete, 'place_changed', () => {
      if (!this.isInitEndRouteMarker) {
        this.endRouteMarker = new google.maps.Marker({map: this.map, draggable: true});
        this.isInitStartRouteMarker = true;
      }

      const place = this.endAddressAutocomplete.getPlace();
      if (!place.geometry) {
        window.alert('No details available for input: ' + place.name);
        return;
      }

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }

      this.endRouteMarker.setPosition(place.geometry.location);
      this.endRouteMarker.setVisible(true);

      this.addEndRouteMarkerListeners();

    });
    if (this.isInitStartRouteMarker && this.isInitEndRouteMarker) {
      this.routeTrip();
    }
    // google.maps.event.addListener(this.map, 'click', (event) => {
    //   console.log('event' + event.latLng);
    //   // --
    //   // if (!this.startRouteMarker) {
    //   //   this.startRouteMarker = new google.maps.Marker({map: this.map, draggable: true});
    //   // }
    //   //
    //   // new google.maps.places.
    //   //
    //   // const place = this.startAddressAutocomplete.getPlace();
    //   // if (!place.geometry) {
    //   //   window.alert('No details available for input: ' + place.name);
    //   //   return;
    //   // }
    //   //
    //   // if (place.geometry.viewport) {
    //   //   this.map.fitBounds(place.geometry.viewport);
    //   //
    //   // } else {
    //   //   this.map.setCenter(place.geometry.location);
    //   //   this.map.setZoom(17);
    //   // }
    //   //
    //   // this.startRouteMarker.setPosition(place.geometry.location);
    //   // this.startRouteMarker.setVisible(true);
    //
    //   // --
    //   console.log(this.startRouteMarker);
    //   console.log(!this.startRouteMarker === null);
    //
    //   if (this.countMarkers === 0) {
    //     this.startRouteMarker = new google.maps.Marker({map: this.map, draggable: true});
    //     this.geoCoder = new google.maps.Geocoder();
    //     this.geoCoder.geocode({location: this.startRouteMarker.getPosition()}, (results, status) => {
    //       if (status === google.maps.GeocoderStatus.OK) {
    //         if (results[0]) {
    //           this.startAddressInput = results[0].formatted_address;
    //
    //           console.log(this.startAddressInput);
    //           console.log(this.startAddressAutocomplete);
    //
    //
    //
    //           // if (this.startRouteMarker != null && this.endRouteMarker != null) {
    //           //   console.log('2');
    //           //   this.routeTrip();
    //           // }
    //         }
    //       }
    //     });
    //   } else {
    //     this.endRouteMarker = new google.maps.Marker({map: this.map, draggable: true});
    //
    //   }
    //
    //   // if (this.markers.length < 2) {
    //   //   this.addMarker(event.latLng);
    //   //
    //   // }
    // });

    google.maps.event.addListener(this.map, 'directions_changed', (event) => {
      console.log(event);
      console.log('directionsDisplay');
      // alert(directionsDisplay.directions.routes[0].legs[0].end_location.lat());
      // alert(startRouteMarker.getPosition().lat());
      // computeTotalDistance(directionsDisplay.getDirections());
      // this.computeTotalDistance(this.directionsDisplay.getDirections());

      // this.calcRoute();
    });

  }

  routeTrip() {
    if (this.directionsDisplay != null) {
      this.directionsDisplay.setMap(null);
    }

    const rendererOptions = {map: this.map, draggable: true};
    this.directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    this.directionsDisplay.addListener('directions_changed', () => {
      // alert(directionsDisplay.directions.routes[0].legs[0].end_location.lat());
      // alert(startRouteMarker.getPosition().lat());
      // computeTotalDistance(directionsDisplay.getDirections());
      this.computeTotalDistance(this.directionsDisplay.getDirections());
      console.log('directionsDisplay');
      console.log('directionsDisplay');
    });
    this.calcRoute();

    // const request = {
    //   origin: this.startRouteMarker.getPosition(),
    //   destination: this.endRouteMarker.getPosition(),
    //   waypoints: this.waypoints,
    //   provideRouteAlternatives: true,
    //   travelMode: google.maps.TravelMode.DRIVING
    // };
    //
    // this.directionsService = new google.maps.DirectionsService();
    // this.directionsService.route(request, (response, status) => {
    //   if (status === google.maps.DirectionsStatus.OK) {
    //     console.log(response);
    //     console.log(response.routes[0].legs[0].start_address);
    //     this.directionsDisplay.setDirections(response);
    //   } else {
    //     alert('failed to get directions');
    //   }
    // });
    this.startRouteMarker.setVisible(false);
    this.endRouteMarker.setVisible(false);
  }

  calcRoute() {
    const request = {
      origin: this.startRouteMarker.getPosition(),
      destination: this.endRouteMarker.getPosition(),
      waypoints: this.waypoints,
      provideRouteAlternatives: true,
      travelMode: google.maps.TravelMode.DRIVING
    };
    this.directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      }
    });
  }

  computeTotalDistance(result) {
    let total = 0;
    const myRoute = result.routes[0];
    for (let i = 0; i < myRoute.legs.length; i++) {
      total += myRoute.legs[i].distance.value;
    }
    total = total / 1000;
    console.log(total);
    // document.getElementById('total').innerHTML = total + ' km';
  }

  onKeyUpStartAddress(value) {
    this.startAddress = value;
  }

  onKeyUpEndAddress(value) {
    this.endAddress = value;
  }


  // initDirections() {
  //
  //
  //   google.maps.event.addListener(this.map, 'directions_changed', (event) => {
  //     console.log(event);
  //     console.log('directionsDisplay');
  //     // this.computeTotalDistance(this.directionsDisplay.getDirections());
  //     // this.calcRoute();
  //   });
  // }

  onSave($event) {

    const leg = this.directionsDisplay.getDirections().routes[0].legs[0];
    const wp = leg.via_waypoints;
    const w = [];
    for (let i = 0; i < wp.length; i++) {
      w[i] = {latitude: wp[i].lat(), longitude: wp[i].lng()};
    }

    // const route = {
    //   originLat: leg.start_location.lat(),
    //   originLng: leg.start_location.lng(),
    //   destinationLat: leg.end_location.lat(),
    //   destinationLng: leg.end_location.lng(),
    //   waypoints: w
    // };

    const route = {
      originLatitude: leg.start_location.lat(),
      originLongitude: leg.start_location.lng(),
      destinationLatitude: leg.end_location.lat(),
      destinationLongitude: leg.end_location.lng(),
      waypoint: w
    };

    console.log('Save button is clicked!', $event);
    console.log('request:', route);

    const objectObservable = this.httpClient.post('http://localhost:8080/driver/addUserRoute?access_token=' +
      JSON.parse(window.sessionStorage.getItem('token')).access_token, route).toPromise();

    console.log('request objectObservable:', objectObservable);

    return objectObservable;
  }

  onRouteReset($event) {
    this.startRouteMarker.setMap(null);
    this.endRouteMarker.setMap(null);

    this.startRouteMarker = null;
    this.endRouteMarker = null;

    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setMap(null);

  }
}


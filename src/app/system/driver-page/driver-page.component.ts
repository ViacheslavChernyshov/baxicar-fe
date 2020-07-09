import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';

// import { } from '@types/googlemaps';

@Component({
  selector: 'bax-driver-page',
  templateUrl: './driver-page.component.html',
  styleUrls: ['./driver-page.component.css']
})

export class DriverPageComponent implements AfterContentInit {

  @ViewChild('googleMap', {static: true}) public gMapElement: ElementRef;

  @ViewChild('startAddress', {static: true}) startAddress: ElementRef;

  @ViewChild('endAddress', {static: true}) endAddress: ElementRef;

  @ViewChild('destinationAddress', {static: true}) destinationAddress: ElementRef;

  public searchControl: FormControl;

  map: google.maps.Map;
  startRouteMarker: google.maps.Marker;
  endRouteMarker: google.maps.Marker;

  startAddressAutocomplete: google.maps.places.Autocomplete;
  endAddressAutocomplete: google.maps.places.Autocomplete;

  geoCoder: google.maps.Geocoder;

  startAddressInput: string;
  endAddressInput: string;

  directionsDisplay: google.maps.DirectionsRenderer;
  waypoints: [];
  directionsService: google.maps.DirectionsService;

  markers = [];

  public ngAfterContentInit(): void {
    this.searchControl = new FormControl();
    this.geoCoder = new google.maps.Geocoder();

    this.initMap();
    this.initPlaces();
  }

  initMap() {
    const mapOptions = {
      center: new google.maps.LatLng(50.4501, 30.5234),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gMapElement.nativeElement, mapOptions);
  }

  initPlaces() {
    // const autocompleteOptions: google.maps.places.AutocompleteOptions = {fields: ['place_id', 'name', 'types', '']};
    // this.originAutocomplete = new google.maps.places.Autocomplete(this.startAddress.nativeElement, autocompleteOptions);
    //  this.destinationAutocomplete = new google.maps.places.Autocomplete(this.destinationAddress.nativeElement, autocompleteOptions);

    this.startAddressAutocomplete = new google.maps.places.Autocomplete(this.startAddress.nativeElement);
    this.endAddressAutocomplete = new google.maps.places.Autocomplete(this.endAddress.nativeElement);

    this.startAddressAutocomplete.bindTo('bounds', this.map);

    google.maps.event.addListener(this.startAddressAutocomplete, 'place_changed', () => {
      if (!this.startRouteMarker) {
        this.startRouteMarker = new google.maps.Marker({map: this.map, draggable: true});
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

      if (this.startRouteMarker != null && this.endRouteMarker != null) {
        this.routeTrip();
      }

      // google.maps.event.addListener(this.startRouteMarker, 'dragend', () => {
      //   this.geoCoder = new google.maps.Geocoder();
      //   this.geoCoder.geocode({location: this.startRouteMarker.getPosition()}, (results, status) => {
      //     if (status === google.maps.GeocoderStatus.OK) {
      //       if (results[0]) {
      //         this.startAddressInput = results[0].formatted_address;
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
      if (!this.endRouteMarker) {
        this.endRouteMarker = new google.maps.Marker({map: this.map, draggable: true});
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

      if (this.startRouteMarker != null && this.endRouteMarker != null) {
        this.routeTrip();
      }

      // google.maps.event.addListener(this.endRouteMarker, 'dragend', () => {
      //   this.geoCoder = new google.maps.Geocoder();
      //   this.geoCoder.geocode({location: this.endRouteMarker.getPosition()}, (results, status) => {
      //     if (status === google.maps.GeocoderStatus.OK) {
      //       if (results[0]) {
      //         this.endAddressInput = results[0].formatted_address;
      //         // if (this.startRouteMarker != null && this.endRouteMarker != null) {
      //         //   console.log('4');
      //         //   this.routeTrip();
      //         // }
      //       }
      //     }
      //   });
      // });
    });

    google.maps.event.addListener(this.map, 'click', (event) => {
      console.log('event' + event.latLng);
      this.addMarker(event.latLng);
    });


  }

  addMarker(location) {
    console.log('1');
    console.log(location);
    const marker = new google.maps.Marker({
      position: location,
      map: this.map
    });
    console.log('2');
    console.log(marker);
    this.markers.push(marker);
    console.log('3');
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
    });

    const request = {
      origin: this.startRouteMarker.getPosition(),
      destination: this.endRouteMarker.getPosition(),
      waypoints: this.waypoints,
      provideRouteAlternatives: true,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService = new google.maps.DirectionsService();
    this.directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log(response);
        console.log(response.routes[0].legs[0].start_address);
        this.directionsDisplay.setDirections(response);
      } else {
        alert('failed to get directions');
      }
    });
    this.startRouteMarker.setVisible(false);
    this.endRouteMarker.setVisible(false);
  }


  onKeyUpStartAddress(value) {
    this.startAddress = value;
  }

  onKeyUpEndAddress(value) {
    this.endAddress = value;
  }
}


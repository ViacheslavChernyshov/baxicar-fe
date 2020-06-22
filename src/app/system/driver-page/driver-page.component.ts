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

  public ngAfterContentInit(): void {
    this.searchControl = new FormControl();

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
        this.startRouteMarker = new google.maps.Marker({
          map: this.map,
          draggable: true
        });
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


      console.log(this.startRouteMarker);
      console.log(this.startAddressAutocomplete.getPlace().formatted_address);
      // this.dataService.setSource(this.originAutocomplete.getPlace().formatted_address);
    });

    google.maps.event.addListener(this.endAddressAutocomplete, 'place_changed', () => {
      if (!this.endRouteMarker) {
        this.endRouteMarker = new google.maps.Marker({
          map: this.map,
          draggable: true
        });
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


      console.log(this.endRouteMarker);
      console.log(this.endAddressAutocomplete.getPlace().formatted_address);
      // this.dataService.setSource(this.originAutocomplete.getPlace().formatted_address);
    });


  }

  onKeyUpStartAddress(value) {
    this.startAddress = value;
  }

  onKeyUpEndAddress(value) {
    this.endAddress = value;
  }
}


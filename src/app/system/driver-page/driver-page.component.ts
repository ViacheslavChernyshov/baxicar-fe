import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';

// import { } from '@types/googlemaps';

@Component({
  selector: 'bax-driver-page',
  templateUrl: './driver-page.component.html',
  styleUrls: ['./driver-page.component.css']
})

export class DriverPageComponent implements AfterContentInit {
  @ViewChild('googleMap', {static: true}) public gMapElement: ElementRef;
  map: google.maps.Map;
  startAddress = '';

  public ngAfterContentInit(): void {
    const mapProperty = {
      center: new google.maps.LatLng(50.4501, 30.5234),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gMapElement.nativeElement, mapProperty);

    // var autocomplete = new google.maps.places.Autocomplete(this.startAddress);
    // autocomplete.bindTo('bounds', map);
    //
    // autocomplete.addListener('place_changed', function () {
    //   if (!startRouteMarker) {
    //     startRouteMarker = new google.maps.Marker({
    //       map: map,
    //       draggable: true
    //     });
    //   }
    //   var place = autocomplete.getPlace();
    //   if (!place.geometry) {
    //     window.alert('No details available for input: \'' + place.name + '\'');
    //     return;
    //   }
    //
    //   if (place.geometry.viewport) {
    //     map.fitBounds(place.geometry.viewport);
    //
    //   } else {
    //     map.setCenter(place.geometry.location);
    //     map.setZoom(17);
    //   }
    //
    //   startRouteMarker.setPosition(place.geometry.location);
    //   startRouteMarker.setVisible(true);
    //
    //   if (startRouteMarker != null && finishRouteMarker != null) {
    //     routeTrip();
    //   }
    //
    //   google.maps.event.addListener(startRouteMarker, 'dragend', function () {
    //     geoCoder.geocode({'latLng': startRouteMarker.getPosition()}, function (results, status) {
    //       if (status == google.maps.GeocoderStatus.OK) {
    //         if (results[0]) {
    //           $('#address-input').val(results[0].formatted_address);
    //         }
    //       }
    //     });
    //   });
    // });

  }

  onKeyUp(value) {
    this.startAddress = value;
  }
}


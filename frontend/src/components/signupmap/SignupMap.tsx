import React, { useEffect } from "react";
import "./SignupMap.css";
import LocationOnIcon from "@material-ui/icons/LocationOn";

declare global {
  interface Window {
    kakao: any;
  }
}
const SignupMap = () => {
  let completed = false;
  const handleClick = () => {
    let container = document.getElementById("map");
    let options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    let map = new window.kakao.maps.Map(container, options);

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new window.kakao.maps.services.Geocoder();

    function displayMarker(locPosition, message) {
      // 마커를 생성합니다
      var marker = new window.kakao.maps.Marker({
        map: map,
        position: locPosition,
      });

      var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

      // 인포윈도우를 생성합니다
      var infowindow = new window.kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable,
      });

      function searchAddrFromCoords(coords, callback) {
        // 좌표로 행정동 주소 정보를 요청합니다
        geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
      }

      // 인포윈도우를 마커위에 표시합니다
      infowindow.open(map, marker);

      // 지도 중심좌표를 접속위치로 변경합니다
      map.setCenter(locPosition);
    }

    function searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    }

    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다

    function displayCenterInfo(result, status) {
      const infoDiv = document.getElementById("dong");
      if (status === window.kakao.maps.services.Status.OK) {
        for (var i = 0; i < result.length; i++) {
          // 행정동의 region_type 값은 'H' 이므로
          if (result[i].region_type === "H") {
            if (!infoDiv) {
              break;
            }
            infoDiv.innerHTML = result[i].address_name;
            break;
          }
        }
      }
    }
    const authButton = document.getElementById("authButton");
    const map__button = document.getElementById("map__button")?.remove();

    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude, // 위도
        lon = position.coords.longitude; // 경도
        
        var locPosition = new window.kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
        
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
        searchAddrFromCoords(map.getCenter(), displayCenterInfo);
        completed = true;
        if (authButton) {
          authButton.innerText = "위치 인증 완료";
        }
      });
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      
      var locPosition = new window.kakao.maps.LatLng(33.450701, 126.570667),
        message = "geolocation을 사용할수 없어요..";

      displayMarker(locPosition, message);
      if (authButton) {
        authButton.innerText = "위치 인증 실패";
      }
    }
  };

  return (
    <div className="map">
      <div id="map"></div>
      <div id="map__button">
        <button
          style={{backgroundColor:"#fb8267", borderRadius:"5px"}}
          id="authButton"
          value=""
          onClick={handleClick}
          disabled={completed}
        >
          위치 인증하기
        </button>
      </div>
      <div id="dong">
        <p></p>
      </div>
    </div>
  );
};

export default SignupMap;
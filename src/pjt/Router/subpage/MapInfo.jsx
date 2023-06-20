import React, { useEffect, useState, useRef } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
const { kakao } = window;

//마커 다시 클릭하거나하면 올라온 설명

const MapInfo = ({ keyword, depart, setDepart, arrival, setArrival, addKakaoPin }) => {
    const [info, setInfo] = useState();
    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState();

    const departureBtnClickHandler = () => {
        console.log("[MapInfo] departureBtnClickHandler CLICKED!!");
        if (info && info.position) {
            const { lat, lng } = info.position;
            const { content } = info;
            setDepart({ latitude: lat, longitude: lng, name: content });
            console.log("출발지 위도:", lat);
            console.log("출발지 경도:", lng);
            console.log("출발지 이름:", content);
        }
    };

    const arrivalBtnClickHandler = () => {
        console.log("[MapInfo] arrivalBtnClickHandler CLICKED!!");
        if (info && info.position) {
            const { lat, lng } = info.position;
            const { content } = info;
            setArrival({ latitude: lat, longitude: lng, name: content });
            console.log("도착지 위도:", lat);
            console.log("도착지 경도:", lng);
            console.log("도착지 이름:", content);
        }
    };

    useEffect(() => {
        console.log("addKakaoPin[0]--> ", addKakaoPin[0]);
        console.log("addKakaoPin[1]--> ", addKakaoPin[1]);

        if (!map) return;
        const ps = new kakao.maps.services.Places();
        //libraries=services에서 지원하는 Places

        if (keyword == "") {
            //아직 default를 안잡아줘서 오류걸리니 부산으로 임시로 해놓음
            keyword = "대구";
        }

        //ps.keywordSearch("센텀 맛집", (data, status, _pagination) => {
        ps.keywordSearch(keyword, (data, status, _pagination) => {
            if (status === kakao.maps.services.Status.OK) {
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가합니다
                const bounds = new kakao.maps.LatLngBounds();
                let markers = [];
                console.log("data ---> ", data);

                for (var i = 0; i < data.length; i++) {
                    // @ts-ignore
                    markers.push({
                        position: {
                            lat: data[i].y,
                            lng: data[i].x,
                        },
                        //content: data[i].place_name,
                        content: data[i].place_name,
                        content2: data[i].place_url,
                    });
                    // @ts-ignore
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                    // console.log(new kakao.maps.LatLng(data[i].y, data[i].x));
                }
                setMarkers(markers);

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                map.setBounds(bounds);
            }
        });
    }, [map, keyword, addKakaoPin]);

    return (
        <Map // 로드뷰를 표시할 Container
            center={{
                lat: 35.8714354,
                lng: 128.601445,
                //lat: addKakaoPin[0],
                //lng: addKakaoPin[1],
            }}
            style={{
                borderRadius: "20px",
                width: "700px",
                height: "500px",
            }}
            level={3}
            onCreate={setMap}
        >
            {markers.map((marker) => (
                <MapMarker
                    key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                    position={marker.position}
                    onClick={() => setInfo(marker)}
                >
                    {info && info.content === marker.content && (
                        <div
                            style={{
                                color: "#000",
                                width: "150px",
                                height: "70px",
                                textAlign: "center",
                                paddingTop: "8px",
                            }}
                        >
                            <a href={marker.content2} target='_blank' style={{ fontSize: "0.8em", fontWeight: "bold" }}>
                                {marker.content}
                            </a>
                            <div
                                style={{
                                    marginTop: "10px",
                                }}
                            >
                                <button
                                    onClick={departureBtnClickHandler}
                                    style={{
                                        width: "60px",
                                        height: "30px",
                                        fontSize: "0.8em",
                                        fontWeight: "bold",
                                        color: "#fff",
                                        backgroundColor: "#f00",
                                        textAlign: "center",
                                        lineHeight: "30px",
                                    }}
                                >
                                    출&nbsp;&nbsp;발
                                </button>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <button
                                    onClick={arrivalBtnClickHandler}
                                    style={{
                                        width: "60px",
                                        height: "30px",
                                        fontSize: "0.8em",
                                        fontWeight: "bold",
                                        color: "#fff",
                                        backgroundColor: "#00f",
                                        textAlign: "center",
                                        lineHeight: "30px",
                                    }}
                                >
                                    도&nbsp;&nbsp;착
                                </button>
                            </div>
                        </div>
                    )}
                </MapMarker>
            ))}
        </Map>
    );
};

export default MapInfo;

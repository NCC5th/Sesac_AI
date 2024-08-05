// 전역 변수 선언
let regionChart = null, barChart = null;
let map;
let geojsonLayer;
let storedData = [];  // 자르기전 특정구 데이터 핵심 데이터를 저장하기 위한 배열
let mapLine;
let seoulGeoData;
let highlightLayer; // 강조된 레이어를 저장하기 위한 변수
let imageLayer; // 이미지 레이어를 저장하기 위한 변수

// 페이지가 로드되면 초기화 작업을 수행합니다.
document.addEventListener('DOMContentLoaded', function() {
    initializeSelects();
    initializeMap();
    document.getElementById('districtSelect').addEventListener('change', updateDongSelect);
    document.getElementById('districtSelect').addEventListener('change', updateCharts);
    document.getElementById('districtSelect').addEventListener('change', updateMap);
    document.getElementById('dongSelect').addEventListener('change', updateCharts);
    document.getElementById('dongSelect').addEventListener('change', updateMap);
    document.getElementById('yearSelect').addEventListener('change', updateCharts);
});

// 동의 좌표를 지도에 표시하는 함수
function drawLines(coords) {
    if (mapLine) {
        map.removeLayer(mapLine);
    }

    mapLine = L.polyline(coords, {color: 'red'}).addTo(map);
    map.fitBounds(mapLine.getBounds()); // 라인을 화면에 맞게 조정
}

// 지도 초기화 함수 (기존 함수 수정)
function initializeMap() {
    map = L.map('map-container').setView([37.5665, 126.9780], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // GeoJSON 데이터 로드
    loadGeoData().then(() => {
        if (seoulGeoData) {
            geojsonLayer = L.geoJSON(seoulGeoData, {
                style: function(feature) {
                    return {
                        fillColor: 'blue',
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: function(feature, layer) {
                    layer.on({
                        click: function(e) {
                            // 기존 강조 레이어 제거
                            if (highlightLayer) {
                                map.removeLayer(highlightLayer);
                            }
                            if (imageLayer) {
                                map.removeLayer(imageLayer);
                            }

                            // 선택된 구역 강조 표시
                            highlightLayer = L.geoJSON(feature, {
                                style: function() {
                                    return {
                                        fillColor: 'yellow',
                                        weight: 5,
                                        color: 'orange',
                                        fillOpacity: 0.7
                                    };
                                }
                            }).addTo(map);

                            // 선택된 구역의 중심에 이미지 추가
                            const bounds = layer.getBounds();
                            const center = bounds.getCenter();
                            imageLayer = L.marker(center, {
                                icon: L.icon({
                                    iconUrl: '/path/to/your/image.png', // 사용할 이미지 URL
                                    iconSize: [50, 50], // 이미지 크기 조정
                                    iconAnchor: [25, 25], // 이미지 중심을 기준으로 앵커 조정
                                    zIndexOffset: 1000 // 최상위 레이어로 설정
                                })
                            }).addTo(map);

                            // 구역을 화면에 맞게 조정
                            map.fitBounds(bounds);
                        }
                    });
                }
            }).addTo(map);

            // 초기 지도 업데이트
            updateMap();
        }
    });
}

// GeoJSON 데이터를 로드하는 함수
async function loadGeoData() {
    try {
        const response = await fetch('/data/seoul_municipalities_geo.json');
        seoulGeoData = await response.json();
    } catch (error) {
        console.error('Error loading GeoJSON data:', error);
    }
}

// 구와 동의 좌표를 찾는 함수
function findCoord(dong, district) {
    if (!seoulGeoData) {
        console.error('GeoJSON data not loaded');
        return null;
    }

    // district 선택 시 해당 지역의 좌표 찾기
    const feature = seoulGeoData.features.find(f => f.properties.name === district);
    if (!feature) {
        console.error(`District not found: ${district}`);
        return null;
    }

    if (feature.geometry.type === 'Polygon') {
        return feature.geometry.coordinates[0];
    } else if (feature.geometry.type === 'MultiPolygon') {
        return feature.geometry.coordinates[0][0];
    } else {
        console.error(`Unsupported geometry type: ${feature.geometry.type}`);
        return null;
    }
}

// 지도 업데이트 함수
function updateMap() {
    const dong = document.getElementById("dongSelect").value;
    const district = document.getElementById("districtSelect").value;

    if (!seoulGeoData) {
        console.error('GeoJSON data not loaded');
        return;
    }

    if (geojsonLayer) {
        // 현재 GeoJSON 레이어를 제거
        map.removeLayer(geojsonLayer);
    }

    // 새로 선택된 구역 강조 표시
    geojsonLayer = L.geoJSON(seoulGeoData, {
        style: function(feature) {
            return {
                fillColor: feature.properties.name === district ? 'yellow' : 'blue',
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        },
        onEachFeature: function(feature, layer) {
            if (feature.properties.name === district) {
                layer.bindPopup(`<strong>${feature.properties.name}</strong>`).openPopup();
                map.fitBounds(layer.getBounds()); // 구역을 화면에 맞게 조정
            }
        }
    }).addTo(map);

    // 동의 좌표 표시 (옵션)
    const coords = findCoord(dong, district);
    if (coords) {
        drawLines(coords);
    }
}

// 구와 동의 리스트를 서버에서 받아오는 함수
function initializeSelects() {
    fetch('/myapp/district')
        .then(response => response.json())
        .then(district => {
            populateSelect('districtSelect', district);
            updateDongSelect(); // 구 선택에 따른 동 초기화
        })
        .catch(error => console.error('Error loading districts:', error));
}

// 선택 메뉴에 옵션을 추가하는 함수
function populateSelect(id, options) {
    const select = document.getElementById(id);
    select.innerHTML = '';
    options.forEach(option => {
        const el = document.createElement('option');
        el.textContent = option;
        el.value = option;
        select.appendChild(el);
    });
}

// 구 선택에 따라 동 선택 메뉴를 업데이트 하는 함수
function updateDongSelect() {
    const selectedDistrict = document.getElementById('districtSelect').value;
    const years = Array.from({length: 16}, (_, i) => 2012 + i);
    populateSelect('yearSelect', years);
    
    if (!selectedDistrict) return;

    fetch(`/myapp/dong?district=${encodeURIComponent(selectedDistrict)}`)
        .then(response => response.json())
        .then(chartDong => {
            // 중복 제거를 위해 Set 사용
            const uniqueOptions = new Set([selectedDistrict, ...chartDong]);
            populateSelect('dongSelect', Array.from(uniqueOptions));
            updateCharts(); // 동 데이터와 함께 차트 업데이트
            updateMap(); // 지도 업데이트
        })
        .catch(error => console.error('Error loading dongs:', error));
}

// 차트를 업데이트하는 함수
function updateCharts() {
    updateRegionChart();
    updateBarChart();
}

// region 차트(년도별 인구수)를 업데이트하는 함수
function updateRegionChart() {
    const selectedDistrict = document.getElementById('districtSelect').value;
    const selectedDong = document.getElementById('dongSelect').value;

    if (!selectedDistrict || !selectedDong) return;

    fetch(`/myapp/chart?district=${encodeURIComponent(selectedDistrict)}&dong=${encodeURIComponent(selectedDong)}`)
        .then(response => response.json())
        .then(data => {
            // data에서 연도와 값을 추출
            const years = Object.keys(data)
                .filter(key => key.startsWith('year_'))
                .map(key => parseInt(key.replace('year_', ''), 10));
            const values = years.map(year => data[`year_${year}`]);

            // 데이터 가공: 앞부분 2개 데이터를 제거하고 저장
            let chartData = years.map((year, index) => ({
                year: year,
                value: values[index]
            }));

            // 데이터를 별도 저장 (슬라이스 전)
            storedData = [...chartData];

            // 첫 2개 데이터 제거
            chartData = chartData.slice(2);

            // 평균 증가량 % 계산
            const initial = chartData[0].value;
            const final = chartData[chartData.length - 1].value;
            const averageGrowthRate = ((Number(final) - Number(initial)) / (Number(initial)+Number(final))) * 100;

            // 이전에 존재하는 차트 삭제
            if (regionChart) {
                regionChart.destroy();
            }










            // 차트 생성
            const ctx = document.getElementById('populationByRegion').getContext('2d');
            regionChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.map(item => item.year),
                    datasets: [{
                        type: 'bar',
                        label: '기초생활 수급자 수',
                        data: chartData.map(item => item.value),
                        backgroundColor: chartData.map(item =>
                            item.year < 2023
                                ? getComputedStyle(document.documentElement).getPropertyValue('--chart-color-past').trim()
                                : getComputedStyle(document.documentElement).getPropertyValue('--chart-color-future').trim()
                        ),
                        borderColor: chartData.map(item =>
                            item.year < 2023
                                ? getComputedStyle(document.documentElement).getPropertyValue('--chart-border-past').trim()
                                : getComputedStyle(document.documentElement).getPropertyValue('--chart-border-future').trim()
                        ),
                        borderWidth: 1
                    }, {
                        type: 'line',
                        label: '추이선',
                        data: chartData.map(item => item.value),
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--chart-line-color').trim(),
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1 // 추이선을 부드럽게 하기 위한 옵션
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                padding: 10
                            }
                        },
                        x: {
                            ticks: {
                                padding: 10
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `${selectedDong}의 2022년까지의 증가량: ${averageGrowthRate.toFixed(2)}%`,
                            padding: {
                                top: 10,
                                bottom: 5
                            }
                        }
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 0,
                            bottom: 0
                        }
                    }
                }
            });

            // 평균 증가량 표시
            document.getElementById('regionChartText').textContent =
                `${selectedDong}의 2022년까지의 증가량: ${averageGrowthRate.toFixed(2)}%`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// 데이터 가져오기 및 처리
async function getDistrictData(district, year) {
    if (!district || isNaN(year)) return Promise.resolve([]);

    return await fetch(`/myapp/data?district=${encodeURIComponent(district)}&year=${encodeURIComponent(year)}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(chartDong => {
            if (!Array.isArray(chartDong)) {
                console.error('Unexpected data format:', chartDong);
                return [];
            }

            return chartDong
                .filter(item => item.area2 !== '소계' && !item.area2.includes('구'))
                .map(item => ({
                    dong: item.area2,
                    value: item.year
                }));
        })
        .catch(error => {
            console.error('Error fetching district data:', error);
            return [];
        });
}

// 수급자 수가 가장 적은/많은 동을 찾는 함수
function findExtremeDong(districtData, isMax) {
    return districtData.reduce((extreme, current) => 
        isMax ? (current.value > extreme.value ? current : extreme)
              : (current.value < extreme.value ? current : extreme)
    );
}

// 바 차트 업데이트 함수
async function updateBarChart() {
    const selectedDistrict = document.getElementById('districtSelect').value;
    const selectedDong = document.getElementById('dongSelect').value;
    const selectedYear = parseInt(document.getElementById('yearSelect').value, 10);

    const districtData = await getDistrictData(selectedDistrict, selectedYear);
    let chartData, backgroundColor, borderColor;

    // '-구' 또는 '전체'가 선택된 경우
    if (selectedDong === selectedDistrict) {
        chartData = districtData;
        const minDong = findExtremeDong(districtData, false);
        const maxDong = findExtremeDong(districtData, true);

        backgroundColor = chartData.map(item => {
            if (item.dong === minDong.dong) return getComputedStyle(document.documentElement).getPropertyValue('--chart-color-min').trim();
            if (item.dong === maxDong.dong) return getComputedStyle(document.documentElement).getPropertyValue('--chart-color-max').trim();
            return getComputedStyle(document.documentElement).getPropertyValue('--chart-color-all').trim();
        });

        borderColor = chartData.map(item => {
            if (item.dong === minDong.dong) return getComputedStyle(document.documentElement).getPropertyValue('--chart-border-min').trim();
            if (item.dong === maxDong.dong) return getComputedStyle(document.documentElement).getPropertyValue('--chart-border-max').trim();
            return getComputedStyle(document.documentElement).getPropertyValue('--chart-border-all').trim();
        });
    } else {
        // 특정 동이 선택된 경우
        const selectedDongData = districtData.find(item => item.dong === selectedDong);
        const minDong = findExtremeDong(districtData, false);
        const maxDong = findExtremeDong(districtData, true);

        chartData = [minDong, selectedDongData, maxDong];
        backgroundColor = [
            getComputedStyle(document.documentElement).getPropertyValue('--chart-color-min').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--chart-color-selected').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--chart-color-max').trim()
        ];
        borderColor = [
            getComputedStyle(document.documentElement).getPropertyValue('--chart-border-min').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--chart-border-selected').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--chart-border-max').trim()
        ];
    }

    if (window.barChart) {
        window.barChart.destroy();
    }

    const ctx = document.getElementById('populationByYear').getContext('2d');
    window.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.map(item => [`${item.dong}`, `(${item.value}명)`]),
            datasets: [{
                label: '기초생활 수급자 수',
                data: chartData.map(item => item.value),
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        padding: 10
                    }
                },
                x: {
                    ticks: {
                        callback: function(val, index) {
                            const label = this.getLabelForValue(val);
                            return label[0]; // 동 이름만 반환
                        },
                        padding: 10
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: `${selectedYear}년 ${selectedDistrict} 기초생활 수급자 통계`,
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                subtitle: {
                    display: selectedDong !== selectedDistrict,
                    text: selectedDong !== selectedDistrict ? `${chartData[0].dong} (최소), ${chartData[1].dong} (선택됨), ${chartData[2].dong} (최대)` : '',
                    padding: {
                        bottom: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            return Array.isArray(label) ? label.join(' ') : label;
                        }
                    }
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 0,
                    bottom: 0
                }
            }
        }
    });

    const totalRecipients = districtData
        .filter(item => !item.dong.includes('구')) // 구 데이터 제외
        .reduce((sum, item) => sum + item.value, 0);

    document.getElementById('yearChartText').textContent =
        `${selectedYear}년 ${selectedDistrict} 전체 기초생활 수급자 수: ${totalRecipients}명`;
}

// 초기 차트 업데이트
updateCharts();
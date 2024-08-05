// 페이지가 로드되면 초기화 작업을 수행합니다.
document.addEventListener('DOMContentLoaded', function() {
    initializeSelects();
    document.getElementById('districtSelect').addEventListener('change', updateDongSelect);
    document.getElementById('districtSelect').addEventListener('change', updateCharts);
    document.getElementById('dongSelect').addEventListener('change', updateCharts);
    document.getElementById('yearSelect').addEventListener('change', updateCharts);
});
let regionChart = null, barChart = null;

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
            populateSelect('dongSelect', [...chartDong]);
            updateCharts(); // 동 데이터와 함께 차트 업데이트
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
                .filter(key => key.startsWith('year_')) // 'year_'로 시작하는 키만 필터링
                .map(key => parseInt(key.replace('year_', ''), 10)); // 'year_' 제거 후 정수로 변환
            const values = years.map(year => data[`year_${year}`]); // 각 연도의 값을 가져옴
            
            // 데이터 가공: 앞부분 2개 데이터를 제거
            let chartData = years.map((year, index) => ({
                year: year,
                value: values[index]
            })).slice(2); // 첫 2개 데이터를 제거

            // 평균 증가량 % 계산
            const initial = chartData[0].value;
            const final = chartData[chartData.length - 6].value;
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

// --------------------------------- 바차트 업그레이드-------------------------

// 데이터 가져오기 및 처리
async function getDistrictData(district, year) {
    const selectedDistrict = document.getElementById('districtSelect').value;
    const selectedYear = parseInt(document.getElementById('yearSelect').value, 10);

    // 선택된 구역이 없거나 연도가 유효하지 않은 경우 빈 배열 반환
    if (!selectedDistrict || isNaN(selectedYear)) return Promise.resolve([]);

    // URL 쿼리 파라미터 인코딩
    return await fetch(`/myapp/data?district=${encodeURIComponent(selectedDistrict)}&year=${encodeURIComponent(selectedYear)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(chartDong => {
            // 데이터 구조 확인 및 필터링
            if (!Array.isArray(chartDong)) {
                console.error('Unexpected data format:', chartDong);
                return [];
            }

            const filteredData = chartDong
                .filter(item => item.area2 !== '소계') // "소계"가 아닌 항목만 필터링
                .map(item => ({
                    dong: item.area2, // 동 이름
                    value: item.year // 연도에 해당하는 값
                }));
            
            return filteredData;
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

// 중간값을 가진 동을 찾는 함수
function findMedianDong(districtData) {
    const sortedData = [...districtData].sort((a, b) => a.value - b.value);
    const medianIndex = Math.floor(sortedData.length / 2);
    return sortedData[medianIndex];
}

async function updateDistrictStatistics() {
    const district = document.getElementById('districtSelect').value;
    const year = parseInt(document.getElementById('yearSelect').value, 10);

    // 데이터 가져오기
    console.log('updateDistrictStatistics');
    const districtData = await getDistrictData(district, year);
    if (districtData === null) {
        console.error('Error updating district statistics:', error);
    }
	
    if (districtData.length === 0) {
        console.log('No data available for the selected district and year.');
        return;
    }
	
	
	
    // 최대/최소값 동 찾기
    const maxDong = findExtremeDong(districtData, true);
    const minDong = findExtremeDong(districtData, false);

    // 중간값 동 찾기
    const medianDong = findMedianDong(districtData);

    // 결과 출력
    console.log('동 중 가장 수급자 수가 많은 동:', maxDong);
    console.log('동 중 가장 수급자 수가 적은 동:', minDong);
    console.log('중간값을 가진 동:', medianDong);

    // 결과를 DOM에 표시
    document.getElementById('maxDong').textContent = `가장 수급자 수가 많은 동: ${maxDong.dong} (${maxDong.value})`;
    document.getElementById('minDong').textContent = `가장 수급자 수가 적은 동: ${minDong.dong} (${minDong.value})`;
    document.getElementById('medianDong').textContent = `중간값을 가진 동: ${medianDong.dong} (${medianDong.value})`;
}

// 바 차트 업데이트 함수
async function updateBarChart() {
	console.log('updateBarChart');
    const selectedDistrict = document.getElementById('districtSelect').value;
    const selectedDong = document.getElementById('dongSelect').value;
    const selectedYear = parseInt(document.getElementById('yearSelect').value, 10);

    const districtData = await getDistrictData(selectedDistrict, selectedYear);
    let chartData, backgroundColor, borderColor;

    if (selectedDong === '전체') {
        chartData = districtData;
        const minValue = Math.min(...chartData.map(item => item.value));
        const maxValue = Math.max(...chartData.map(item => item.value));

        backgroundColor = chartData.map(item => {
            if (item.value === minValue) return getComputedStyle(document.documentElement).getPropertyValue('--chart-color-all-min').trim();
            if (item.value === maxValue) return getComputedStyle(document.documentElement).getPropertyValue('--chart-color-all-max').trim();
            return getComputedStyle(document.documentElement).getPropertyValue('--chart-color-all').trim();
        });

        borderColor = chartData.map(item => {
            if (item.value === minValue) return getComputedStyle(document.documentElement).getPropertyValue('--chart-border-all-min').trim();
            if (item.value === maxValue) return getComputedStyle(document.documentElement).getPropertyValue('--chart-border-all-max').trim();
            return getComputedStyle(document.documentElement).getPropertyValue('--chart-border-all').trim();
        });
    } else {
        const selectedDongData = districtData.find(item => item.dong === selectedDong);
        const minDong = findExtremeDong(districtData, false);
        const maxDong = findExtremeDong(districtData, true);
        
        const maxValue = maxDong.value;
    	const updatedDistrictData = districtData.filter(item => item.value !== maxValue);
		const maxDong2 = findExtremeDong(updatedDistrictData, true);

        chartData = [minDong, selectedDongData, maxDong2];
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
        // [변경 1] 라벨을 배열로 변경
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
                    // [변경 2] x축 ticks callback 함수 수정
                    callback: function(val, index) {
                        const label = this.getLabelForValue(val);
                        if (selectedDong === '전체') {
                            return label;
                        } else {
                            return label[0]; // 동 이름만 반환
                        }
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
                display: selectedDong !== '전체',
                text: selectedDong !== '전체' ? `${chartData[0].dong} (최소), ${chartData[1].dong} (선택됨), ${chartData[2].dong} (최대)` : '',
                padding: {
                    bottom: 10
                }
            },
            // [변경 3] 툴팁 설정 추가
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        if (Array.isArray(label)) {
                            return label.join(' '); // 툴팁에서는 한 줄로 표시
                        }
                        return label;
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

    document.getElementById('yearChartText').textContent =
        `${selectedYear}년 ${selectedDistrict} 전체 기초생활 수급자 수: ${districtData.reduce((sum, item) => sum + item.value, 0)}명`;
}

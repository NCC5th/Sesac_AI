let emotionChart; // 전역 변수로 선언하여 전역 범위에서 차트를 관리

document.getElementById('analyzeButton').addEventListener('click', function() {
    // /emotion 엔드포인트로 AJAX 요청
    fetch('/myapp/emotion')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // JSON 데이터에서 감정 데이터 추출
            const emotionData = data;
            const labels = Object.keys(emotionData);
            const values = Object.values(emotionData);

            // 기존 차트가 있다면 삭제
            if (emotionChart) {
                emotionChart.destroy();
            }

            // 차트 생성
            const ctx = document.getElementById('emotionChart').getContext('2d');
            emotionChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Emotion Distribution',
                        data: values,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',   // Anger
                            'rgba(54, 162, 235, 0.2)',   // Happiness
                            'rgba(75, 192, 192, 0.2)',   // Sadness
                            'rgba(255, 206, 86, 0.2)',   // Neutral
                            'rgba(153, 102, 255, 0.2)',  // Fear
                            'rgba(255, 159, 64, 0.2)',   // Surprise
                            'rgba(201, 203, 207, 0.2)'   // Confuse
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(201, 203, 207, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right', // 범례를 오른쪽으로 옮김
                            align: 'start', // 범례를 세로로 나열
                            labels: {
                                boxWidth: 60, // 범례 아이콘의 너비 조정
                                padding: 40, // 범례 텍스트와 아이콘 사이의 간격 조정
                                font: {
                                    size: 25 // 범례 텍스트 크기 조정
                                }
                            }
                        }
                    },
                    layout: {
                        padding: {
                            top: 10, // 차트와 텍스트 사이의 거리 조정
                            right: 20 // 차트와 범례 사이에 더 많은 여백 추가
                        }
                    }
                }
            });

            // 이미지 숨기고 차트 보이기
            document.getElementById('emotion-image-container').style.display = 'none';
            document.querySelector('.chart.first-chart').style.display = 'block';
        })
        .catch(error => console.error('Fetch error:', error));
});

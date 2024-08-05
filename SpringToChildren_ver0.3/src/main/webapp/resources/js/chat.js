document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatInputContainer = document.querySelector('.chat-input-container');
    const graphButton = document.querySelector('.graph-button');
    const chartContainer = document.querySelector('.chart-container');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const returnButton = document.querySelector('.return-button');
    const footer = document.querySelector('footer');
    let isChartVisible = false;
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });
    document.querySelector('.chat-input-button').addEventListener('click', function() {
        sendMessage();
    });
    // 수정: graphButton 이벤트 리스너 수정
    graphButton.addEventListener('click', function() {
        toggleView(true);
    });
    // 수정: returnButton 이벤트 리스너 수정
    returnButton.addEventListener('click', function() {
        toggleView(false);
    });
    // 추가: toggleView 함수
    function toggleView(showChart) {
        isChartVisible = showChart;
        adjustLayout();
    }
    // 수정: adjustLayout 함수 전체 수정
    function adjustLayout() {
        if (window.innerWidth <= 768) {
            if (isChartVisible) {
                chatbotContainer.style.display = 'none';
                chartContainer.style.display = 'flex';
                returnButton.style.display = 'flex';
                chatInputContainer.style.display = 'none';
            } else {
                chartContainer.style.display = 'none';
                chatbotContainer.style.display = 'flex';
                returnButton.style.display = 'none';
                chatInputContainer.style.display = 'flex';
            }
            graphButton.style.display = 'flex';
        } else {
            chartContainer.style.display = 'flex';
            chatbotContainer.style.display = 'flex';
            returnButton.style.display = 'none';
            chatInputContainer.style.display = 'flex';
            graphButton.style.display = 'none';
            isChartVisible = false;
        }
    }
    // 추가: 초기 레이아웃 설정
    adjustLayout();
    // 추가: 윈도우 크기 변경 시 레이아웃 조정
    window.addEventListener('resize', adjustLayout);
    function sendMessage() {
        if (userInput.value.trim() !== "") {
            // 사용자 메시지 추가
            const userMessage = document.createElement('div');
            userMessage.classList.add('chat-message', 'user-message');
            userMessage.textContent = userInput.value;
            chatMessages.appendChild(userMessage);
           fetch('/myapp/addConversation', {
             method: 'POST',
              headers: {
               'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                  body: new URLSearchParams({ message: userInput.value })
                    })
            fetch('/myapp/chat', {
             method: 'POST',
              headers: {
               'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                  body: new URLSearchParams({ message: userInput.value })
                    })
                    .then(response => response.text())
                    .then(data => {
            // 챗봇 응답 추가
            const botMessage = document.createElement('div');
            botMessage.classList.add('chat-message', 'bot-message');
            botMessage.textContent = data;
            chatMessages.appendChild(botMessage);
            // 입력 필드 비우기
            userInput.value = "";
            // 스크롤을 맨 아래로 이동
            chatMessages.scrollTop = chatMessages.scrollHeight;
            })
            .catch(error=> console.error('Error:', error));
        }
    }
});
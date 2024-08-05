<%@ page language="java" contentType="text/html; charset=UTF-8"
isELIgnored = "false"
    pageEncoding="UTF-8"%>
    <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<html>
<head>
<meta charset="UTF-8">
    <title>HealthPro LAB</title>
    <link rel="stylesheet" href="<c:url value='/css/service.css'/>">
</head>
 <header id="header">
        <nav>
            <div class="logo">
                <a href="<c:url value='/main'/>">
                    <img src="image/logo3.png" alt="Logo">
                </a>
            </div>
            <button id="menu-toggle" class="menu-icon">
                <img src="image/menu-icon.png" alt="Menu Icon">
            </button>
            <div id="menu-dropdown" class="user-dropdown">
                <a href="<c:url value='/service'/>" onclick="showSection('serviceExplain'); return false;">서비스 소개</a>
                <a href="<c:url value='/serviceA'/>" onclick="showSection('service'); return false;">서비스</a>
                <a href="<c:url value='/serviceA'/>" onclick="showSection('patent'); return false;">특허 및 저작권</a>
                <a href="#" onclick="showSection('contact'); return false;">Contact</a>
            </div>

         <div class="menu">
                <ul>
                    <li><a href="<c:url value='/service'/>">서비스 소개</a></li>
                    <li>
                        <a href="<c:url value='/serviceA'/>">서비스</a>
                        <ul class="submenu">
                            <li><a href="<c:url value='/serviceA'/>">ChatBot</a></li>
                            <li><a href="<c:url value='/dashboard'/>">Prediction</a></li>
                        </ul>
                    </li>
                    <li><a href="#">특허 및 저작권</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </nav>
    </header>
    <main>
        <div class="container">
            <div class="overlay-text">
                <p class="intro-text">아이들</p>
                <h1>새로운 대화의 시작</h1>
                <div class="chatbot-wrapper">
                    <p class="chatbot-text">CHATBOT</p>
                </div>
                <div class="start-button-wrapper">
                    <a href="<c:url value='/serviceA'/>" class="start-button">시작하기
                    <img src="image/arrow.png" alt="화살표 아이콘" class="arrow-icon">
                    </a>
                </div>
            </div>
            <div class="chatbot-description">
                <h2><span class="highlight">생성형 AI 서비스</span> CHATBOT</h2>
                <p>생성형 AI는 대량의 데이터로부터 학습하여 사용자의 요구를 이해하고 적절한 응답을 생성하는 기술입니다. 이를 활용한 챗봇은 자연어 처리(NLP)를 통해 다양한 주제에 대해 대화를 나눌 수 있습니다. </p>
            </div>
            <div class="image-box">
                <img src="image/chatbot-conversation.png" alt="Chatbot Conversation">
            </div>
            <div class="chartbot-description">
                <h2><span class="highlight">그래프 서비스</span> CHART</h2>
                <p>그래프 서비스는 데이터 시각화 도구를 통해 복잡한 데이터를 이해하기 쉽게 표현합니다. 이를 활용한 차트는 사용자가 다양한 데이터셋을 시각적으로 분석하고 인사이트를 도출할 수 있도록 도와줍니다. 사용자 인터페이스(UI)를 통해 손쉽게 차트를 생성하고, 여러 형식의 그래프를 제공하여 데이터 분석에 유용하게 활용할 수 있습니다.</p>
            </div>
            <div class="image-box">
                <img src="image/chatbot-conversation.png" alt="Chatbot Conversation">
            </div>
        </div>
    </main>
    <footer>
        <div class="footer-content">
            <div class="contact-info">
                <p>Team : SpringToChildren</p>
                <p>팀원 : 임수한 박지수 박우람 양호준</p>
                <p>ⓒ SpringToChildren ALL RIGHTS RESERVED.</p>
            </div>
        </div>
    </footer>
    <script src="js/service.js"></script>
</body>
</html>
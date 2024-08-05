<!--<%@ page language="java" contentType="text/html; charset=UTF-8"
isELIgnored = "false"
pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>-->
<html>
<head>
    <meta charset="UTF-8">
    <title>SpringToChildren LAB - Service A</title>
    <link rel="stylesheet" href="<c:url value='/css/serviceA.css'/>">
</head>
<body>
    <header id="header">
        <nav>
            <div class="logo">
                <a href="<c:url value='/main'/>">
                    <img src="image/logo3.png" alt="Logo">
                </a>
            </div>
            <button id="menu-toggle">
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

    <div class="container">
        <div class="chatbot-container" id="chatbot-container">
            <div class="chatbot-box">
                <div class="chat-window">
                    <div class="chat-messages" id="chat-messages">
                        <!-- Chat messages will be displayed here -->
                    </div>
                    <div class="chat-input-container">
                        <button class="graph-button" id="graph-button"></button>
                        <input type="text" id="user-input" class="chat-input" placeholder="메시지를 입력하세요...">
                        <button class="chat-input-button"></button>
                    </div>
                </div>
            </div>
        </div>

        <div class="chart-container">
            <div class="emotion-image-container" id="emotion-image-container">
                <img src="image/emotion.png" alt="Emotion Analysis">
            </div>
            <div class="chart-content">
                <div class="chart first-chart" style="display: none;">
                    <canvas id="emotionChart"></canvas>
                    <div id="yearChartText" class="chart-text"></div>
                </div>
                <div class="text-container">
                    <p>아래 버튼을 누르면 채팅간에 감정을 분석합니다</p>
                </div>
            </div>
            <button id="analyzeButton">감정분석</button>
        </div>
    </div>

    <button class="return-button" id="return-button"></button>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="<c:url value='/js/chat.js'/>"></script>
    <script src="<c:url value='/js/emotion.js'/>"></script>
    <script src="js/serviceA.js"></script>
</body>
</html>



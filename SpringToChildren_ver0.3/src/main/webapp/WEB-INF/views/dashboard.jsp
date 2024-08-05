<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<html>
<head>
    <meta charset="UTF-8">
    <title>SpringToChildren LAB - Dashboard</title>
    <link rel="stylesheet" href="<c:url value='/css/dashboard.css'/>">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
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
                            <li><a href="<c:url value='/serviceA'/>">Prediction</a></li>
                        </ul>
                    </li>
                    <li><a href="#">특허 및 저작권</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <div class="container">
        <div class="map-container" id="map-container"></div>
        <div class="chart-container">
            <div class="controls">
                <div class="select-container">
                    <select id="districtSelect"></select>
                </div>
                <div class="select-container">
                    <select id="dongSelect"></select>
                </div>
                <div class="select-container">
                    <select id="yearSelect"></select>
                </div>
            </div>
            <div class="chart first-chart">
                <canvas id="populationByYear"></canvas>
                <div id="yearChartText" class="chart-text"></div>
            </div>
            <div class="chart second-chart">
                <canvas id="populationByRegion"></canvas>
                <div id="regionChartText" class="chart-text"></div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="<c:url value='/js/dashboard.js'/>"></script>
</body>
</html>
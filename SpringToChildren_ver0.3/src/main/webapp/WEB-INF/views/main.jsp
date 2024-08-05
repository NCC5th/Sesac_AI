<%@ page language="java" contentType="text/html; charset=UTF-8"
isELIgnored = "false"
    pageEncoding="UTF-8"%>
    <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<html>
<head>
<meta charset="UTF-8">
    <title>SpringToChildren LAB</title>
   <link rel="stylesheet" href="<c:url value='/css/main.css'/>">
    
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
                <a href="<c:url value='/dashboard'/>" onclick="showSection('patent'); return false;">특허 및 저작권</a>
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


        <div class="hero">
            <video autoplay loop muted playsinline>
                <source src="video/video2_2.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="overlay-textTop">
                <h6top>Welcome to <br>
                    SpringToChildren</h6top>
                <br>
                <br>
                <p6top>Discover the best solutions for your Children.</p6top><br>
                <p6top>keep your children.</p6top>
            </div>
        </div>

        <section class="service">
            <h2>Main Service</h2>
            <h4>아이들을 위한 전문적인 솔루션을<br>
                SpringToChildren의 서비스로 만나보세요.</h4>
                <div class="service-item service-item-a">
                    <div class="service-text">
                        <h3>심리상담을 위한 생상형 챗봇</h3>
                        <h5>아이들의 멘탈케어를 위한 심리상당 챗봇 서비스</h5>
                        <p>#청소년 #심리상담 #멘탈케어</p>
                        <a href="<c:url value='/serviceA'/>">더 알아보기</a>
                    </div>
                    <div class="service-image">
                        <img src="image/chatbot.png" alt="Service A">
                    </div>
                </div>
                
                <div class="service-item service-item-b">
                    <div class="service-text">
                        <h3>인구 예측 데이터</h3>
                        <h5>고령층 질병 분석을 통한 지역별 질병률 및 건강상태 상관 분석 및 예측 서비스</p></h5>
                        <p>#서울 #동별 #구별</p>
                        <a href="<c:url value='/serviceA'/>">더 알아보기</a>
                    </div>
                    <div class="service-image">
                        <img src="image/chart.png" alt="Service B">
                    </div>
                </div>
                
        </section>

        <div class="fixed-background">
            <div class="overlay-text">
                <h2>Make your Children's Phychological Activity Better</h2>
                <p>We are here to be your best partner for a healthy life.</p>
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

    <script src="js/main.js"></script>
</body>
</html>

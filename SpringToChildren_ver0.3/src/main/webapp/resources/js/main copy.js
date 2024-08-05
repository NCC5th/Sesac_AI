document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('header');
    const heroSection = document.querySelector('.hero');
    const serviceItems = document.querySelectorAll('.service-item');
    const scrollImage = document.querySelector('.scroll-image');
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('nav .menu'); // 수정: 올바른 menu 요소 선택

    // Intersection Observer 설정 (헤더)
    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0
    });

    observer.observe(heroSection);

    // Fade-in 효과를 위한 Intersection Observer 설정
    const fadeInOptions = {
        threshold: 0.5 // 요소가 화면에 50% 이상 나타날 때 작동
    };

    const fadeInObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1"; // 요소가 화면에 진입하면 opacity를 1로 변경하여 fade-in 효과 보여주기
                entry.target.style.transition = "opacity 1s"; // 페이드 인 효과에 대한 트랜지션 추가
                fadeInObserver.unobserve(entry.target); // 요소가 한 번 페이드 인되면 더 이상 관찰하지 않음
            }
        });
    }, fadeInOptions);

    // 각 서비스 아이템을 관찰 대상으로 등록
    serviceItems.forEach(item => {
        item.style.opacity = "0"; // 초기 상태를 투명하게 설정
        fadeInObserver.observe(item);
    });

    // Scroll Image Grow 효과 설정
    const scrollImageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('grow');
            } else {
                entry.target.classList.remove('grow');
            }
        });
    }, {
        threshold: 0.5 // 요소가 화면에 50% 이상 나타날 때 작동
    });

    // 이미지 섹션을 관찰 대상으로 등록
    scrollImageObserver.observe(scrollImage);

    // 메뉴 토글 기능 추가
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('show');
    });

    // 초기 로드 시와 리사이즈 시 메뉴 토글 아이콘 및 메뉴 상태 관리
    function handleMenuToggle() {
        // 화면 너비에 따라 메뉴 토글 아이콘 및 메뉴 상태 관리
        if (window.innerWidth >= 768) {
            menuToggle.style.display = 'none'; // 너비가 768px 이상이면 메뉴 토글 아이콘 숨김
            menu.classList.remove('show'); // 메뉴 숨김
        } else {
            menuToggle.style.display = 'block'; // 너비가 768px 미만이면 메뉴 토글 아이콘 표시
            // 메뉴 숨김 (기본적으로 숨기도록 설정)
            menu.classList.remove('show'); 
        }
    }

    // 초기 로드 시 메뉴 토글 아이콘 및 메뉴 상태 관리 함수 호출
    handleMenuToggle();

    // 창 크기 변경 시 메뉴 토글 아이콘 및 메뉴 상태 관리 함수 호출
    window.addEventListener('resize', handleMenuToggle);
});




// header footer 구획 구분을 위한 추가 코드
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('.menu');

    menuToggle.addEventListener('click', function() {
        menu.classList.toggle('show');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const menuDropdown = document.getElementById('menu-dropdown');

    // 메뉴 토글 기능
    menuToggle.addEventListener('click', () => {
        menuDropdown.classList.toggle('show');
    });

    // 섹션 표시 함수
    function showSection(sectionId) {
        const allSections = document.querySelectorAll('.section');
        allSections.forEach(section => {
            section.classList.remove('active');
        });

        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
        }

        // 드롭다운 메뉴 숨기기
        menuDropdown.classList.remove('show');
    }

    // 메뉴 항목 클릭 이벤트
    const menuItems = document.querySelectorAll('.user-dropdown a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== 'serviceA.html') {
                e.preventDefault();
                const sectionId = this.getAttribute('onclick').match(/'(.+)'/)[1];
                showSection(sectionId);
            }
        });
    });

    // 화면 크기 변경 시 메뉴 상태 관리
    function handleMenuToggle() {
        if (window.innerWidth >= 768) {
            menuDropdown.classList.remove('show');
        }
    }

    window.addEventListener('resize', handleMenuToggle);

});
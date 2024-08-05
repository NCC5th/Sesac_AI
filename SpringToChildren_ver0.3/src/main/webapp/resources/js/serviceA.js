// 문서가 로드되면 실행되는 이벤트 리스너
document.addEventListener('DOMContentLoaded', function () {
    // 필요한 DOM 요소들을 선택합니다.
    const header = document.getElementById('header');
    const heroSection = document.querySelector('.hero');
    const serviceItems = document.querySelectorAll('.service-item');
    const scrollImage = document.querySelector('.scroll-image');
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('nav .menu');

    // 헤더 스크롤 효과를 위한 Intersection Observer 설정
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

    // 서비스 아이템의 Fade-in 효과를 위한 Intersection Observer 설정
    const fadeInOptions = {
        threshold: 0.5 // 요소가 화면에 50% 이상 나타날 때 작동
    };

    const fadeInObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1"; // 요소가 화면에 진입하면 opacity를 1로 변경
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

    // 화면 크기에 따른 메뉴 표시 관리 함수
    function handleMenuToggle() {
        if (window.innerWidth >= 768) {
            menuToggle.style.display = 'none'; // 화면이 넓으면 메뉴 토글 버튼 숨김
            menu.classList.remove('show'); // 메뉴 숨김
        } else {
            menuToggle.style.display = 'block'; // 화면이 좁으면 메뉴 토글 버튼 표시
            menu.classList.remove('show'); // 기본적으로 메뉴 숨김
        }
    }

    // 초기 로드 시 메뉴 상태 설정
    handleMenuToggle();
    // 화면 크기 변경 시 메뉴 상태 관리
    window.addEventListener('resize', handleMenuToggle);
});

// 메뉴 및 섹션 관리를 위한 추가 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuDropdown = document.getElementById('menu-dropdown');

    // 메뉴 토글 버튼 클릭 이벤트
    menuToggle.addEventListener('click', function() {
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

        // 섹션 변경 후 드롭다운 메뉴 숨기기
        menuDropdown.classList.remove('show');
    }

    // 메뉴 항목 클릭 이벤트 처리
    const menuItems = document.querySelectorAll('.user-dropdown a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const sectionId = this.getAttribute('onclick').match(/'(.+)'/)[1];

            if (href === '#' || href.startsWith('#')) {
                // 내부 링크인 경우 기본 동작 방지 및 섹션 전환
                e.preventDefault();
                showSection(sectionId);
            } else {
                // 외부 링크인 경우 기본 동작 유지 (페이지 이동)
                // 필요한 경우 여기에 추가 로직을 넣을 수 있습니다.
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
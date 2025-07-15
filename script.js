document.addEventListener('DOMContentLoaded', function () {
    const loginContainer = document.getElementById('loginContainer');
    const mainContent = document.getElementById('main');
    const videoContainer = document.getElementById('videos');
    
    // كائن يحتوي على بيانات جميع الطلاب
    const studentsData = {
        '45454': {
            name: 'عمرو محمد عبدالمنعم',
            phone: '01011717876',
            email: 'mamro8529@gmail.com',
            language: 'عربي',
            image: 'https://i.imgur.com/JqYeS5n.jpg',
            welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير'
        },
        '18234': {
            name: 'طالب آخر',
            phone: '01000000000',
            email: 'student@example.com',
            language: 'عربي',
            image: 'https://example.com/student.jpg',
            welcomeMessage: 'مرحباً بك في المنصة التعليمية'
        },
        '19543': {
            name: 'محمد أحمد',
            phone: '01111111111',
            email: 'mohamed@example.com',
            language: 'عربي',
            image: 'https://example.com/mohamed.jpg',
            welcomeMessage: 'أهلاً بك في منصتنا التعليمية'
        }
    };

    // دالة لحفظ حالة تسجيل الدخول
    function saveLoginState(username) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
    }

    // دالة للتحقق من حالة تسجيل الدخول
    function checkLoginState() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const username = localStorage.getItem('username');

        if (isLoggedIn === 'true' && username) {
            loadVideoContent('CODE1', username);
            showMainContent();
        } else {
            showLogin();
        }
    }

    function showLogin() {
        loginContainer.style.display = 'flex';
        mainContent.style.display = 'none';
    }

    function showMainContent() {
        loginContainer.style.display = 'none';
        mainContent.style.display = 'block';
    }

    function loadVideoContent(code, username) {
        

        const welcomeBanner = `
        <div class="welcome-banner">
            <div class="welcome-text">
                <h3>مرحباً ${student.name}</h3>
                <p>${student.welcomeMessage}</p>
            </div>
            <div class="profile-img-container">
                <img src="${student.image}" alt="صورة البروفايل">
                <div class="show-details">اظهار التفاصيل</div>
                <div class="profile-info" id="profileInfo">
                    <p><strong>الاسم:</strong> ${student.name}</p>
                    <p><strong>رقم التليفون:</strong> ${student.phone}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${student.email}</p>
                    <p><strong>لغة الدراسة:</strong> ${student.language}</p>
                </div>
            </div>
        </div>
        `;

        let videoHTML = welcomeBanner;
        
        if (code === 'CODE1') {
            videoHTML += `
                <h2>الفصل الثاني</h2>
                <select id="videoSelector" class="form-select">
                    <option value="video0">اختر الفيديو...</option>
                    <option value="video1">شرح الفصل الثاني (الجزء الأول)</option>
                    <option value="video2">شرح الفصل الثاني (الجزء الثاني)</option>
                    <option value="video3">شرح الفصل الثاني (الجزء الثالث)</option>
                    <option value="video4">تدريبات الدرس الأول</option>
                    <option value="video5">تدريبات الدرس الثاني</option>
                    <option value="video6">تدريبات الدرس الثالث</option>
                    <option value="video7">تدريبات الدرس الرابع</option>
                </select>
                
                <div class="video" id="video1">
                    <h3 class="video-title">شرح الفصل الثاني (الجزء الأول)</h3>
                    <iframe src="https://drive.google.com/file/d/1JsbhZ8UWhqh9p2RlecTBrCa5L_8vgJCR/preview" allowfullscreen></iframe>
                </div>

                <div class="video" id="video2">
                    <h3 class="video-title">شرح الفصل الثاني (الجزء الثاني)</h3>
                    <iframe src="https://drive.google.com/file/d/1fOeP-_8VgSYQkiR5BeMhL0Xt422Wv7Vc/preview" allowfullscreen></iframe>
                </div>
                
                <div class="video" id="video3">
                    <h3 class="video-title">شرح الفصل الثاني (الجزء الثالث)</h3>
                    <iframe src="https://drive.google.com/file/d/17dQEtszqYpmPmpU3GKYfsiyjGmwCHKhq/preview" allowfullscreen></iframe>
                </div>
             
                <div class="video" id="video4">
                    <h3 class="video-title">تدريبات الدرس الأول</h3>
                    <h4 class="video-part">الجزء الأول</h4>
                    <iframe src="https://drive.google.com/file/d/1Xafno2FXrklMu3N5udbsb_FAPQwQI0Na/preview" allowfullscreen></iframe>
                    
                    <h4 class="video-part">الجزء الثاني</h4>
                    <iframe src="https://drive.google.com/file/d/1Uqmcfk2Ujoq2X_u8-6K3MTIA7B9NQ-RY/preview" allowfullscreen></iframe>
                    
                    <h4 class="video-part">الجزء الثالث</h4>
                    <iframe src="https://drive.google.com/file/d/1b4NmhBy8VpzKk4wl0ktq9CvVDU5RVhgJ/preview" allowfullscreen></iframe>
                    
                    <h4 class="video-part">الجزء الرابع</h4>
                    <iframe src="https://drive.google.com/file/d/1oYsLZZQhUABeYI9aH2Ac1_eewUfYOC1D/preview" allowfullscreen></iframe>
                </div>
                
                <div class="video" id="video5">
                    <h3 class="video-title">تدريبات الدرس الثاني</h3>
                    <h4 class="video-part">الجزء الأول</h4>
                    <iframe src="https://drive.google.com/file/d/1n8VJZWh6MZLM5EJZoydah6GQzsvpx_pN/preview" allowfullscreen></iframe>
                    
                    <h4 class="video-part">الجزء الثاني</h4>
                    <iframe src="https://drive.google.com/file/d/1XcTlpD_pOpFchYzye_OzLf54RoxlfVWl/preview" allowfullscreen></iframe>
                </div>
                
                <div class="video" id="video6">
                    <h3 class="video-title">تدريبات الدرس الثالث</h3>
                    <h4 class="video-part">الجزء الأول</h4>
                    <iframe src="https://drive.google.com/file/d/1FSiqPd1aI2N6ObTw1IqskrkkT5A3wDeV/preview" allowfullscreen></iframe>
                    
                    <h4 class="video-part">الجزء الثاني</h4>
                    <iframe src="https://drive.google.com/file/d/18uhR-4gz7w9Npu9Ronztyu-IMukHurld/preview" allowfullscreen></iframe>
                    
                    <h4 class="video-part">الجزء الثالث</h4>
                    <iframe src="https://drive.google.com/file/d/1B0R8m9BavCxYEtXOz1qMHiQMEHqCebAA/preview" allowfullscreen></iframe>
                </div>
                
                <div class="video" id="video7">
                    <h3 class="video-title">تدريبات الدرس الرابع</h3>
                    <h4 class="video-part">الجزء الأول</h4>
                    <iframe src="https://drive.google.com/file/d/11MiD_5E587CPRDIRi4j6nMth61_8YbiW/preview" allowfullscreen></iframe>
                    
                    <h4 class="video-part">الجزء الثاني</h4>
                    <iframe src="https://drive.google.com/file/d/1hSEX0DJvQTrggrkmtIm0NxyoEFvd_RN4/preview" allowfullscreen></iframe>
                    
                    <h4 class="video-part">الجزء الثالث</h4>
                    <iframe src="https://drive.google.com/file/d/17czArTr3Mms54nFtW00TIeA8PHAS-vpc/preview" allowfullscreen></iframe>
                </div>
            `;
        } 
        
        videoContainer.innerHTML = videoHTML;

        // إضافة حدث النقر على صورة البروفايل أو نص "اظهار التفاصيل"
        const profileImgContainer = document.querySelector('.profile-img-container');
        if (profileImgContainer) {
            profileImgContainer.addEventListener('click', function(e) {
                e.stopPropagation();
                const profileInfo = document.getElementById('profileInfo');
                profileInfo.classList.toggle('active');
            });
        }

        // إغلاق معلومات البروفايل عند النقر في أي مكان آخر
        document.addEventListener('click', function() {
            const profileInfo = document.getElementById('profileInfo');
            if (profileInfo) {
                profileInfo.classList.remove('active');
            }
        });

        const videoSelector = document.getElementById('videoSelector');
        if (videoSelector) {
            videoSelector.addEventListener('change', function () {
                const selectedVideo = videoSelector.value;
                const videos = document.querySelectorAll('.video');
                videos.forEach(video => video.style.display = 'none');
                const videoToShow = document.getElementById(selectedVideo);
                if (videoToShow) {
                    videoToShow.style.display = 'block';
                }
            });
        }
    }

    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const errorMessage = document.getElementById('errorMessage');

        const validUsernames = {
            'CODE1': ['45454','222']
        };

        let code = '';
        for (const [key, values] of Object.entries(validUsernames)) {
            if (values.includes(username)) {
                code = key;
                break;
            }
        }

        if (code) {
            errorMessage.textContent = '';
            saveLoginState(username); // حفظ حالة تسجيل الدخول
            loadVideoContent(code, username);
            showMainContent();
            
            // Scroll to videos section
            document.getElementById('videos').scrollIntoView({ behavior: 'smooth' });
        } else {
            errorMessage.textContent = 'Invalid access code, please try again';
        }
    });

    // عند تحميل الصفحة، التحقق من حالة تسجيل الدخول
    checkLoginState();
});

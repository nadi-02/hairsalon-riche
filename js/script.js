document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  // Header Scroll Effect
  const header = document.querySelector('.header');
  if (header && !header.classList.contains('not-top')) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Fade-in Animation on Scroll
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const checkFade = () => {
    fadeElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.85) {
        element.classList.add('appear');
      }
    });
  };

  window.addEventListener('scroll', checkFade);
  checkFade(); // Check on initial load
  setTimeout(checkFade, 100); // Check again slightly after load for safety
  // Calendar Generation
  const calendarHead = document.getElementById('calendarHead');
  const calendarBody = document.getElementById('calendarBody');
  const btnPrevWeek = document.getElementById('prevWeek');
  const btnNextWeek = document.getElementById('nextWeek');
  
  if (calendarHead && calendarBody) {
    let currentStartDate = new Date(); // Start from today
    
    const timeSlots = [];
    for(let h=10; h<=18; h++) {
      timeSlots.push(`${h}:00`);
      if(h !== 18) {
        timeSlots.push(`${h}:30`);
      }
    }
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    
    const checkAvailability = (dateObj, timeStr) => {
      // 今日より前（過去）の日付は×にする
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(dateObj);
      targetDate.setHours(0, 0, 0, 0);
      
      if (targetDate < today) return 'x';

      // 火曜日は定休日
      if (dateObj.getDay() === 2) return 'closed';
      
      // 簡単な空き状況シミュレーション
      const seed = dateObj.getDate() + parseInt(timeStr.split(':')[0]);
      if (seed % 5 === 0) return 'x';
      return 'o';
    };

    const renderCalendar = (startDate) => {
      calendarHead.innerHTML = '';
      calendarBody.innerHTML = '';
      
      // Thead
      const trHead = document.createElement('tr');
      const thTime = document.createElement('th');
      thTime.textContent = '時間';
      trHead.appendChild(thTime);
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const th = document.createElement('th');
        th.innerHTML = `${d.getMonth() + 1}/${d.getDate()}<br>(${days[d.getDay()]})`;
        trHead.appendChild(th);
      }
      calendarHead.appendChild(trHead);
      
      // Tbody
      timeSlots.forEach(time => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = time;
        tr.appendChild(th);
        
        for (let i = 0; i < 7; i++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          
          const td = document.createElement('td');
          const status = checkAvailability(d, time);
          
          if (status === 'closed') {
            td.innerHTML = '<span class="status-x">休</span>';
          } else if (status === 'x') {
            td.innerHTML = '<span class="status-x">×</span>';
          } else {
            const dateStr = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${time.replace(':','')}`;
            td.innerHTML = `<label><input type="radio" name="datetime" value="${dateStr}" required><span>○</span></label>`;
          }
          
          tr.appendChild(td);
        }
        calendarBody.appendChild(tr);
      });
    };

    renderCalendar(currentStartDate);

    if (btnPrevWeek) {
      btnPrevWeek.addEventListener('click', () => {
        currentStartDate.setDate(currentStartDate.getDate() - 7);
        renderCalendar(currentStartDate);
      });
    }

    if (btnNextWeek) {
      btnNextWeek.addEventListener('click', () => {
        currentStartDate.setDate(currentStartDate.getDate() + 7);
        renderCalendar(currentStartDate);
      });
    }
  }

  // Modal Handling
  const form = document.querySelector('.reservation-form');
  const modal = document.getElementById('confirmModal');
  const btnCancel = document.getElementById('btnCancel');
  const btnSubmitFinal = document.getElementById('btnSubmitFinal');
  const btnCloseModalIcon = document.getElementById('btnCloseModalIcon');

  if (form && modal) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      document.getElementById('confirmName').textContent = form.name.value;
      document.getElementById('confirmPhone').textContent = form.phone.value;
      
      const stylistSelect = form.stylist;
      document.getElementById('confirmStylist').textContent = stylistSelect.options[stylistSelect.selectedIndex].text;
      
      const menuSelect = form.menu;
      document.getElementById('confirmMenu').textContent = menuSelect.options[menuSelect.selectedIndex].text;
      
      document.getElementById('confirmMessage').textContent = form.message.value || 'なし';
      
      const selectedDate = form.querySelector('input[name="datetime"]:checked');
      if (selectedDate) {
        const val = selectedDate.value;
        const year = val.substring(0,4);
        const month = val.substring(4,6);
        const day = val.substring(6,8);
        const time = val.substring(9,11) + ':' + val.substring(11,13);
        document.getElementById('confirmDate').textContent = `${year}年${month}月${day}日 ${time}`;
      } else {
        document.getElementById('confirmDate').textContent = '未選択';
      }

      modal.classList.add('active');
    });

    btnCancel.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    if (btnCloseModalIcon) {
      btnCloseModalIcon.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    btnSubmitFinal.addEventListener('click', () => {
      modal.classList.remove('active');
      alert('ご予約リクエストを送信しました。（※デモのため実際の送信は行われません）');
      form.reset();
      
      const checkedRadio = form.querySelector('input[name="datetime"]:checked');
      if (checkedRadio) checkedRadio.checked = false;
    });
  }
});

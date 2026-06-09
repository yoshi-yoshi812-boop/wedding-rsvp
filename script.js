/* ===================================================
   Wedding RSVP — script.js
   - アレルギー詳細の表示切り替え
   - Formspree 非同期送信 + 成功メッセージ
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── アレルギー詳細 表示切り替え ──
  const allergyRadios = document.querySelectorAll('input[name="allergy"]');
  const allergyWrap   = document.getElementById('allergyWrap');

  allergyRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'ございます') {
        allergyWrap.classList.add('open');
      } else {
        allergyWrap.classList.remove('open');
      }
    });
  });

  // ── 交通手段詳細 表示切り替え ──
  const transportRadios = document.querySelectorAll('input[name="transport"]');
  const transportWrap   = document.getElementById('transportWrap');

  transportRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === '公共交通機関') {
        transportWrap.classList.add('open');

    } else {

        transportWrap.classList.remove('open');

        document.querySelector(
            'input[name="taxi"][value="タクシー利用しない"]'
        ).checked = true;

        taxiDetailWrap.classList.remove('open');
      }
    });
  });

  // ── 同行者詳細 表示切り替え ──
  const taxiRadios = document.querySelectorAll('input[name="taxi"]');
  const taxiDetailWrap   = document.getElementById('taxiDetailWrap');

  taxiRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'タクシー利用する') {
        taxiDetailWrap.classList.add('open');
      } else {
        taxiDetailWrap.classList.remove('open');
      }
    });
  });

  // ── Formspree 非同期送信 ──
  const form = document.getElementById('rsvpForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-send');
    btn.disabled = true;
    btn.textContent = '送信中…';

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // 成功
        form.style.display = 'none';

        // 成功メッセージを挿入
        const msg = document.createElement('div');
        msg.className = 'success-msg show';
        msg.innerHTML = `
          <p style="font-family: 'Playfair Display', serif;font-size:15px;color:#9a8880;letter-spacing:0.12em;">
            ご回答ありがとうございます。<br>
            大変お手数ですが当日は11:20までに<br>
            ご来場いただけますようお願いいたします。<br>
            お会いできることを楽しみにしております!</p>
          <p style="margin-top:14px;font-family: 'Playfair Display', serif;font-size:10px;color:#9a8880;letter-spacing:0.12em;">
            Yoshiki &amp; Kasumi
          </p>
        `;
        form.parentNode.insertBefore(msg, form);
      } else {
        // エラー
        alert('送信に失敗しました。お手数ですが、もう一度お試しください。');
        btn.disabled = false;
        btn.innerHTML = '<span>✦</span> 送　信 <span>✦</span>';
      }
    } catch {
      alert('通信エラーが発生しました。ネットワークをご確認の上、再度お試しください。');
      btn.disabled = false;
      btn.innerHTML = '<span>✦</span> 送　信 <span>✦</span>';
    }
  });

});
/* ===================================================
   Wedding RSVP — script.js
   - アレルギー詳細の表示切り替え
   - 交通手段 / タクシー詳細の表示切り替え
   - スクロール連動フェードイン（Intersection Observer）
   - Formspree 非同期送信 + 成功メッセージ
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAllergyToggle();
  initTransportToggle();
  initScrollReveal();
  initFormSubmit();
});

/* ── アレルギー詳細 表示切り替え ── */
function initAllergyToggle() {
  const allergyRadios = document.querySelectorAll('input[name="allergy"]');
  const allergyWrap = document.getElementById('allergyWrap');
  if (!allergyWrap) return;

  allergyRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      allergyWrap.classList.toggle('open', radio.value === 'ございます');
    });
  });
}

/* ── 交通手段 / タクシー詳細 表示切り替え ── */
function initTransportToggle() {
  const transportRadios = document.querySelectorAll('input[name="transport"]');
  const transportWrap = document.getElementById('transportWrap');
  const taxiRadios = document.querySelectorAll('input[name="taxi"]');
  const taxiDetailWrap = document.getElementById('taxiDetailWrap');
  if (!transportWrap || !taxiDetailWrap) return;

  transportRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const isPublicTransport = radio.value === '公共交通機関';
      transportWrap.classList.toggle('open', isPublicTransport);

      if (!isPublicTransport) {
        const noTaxi = document.querySelector('input[name="taxi"][value="タクシー利用しない"]');
        if (noTaxi) noTaxi.checked = true;
        taxiDetailWrap.classList.remove('open');
      }
    });
  });

  taxiRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      taxiDetailWrap.classList.toggle('open', radio.value === 'タクシー利用する');
    });
  });
}

/* ── スクロール連動フェードイン ──
   対象要素に .reveal を付与し、画面内に入ったら .is-visible を追加。
   一度表示された要素は監視を解除（再度隠れても消えない）。 */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.reveal'
  );
  if (!targets.length) return;

  // 万一 IntersectionObserver が使えない環境では即表示にフォールバック
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('reveal', 'is-visible'));
    return;
  }

// フォーム項目 (.fb) は左右交互＋少しずつ遅延表示
let fbIndex = 0;

targets.forEach(el => {

  el.classList.add("reveal");

  if (!el.classList.contains("fb")) {

    el.classList.add("reveal-up");

  } else {

    if (fbIndex % 2 === 0) {
      el.classList.add("reveal-left");
    } else {
      el.classList.add("reveal-right");
    }

    el.style.transitionDelay = `${Math.min(fbIndex * 0.08, 0.4)}s`;

    fbIndex++;
  }

});

  // observe() 直後は要素がすでに画面内にあるとコールバックがほぼ即座に発火し、
  // ブラウザが opacity:0 の初期状態を描画する前に is-visible が付いてしまい
  // トランジションが効かない（一瞬でジャンプする）ことがある。
  // rAFを2回挟むことで、初期状態が確実に1フレーム描画されてから監視を開始する。
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      targets.forEach(el => observer.observe(el));
    });
  });
}

/* ── Formspree 非同期送信 ── */
function initFormSubmit() {
  const form = document.getElementById('rsvpForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-send');
    const originalLabel = btn.innerHTML;
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
        showSuccessMessage(form);
      } else {
        alert('送信に失敗しました。お手数ですが、もう一度お試しください。');
        btn.disabled = false;
        btn.innerHTML = originalLabel;
      }
    } catch {
      alert('通信エラーが発生しました。ネットワークをご確認の上、再度お試しください。');
      btn.disabled = false;
      btn.innerHTML = originalLabel;
    }
  });
}

/* ── 送信成功メッセージの表示 ── */
function showSuccessMessage(form) {
  form.style.display = 'none';

  const msg = document.createElement('div');
  msg.className = 'success-msg show';
  msg.innerHTML = `
    <p class="success-msg-body">
      ご回答ありがとうございます。<br>
      大変お手数ですが当日は11:20までに<br>
      ご来場いただけますようお願いいたします。<br>
      お会いできることを楽しみにしております!
    </p>
    <p class="success-msg-sign">
      Yoshiki &amp; Kasumi
    </p>
  `;
  form.parentNode.insertBefore(msg, form);
  msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
}




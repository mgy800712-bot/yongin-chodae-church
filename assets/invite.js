/* 개인 초대 링크 — ?from=이름 · &tel=번호
   index.html · welcome.html 이 함께 쓴다. 값이 없으면 아무것도 바꾸지 않는다.
   index.html 이 '처음 오시는 분께' 를 덮개로 불러온 뒤 그 조각에도 다시 적용하므로
   INV.apply(root) 로 꺼내 둔다. */
(function () {
  var q = new URLSearchParams(location.search);
  // 이름은 공백 정리 후 20자까지. textContent 로만 넣으므로 HTML 은 그대로 글자가 된다(이스케이프).
  var from = (q.get('from') || '').replace(/\s+/g, ' ').trim().slice(0, 20);
  var tel = (q.get('tel') || '').replace(/\D/g, '').slice(0, 15);   // 숫자만 남긴다

  // 아이폰은 문자 본문 구분자가 &, 안드로이드는 ?
  var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var sms = tel && 'sms:' + tel + (ios ? '&' : '?') + 'body=' +
    encodeURIComponent((from ? from + '님, ' : '') + '이번 주일에 교회 한번 가볼게요!');

  var keep = new URLSearchParams();
  if (from) keep.set('from', from);
  if (tel) keep.set('tel', tel);

  function apply(root) {
    root = root || document;

    // 1) 초대 문구 — .inv-to 자리마다. data-wait 가 붙은 자리는 "기다리고 있어요"
    if (from) {
      var tos = root.querySelectorAll('.inv-to');
      for (var i = 0; i < tos.length; i++) {
        tos[i].textContent = from + ('wait' in tos[i].dataset ? '님이 기다리고 있어요' : '님이 당신을 초대합니다');
        tos[i].hidden = false;
      }
    }

    // 2) '이번 주에 가볼게요' — 번호가 있을 때만 보인다
    if (sms) {
      var gos = root.querySelectorAll('.inv-go');
      for (var j = 0; j < gos.length; j++) { gos[j].href = sms; gos[j].hidden = false; }
    }

    // 3) 사이트 안에서 페이지를 옮겨도 from·tel 을 들고 간다
    if (from || tel) {
      var as = root.querySelectorAll('a[href]');
      for (var k = 0; k < as.length; k++) {
        var h = as[k].getAttribute('href');
        if (!/^(\.\/)?(index|welcome|invite)\.html/.test(h) && h !== './' && h !== '.') continue;
        as[k].setAttribute('href', h.split(/[?#]/)[0] + '?' + keep);
      }
    }
  }

  window.INV = { apply: apply, from: from, tel: tel };
  apply(document);
})();

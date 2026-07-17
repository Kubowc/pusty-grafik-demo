(() => {
  'use strict';

  const STORAGE_KEY = 'pusty-grafik-v1';
  const DAY = 86400000;
  const plDate = new Intl.DateTimeFormat('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });
  const plFullDate = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
  const money = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 });

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const iso = date => date.toISOString().slice(0, 10);
  const dateFromToday = days => iso(new Date(Date.now() + days * DAY));
  const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / DAY);
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  const initials = name => name.split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase();
  const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);
  const firstNameVocative = name => ({ Anna: 'Aniu', Ania: 'Aniu', Karolina: 'Karolino', Natalia: 'Natalio', Monika: 'Moniko', Julia: 'Julio', Kasia: 'Kasiu', Katarzyna: 'Kasiu', Ola: 'Olu', Aleksandra: 'Olu', Marta: 'Marto', Ewa: 'Ewo', Zofia: 'Zosiu' }[name.split(' ')[0]] || name.split(' ')[0]);
  const clientCountLabel = count => count === 1 ? '1 klientka' : (count >= 2 && count <= 4 ? `${count} klientki` : `${count} klientek`);
  const messageCountLabel = count => count === 1 ? '1 wiadomość' : (count >= 2 && count <= 4 ? `${count} wiadomości` : `${count} wiadomości`);

  function demoState() {
    const clients = [
      ['c1', 'Anna Kowalska', '500 120 340', 'Manicure hybrydowy', -34, 28, 140, true],
      ['c2', 'Karolina Maj', '510 843 221', 'Manicure hybrydowy', -31, 28, 140, true],
      ['c3', 'Natalia Wójcik', '602 114 937', 'Uzupełnienie żelu', -29, 24, 170, true],
      ['c4', 'Monika Lis', '690 332 118', 'Laminacja brwi', -47, 42, 150, true],
      ['c5', 'Julia Nowak', '508 771 009', 'Pedicure hybrydowy', -39, 35, 170, true],
      ['c6', 'Kasia Mazur', '604 225 901', 'Manicure hybrydowy', -24, 28, 140, true],
      ['c7', 'Ola Zielińska', '519 400 762', 'Laminacja brwi', -35, 42, 150, true],
      ['c8', 'Ewa Król', '606 813 447', 'Uzupełnienie żelu', -38, 24, 170, false],
      ['c9', 'Zofia Pawlik', '575 192 440', 'Pedicure hybrydowy', -26, 35, 170, true],
      ['c10', 'Marta Kaczmarek', '533 727 180', 'Manicure hybrydowy', -43, 28, 140, true]
    ].map(([id, name, phone, service, days, repeatDays, price, consent]) => ({ id, name, phone, service, lastVisit: dateFromToday(days), repeatDays, price, consent }));

    const slots = [
      ['s1', 1, '16:30', 90, 'Manicure hybrydowy', 'Marta', 140],
      ['s2', 2, '12:00', 90, 'Uzupełnienie żelu', 'Marta', 170],
      ['s3', 3, '14:30', 60, 'Laminacja brwi', 'Ola', 150],
      ['s4', 5, '10:00', 100, 'Pedicure hybrydowy', 'Marta', 170],
      ['s5', 6, '17:00', 90, 'Manicure hybrydowy', 'Ola', 140]
    ].map(([id, day, time, duration, service, employee, value]) => ({ id, date: dateFromToday(day), time, duration, service, employee, value }));

    const history = [
      { id: 'h1', clientId: 'c10', slotId: 'past1', date: dateFromToday(-8), service: 'Manicure hybrydowy', value: 140, status: 'booked', message: 'Zwolnił nam się termin — czy pasuje Ci jutro o 15:00?' },
      { id: 'h2', clientId: 'c4', slotId: 'past2', date: dateFromToday(-5), service: 'Laminacja brwi', value: 150, status: 'booked', message: 'Czy masz ochotę odświeżyć brwi w tym tygodniu?' },
      { id: 'h3', clientId: 'c6', slotId: 'past3', date: dateFromToday(-3), service: 'Manicure hybrydowy', value: 140, status: 'no_reply', message: 'Mamy wolny termin w piątek o 13:30.' },
      { id: 'h4', clientId: 'c9', slotId: 'past4', date: dateFromToday(-1), service: 'Pedicure hybrydowy', value: 170, status: 'sent', message: 'Zwolnił się termin na pedicure — czy chciałabyś go zarezerwować?' }
    ];

    return {
      clients,
      slots,
      queue: [
        { id: 'q1', clientId: 'c1', slotId: 's1', message: createMessage(clients[0], slots[0], 'Studio Lune', 'warm') },
        { id: 'q2', clientId: 'c3', slotId: 's2', message: createMessage(clients[2], slots[1], 'Studio Lune', 'warm') }
      ],
      history,
      settings: { salonName: 'Studio Lune', ownerName: 'Marta', tone: 'warm', discount: 10, consentOnly: true }
    };
  }

  function createMessage(client, slot, salonName = 'Studio Lune', tone = 'warm') {
    const day = plFullDate.format(new Date(slot.date)).replace(',', '');
    const greeting = `Cześć ${firstNameVocative(client.name)}!`;
    if (tone === 'short') return `${greeting} Zwolnił nam się termin na ${slot.service.toLowerCase()}: ${day} o ${slot.time}. Czy chcesz go zarezerwować? — ${salonName}`;
    const elapsed = daysBetween(client.lastVisit, iso(new Date()));
    const weeks = Math.max(1, Math.round(elapsed / 7));
    return `${greeting} Minęło już około ${weeks} tygodni od Twojej ostatniej wizyty. Zwolnił nam się termin na ${slot.service.toLowerCase()} — ${day} o ${slot.time}. Czy chciałabyś go zarezerwować? 😊\n\n${salonName}`;
  }

  let state = loadState();
  let selectedSlotId = state.slots[0]?.id || null;
  let range = 3;

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored?.clients && stored?.slots && stored?.settings) return stored;
    } catch (_) { /* corrupted local data falls back to demo */ }
    return demoState();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function matchesForSlot(slot) {
    return state.clients
      .filter(client => client.service.toLowerCase() === slot.service.toLowerCase())
      .filter(client => !state.settings.consentOnly || client.consent)
      .filter(client => !state.queue.some(q => q.clientId === client.id && q.slotId === slot.id))
      .map(client => {
        const daysSince = daysBetween(client.lastVisit, iso(new Date()));
        const overdue = daysSince - Number(client.repeatDays || 28);
        const score = Math.max(52, Math.min(98, 76 + overdue * 2 + (client.consent ? 4 : 0)));
        return { ...client, overdue, score };
      })
      .filter(client => client.overdue >= -7)
      .sort((a, b) => b.score - a.score);
  }

  function render() {
    renderHeader();
    renderSummary();
    renderOpportunities();
    renderDraft();
    renderQueue();
    renderClients();
    renderResults();
    renderSettings();
  }

  function renderHeader() {
    const now = new Date();
    $('#todayDate').textContent = plFullDate.format(now).toUpperCase();
    $('#view-today h1').textContent = `Dzień dobry, ${state.settings.ownerName}`;
    $('.brand small').textContent = state.settings.salonName;
  }

  function renderSummary() {
    const visibleSlots = state.slots.filter(s => daysBetween(iso(new Date()), s.date) <= range);
    const possible = visibleSlots.reduce((sum, s) => sum + s.value, 0);
    const ready = new Set(visibleSlots.flatMap(s => matchesForSlot(s).map(c => c.id))).size;
    const booked = state.history.filter(h => h.status === 'booked');
    const recovered = booked.reduce((sum, h) => sum + Number(h.value || 0), 0);
    $('#summaryGrid').innerHTML = [
      ['Wolne terminy', visibleSlots.length, `w ciągu ${range} dni`, true],
      ['Potencjalny przychód', money.format(possible), 'jeśli wypełnisz wszystkie', false],
      ['Klientki gotowe na wizytę', ready, 'z aktualną zgodą na kontakt', false],
      ['Odzyskane w tym miesiącu', money.format(recovered), `${booked.length} potwierdzone wizyty`, false]
    ].map(([label, value, caption, featured]) => `<article class="summary-card ${featured ? 'featured' : ''}"><span class="label">${label}</span><strong class="summary-value">${value}</strong><span class="summary-caption">${caption}</span>${featured ? '<i class="summary-accent"></i>' : ''}</article>`).join('');
  }

  function renderOpportunities() {
    const slots = state.slots.filter(s => {
      const days = daysBetween(iso(new Date()), s.date);
      return days >= 0 && days <= range;
    });
    if (!slots.some(s => s.id === selectedSlotId)) selectedSlotId = slots[0]?.id || null;
    $('#opportunityList').innerHTML = slots.length ? slots.map(slot => {
      const d = new Date(slot.date);
      const parts = plDate.formatToParts(d);
      const weekday = parts.find(p => p.type === 'weekday')?.value || '';
      const day = parts.find(p => p.type === 'day')?.value || '';
      const matches = matchesForSlot(slot);
      return `<article class="opportunity-card ${slot.id === selectedSlotId ? 'active' : ''}" data-slot-id="${slot.id}" tabindex="0">
        <div class="date-tile"><span>${escapeHtml(weekday)}</span><strong>${day}</strong></div>
        <div><h3>${escapeHtml(slot.service)} · ${slot.time}</h3><div class="opportunity-meta"><span>${slot.duration} min</span><span>${escapeHtml(slot.employee)}</span><span>${money.format(slot.value)}</span></div></div>
        <div class="match-count"><strong>${clientCountLabel(matches.length)}</strong><span>dobrze pasują</span></div>
      </article>`;
    }).join('') : '<div class="empty-state">Brak wolnych terminów w tym zakresie.</div>';
    $$('.opportunity-card').forEach(card => {
      const select = () => { selectedSlotId = card.dataset.slotId; renderOpportunities(); renderDraft(); };
      card.addEventListener('click', select);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') select(); });
    });
  }

  function renderDraft() {
    const panel = $('#draftPanel');
    const slot = state.slots.find(s => s.id === selectedSlotId);
    const matches = slot ? matchesForSlot(slot) : [];
    if (!slot || !matches.length) {
      panel.innerHTML = `<div class="empty-draft"><span>✦</span><p>${slot ? 'Brak kolejnych pasujących klientek. Spróbuj innego terminu.' : 'Wybierz termin, aby przygotować wiadomość.'}</p></div>`;
      return;
    }
    const client = matches[0];
    panel.innerHTML = `<span class="draft-kicker">NAJLEPSZE DOPASOWANIE</span>
      <div class="draft-person"><strong>${escapeHtml(client.name)}</strong><span class="score-pill">${client.score}% dopasowania</span></div>
      <select class="client-picker" id="draftClient">${matches.map(c => `<option value="${c.id}">${escapeHtml(c.name)} · ${c.score}%</option>`).join('')}</select>
      <textarea class="draft-message" id="draftMessage">${escapeHtml(createMessage(client, slot, state.settings.salonName, state.settings.tone))}</textarea>
      <div class="draft-actions"><button class="button primary" id="addToQueue">Dodaj do sprawdzenia</button><button class="button dark-secondary" id="copyDraft" title="Kopiuj">⧉</button></div>
      <p class="draft-reason">Ostatnia wizyta: ${formatDate(client.lastVisit)} · cykl: ${client.repeatDays} dni · zgoda: ${client.consent ? 'tak' : 'nie'}</p>`;

    $('#draftClient').addEventListener('change', e => {
      const nextClient = matches.find(c => c.id === e.target.value);
      $('#draftMessage').value = createMessage(nextClient, slot, state.settings.salonName, state.settings.tone);
      $('.draft-person strong').textContent = nextClient.name;
      $('.score-pill').textContent = `${nextClient.score}% dopasowania`;
      $('.draft-reason').textContent = `Ostatnia wizyta: ${formatDate(nextClient.lastVisit)} · cykl: ${nextClient.repeatDays} dni · zgoda: ${nextClient.consent ? 'tak' : 'nie'}`;
    });
    $('#copyDraft').addEventListener('click', () => copyText($('#draftMessage').value));
    $('#addToQueue').addEventListener('click', () => {
      const clientId = $('#draftClient').value;
      state.queue.push({ id: `q${Date.now()}`, clientId, slotId: slot.id, message: $('#draftMessage').value.trim() });
      saveState();
      toast('Wiadomość dodana do sprawdzenia');
      render();
    });
  }

  function renderQueue() {
    $('#queueCount').textContent = messageCountLabel(state.queue.length);
    $('#messageQueue').innerHTML = state.queue.length ? state.queue.map(item => {
      const client = state.clients.find(c => c.id === item.clientId);
      const slot = state.slots.find(s => s.id === item.slotId);
      if (!client || !slot) return '';
      return `<div class="queue-row" data-queue-id="${item.id}">
        <span class="initials">${initials(client.name)}</span>
        <div class="person"><strong>${escapeHtml(client.name)}</strong><span>${formatDate(slot.date)} · ${slot.time}</span></div>
        <div class="queue-preview">${escapeHtml(item.message.replace(/\n/g, ' '))}</div>
        <div class="queue-actions"><button class="icon-btn remove" title="Usuń">×</button><button class="icon-btn copy" title="Kopiuj">⧉</button><button class="icon-btn approve" title="Oznacz jako wysłaną">✓</button></div>
      </div>`;
    }).join('') : '<div class="empty-state">Nie masz teraz żadnych wiadomości do sprawdzenia.</div>';

    $$('.queue-row').forEach(row => {
      const item = state.queue.find(q => q.id === row.dataset.queueId);
      $('.remove', row).addEventListener('click', () => { state.queue = state.queue.filter(q => q.id !== item.id); saveState(); render(); });
      $('.copy', row).addEventListener('click', () => copyText(item.message));
      $('.approve', row).addEventListener('click', () => {
        const client = state.clients.find(c => c.id === item.clientId);
        const slot = state.slots.find(s => s.id === item.slotId);
        copyText(item.message, false);
        state.history.unshift({ id: `h${Date.now()}`, clientId: item.clientId, slotId: item.slotId, date: iso(new Date()), service: slot.service, value: slot.value, status: 'sent', message: item.message });
        state.queue = state.queue.filter(q => q.id !== item.id);
        saveState(); render();
        toast(`Skopiowano wiadomość dla ${client.name}. Oznaczono jako wysłaną.`);
      });
    });
  }

  function clientReadiness(client) {
    const due = new Date(new Date(client.lastVisit).getTime() + Number(client.repeatDays) * DAY);
    const until = daysBetween(iso(new Date()), iso(due));
    if (until <= 0) return { label: 'Gotowa', className: 'ready', due, until };
    if (until <= 7) return { label: `Za ${until} dni`, className: 'soon', due, until };
    return { label: 'Później', className: 'later', due, until };
  }

  function renderClients() {
    const query = ($('#clientSearch')?.value || '').toLowerCase();
    const filter = $('#clientFilter')?.value || 'all';
    const clients = state.clients.filter(c => `${c.name} ${c.service}`.toLowerCase().includes(query)).filter(c => filter === 'all' || (filter === 'ready' && clientReadiness(c).until <= 0) || (filter === 'consent' && c.consent));
    $('#clientTable').innerHTML = clients.length ? clients.map(client => {
      const readiness = clientReadiness(client);
      return `<tr><td class="client-name">${escapeHtml(client.name)}<small>${escapeHtml(client.phone)} · ${client.consent ? 'zgoda na kontakt' : 'brak zgody'}</small></td><td>${escapeHtml(client.service)}</td><td>${formatDate(client.lastVisit)}</td><td>${formatDate(iso(readiness.due))}</td><td><span class="status ${readiness.className}">${readiness.label}</span></td></tr>`;
    }).join('') : '<tr><td colspan="5" style="text-align:center;color:var(--muted)">Brak klientek pasujących do filtra.</td></tr>';
  }

  function renderResults() {
    const booked = state.history.filter(h => h.status === 'booked');
    const sent = state.history.length;
    const recovered = booked.reduce((sum, h) => sum + Number(h.value || 0), 0);
    const conversion = sent ? Math.round(booked.length / sent * 100) : 0;
    $('#resultsSummary').innerHTML = [
      ['Odzyskany przychód', money.format(recovered), `${booked.length} potwierdzone wizyty`],
      ['Wysłane wiadomości', sent, 'zapisane w historii'],
      ['Skuteczność', `${conversion}%`, 'wysłane → rezerwacja']
    ].map(([label, value, note]) => `<article class="result-card"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`).join('');
    $('#chartTotal').textContent = money.format(recovered);
    const weekLabels = ['4 tyg. temu', '3 tyg. temu', '2 tyg. temu', 'Ten tydzień'];
    const buckets = [0, 0, 0, 0];
    booked.forEach(h => {
      const daysAgo = Math.max(0, daysBetween(h.date, iso(new Date())));
      const bucket = Math.max(0, 3 - Math.floor(daysAgo / 7));
      buckets[bucket] += Number(h.value || 0);
    });
    const max = Math.max(...buckets, 1);
    $('#barChart').innerHTML = buckets.map((value, i) => `<div class="bar-column" title="${money.format(value)}"><div class="bar" style="height:${Math.round(value / max * 125)}px"></div><span>${weekLabels[i]}</span></div>`).join('');
    $('#historyList').innerHTML = state.history.length ? state.history.map(item => {
      const client = state.clients.find(c => c.id === item.clientId);
      if (!client) return '';
      return `<div class="history-row" data-history-id="${item.id}"><span class="initials">${initials(client.name)}</span><div class="person"><strong>${escapeHtml(client.name)}</strong><span>${formatDate(item.date)} · ${escapeHtml(item.service)}</span></div><div class="queue-preview">${escapeHtml(item.message)}</div><div class="history-actions"><select aria-label="Wynik kontaktu"><option value="sent" ${item.status === 'sent' ? 'selected' : ''}>Wysłana</option><option value="booked" ${item.status === 'booked' ? 'selected' : ''}>Zarezerwowano</option><option value="no_reply" ${item.status === 'no_reply' ? 'selected' : ''}>Brak odpowiedzi</option><option value="declined" ${item.status === 'declined' ? 'selected' : ''}>Nie teraz</option></select></div></div>`;
    }).join('') : '<div class="empty-state">Historia pojawi się po wysłaniu pierwszej wiadomości.</div>';
    $$('.history-row select').forEach(select => select.addEventListener('change', e => {
      const id = e.target.closest('.history-row').dataset.historyId;
      state.history.find(h => h.id === id).status = e.target.value;
      saveState(); renderResults(); renderSummary(); renderSettings();
      toast('Wynik został zapisany');
    }));
  }

  function renderSettings() {
    const form = $('#settingsForm');
    if (!form) return;
    form.elements.salonName.value = state.settings.salonName;
    form.elements.ownerName.value = state.settings.ownerName;
    form.elements.tone.value = state.settings.tone;
    form.elements.discount.value = state.settings.discount;
    form.elements.consentOnly.checked = state.settings.consentOnly;
    $('#settingsClientCount').textContent = state.clients.length;
    $('#settingsHistoryCount').textContent = state.history.length;
  }

  function formatDate(value) {
    return capitalize(plDate.format(new Date(value)).replace(',', ''));
  }

  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  async function copyText(text, notify = true) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = text; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
    }
    if (notify) toast('Wiadomość skopiowana');
  }

  function download(filename, content, mime = 'text/csv;charset=utf-8') {
    const blob = new Blob(['\ufeff', content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: filename });
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) throw new Error('Plik nie zawiera żadnych danych.');
    const delimiter = (lines[0].match(/;/g) || []).length >= (lines[0].match(/,/g) || []).length ? ';' : ',';
    const split = line => {
      const values = []; let value = ''; let quoted = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && line[i + 1] === '"' && quoted) { value += '"'; i++; }
        else if (char === '"') quoted = !quoted;
        else if (char === delimiter && !quoted) { values.push(value.trim()); value = ''; }
        else value += char;
      }
      values.push(value.trim()); return values;
    };
    const headers = split(lines[0]).map(h => h.toLowerCase().trim().replace(/\s+/g, '_'));
    const required = ['imie', 'telefon', 'usluga', 'ostatnia_wizyta'];
    if (!required.every(h => headers.includes(h))) throw new Error(`Brakuje kolumn: ${required.filter(h => !headers.includes(h)).join(', ')}`);
    return lines.slice(1).map((line, index) => {
      const values = split(line); const row = Object.fromEntries(headers.map((h, i) => [h, values[i] || '']));
      const lastVisit = /^\d{4}-\d{2}-\d{2}$/.test(row.ostatnia_wizyta) ? row.ostatnia_wizyta : iso(new Date(row.ostatnia_wizyta));
      if (!lastVisit || lastVisit === 'NaN-NaN-NaN') throw new Error(`Nieprawidłowa data w wierszu ${index + 2}. Użyj RRRR-MM-DD.`);
      return { id: `i${Date.now()}-${index}`, name: row.imie, phone: row.telefon, service: row.usluga, lastVisit, repeatDays: Number(row.cykl_dni || 28), price: Number(row.cena || 0), consent: /^(tak|true|1|yes)$/i.test(row.zgoda || '') };
    });
  }

  function wireEvents() {
    $$('.nav-item').forEach(button => button.addEventListener('click', () => {
      $$('.nav-item').forEach(b => b.classList.toggle('active', b === button));
      $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${button.dataset.view}`));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }));
    $$('.segmented button').forEach(button => button.addEventListener('click', () => {
      range = Number(button.dataset.range);
      $$('.segmented button').forEach(b => b.classList.toggle('active', b === button));
      renderSummary(); renderOpportunities(); renderDraft();
    }));

    const modal = $('#importModal');
    const showImportStep = name => {
      $$('.import-step', modal).forEach(step => step.classList.toggle('active', step.dataset.importStep === name));
      modal.scrollTop = 0;
    };
    const openModal = () => {
      showImportStep('start');
      $('#importStatus').textContent = '';
      $('#importStatus').classList.remove('warning');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    };
    const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
    ['#importButton', '#openImport', '#clientsImport'].forEach(selector => $(selector).addEventListener('click', openModal));
    $('.modal-close').addEventListener('click', closeModal);
    $$('.close-import', modal).forEach(button => button.addEventListener('click', closeModal));
    $('#haveBooksyFiles').addEventListener('click', () => showImportStep('files'));
    $('#needBooksyHelp').addEventListener('click', () => showImportStep('help'));
    $('#continueToFiles').addEventListener('click', () => showImportStep('files'));
    $('#previewImportSuccess').addEventListener('click', () => {
      $('#foundClients').textContent = state.clients.length;
      $('#foundServices').textContent = new Set(state.clients.map(client => client.service)).size;
      $('#foundReady').textContent = state.clients.filter(client => client.consent && clientReadiness(client).until <= 7).length;
      showImportStep('success');
    });
    $$('.step-back', modal).forEach(button => button.addEventListener('click', () => showImportStep(button.dataset.backTo)));
    $('#copyBooksyRequest').addEventListener('click', () => copyText($('#booksyRequest').textContent));
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    $('#csvFile').addEventListener('change', async e => {
      const files = [...e.target.files]; if (!files.length) return;
      const file = files.find(item => item.name.toLowerCase().endsWith('.csv'));
      if (!file) {
        $('#importStatus').classList.add('warning');
        $('#importStatus').innerHTML = '<strong>Pliki zostały wybrane.</strong><br>Ten rodzaj eksportu wymaga jednorazowego dopasowania w pilotażu. Niczego w nim nie zmieniaj — przygotujemy pierwszy import wspólnie.';
        e.target.value = '';
        return;
      }
      try {
        const clients = parseCsv(await file.text());
        state.clients = clients;
        state.queue = [];
        saveState(); render();
        const services = new Set(clients.map(client => client.service)).size;
        const ready = clients.filter(client => client.consent && clientReadiness(client).until <= 7).length;
        $('#foundClients').textContent = clients.length;
        $('#foundServices').textContent = services;
        $('#foundReady').textContent = ready;
        showImportStep('success');
        toast('Dane z Booksy są gotowe');
      } catch (error) {
        $('#importStatus').classList.add('warning');
        $('#importStatus').innerHTML = '<strong>Nie udało się jeszcze odczytać tego pliku.</strong><br>Nie musisz niczego poprawiać. W pierwszym pilotażu dopasujemy eksport do Twojego konta Booksy.';
      }
      e.target.value = '';
    });

    $('#clientSearch').addEventListener('input', renderClients);
    $('#clientFilter').addEventListener('change', renderClients);
    $('#settingsForm').addEventListener('submit', e => {
      e.preventDefault(); const data = new FormData(e.target);
      state.settings = { salonName: data.get('salonName').trim() || 'Mój salon', ownerName: data.get('ownerName').trim() || 'Właścicielko', tone: data.get('tone'), discount: Number(data.get('discount') || 0), consentOnly: e.target.elements.consentOnly.checked };
      saveState(); render(); toast('Ustawienia zapisane');
    });
    $('#resetDemo').addEventListener('click', () => {
      if (!confirm('Przywrócić dane demonstracyjne? Obecne dane w aplikacji zostaną zastąpione.')) return;
      state = demoState(); selectedSlotId = state.slots[0].id; saveState(); render(); toast('Przywrócono dane demonstracyjne');
    });
    $('#exportBackup').addEventListener('click', () => download(`pusty-grafik-kopia-${iso(new Date())}.json`, JSON.stringify(state, null, 2), 'application/json'));
    $('#exportResults').addEventListener('click', () => {
      const header = 'data;klientka;usluga;wartosc;status';
      const rows = state.history.map(h => {
        const c = state.clients.find(x => x.id === h.clientId);
        return [h.date, c?.name || '', h.service, h.value, h.status].map(v => `"${String(v).replace(/"/g, '""')}"`).join(';');
      });
      download(`raport-pusty-grafik-${iso(new Date())}.csv`, [header, ...rows].join('\n'));
    });
  }

  wireEvents();
  saveState();
  render();
})();

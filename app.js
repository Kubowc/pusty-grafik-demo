(() => {
  'use strict';

  const STORAGE_KEY = 'pusty-grafik-crm-v2';
  const DAY = 86400000;
  const BOOKSY_LINK = 'https://booksy.com/pl-pl/65605_karina-pniewsky-aesthetic-pirua-beauty_medycyna-estetyczna_3_warszawa';
  const money = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 });
  const shortDate = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'short' });
  const fullDate = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const num = value => Math.max(0, Number(value) || 0);
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const initials = name => name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const today = () => { const value = new Date(); value.setHours(0, 0, 0, 0); return value; };
  const toIso = date => { const value = new Date(date); value.setMinutes(value.getMinutes() - value.getTimezoneOffset()); return value.toISOString().slice(0, 10); };
  const dateFromToday = days => toIso(new Date(today().getTime() + days * DAY));
  const addDays = (date, days) => toIso(new Date(new Date(`${date}T12:00:00`).getTime() + days * DAY));
  const daysBetween = (from, to) => Math.round((new Date(`${to}T12:00:00`) - new Date(`${from}T12:00:00`)) / DAY);
  const formatDate = value => shortDate.format(new Date(`${value}T12:00:00`)).replace('.', '');
  const firstNameVocative = name => ({ Anna: 'Aniu', Karolina: 'Karolino', Natalia: 'Natalio', Monika: 'Moniko', Julia: 'Julio', Kasia: 'Kasiu', Katarzyna: 'Kasiu', Ola: 'Olu', Aleksandra: 'Olu', Marta: 'Marto', Ewa: 'Ewo', Zofia: 'Zosiu' }[name.split(' ')[0]] || name.split(' ')[0]);

  const SERVICE_RULES = [
    { id: 'btx', name: 'BTX', price: 1200, reminders: [
      { code: 'btx-control', label: 'Konsultacja pozabiegowa', afterDays: 0, targetDays: 14 },
      { code: 'btx-refresh', label: 'Odświeżenie BTX', afterDays: 90, targetDays: 90 }
    ] },
    { id: 'lips', name: 'Modelowanie ust', price: 899, reminders: [{ code: 'lips-refresh', label: 'Odświeżenie ust', afterDays: 240, targetDays: 240 }] },
    { id: 'volumetry', name: 'Wolumetria twarzy', price: 1800, reminders: [{ code: 'volumetry-refresh', label: 'Odświeżenie efektu', afterDays: 365, targetDays: 365 }] },
    { id: 'biostimulation', name: 'Biostymulacja', price: 750, reminders: [{ code: 'bio-stage', label: 'Kolejny etap biostymulacji', afterDays: 30, targetDays: 30 }] },
    { id: 'temporal-lift', name: 'Lift powięziowo-skroniowy', price: 2500, reminders: [{ code: 'series-60', label: 'Kolejny etap zabiegu', afterDays: 46, targetDays: 60 }] },
    { id: 'plla', name: 'Kwas polimlekowy', price: 1800, reminders: [{ code: 'series-60', label: 'Kolejny etap zabiegu', afterDays: 46, targetDays: 60 }] },
    { id: 'caha', name: 'Hydroksyapatyt wapnia', price: 1800, reminders: [{ code: 'series-60', label: 'Kolejny etap zabiegu', afterDays: 46, targetDays: 60 }] }
  ];

  const PRODUCTS = [
    { id: '', name: 'Bez preparatu', unit: 'ml', costPerUnit: 0 },
    { id: 'botulinum', name: 'Toksyna botulinowa — demo', unit: 'j.', costPerUnit: 11 },
    { id: 'filler', name: 'Kwas hialuronowy — demo', unit: 'ml', costPerUnit: 390 },
    { id: 'stimulator', name: 'Biostymulator — demo', unit: 'ml', costPerUnit: 220 },
    { id: 'plla-product', name: 'Kwas polimlekowy — demo', unit: 'fiol.', costPerUnit: 620 },
    { id: 'caha-product', name: 'Hydroksyapatyt wapnia — demo', unit: 'ml', costPerUnit: 510 }
  ];

  function demoState() {
    const clients = [
      ['c1', 'Anna Kowalska', '500 120 340', true], ['c2', 'Karolina Maj', '510 843 221', true],
      ['c3', 'Natalia Wójcik', '602 114 937', true], ['c4', 'Monika Lis', '690 332 118', true],
      ['c5', 'Julia Nowak', '508 771 009', true], ['c6', 'Kasia Mazur', '604 225 901', false]
    ].map(([id, name, phone, consent]) => ({ id, name, phone, consent }));
    const visits = [
      makeVisit('v1', 'c1', 'btx', -10, 1200, 0, 'botulinum', 40, 200, 0, 0, 0, 'Karta'),
      makeVisit('v2', 'c2', 'lips', -20, 899, 0, 'filler', 1, 200, 180, 0, 0, 'BLIK'),
      makeVisit('v3', 'c3', 'biostimulation', -35, 750, 10, 'stimulator', 1, 0, 0, 0, 0, 'Gotówka'),
      makeVisit('v4', 'c4', 'volumetry', -120, 1800, 0, 'filler', 2, 200, 0, 0, 0, 'Przelew'),
      makeVisit('v5', 'c5', 'temporal-lift', -50, 2500, 0, 'filler', 2, 200, 0, 500, 0, 'Karta'),
      makeVisit('v6', 'c2', 'lips', -250, 899, 0, 'filler', 1, 0, 0, 0, 899, 'Voucher')
    ];
    const reminders = visits.flatMap(visit => remindersForVisit(visit));
    const alreadySent = reminders.find(item => item.visitId === 'v1' && item.ruleCode === 'btx-control');
    if (alreadySent) { alreadySent.status = 'sent'; alreadySent.sentDate = addDays(visits[0].date, 1); }
    const slots = [
      ['s1', 1, '14:00', 60, 'lips', 899], ['s2', 2, '16:30', 45, 'btx', 1200], ['s3', 5, '12:00', 60, 'biostimulation', 750]
    ].map(([id, days, time, duration, serviceId, value]) => ({ id, date: dateFromToday(days), time, duration, serviceId, value }));
    return {
      clients, visits, reminders, slots, queue: [],
      settings: { salonName: 'Karina Pniewsky Aesthetic & Pirua Beauty', ownerName: 'Karina', booksyLink: BOOKSY_LINK, tone: 'warm', consentOnly: true }
    };
  }

  function makeVisit(id, clientId, serviceId, dayOffset, price, discount, productId, productAmount, deposit, cosmetics, voucherSold, voucherUsed, paymentMethod) {
    return { id, clientId, serviceId, date: dateFromToday(dayOffset), price, discount, productId, productAmount, deposit, cosmetics, voucherSold, voucherUsed, paymentMethod };
  }

  function getService(id) { return SERVICE_RULES.find(item => item.id === id) || SERVICE_RULES[0]; }
  function getProduct(id) { return PRODUCTS.find(item => item.id === id) || PRODUCTS[0]; }
  function getClient(id) { return state.clients.find(item => item.id === id); }

  function visitTotals(visit) {
    const serviceValue = Math.round(num(visit.price) * (1 - Math.min(100, num(visit.discount)) / 100));
    const productCost = Math.round(num(visit.productAmount) * getProduct(visit.productId).costPerUnit);
    const extras = num(visit.cosmetics) + num(visit.voucherSold);
    const paidAtVisit = Math.max(0, serviceValue + extras - num(visit.deposit) - num(visit.voucherUsed));
    return { serviceValue, productCost, extras, paidAtVisit, collected: paidAtVisit + num(visit.deposit), estimatedMargin: serviceValue - productCost };
  }

  function remindersForVisit(visit) {
    const service = getService(visit.serviceId);
    return service.reminders.map((rule, index) => ({
      id: `r-${visit.id}-${index}`, visitId: visit.id, clientId: visit.clientId, serviceId: visit.serviceId,
      ruleCode: rule.code, label: rule.label, sendDate: addDays(visit.date, rule.afterDays), targetDate: addDays(visit.date, rule.targetDays), status: 'pending'
    }));
  }

  function reminderMessage(reminder) {
    if (reminder.message) return reminder.message;
    const client = getClient(reminder.clientId);
    const link = state.settings.booksyLink;
    const hello = `Cześć ${firstNameVocative(client.name)}!`;
    let body = '';
    if (reminder.ruleCode === 'btx-control') body = 'Zapraszamy na darmową konsultację pozabiegową za około 2 tygodnie. Warto zarezerwować dogodny termin już teraz.';
    if (reminder.ruleCode === 'btx-refresh') body = 'Minęły około 3 miesiące od zabiegu BTX. Zgodnie z zaleceniami producenta efekt może zacząć stopniowo ustępować. Gdy zejdzie w całości, zapraszamy na kolejną wizytę. Warto wcześniej wybrać dogodny termin.';
    if (reminder.ruleCode === 'lips-refresh') body = 'Minęło około 8 miesięcy od modelowania ust. Zapraszamy na odświeżenie efektu — wcześniejsza rezerwacja pomoże wybrać dogodny termin.';
    if (reminder.ruleCode === 'volumetry-refresh') body = 'Mija rok od wolumetrii twarzy. Zapraszamy na konsultację i odświeżenie efektu. Warto wcześniej zarezerwować dogodny termin.';
    if (reminder.ruleCode === 'bio-stage') body = 'Mija miesiąc od biostymulacji. Zapraszamy na kolejny etap terapii — zarezerwuj wcześniej termin, który najlepiej Ci odpowiada.';
    if (reminder.ruleCode === 'series-60') body = 'Zbliża się termin kolejnego etapu zabiegu. Wysyłamy przypomnienie 2 tygodnie wcześniej, aby łatwiej było zarezerwować dogodną godzinę.';
    if (state.settings.tone === 'short') body = `${reminder.label}: zapraszamy do rezerwacji dogodnego terminu.`;
    return `${hello} ${body}\n\nZapisy: ${link}`;
  }

  function winbackMessage(client, slot) {
    const service = getService(slot.serviceId);
    return `Cześć ${firstNameVocative(client.name)}! Zwolnił nam się termin na ${service.name.toLowerCase()} — ${formatDate(slot.date)} o ${slot.time}. Czy chciałabyś go zarezerwować?\n\n${state.settings.settings?.salonName || state.settings.salonName}\n${state.settings.booksyLink}`;
  }

  let state = loadState();
  let selectedSlotId = state.slots[0]?.id || null;
  let slotRange = 3;
  let reminderFilter = 'due';

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored?.clients && stored?.visits && stored?.reminders && stored?.settings) return stored;
    } catch (_) { /* use safe demo fallback */ }
    return demoState();
  }
  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  function render() {
    renderHeader(); renderToday(); renderSlots(); renderVisits(); renderClients(); renderReminders(); renderFinance(); renderSettings();
  }

  function renderHeader() {
    $('#todayDate').textContent = fullDate.format(today()).toUpperCase();
    $('#welcomeTitle').textContent = `Dzień dobry, ${state.settings.ownerName}`;
    $('#brandSalon').textContent = state.settings.salonName;
    const due = dueReminders().length;
    $('#navReminderCount').textContent = due;
    $('#navReminderCount').hidden = !due;
  }

  function monthVisits() {
    const now = today();
    return state.visits.filter(visit => { const date = new Date(`${visit.date}T12:00:00`); return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); });
  }
  function dueReminders() { return state.reminders.filter(item => item.status === 'pending' && daysBetween(item.sendDate, toIso(today())) >= 0 && getClient(item.clientId)?.consent); }

  function renderToday() {
    const visits = monthVisits();
    const totals = visits.reduce((acc, visit) => { const item = visitTotals(visit); acc.service += item.serviceValue; acc.collected += item.collected; acc.margin += item.estimatedMargin; return acc; }, { service: 0, collected: 0, margin: 0 });
    const due = dueReminders();
    $('#summaryGrid').innerHTML = [
      ['Wizyty w tym miesiącu', visits.length, 'zapisane w rejestrze', true],
      ['Wartość zabiegów', money.format(totals.service), 'po rabatach'],
      ['Wpłaty przypisane', money.format(totals.collected), 'z zadatkami'],
      ['SMS-y do sprawdzenia', due.length, due.length ? 'czekają na decyzję' : 'wszystko gotowe']
    ].map(([label, value, note, featured]) => `<article class="summary-card ${featured ? 'featured' : ''}"><span class="label">${label}</span><strong class="summary-value">${value}</strong><span class="summary-caption">${note}</span></article>`).join('');

    const tasks = due.slice(0, 3).map(reminder => { const client = getClient(reminder.clientId); return `<button class="task-row" data-go="reminders"><span class="task-icon">✉</span><span><strong>${escapeHtml(client.name)}</strong><small>${escapeHtml(reminder.label)} · ${formatDate(reminder.sendDate)}</small></span><b>→</b></button>`; });
    const openSlots = state.slots.filter(slot => daysBetween(toIso(today()), slot.date) >= 0 && daysBetween(toIso(today()), slot.date) <= 7).length;
    tasks.push(`<div class="task-row"><span class="task-icon soft">○</span><span><strong>${openSlots} wolne terminy w ciągu 7 dni</strong><small>Możesz przygotować wiadomości poniżej.</small></span></div>`);
    $('#todayTasks').innerHTML = tasks.join('');

    const latest = [...state.visits].sort((a, b) => b.date.localeCompare(a.date))[0];
    if (latest) {
      const client = getClient(latest.clientId); const service = getService(latest.serviceId); const totals = visitTotals(latest);
      $('#latestVisit').innerHTML = `<div class="latest-person"><span class="initials">${initials(client.name)}</span><div><strong>${escapeHtml(client.name)}</strong><small>${formatDate(latest.date)} · ${escapeHtml(service.name)}</small></div></div><div class="dark-stats"><div><span>Wartość</span><strong>${money.format(totals.serviceValue)}</strong></div><div><span>Koszt preparatu</span><strong>${money.format(totals.productCost)}</strong></div><div><span>Marża szacunkowa</span><strong>${money.format(totals.estimatedMargin)}</strong></div></div>`;
    }
    $$('[data-go]').forEach(button => button.onclick = () => switchView(button.dataset.go));
  }

  function slotCandidates(slot) {
    return state.clients.filter(client => (!state.settings.consentOnly || client.consent) && state.visits.some(visit => visit.clientId === client.id && visit.serviceId === slot.serviceId)).filter(client => !state.queue.some(item => item.clientId === client.id && item.slotId === slot.id));
  }
  function renderSlots() {
    const slots = state.slots.filter(slot => { const days = daysBetween(toIso(today()), slot.date); return days >= 0 && days <= slotRange; });
    if (!slots.some(slot => slot.id === selectedSlotId)) selectedSlotId = slots[0]?.id || null;
    $('#opportunityList').innerHTML = slots.length ? slots.map(slot => { const service = getService(slot.serviceId); const candidates = slotCandidates(slot); return `<article class="opportunity-card ${slot.id === selectedSlotId ? 'active' : ''}" data-slot-id="${slot.id}" tabindex="0"><div class="date-tile"><span>${formatDate(slot.date)}</span><strong>${slot.time}</strong></div><div><h3>${escapeHtml(service.name)}</h3><div class="opportunity-meta"><span>${slot.duration} min</span><span>${money.format(slot.value)}</span></div></div><div class="match-count"><strong>${candidates.length}</strong><span>pasujących klientek</span></div></article>`; }).join('') : '<div class="empty-state">Brak wolnych terminów w tym zakresie.</div>';
    $$('.opportunity-card').forEach(card => { const choose = () => { selectedSlotId = card.dataset.slotId; renderSlots(); }; card.onclick = choose; card.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') choose(); }; });
    renderDraft();
  }
  function renderDraft() {
    const slot = state.slots.find(item => item.id === selectedSlotId); const candidates = slot ? slotCandidates(slot) : [];
    if (!slot || !candidates.length) { $('#draftPanel').innerHTML = `<div class="empty-draft"><span>✦</span><p>${slot ? 'Nie ma kolejnej pasującej klientki.' : 'Wybierz termin, aby przygotować wiadomość.'}</p></div>`; return; }
    const client = candidates[0];
    $('#draftPanel').innerHTML = `<span class="draft-kicker">WIADOMOŚĆ DO SPRAWDZENIA</span><div class="draft-person"><strong>${escapeHtml(client.name)}</strong><span class="score-pill">zgoda na SMS</span></div><select class="client-picker" id="draftClient">${candidates.map(item => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('')}</select><textarea class="draft-message" id="draftMessage">${escapeHtml(winbackMessage(client, slot))}</textarea><div class="draft-actions"><button class="button primary" id="queueDraft">Dodaj do kolejki</button><button class="button dark-secondary" id="copyDraft" title="Kopiuj">⧉</button></div><p class="draft-reason">Nic nie zostanie wysłane automatycznie.</p>`;
    $('#draftClient').onchange = event => { const next = getClient(event.target.value); $('#draftMessage').value = winbackMessage(next, slot); $('.draft-person strong').textContent = next.name; };
    $('#copyDraft').onclick = () => copyText($('#draftMessage').value);
    $('#queueDraft').onclick = () => {
      const created = Date.now(); const clientId = $('#draftClient').value; const message = $('#draftMessage').value;
      state.queue.push({ id: `q-${created}`, clientId, slotId: slot.id, message });
      state.reminders.push({ id: `r-slot-${created}`, visitId: null, clientId, serviceId: slot.serviceId, ruleCode: 'empty-slot', label: 'Wolny termin', sendDate: toIso(today()), targetDate: slot.date, status: 'pending', message });
      saveState(); toast('Wiadomość czeka w sekcji SMS'); render();
    };
  }

  function renderVisits() {
    const query = ($('#visitSearch')?.value || '').toLowerCase();
    const visits = [...state.visits].sort((a, b) => b.date.localeCompare(a.date)).filter(visit => { const client = getClient(visit.clientId); const service = getService(visit.serviceId); return `${client?.name} ${service.name}`.toLowerCase().includes(query); });
    $('#visitList').innerHTML = visits.length ? visits.map(visit => { const client = getClient(visit.clientId); const service = getService(visit.serviceId); const product = getProduct(visit.productId); const totals = visitTotals(visit); return `<article class="visit-card"><div class="visit-main"><span class="initials">${initials(client.name)}</span><div><strong>${escapeHtml(client.name)}</strong><small>${formatDate(visit.date)} · ${escapeHtml(service.name)}</small></div></div><div class="visit-detail"><span>Preparat<small>${escapeHtml(product.name)}${visit.productAmount ? ` · ${visit.productAmount} ${product.unit}` : ''}</small></span><span>Wpłata przy wizycie<strong>${money.format(totals.paidAtVisit)}</strong></span><span>Wartość zabiegu<strong>${money.format(totals.serviceValue)}</strong></span><span>Marża szacunkowa<strong class="positive">${money.format(totals.estimatedMargin)}</strong></span></div><button class="icon-btn delete-visit" data-visit-id="${visit.id}" title="Usuń wpis">×</button></article>`; }).join('') : '<div class="empty-state">Nie znaleziono wizyt.</div>';
    $$('.delete-visit').forEach(button => button.onclick = () => { if (!confirm('Usunąć tę demonstracyjną wizytę i jej przypomnienia?')) return; state.visits = state.visits.filter(item => item.id !== button.dataset.visitId); state.reminders = state.reminders.filter(item => item.visitId !== button.dataset.visitId); saveState(); render(); toast('Wizyta usunięta'); });
  }

  function clientStats(client) {
    const visits = state.visits.filter(visit => visit.clientId === client.id).sort((a, b) => b.date.localeCompare(a.date));
    const total = visits.reduce((sum, visit) => sum + visitTotals(visit).serviceValue, 0);
    const next = state.reminders.filter(reminder => reminder.clientId === client.id && reminder.status === 'pending').sort((a, b) => a.sendDate.localeCompare(b.sendDate))[0];
    return { visits, total, next };
  }
  function renderClients() {
    const query = ($('#clientSearch')?.value || '').toLowerCase(); const filter = $('#clientFilter')?.value || 'all';
    const clients = state.clients.filter(client => `${client.name} ${client.phone} ${clientStats(client).visits.map(visit => getService(visit.serviceId).name).join(' ')}`.toLowerCase().includes(query)).filter(client => filter === 'all' || (filter === 'consent' && client.consent) || (filter === 'ready' && clientStats(client).next && daysBetween(clientStats(client).next.sendDate, toIso(today())) >= 0));
    $('#clientTable').innerHTML = clients.length ? clients.map(client => { const stats = clientStats(client); const last = stats.visits[0]; return `<tr><td class="client-name">${escapeHtml(client.name)}<small>${escapeHtml(client.phone)} · ${client.consent ? 'zgoda na SMS' : 'brak zgody'}</small></td><td>${last ? escapeHtml(getService(last.serviceId).name) : '—'}</td><td>${last ? formatDate(last.date) : '—'}</td><td>${money.format(stats.total)}</td><td>${stats.next ? `<span class="status ${daysBetween(stats.next.sendDate, toIso(today())) >= 0 ? 'ready' : 'soon'}">${formatDate(stats.next.sendDate)}</span>` : '<span class="status later">Brak</span>'}</td></tr>`; }).join('') : '<tr><td colspan="5" class="table-empty">Brak klientek pasujących do filtra.</td></tr>';
  }

  function renderReminders() {
    const current = toIso(today());
    let reminders = state.reminders.filter(item => {
      const isDue = item.status === 'pending' && daysBetween(item.sendDate, current) >= 0;
      if (reminderFilter === 'due') return isDue;
      if (reminderFilter === 'upcoming') return item.status === 'pending' && !isDue;
      return item.status === 'sent';
    }).sort((a, b) => a.sendDate.localeCompare(b.sendDate));
    $('#dueCount').textContent = dueReminders().length;
    $('#reminderList').innerHTML = reminders.length ? reminders.map(reminder => { const client = getClient(reminder.clientId); const service = getService(reminder.serviceId); const blocked = !client.consent; const message = reminderMessage(reminder); return `<article class="reminder-card ${blocked ? 'blocked' : ''}"><div class="reminder-date"><span>${reminder.status === 'sent' ? 'WYSŁANO' : daysBetween(reminder.sendDate, current) >= 0 ? 'GOTOWE' : 'WYŚLIJ'}</span><strong>${formatDate(reminder.status === 'sent' ? reminder.sentDate || reminder.sendDate : reminder.sendDate)}</strong></div><div class="reminder-content"><div class="reminder-person"><span class="initials">${initials(client.name)}</span><div><strong>${escapeHtml(client.name)}</strong><small>${escapeHtml(service.name)} · ${escapeHtml(reminder.label)}</small></div></div><textarea data-reminder-text="${reminder.id}" ${reminder.status === 'sent' || blocked ? 'readonly' : ''}>${escapeHtml(message)}</textarea><p class="reminder-note">${blocked ? 'Brak zapisanej zgody — wysyłka zablokowana.' : `Sugerowany termin wizyty: ${formatDate(reminder.targetDate)}.`}</p></div><div class="reminder-actions">${reminder.status === 'pending' && !blocked ? `<button class="button secondary copy-reminder" data-id="${reminder.id}">Kopiuj</button><button class="button primary send-reminder" data-id="${reminder.id}">Oznacz jako wysłany</button><button class="text-link cancel-reminder" data-id="${reminder.id}">Klientka już zapisana</button>` : reminder.status === 'sent' ? '<span class="status booked">Wysłana</span>' : '<span class="status later">Brak zgody</span>'}</div></article>`; }).join('') : '<div class="empty-state">W tej sekcji nie ma teraz żadnych wiadomości.</div>';
    $$('[data-reminder-text]').forEach(area => area.onchange = () => { const reminder = state.reminders.find(item => item.id === area.dataset.reminderText); reminder.message = area.value.trim(); saveState(); });
    $$('.copy-reminder').forEach(button => button.onclick = () => { const reminder = state.reminders.find(item => item.id === button.dataset.id); const area = $(`[data-reminder-text="${button.dataset.id}"]`); reminder.message = area.value.trim(); saveState(); copyText(reminder.message); });
    $$('.send-reminder').forEach(button => button.onclick = () => { const reminder = state.reminders.find(item => item.id === button.dataset.id); reminder.message = $(`[data-reminder-text="${button.dataset.id}"]`).value.trim(); reminder.status = 'sent'; reminder.sentDate = toIso(today()); saveState(); render(); toast('Wiadomość oznaczona jako wysłana'); });
    $$('.cancel-reminder').forEach(button => button.onclick = () => { const reminder = state.reminders.find(item => item.id === button.dataset.id); reminder.status = 'cancelled'; saveState(); render(); toast('Przypomnienie anulowane'); });
  }

  function renderFinance() {
    const visits = monthVisits();
    const totals = visits.reduce((acc, visit) => { const item = visitTotals(visit); acc.service += item.serviceValue; acc.collected += item.collected; acc.cost += item.productCost; acc.margin += item.estimatedMargin; acc.cosmetics += num(visit.cosmetics); acc.vouchers += num(visit.voucherSold); return acc; }, { service: 0, collected: 0, cost: 0, margin: 0, cosmetics: 0, vouchers: 0 });
    $('#financeSummary').innerHTML = [
      ['Wartość zabiegów', money.format(totals.service), 'po rabatach'], ['Wpłaty przypisane', money.format(totals.collected), 'wraz z zadatkami'],
      ['Koszt preparatów', money.format(totals.cost), 'wg fikcyjnej bazy kosztów'], ['Marża szacunkowa', money.format(totals.margin), 'przed kosztami stałymi i podatkami']
    ].map(([label, value, note], index) => `<article class="finance-card ${index === 3 ? 'accent' : ''}"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`).join('');
    const methods = visits.reduce((acc, visit) => { const amount = visitTotals(visit).collected; acc[visit.paymentMethod] = (acc[visit.paymentMethod] || 0) + amount; return acc; }, {});
    const max = Math.max(...Object.values(methods), 1);
    $('#paymentChart').innerHTML = Object.entries(methods).sort((a, b) => b[1] - a[1]).map(([method, value]) => `<div class="payment-row"><span>${escapeHtml(method)}</span><div><i style="width:${Math.max(5, value / max * 100)}%"></i></div><strong>${money.format(value)}</strong></div>`).join('') || '<div class="empty-state">Brak płatności w tym miesiącu.</div>';
    $('#extraStats').innerHTML = `<div><span>Kosmetyki</span><strong>${money.format(totals.cosmetics)}</strong></div><div><span>Sprzedane vouchery</span><strong>${money.format(totals.vouchers)}</strong></div><p>Realizacja vouchera zmniejsza wpłatę przy wizycie, ale nie zmniejsza wartości wykonanego zabiegu.</p>`;
    const grouped = visits.reduce((acc, visit) => { const service = getService(visit.serviceId); const item = visitTotals(visit); acc[service.name] ||= { count: 0, value: 0, cost: 0, margin: 0 }; acc[service.name].count++; acc[service.name].value += item.serviceValue; acc[service.name].cost += item.productCost; acc[service.name].margin += item.estimatedMargin; return acc; }, {});
    $('#profitList').innerHTML = Object.entries(grouped).sort((a, b) => b[1].margin - a[1].margin).map(([name, item]) => `<div class="profit-row"><div><strong>${escapeHtml(name)}</strong><small>${item.count} ${item.count === 1 ? 'wizyta' : 'wizyty'}</small></div><span>Wartość <strong>${money.format(item.value)}</strong></span><span>Preparaty <strong>${money.format(item.cost)}</strong></span><span>Marża <strong class="positive">${money.format(item.margin)}</strong></span></div>`).join('') || '<div class="empty-state">Brak zabiegów w tym miesiącu.</div>';
  }

  function renderSettings() {
    const form = $('#settingsForm');
    form.elements.salonName.value = state.settings.salonName; form.elements.ownerName.value = state.settings.ownerName; form.elements.booksyLink.value = state.settings.booksyLink; form.elements.tone.value = state.settings.tone; form.elements.consentOnly.checked = state.settings.consentOnly;
    $('#settingsClientCount').textContent = state.clients.length; $('#settingsVisitCount').textContent = state.visits.length; $('#settingsReminderCount').textContent = state.reminders.length;
    $('#rulesGrid').innerHTML = SERVICE_RULES.map(service => `<article class="rule-card"><strong>${escapeHtml(service.name)}</strong>${service.reminders.map(rule => `<div><span>${escapeHtml(rule.label)}</span><small>${rule.afterDays === 0 ? 'od razu' : rule.afterDays === rule.targetDays ? `po ${rule.afterDays} dniach` : `${rule.targetDays - rule.afterDays} dni przed terminem`}</small></div>`).join('')}</article>`).join('');
  }

  function switchView(name) {
    $$('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === name));
    $$('.view').forEach(view => view.classList.toggle('active', view.id === `view-${name}`));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function toast(message) { const element = $('#toast'); element.textContent = message; element.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => element.classList.remove('show'), 2500); }
  async function copyText(text) { try { await navigator.clipboard.writeText(text); } catch (_) { const area = document.createElement('textarea'); area.value = text; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove(); } toast('Wiadomość skopiowana'); }
  function download(filename, content, mime = 'text/csv;charset=utf-8') { const blob = new Blob(['\ufeff', content], { type: mime }); const url = URL.createObjectURL(blob); const link = Object.assign(document.createElement('a'), { href: url, download: filename }); link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function csvRows(visits) { const header = 'data;klientka;telefon;zabieg;cena_po_rabacie;zadatek;zaplacono_przy_wizycie;forma_platnosci;koszt_preparatu;marza_szacunkowa;kosmetyki;voucher_sprzedany;voucher_wykorzystany'; return [header, ...visits.map(visit => { const client = getClient(visit.clientId); const service = getService(visit.serviceId); const totals = visitTotals(visit); return [visit.date, client.name, client.phone, service.name, totals.serviceValue, visit.deposit, totals.paidAtVisit, visit.paymentMethod, totals.productCost, totals.estimatedMargin, visit.cosmetics, visit.voucherSold, visit.voucherUsed].map(value => `"${String(value).replace(/"/g, '""')}"`).join(';'); })].join('\n'); }

  function openVisitModal() {
    const form = $('#visitForm');
    form.reset(); form.elements.date.value = toIso(today());
    form.elements.clientId.innerHTML = state.clients.map(client => `<option value="${client.id}">${escapeHtml(client.name)}</option>`).join('');
    form.elements.serviceId.innerHTML = SERVICE_RULES.map(service => `<option value="${service.id}">${escapeHtml(service.name)}</option>`).join('');
    form.elements.productId.innerHTML = PRODUCTS.map(product => `<option value="${product.id}">${escapeHtml(product.name)}</option>`).join('');
    form.elements.price.value = SERVICE_RULES[0].price; form.elements.consent.checked = true;
    updateVisitCalculation(); showModal($('#visitModal'));
  }
  function updateVisitCalculation() {
    const form = $('#visitForm'); const draft = { price: form.elements.price.value, discount: form.elements.discount.value, productId: form.elements.productId.value, productAmount: form.elements.productAmount.value, deposit: form.elements.deposit.value, cosmetics: form.elements.cosmetics.value, voucherSold: form.elements.voucherSold.value, voucherUsed: form.elements.voucherUsed.value }; const totals = visitTotals(draft);
    $('#productUnit').textContent = getProduct(draft.productId).unit;
    $('#calculationPreview').innerHTML = `<div><span>Wartość zabiegu</span><strong>${money.format(totals.serviceValue)}</strong></div><div><span>Koszt preparatu</span><strong>${money.format(totals.productCost)}</strong></div><div><span>Do zapłaty przy wizycie</span><strong>${money.format(totals.paidAtVisit)}</strong></div><div class="accent"><span>Marża szacunkowa</span><strong>${money.format(totals.estimatedMargin)}</strong></div><p>Zadatek jest częścią ceny. Realizacja vouchera może obniżyć wpłatę do 0 zł.</p>`;
  }
  function showModal(modal) { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
  function closeModal(modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }

  function wireEvents() {
    $$('.nav-item').forEach(button => button.onclick = () => switchView(button.dataset.view));
    $$('.segmented button').forEach(button => button.onclick = () => { slotRange = Number(button.dataset.range); $$('.segmented button').forEach(item => item.classList.toggle('active', item === button)); renderSlots(); });
    $$('.open-visit').forEach(button => button.onclick = openVisitModal);
    $('#visitSearch').oninput = renderVisits; $('#clientSearch').oninput = renderClients; $('#clientFilter').onchange = renderClients;
    $$('.reminder-tabs button').forEach(button => button.onclick = () => { reminderFilter = button.dataset.reminderFilter; $$('.reminder-tabs button').forEach(item => item.classList.toggle('active', item === button)); renderReminders(); });

    const visitForm = $('#visitForm');
    visitForm.elements.serviceId.onchange = event => { visitForm.elements.price.value = getService(event.target.value).price; updateVisitCalculation(); };
    ['price', 'discount', 'productId', 'productAmount', 'deposit', 'cosmetics', 'voucherSold', 'voucherUsed'].forEach(name => visitForm.elements[name].addEventListener('input', updateVisitCalculation));
    visitForm.onsubmit = event => { event.preventDefault(); const data = new FormData(visitForm); const visit = { id: `v-${Date.now()}`, clientId: data.get('clientId'), serviceId: data.get('serviceId'), date: data.get('date'), price: num(data.get('price')), discount: num(data.get('discount')), productId: data.get('productId'), productAmount: num(data.get('productAmount')), deposit: num(data.get('deposit')), cosmetics: num(data.get('cosmetics')), voucherSold: num(data.get('voucherSold')), voucherUsed: num(data.get('voucherUsed')), paymentMethod: data.get('paymentMethod') }; const client = getClient(visit.clientId); client.consent = visitForm.elements.consent.checked; state.visits.push(visit); state.reminders.push(...remindersForVisit(visit)); saveState(); closeModal($('#visitModal')); render(); switchView('visits'); toast('Wizyta zapisana, przypomnienia zaplanowane'); };

    $$('.modal-close').forEach(button => button.onclick = () => closeModal(button.closest('.modal-backdrop')));
    $$('.modal-backdrop').forEach(modal => modal.onclick = event => { if (event.target === modal) closeModal(modal); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') $$('.modal-backdrop.open').forEach(closeModal); });

    const importModal = $('#importModal'); const showImportStep = name => $$('.import-step', importModal).forEach(step => step.classList.toggle('active', step.dataset.importStep === name));
    $$('.open-import').forEach(button => button.onclick = () => { showImportStep('start'); $('#importStatus').innerHTML = ''; showModal(importModal); });
    $$('.close-import').forEach(button => button.onclick = () => closeModal(importModal));
    $('#haveBooksyFiles').onclick = () => showImportStep('files'); $('#needBooksyHelp').onclick = () => showImportStep('help'); $('#continueToFiles').onclick = () => showImportStep('files');
    $$('.step-back').forEach(button => button.onclick = () => showImportStep(button.dataset.backTo)); $('#copyBooksyRequest').onclick = () => copyText($('#booksyRequest').textContent);
    $('#booksyFiles').onchange = event => { if (!event.target.files.length) return; $('#importStatus').innerHTML = '<strong>Pliki zostały wybrane.</strong><br>W publicznej demonstracji nie przetwarzamy prawdziwych danych. Pierwszy eksport zostanie bezpiecznie dopasowany podczas prywatnego pilotażu.'; $('#importStatus').classList.add('warning'); event.target.value = ''; };

    $('#settingsForm').onsubmit = event => { event.preventDefault(); const data = new FormData(event.target); state.settings = { ...state.settings, salonName: data.get('salonName').trim() || 'Mój salon', ownerName: data.get('ownerName').trim() || 'Właścicielko', booksyLink: data.get('booksyLink').trim() || BOOKSY_LINK, tone: data.get('tone'), consentOnly: event.target.elements.consentOnly.checked }; saveState(); render(); toast('Ustawienia zapisane'); };
    $('#exportBackup').onclick = () => download(`pusty-grafik-kopia-${toIso(today())}.json`, JSON.stringify(state, null, 2), 'application/json');
    $('#exportVisits').onclick = () => download(`wizyty-${toIso(today())}.csv`, csvRows(state.visits)); $('#exportFinance').onclick = () => download(`finanse-${toIso(today())}.csv`, csvRows(monthVisits()));
    $('#resetDemo').onclick = () => { if (!confirm('Przywrócić fikcyjne dane demonstracyjne?')) return; state = demoState(); selectedSlotId = state.slots[0]?.id; saveState(); render(); toast('Przywrócono demonstrację'); };
  }

  wireEvents(); saveState(); render();
})();

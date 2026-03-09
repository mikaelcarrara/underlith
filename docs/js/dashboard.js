(() => {
  const DATA_URL = 'data/dashboard.json';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const views = {
    projects: $('#view-projects'),
    pkg: $('#view-package'),
    adoption: $('#view-adoption'),
    graph: $('#view-graph')
  };

  const tabs = {
    projects: $('#tab-projects'),
    pkg: $('#tab-package'),
    adoption: $('#tab-adoption'),
    graph: $('#tab-graph')
  };

  function switchView(target) {
    Object.values(views).forEach(v => v.hidden = true);
    Object.values(tabs).forEach(t => t.setAttribute('aria-selected', 'false'));
    views[target].hidden = false;
    const tabKey = target === 'pkg' ? 'pkg' : target;
    tabs[tabKey].setAttribute('aria-selected', 'true');
  }

  tabs.projects.addEventListener('click', () => switchView('projects'));
  tabs.pkg.addEventListener('click', () => switchView('pkg'));
  tabs.adoption.addEventListener('click', () => switchView('adoption'));
  tabs.graph.addEventListener('click', () => switchView('graph'));

  function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  }

  function renderProjects(data) {
    const latest = data.package.latestVersion;
    const tbody = $('#projects-table tbody');
    tbody.innerHTML = '';
    let upToDate = 0;
    data.projects.forEach(p => {
      const isOk = p.tokenVersion === latest;
      if (isOk) upToDate++;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.name}</td>
        <td><a href="${p.repo}" target="_blank" rel="noopener">${p.repo.replace(/^https?:\/\//,'')}</a></td>
        <td>${p.framework}</td>
        <td>${p.tokenPackage}</td>
        <td>v${p.tokenVersion}</td>
        <td>${timeAgo(p.lastSync)}</td>
        <td>${isOk ? 'Up-to-date' : 'Outdated'}</td>
      `;
      tbody.appendChild(tr);
    });
    $('#kpi-total-projects').textContent = String(data.projects.length);
    $('#kpi-up-to-date').textContent = String(upToDate);
    $('#kpi-outdated').textContent = String(data.projects.length - upToDate);
    $('#kpi-latest-version').textContent = 'v' + latest;
  }

  function renderPackage(data) {
    const pkg = data.package;
    $('#pkg-name').textContent = pkg.name;
    $('#pkg-latest').textContent = 'v' + pkg.latestVersion;
    $('#pkg-date').textContent = new Date(pkg.publishDate).toLocaleDateString();
    const consumers = data.projects.filter(p => p.tokenPackage === pkg.name).length;
    $('#pkg-consumers').textContent = String(consumers);
    $('#pkg-count').textContent = String(pkg.tokenCount);

    const tokenList = $('#token-list');
    tokenList.innerHTML = '';
    const categories = ['colors','spacing','typography','radius'];
    categories.forEach(cat => {
      if (!pkg.categories[cat]) return;
      const card = document.createElement('div');
      card.className = 'doc-mb-3';
      const title = document.createElement('h4');
      title.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      card.appendChild(title);
      (pkg.categories[cat]).forEach(tok => {
        const pill = document.createElement('span');
        pill.className = 'token-pill';
        pill.textContent = tok;
        pill.dataset.token = tok;
        pill.addEventListener('click', () => showTokenDetail(tok, data));
        card.appendChild(pill);
      });
      tokenList.appendChild(card);
    });
  }

  function showTokenDetail(token, data) {
    const usedIn = (data.dependencies[token] || []);
    $('#token-detail-empty').hidden = true;
    $('#token-detail').hidden = false;
    $('#token-detail-name').textContent = token;
    const list = $('#token-detail-projects');
    list.innerHTML = '';
    if (usedIn.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No projects found.';
      list.appendChild(li);
      return;
    }
    usedIn.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      list.appendChild(li);
    });
  }

  function renderAdoption(data) {
    const latest = data.package.latestVersion;
    const tbody = $('#adoption-table tbody');
    tbody.innerHTML = '';
    data.projects
      .filter(p => p.tokenVersion !== latest)
      .forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.name}</td>
          <td>v${p.tokenVersion}</td>
          <td>v${latest}</td>
        `;
        tbody.appendChild(tr);
      });
  }

  function renderGraph(data) {
    const tbody = $('#graph-table tbody');
    tbody.innerHTML = '';
    const entries = Object.entries(data.dependencies).sort((a,b) => b[1].length - a[1].length);
    entries.forEach(([tok, list]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><a href="#view-package" data-token="${tok}">${tok}</a></td>
        <td>${list.length}</td>
      `;
      tr.querySelector('a')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('pkg');
        showTokenDetail(tok, data);
      });
      tbody.appendChild(tr);
    });
  }

  function useData(data) {
    renderProjects(data);
    renderPackage(data);
    renderAdoption(data);
    renderGraph(data);
  }

  const isFile = location.protocol === 'file:';
  const FALLBACK = window.__UL_DASHBOARD_FALLBACK;

  if (isFile && FALLBACK) {
    useData(FALLBACK);
  } else {
    fetch(DATA_URL)
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(useData)
      .catch(err => {
        console.warn('Failed to load dashboard data from', DATA_URL, err);
        if (FALLBACK) {
          useData(FALLBACK);
          return;
        }
        ['#projects-table tbody', '#adoption-table tbody', '#graph-table tbody'].forEach(sel => {
          const el = document.querySelector(sel);
          if (el) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 7;
            td.textContent = 'Failed to load data.';
            tr.appendChild(td);
            el.appendChild(tr);
          }
        });
      });
  }
})();

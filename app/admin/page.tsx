"use client";

import { useEffect, useMemo, useState } from "react";

type Registration = {
  id: number;
  parentName: string;
  childName: string;
  childAge: number;
  contactPhone: string;
  contactEmail: string | null;
  course: string;
  availability: string;
  supportNeeds: string | null;
  message: string | null;
  status: string;
  createdAt: string;
};

const statusLabels: Record<string, string> = {
  new: "新報名",
  contacted: "已聯絡",
  assessment: "已安排速評",
  enrolled: "已入班",
  closed: "已完成",
};

const statusOptions = Object.keys(statusLabels);

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-HK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminPage() {
  const [rows, setRows] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({ total: 0 });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [adminKey, setAdminKey] = useState("");
  const [needsKey, setNeedsKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRegistrations(key = adminKey) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/registrations", {
        headers: key ? { "x-admin-key": key } : undefined,
        cache: "no-store",
      });
      const data = await response.json();
      if (response.status === 401) {
        setNeedsKey(true);
        setRows([]);
        setError("請輸入管理員存取碼，或以網站管理員帳戶登入。");
        return;
      }
      if (!response.ok) throw new Error(data.error || "未能讀取報名資料");
      setNeedsKey(false);
      setRows(data.registrations || []);
      setStats(data.stats || { total: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "未能讀取報名資料");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRegistrations();
    // The dashboard intentionally loads once; refresh is available beside the title.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function changeStatus(id: number, status: string) {
    setError("");
    try {
      const response = await fetch("/api/registrations", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          ...(adminKey ? { "x-admin-key": adminKey } : {}),
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "未能更新狀態");
      setRows((current) => current.map((row) => (row.id === id ? data.registration : row)));
      void loadRegistrations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "未能更新狀態");
    }
  }

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesStatus = filter === "all" || row.status === filter;
      const haystack = [row.parentName, row.childName, row.contactPhone, row.course].join(" ").toLowerCase();
      return matchesStatus && (!term || haystack.includes(term));
    });
  }, [filter, query, rows]);

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a className="admin-brand" href="/">
          <img src="/chinglam-logo.jpg" alt="菁林體育會" />
          <span><strong>菁林體育會</strong><small>報名管理後台</small></span>
        </a>
        <a className="admin-back" href="/">← 返回網站</a>
      </header>

      <section className="admin-content">
        <div className="admin-title-row">
          <div><p className="kicker">CHINGLAM ADMIN</p><h1>報名資料</h1><p className="admin-subtitle">集中查看家長查詢，跟進速評及入班安排。</p></div>
          <button className="admin-refresh" type="button" onClick={() => void loadRegistrations()}>↻ 重新整理</button>
        </div>

        <div className="admin-stat-grid">
          <article><span>全部報名</span><strong>{stats.total ?? 0}</strong><small>累計收到的表格</small></article>
          <article className="stat-new"><span>新報名</span><strong>{stats.new ?? 0}</strong><small>等待首次聯絡</small></article>
          <article className="stat-assessment"><span>已安排速評</span><strong>{stats.assessment ?? 0}</strong><small>準備開始了解需要</small></article>
          <article className="stat-enrolled"><span>已入班</span><strong>{stats.enrolled ?? 0}</strong><small>正在參與訓練</small></article>
        </div>

        {needsKey && <form className="admin-key-panel" onSubmit={(event) => { event.preventDefault(); void loadRegistrations(adminKey); }}><div><strong>管理員驗證</strong><p>請輸入後台存取碼以查看報名資料。</p></div><div className="admin-key-input"><input value={adminKey} onChange={(event) => setAdminKey(event.target.value)} type="password" placeholder="管理員存取碼" aria-label="管理員存取碼"/><button type="submit">進入後台</button></div></form>}
        {error && <p className="admin-alert" role="alert">{error}</p>}

        <div className="admin-toolbar"><label className="admin-search">⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋家長、孩子、電話或課程" aria-label="搜尋報名資料"/></label><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="篩選報名狀態"><option value="all">全部狀態</option>{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></div>

        <section className="admin-table-card">
          <div className="admin-table-head"><h2>最新報名</h2><span>{filteredRows.length} 份資料</span></div>
          {loading ? <div className="admin-empty">讀取中…</div> : filteredRows.length === 0 ? <div className="admin-empty"><strong>暫時未有符合的報名</strong><span>家長提交表格後，資料會在這裡出現。</span></div> : <div className="admin-table-wrap"><table><thead><tr><th>家長／孩子</th><th>課程</th><th>聯絡方式</th><th>可安排時段</th><th>收到時間</th><th>狀態</th></tr></thead><tbody>{filteredRows.map((row) => <tr key={row.id}><td><strong>{row.parentName}</strong><span>{row.childName} · {row.childAge} 歲</span>{row.supportNeeds && <small>支援需要：{row.supportNeeds}</small>}</td><td>{row.course}</td><td><a href={`tel:${row.contactPhone}`}>{row.contactPhone}</a>{row.contactEmail && <a href={`mailto:${row.contactEmail}`}>{row.contactEmail}</a>}</td><td>{row.availability}</td><td>{formatDate(row.createdAt)}</td><td><select className={`status-select status-${row.status}`} value={row.status} onChange={(event) => void changeStatus(row.id, event.target.value)} aria-label={`${row.childName} 報名狀態`}>{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></td></tr>)}</tbody></table></div>}
        </section>
        <p className="admin-privacy">家長資料只供菁林體育會安排聯絡及訓練用途，請妥善保管及定期清理已完成個案。</p>
      </section>
    </main>
  );
}


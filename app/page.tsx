"use client";
import { useState } from "react";

const courses = [
  ["SEN 小組體適能訓練", "提升體能、耐力與協調", "對象：4–16 歲", "小組：3–6 人", "互動・結構化・安全環境"],
  ["專注力 × 運動訓練", "改善專注、控制及活動耐受", "對象：5–16 歲", "小組：3–5 人", "專注技巧・感覺整合"],
  ["社交 × 團隊運動", "建立社交技巧與合作", "對象：6–16 歲", "小組：4–6 人", "社交故事・小組互動"],
  ["個別 1:1 運動訓練", "針對需要、個別指導", "對象：4–16 歲", "形式：1 對 1", "度身計劃・彈性時間"],
];
const reasons = [["專業團隊", "教練具 SEN 訓練經驗，備悉因應個別需要調整教學"], ["SEN 友善環境", "小班教學、結構化流程、感官友善設施"], ["循證為本", "課程參考運動科學研究，以成效為導向"], ["家校合作", "與家長緊密溝通，一起見證孩子的進步"]];
const faqs = [["訓練會否作 SEN 或 ADHD 診斷？", "不會。菁林提供運動訓練與觀察回饋；如需臨床評估，請向合資格專業人士查詢。"], ["孩子未做過運動，適合參加嗎？", "可以。初次速評會了解孩子的興趣、舒適度和基本動作，再建議合適的起步安排。"], ["家長可以了解孩子的進度嗎？", "可以。我們會按訓練目標提供清晰進度回饋，與家長一起調整練習方向。"]];

function Logo(){return <a className="logo" href="#top"><span className="logo-mark"><i/><b/><em/></span><span className="logo-copy"><strong>菁林體育會</strong><small>SEN Sports Training</small><label>專為SEN兒童及青少年而設的運動訓練</label></span></a>}

export default function Home(){const [openFaq,setOpenFaq]=useState<number|null>(0);return <main id="top">
  <header className="site-header"><Logo/><nav className="desktop-nav"><a href="#courses">課程</a><a href="#process">訓練流程</a><a href="#team">專業團隊</a><a href="#contact">聯絡我們</a></nav><button className="menu-button" aria-label="開啟選單">☰</button></header>
  <section className="hero"><div className="hero-copy"><p className="kicker">以運動為媒介</p><h1>發展潛能・建立自信<br/>成就更好的自己</h1><div className="benefits"><span><b>♧</b>體能發展</span><span><b>♧</b>專注力</span><span><b>♧</b>社交能力</span><span><b>♧</b>情緒管理</span></div><p className="hero-sub">專業團隊・個別支援・循證課程・用心陪伴</p><div className="hero-actions"><a className="btn green" href="#contact">♧　預約免費諮詢</a><a className="btn navy" href="#courses">▣　查看課程</a></div></div><div className="hero-image"><div className="hero-photo"/><div className="slider-dots"><b/><i/><i/></div></div></section>
  <section className="quick-strip">{[["♧","訓練前速評","了解需要"],["◎","個人化目標","專屬計劃"],["♧","專業訓練","SEN支援課程"],["▥","進度追蹤","成長看得見"],["♡","家長支援","同行支持"]].map(([icon,t,d])=><article key={t}><b>{icon}</b><strong>{t}</strong><span>{d}</span></article>)}</section>
  <section className="section courses" id="courses"><div className="section-head"><div><p className="kicker">OUR PROGRAMS</p><h2>SEN 運動訓練課程</h2></div><a href="#contact">查看全部課程　›</a></div><div className="course-grid">{courses.map(([t,d,o,g,tag],i)=><article className="course-card" key={t}><div className={'course-image ci'+i}/><div className="course-body"><h3>{t}</h3><p>{d}</p><small>{o}</small><small>{g}</small><label>{tag}</label></div></article>)}</div></section>
  <section className="section process" id="process"><p className="kicker">HOW WE TRAIN</p><h2>我們的訓練流程</h2><div className="process-grid">{[["▣","1. 訓練前速評","專業評估孩子的體能、動作、專注及社交需要"],["◎","2. 設定個人目標","與家長共同制定可量化的訓練目標"],["♧","3. 專屬訓練計劃","設計合適的運動活動與支援策略"],["▤","4. 進度追蹤與報告","定期記錄及回饋，讓成長看得見"]].map(([icon,t,d],i)=><article key={t}><b>{icon}</b><h3>{t}</h3><p>{d}</p>{i<3&&<i>›</i>}</article>)}</div></section>
  <section className="section reasons"><p className="kicker">WHY CHINGLAM</p><h2>為什麼選擇菁林體育會？</h2><div className="reason-grid">{reasons.map(([t,d],i)=><article key={t}><b>{["♧","⬡","▤","♡"][i]}</b><h3>{t}</h3><p>{d}</p></article>)}</div></section>
  <section className="section team" id="team"><div className="team-visual"><div className="team-photo"/></div><div><p className="kicker">THE CHINGLAM TEAM</p><h2>專業、耐心，<br/>陪孩子一起成長。</h2><p>菁林的教練以兒童為本，重視清晰溝通、正向鼓勵和安全感。在每節課中，我們留意孩子的反應，按需要調整節奏。</p><a className="outline-link" href="#contact">認識我們的團隊　→</a></div></section>
  <section className="section testimonials"><div className="section-head"><div><p className="kicker">PARENTS' VOICES</p><h2>家長心聲</h2></div><a href="#contact">更多分享　›</a></div><div className="quote-grid"><blockquote>“孩子以前好容易分心，參加訓練後，專注力明顯提升，亦樂於嘗試新事物。”<footer>— K先生 家長</footer></blockquote><blockquote>“教練好有耐心，課程設計很貼心，孩子每次上堂都好開心！”<footer>— 陳太 家長</footer></blockquote><blockquote>“由抗拒運動到主動參與，感謝教練的鼓勵和團隊的專業支援！”<footer>— 王太 家長</footer></blockquote></div></section>
  <section className="section faq"><p className="kicker">FAQ</p><h2>家長常問</h2>{faqs.map(([q,a],i)=><article key={q}><button onClick={()=>setOpenFaq(openFaq===i?null:i)} aria-expanded={openFaq===i}>{q}<b>{openFaq===i?'−':'＋'}</b></button>{openFaq===i&&<p>{a}</p>}</article>)}</section>
  <section className="contact" id="contact"><div className="contact-inner"><div><p className="kicker">START THE CONVERSATION</p><h2>孩子的下一步，<br/>由一次對話開始。</h2><p>歡迎透過 WhatsApp 或電話，和我們談談孩子的運動需要。</p></div><div className="contact-buttons"><a className="contact-wa" href="https://wa.me/85291234567">◉　WhatsApp 查詢<br/><small>+852 9123 4567</small></a><a className="contact-call" href="tel:+85223456789">⌕　致電查詢<br/><small>+852 2345 6789</small></a><span className="contact-address">⌖　地址<br/><small>九龍灣宏光道XX號XX樓</small></span></div></div></section>
  <footer className="footer"><Logo/><p>© 2026 菁林體育會 ChingLam Sport Club</p></footer>
  <nav className="mobile-nav"><a href="#top"><b>⌂</b><small>首頁</small></a><a href="#courses"><b>▤</b><small>課程</small></a><a href="#process"><b>▥</b><small>成長紀錄</small></a><a href="#contact"><b>▣</b><small>活動</small></a><a href="#contact"><b>♙</b><small>我的</small></a></nav>
</main>}


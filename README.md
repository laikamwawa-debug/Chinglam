# 菁林體育會 ChingLam Sport Club

香港 SEN 兒童及青少年專項運動訓練網站，採用手機優先設計，內容包括訓練前速評、課程、訓練流程、團隊介紹、家長心聲及查詢入口。

## 本機預覽

```bash
npm install
npm run dev
```

## GitHub → Railway 部署

1. 將此專案推送到 GitHub repository。
2. 在 Railway 選擇 **New Project → Deploy from GitHub repo**。
3. Railway 會讀取 `railway.json`，自動執行 `npm run build`，並以 `npm run start` 啟動網站。
4. 不需要手動設定固定 Port；Railway 的 `PORT` 會由 vinext 自動讀取。

## 報名及後台

- 公開報名表位於首頁「立即報名」區塊，提交後會寫入 D1 `registrations` 資料表。
- 管理後台：`/admin`。在 Sites 內以管理員帳戶登入即可查看；如部署到其他平台，請設定 `ADMIN_ACCESS_KEY`，再於後台輸入存取碼。
- 後台可搜尋報名、按狀態篩選，並更新為「新報名、已聯絡、已安排速評、已入班、已完成」。

## 品牌資料

聯絡電話、WhatsApp 號碼及地址目前沿用模版示例，正式上線前請在 `app/page.tsx` 的聯絡區塊替換。

## 內容範圍

菁林提供運動訓練與觀察回饋，不作 SEN／ADHD 診斷。如有臨床評估需要，請向合資格專業人士查詢。


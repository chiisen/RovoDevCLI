# RovoDevCLI
 這是我用來測試 Rovo Dev CLI 編程能力的專案，主要記錄我操作 Rovo Dev CLI 的步驟與流程。

 ---

## Windows 安裝
```bash
Invoke-WebRequest -Uri  https://acli.atlassian.com/windows/latest/acli_windows_amd64/acli.exe -OutFile acli.exe
```
## 測試安裝是否成功
```bash
.\acli.exe --help
```

## 建立 API KEY
網址: [Atlassian profile](https://id.atlassian.com/manage-profile/security/api-tokens)
![ATLASSIAN_Account](./images/RovoDevCLI_API_Key.jpg)

## 登入 rovo dev
```bash
.\acli rovodev auth login
```
要輸入信箱與 API KEY

## 執行 rovo dev
```bash
.\acli rovodev run
```
![ROVO_DEV_CLI](./images/RovoDevCLI.jpg)



import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  Table,
  Button,
  Input,
  message,
  Space,
  Image,
  Modal,
} from "antd";
import { UploadOutlined, SearchOutlined, ReloadOutlined, OpenAIOutlined, TranslationOutlined, FileExcelTwoTone, FileExcelOutlined } from "@ant-design/icons";

// ---------- 错误边界 ----------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: "red" }}>
          <h2>组件加载出错！</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------- 自定义 Hook: Excel 数据缓存 ----------
function useExcelCache(tableData, setTableData) {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化恢复缓存
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("excelTableData");
      const savedKeys = localStorage.getItem("excelSelectedKeys");

      if (savedData && savedData !== "undefined" && savedData !== "null") {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
          setTableData(parsedData);
          setFilteredData(parsedData);
        }

        if (savedKeys) {
          const parsedKeys = JSON.parse(savedKeys);
          const normalizedKeys = parsedKeys.map((k) =>
            typeof k === "string" && /^\d+$/.test(k) ? Number(k) : k
          );
          const validKeys = normalizedKeys.filter((k) =>
            parsedData.some((r) => r.id === k)
          );
          setSelectedRowKeys(validKeys);
        }
      } else {
        localStorage.removeItem("excelTableData");
        localStorage.removeItem("excelSelectedKeys");
      }
    } catch (e) {
      console.error("Restore cache failed:", e);
    }
    setIsInitialized(true);
  }, [setTableData]);

  // 缓存 tableData
  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (Array.isArray(tableData)) {
        localStorage.setItem("excelTableData", JSON.stringify(tableData));
      }
    } catch (e) {
      console.error("Save excelTableData failed:", e);
    }
  }, [tableData, isInitialized]);

  // 缓存选中行
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("excelSelectedKeys", JSON.stringify(selectedRowKeys));
    } catch (e) {
      console.error("Save selectedRowKeys failed:", e);
    }
  }, [selectedRowKeys, isInitialized]);

  // 清除缓存
  const clearCache = () => {
    localStorage.removeItem("excelTableData");
    localStorage.removeItem("excelSelectedKeys");
    setTableData([]);
    setFilteredData([]);
    setSelectedRowKeys([]);
    message.success("✅ 本地缓存已清除！");
  };

  return { filteredData, setFilteredData, selectedRowKeys, setSelectedRowKeys, clearCache };
}

// ---------- 主组件 ----------
function SatoriEdtoriReview({ tableData, setTableData }) {
  const { filteredData, setFilteredData, selectedRowKeys, setSelectedRowKeys, clearCache } =
    useExcelCache(tableData, setTableData);

  const [searchText, setSearchText] = useState("");
  const [timestampFilter, setTimestampFilter] = useState("");
  const [imageId, setImageId] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);

  const pageSize = 300;

  const getImageUrl = (id) =>
    `https://th.bing.com/th/id/${id}`;

  const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    total_seconds -= seconds;
    const hours = Math.floor(total_seconds / 3600);
    const minutes = Math.floor(total_seconds / 60) % 60;
    date_info.setHours(hours);
    date_info.setMinutes(minutes);
    date_info.setSeconds(seconds);
    return date_info;
  };

  const formatDate = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // ---------- 文件上传 ----------
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const dataWithId = jsonData.map((item, index) => {
          let ts = item["Ingested Timestamp"];
          if (typeof ts === "number") ts = formatDate(excelDateToJSDate(ts));
          else if (typeof ts === "string" && ts.includes(" ")) ts = ts.split(" ")[0];
          return { id: index + 1, ...item, "Ingested Timestamp": ts || "-" };
        });

        setTableData(dataWithId);
        setFilteredData(dataWithId);
        setSelectedRowKeys((prevKeys) => prevKeys.filter((k) => dataWithId.some((r) => r.id === k)));

        localStorage.setItem("excelTableData", JSON.stringify(dataWithId));
        message.success("✅ Excel 上传成功，数据已缓存！");
      } catch (err) {
        message.error("❌ Excel 解析失败！");
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const normalizeValue = (value) => {
    if (!value) return "-";
    if (value === "UNSPECIFIED") return "*";
    return value.replace(/_/g, "-");
  };

  const generateSIDLink = (sid, lang, region) => {
    const fixedUrl = "https://satoriv2.azurewebsites.net/EntityRepositoryBrowser?";
    const setLang = lang === "UNSPECIFIED" ? "*" : lang?.replace(/_/g, "-");
    const cc = region === "UNSPECIFIED" ? "*" : region?.replace(/_/g, "-");
    return `${fixedUrl}SID=${sid}&setLang=${setLang}&cc=${cc}&ns=0`;
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("复制成功！");
    } catch {
      message.error("复制失败");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    {
      title: "SID",
      dataIndex: "SID",
      key: "sid",
      render: (sid, record) => (
        <a
          href={generateSIDLink(sid, record.Language, record.Region)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            setSelectedRowKeys((prev) => (prev.includes(record.id) ? prev : [...prev, record.id]));
            if (record.SubKey) handleCopy(record.SubKey);
            window.open(generateSIDLink(sid, record.Language, record.Region), "_blank");
          }}
        >
          {sid}
        </a>
      ),
    },
    {
      title: "BugLink",
      dataIndex: "BugLink",
      key: "buglink",
      render: (link) => (link ? <a href={link} target="_blank" rel="noopener noreferrer">buglink</a> : "-"),
    },
    { title: "Language", dataIndex: "Language", key: "language", render: normalizeValue },
    { title: "Region", dataIndex: "Region", key: "region", render: normalizeValue },
    {
      title: "SubKey",
      dataIndex: "SubKey",
      key: "subkey",
      sorter: (a, b) => {
        const valA = a.SubKey ? a.SubKey.toString().toLowerCase() : "";
        const valB = b.SubKey ? b.SubKey.toString().toLowerCase() : "";
        return valA.localeCompare(valB);
      },
      sortDirections: ["ascend", "descend"],
    },
    { title: "Ingested Timestamp", dataIndex: "Ingested Timestamp", key: "timestamp" },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    preserveSelectedRowKeys: true,
  };

  // 搜索过滤
  useEffect(() => {
    let data = tableData;
    if (searchText) {
      const lower = searchText.toLowerCase();
      data = data.filter(
        (item) =>
          item.SID?.toString().toLowerCase().includes(lower) ||
          item.SubKey?.toString().toLowerCase().includes(lower)
      );
    }
    if (timestampFilter) {
      const lower = timestampFilter.toLowerCase();
      data = data.filter((item) =>
        item["Ingested Timestamp"]?.toString().toLowerCase().includes(lower)
      );
    }
    setFilteredData(data);
  }, [searchText, timestampFilter, tableData]);

  return (
    <div style={{ padding: 24, height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 顶部控制区 */}
      <div style={{ flexShrink: 0 }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".xlsx,.xls,.csv">
            <Button icon={<UploadOutlined />}>上传 Excel</Button>
          </Upload>

          <Button danger onClick={clearCache}>
            清除缓存
          </Button>

          <Input
            placeholder="搜索 SID / SubKey"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Input
            placeholder="搜索 Ingested Timestamp (YYYY-MM-DD)"
            prefix={<SearchOutlined />}
            value={timestampFilter}
            onChange={(e) => setTimestampFilter(e.target.value)}
            allowClear
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearchText("");
              setTimestampFilter("");
              setFilteredData(tableData);
            }}
          >
            重置筛选
          </Button>
        </Space>
        <br></br>
        {/* 图片预览 */}
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="输入图片 ID"
            value={imageId}
            onChange={(e) => setImageId(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            onClick={() => {
              if (!imageId) message.warning("请输入图片 ID");
              else setPreviewVisible(true);
            }}
          >
            预览图片
          </Button>
          <Button
            type="link"
            icon={<TranslationOutlined />}
            href="https://translate.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            谷歌翻译
          </Button>

          <Button
            type="link"
            icon={<OpenAIOutlined />}
            href="https://chatgpt.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ChatGPT
          </Button>

          <Button
            type="link"
            icon={<FileExcelTwoTone />}
            href="https://microsoft-my.sharepoint.com/:x:/p/v-yuanhlu/ESsjRE38V01FnwZRRK2RdBgB4s6Qoqxq-C7FDMaLxgg-Hg?wdOrigin=TEAMS-MAGLEV.p2p_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1760516300365&web=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            DailyReviewReport
          </Button>

          <Button
            type="link"
            icon={<FileExcelOutlined />}
            href="https://satoriv2.azurewebsites.net/EntityRepositoryBrowser/EditorialReview"
            target="_blank"
            rel="noopener noreferrer"
          >
            EdtoriReviewV2
          </Button>

          <Button
            type="link"
            icon={<FileExcelOutlined />}
            href="https://microsoft.sharepoint.com/:x:/r/teams/BYSSatoriTeam/_layouts/15/doc2.aspx?sourcedoc=%7B774914fb-a742-45c0-8848-3b41e0477936%7D&action=edit&wdinitialsession=6102a3a9-2403-5425-3594-4c8ab692e571&wdrldsc=3&wdrldc=1&wdrldr=ContinueInExcel&share=IQH7FEl3QqfARYhIO0HgR3k2AXnoYJIy110gl0OtIJA9IbI&wdOrigin=TEAMS-MAGLEV.p2p_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1761699340874&web=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            BlackListReview
          </Button>
        </Space>
        <Modal
          open={previewVisible}
          title="图片预览"
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          width={700}
        >
          {imageId && <Image src={getImageUrl(imageId)} width="100%" />}
        </Modal>

        <br />
      </div>

      {/* 表格滚动区 */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          bordered
          pagination={{ pageSize }}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  );
}

// ---------- 导出组件时包裹错误边界 ----------
export default function WrappedSatoriEdtoriReview(props) {
  return (
    <ErrorBoundary>
      <SatoriEdtoriReview {...props} />
    </ErrorBoundary>
  );
}

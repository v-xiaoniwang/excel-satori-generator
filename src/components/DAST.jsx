import React, { useState, useEffect } from "react";

import {
  Tooltip,
  Menu,
  Space,
  Button,
  Table,
  Input,
  message,
  Tabs,
  Typography,
} from "antd";

import {
  SearchOutlined,
  CopyOutlined,
  FileWordTwoTone,
  FileExcelTwoTone,
  DiffOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import menuData from "../config/dastMenuData.json";
import templates from "../config/dastTemplates.json";
import warnings from "../config/dastWarnings.json";
import highlightRules from "../config/highlightRules.json"
import mappingData from "../config/magazineMapping.json";

const { TextArea } = Input;
const { Title } = Typography
const { Text } = Typography;;

export default function DASTSection() {
  const [activeKey, setActiveKey] = useState(null);
  const [expandedTabs, setExpandedTabs] = useState([]);
  const [selectedRows, setSelectedRows] = useState(
    JSON.parse(localStorage.getItem("selectedRows") || "[]")
  );
  const [text, setText] = useState(localStorage.getItem("dastText") || "");
  const [url, setUrl] = useState("");
  const [warningList, setWarningList] = useState([]); // ✅ 新增状态


  // ✅ 表格数据
  const firstTabTableData = [
    {
      key: "1",
      recipient:
        "Bing Feedback Triage <bftriageteam@microsoft.com>; Bing Feedback Mail2Bug No Ack <bingfeedbackbugnoack@microsoft.com>",
      cc: "BYS Satori Editorial Team <bysedit@microsoft.com>",
    },
  ];

  const firstTabColumns = [
    {
      title: "收件人(Send)",
      dataIndex: "recipient",
      key: "recipient",
      render: (text) => (
        <Space>
          {text}
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(text);
              message.success("收件人已复制");
            }}
          />
        </Space>
      ),
    },
    {
      title: "抄送(CC)",
      dataIndex: "cc",
      key: "cc",
      render: (text) => (
        <Space>
          {text}
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(text);
              message.success("抄送人已复制");
            }}
          />
        </Space>
      ),
    },
  ];
  const [firstTabText, setFirstTabText] = useState(
    `Hi Triage Team,

(自己写). This is misassigned to Satori, please help to check and reassign it. 

Thanks,
Satori`
  );

  const secondTabText = `The (写什么问题) issue cannot reproduce.
The original screenshot for the issue:
The screenshot that the issue cannot reproduce:`;

  const handleTabClick = (key) => {
    setActiveKey(key);
    if (expandedTabs.includes(key)) {
      setExpandedTabs(expandedTabs.filter((k) => k !== key));
    } else {
      setExpandedTabs([...expandedTabs, key]);
    }
  };

  const contentStyle = {
    overflow: "hidden",
    transition: "max-height 0.3s ease, opacity 0.3s ease",
  };

  const getMaxHeight = (isExpanded) => (isExpanded ? "1000px" : "0px");

  const handleClearCache = () => {
  // 1. 清 localStorage
  localStorage.removeItem("selectedRows");
  localStorage.removeItem("dastText");
 
  // 2. 重置 state
  setSelectedRows([]);
  setText("");
  setWarningList([]);
  setActiveKey(null);
  setExpandedTabs([]);
 
  message.success("缓存已清除");
};

  // ✅ URL查询按钮
  const handleGo = () => {
    if (!url) {
      message.warning("请输入 URL！");
      return;
    }
    navigator.clipboard
      .writeText("lyricsid")
      .then(() => message.success(`已复制: lyricsid`))
      .catch(() => message.error("复制失败，请手动复制"));

    const fullUrl = url.includes("?")
      ? `${url}&format=pbxml`
      : `${url}?format=pbxml`;
    window.open(fullUrl, "_blank");
  };

  // ✅ 点击三级菜单时触发
  const handleMenuClick = (lvl1, lvl2, lvl3) => {
    const newRows = [
      {
        key: Date.now(),
        answerType: lvl1,
        problemType: lvl2,
        devOwner: lvl3,
      },
    ];
    setSelectedRows(newRows);
    localStorage.setItem("selectedRows", JSON.stringify(newRows));

    const key = `${lvl1}>${lvl2}`;
    const newText =
      templates[key] ||
      `Issue:\nRootCause:\nAction taken: I have editorially (自己写) in (key) in ERB. Made changes are reflecting fine, please find the attached screenshot.\nSID and Source:\nThe original screenshot for the issue:\nThe screenshot after the issue mitigated:`;
    setText(newText);
    localStorage.setItem("dastText", newText);

    // ✅ 加载警示文本 (支持 三级路径)
    const warnKey = `${lvl1}>${lvl2}>${lvl3}`;
    if (warnings[warnKey]) {
      setWarningList(warnings[warnKey]);
    } else {
      setWarningList([]);
    }
  };

  // ✅ 渲染菜单
  const renderSubMenu = (items, parentKey, parentLabel) =>
    items.map((item) =>
      item.children ? (
        <Menu.SubMenu key={item.key} title={item.label}>
          {renderSubMenu(item.children, parentKey, item.label)}
        </Menu.SubMenu>
      ) : (
        <Menu.Item
          key={item.key}
          onClick={() => {
            handleMenuClick(parentKey, parentLabel, item.label);
            // ✅ 点击三级菜单收起
            setExpandedTabs([]);
          }}
          style={{ height: 40, lineHeight: '40px', fontSize: '13px' }} // 可单独调整三级菜单大小
        >
          {item.label}
        </Menu.Item>
      )
    );


  const columns = [
    {
      title: "AnswerType (CustomerString01)",
      dataIndex: "answerType",
      key: "answerType",
      render: (text) => (
        <Space>
          {text}
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(text);
              message.success("已复制 AnswerType");
            }}
          />
        </Space>
      ),
    },
    {
      title: "ProblemType (CustomerString02)",
      dataIndex: "problemType",
      key: "problemType",
      render: (text) => (
        <Space>
          {text}
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(text);
              message.success("已复制 ProblemType");
            }}
          />
        </Space>
      ),
    },
    {
      title: "DevOwner",
      dataIndex: "devOwner",
      key: "devOwner",
      render: (text) => (
        <Space>
          {text}
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(text);
              message.success("已复制 DevOwner");
            }}
          />
        </Space>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (_, record) => {
        // 根据 ProblemType 判断 Priority
        const priorityValue = (record.problemType === "UI" || record.problemType === "Algo_UI" || record.problemType === "Creator_UI" ) ? 1 : 2;

        return (
          <Space>
            {priorityValue}
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(priorityValue);
                message.success("已复制 Priority");
              }}
            />
          </Space>
        );
      },
    },
  ];


  useEffect(() => {
    localStorage.setItem("dastText", text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem("selectedRows", JSON.stringify(selectedRows));
  }, [selectedRows]);

  return (
    <div>
      <Space>
        <h3>DAST Mapping:</h3>
        <Button
          type="link"
          icon={<FileExcelTwoTone />}
          href="https://microsoftapc-my.sharepoint.com/:x:/r/personal/v-shuxwa_microsoft_com/_layouts/15/Doc.aspx?sourcedoc=%7B02535408-0B5A-4F9E-A355-3CA2A72BA316%7D&file=Assignment%20Mapping.xlsx&action=default&mobileredirect=true"
          target="_blank"
          rel="noopener noreferrer"
        >
          AssignMent Mapping
        </Button>
        <Button danger type="link" block icon={<DeleteOutlined />} onClick={handleClearCache}>Clean</Button>
      </Space>   
      <br />
      <Space>
        <h3>Lyics工具:</h3>
        <Input
          placeholder="查询lyicsId, 输入 URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: 300 }}
        />
        <Tooltip title="LyicsId查询">
          <Button shape="circle" icon={<SearchOutlined />} onClick={handleGo} />
        </Tooltip>
        <Button
          type="link"
          icon={<SearchOutlined />}
          href="https://satoriv2internalweb.azurewebsites.net/Tools/Lyrics"
          target="_blank"
          rel="noopener noreferrer"
        >
          查询ISCR
        </Button>
        <Button
          type="link"
          icon={<DiffOutlined />}
          href="https://musixmatch.atlassian.net/servicedesk/customer/portal/22/group/46/create/228"
          target="_blank"
          rel="noopener noreferrer"
        >
          添加ticket
        </Button>
        <Button
          type="link"
          icon={<FileWordTwoTone />}
          href="https://microsoft.sharepoint.com/:w:/r/teams/askall/_layouts/15/Doc.aspx?sourcedoc=%7BEDFA4122-6DE4-4308-A79A-CBFF45A48186%7D&file=Triaging%20Lyrics%20Issues.docx&action=default&mobileredirect=true"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lyics 参考文档
        </Button>
      </Space>
      <br />
      <Menu
        mode="horizontal"
        triggerSubMenuAction="click"
        style={{ height: 50, lineHeight: '50px', fontSize: '14px' }} // 修改菜单高度和字体
        openKeys={expandedTabs}
        onOpenChange={(keys) => setExpandedTabs(keys)}
      >
        {Object.keys(menuData).map((mainKey) => (
          <Menu.SubMenu key={mainKey} title={mainKey}>
            {renderSubMenu(menuData[mainKey], mainKey, mainKey)}
          </Menu.SubMenu>
        ))}
      </Menu>

      {/* ⚠️ 警示文本模块 */}
      {warningList.length > 0 && (
        <div
          style={{
            marginTop: 20,
            padding: "12px 16px",
            border: "1px solid #faad14",
            borderRadius: 8,
            backgroundColor: "#fffbe6",
            width: "70%",

          }}
        >
          <Title
            level={5}
            style={{ color: "#d48806", marginTop: 0, marginBottom: 10 }}
          >
            注意事项：
          </Title>

          {warningList.map((line, idx) => {
            let formattedLine = line;
            highlightRules.forEach(({ word, color, background }) => {
              const regex = new RegExp(
                word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "gi"
              );
              formattedLine = formattedLine.replace(
                regex,
                `<span style="color:${color}; background:${background}; padding:1px 3px; border-radius:4px; font-weight:500;">${word}</span>`
              );
            });

            return (
              <p
                key={idx}
                style={{ margin: 0, textIndent: "2em", lineHeight: 1.6, fontSize: "13px" }}
                dangerouslySetInnerHTML={{ __html: formattedLine }}
              />
            );
          })}
        </div>
      )}
      {/* 主体内容 */}
      <div style={{ display: "flex", gap: "16px", marginTop: 16 }}>
        {/* 左侧表格 */}
        <div style={{ flex: 1 }}>
          <h3>AnswerType&ProblemType</h3>
          <Table
            columns={columns}
            dataSource={selectedRows}
            pagination={false}
            bordered
            size="middle"
          />
        </div>
        {/* 右侧模板内容 */}
        <div style={{ flex: 1 }}>
          <h3>Comments</h3>
          <TextArea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              resize: "none",
              fontFamily: "Calibri",
              fontSize: "11pt",
            }}
          />
          <Button
            icon={<CopyOutlined />}
            type="primary"
            block
            style={{ marginTop: 8 }}
            onClick={() => {
              navigator.clipboard.writeText(text);
              message.success("模板已复制");
            }}
          >
            一键复制模板
          </Button>
        </div>
      </div>

      {/* Tabs 区域 */}
      <div>
        <Tabs
          type="card"
          activeKey={activeKey}
          onTabClick={handleTabClick}
          defaultActiveKey={null}
        >
          <Tabs.TabPane tab="Reassign" key="1">
            <div
              style={{
                ...contentStyle,
                maxHeight: getMaxHeight(expandedTabs.includes("1")),
                opacity: expandedTabs.includes("1") ? 1 : 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  padding: 16,
                  alignItems: "stretch",
                }}
              >
                <div style={{ flex: 1 }}>
                  <Table
                    dataSource={firstTabTableData}
                    columns={firstTabColumns}
                    pagination={false}
                    bordered
                    size="middle"
                  />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <TextArea
                    value={firstTabText}
                    onChange={(e) => setFirstTabText(e.target.value)} // 添加这行
                    rows={7}
                    style={{ fontFamily: "Calibri", fontSize: "11pt" }}
                  />
                  <Button
                    icon={<CopyOutlined />}
                    type="primary"
                    block
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      navigator.clipboard.writeText(firstTabText);
                      message.success("模板已复制");
                    }}
                  >
                    一键复制模板
                  </Button>
                </div>

              </div>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Cannot Reproduce" key="2">
            <div
              style={{
                ...contentStyle,
                maxHeight: getMaxHeight(expandedTabs.includes("2")),
                opacity: expandedTabs.includes("2") ? 1 : 0,
              }}
            >
              <div style={{ padding: 16 }}>
                <TextArea
                  value={secondTabText}
                  readOnly
                  rows={5}
                  style={{ fontFamily: "Calibri", fontSize: "11pt" }}
                />
                <Button
                  icon={<CopyOutlined />}
                  type="primary"
                  block
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    navigator.clipboard.writeText(secondTabText);
                    message.success("问题描述已复制");
                  }}
                >
                  一键复制问题描述
                </Button>
              </div>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Magazine分类表" key="3">
            <div
              style={{
                ...contentStyle,
                maxHeight: getMaxHeight(expandedTabs.includes("3")),
                opacity: expandedTabs.includes("3") ? 1 : 0,
              }}
            >
              <div style={{ padding: 16 }}>
                <Table
                  dataSource={mappingData}
                  columns={[
                    { title: "AnswerType", dataIndex: "type", key: "type", width: 300 },
                    { title: "条件 / 说明", dataIndex: "condition", key: "condition" },
                    { title: "Feeds 示例", dataIndex: "examples", key: "examples" },
                  ]}
                  bordered
                  size="middle"
                  pagination={false}
                  rowKey="type"
                />
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>

      </div>
    </div>
  );
}

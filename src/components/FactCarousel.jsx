
import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Button,
  Row,
  Col,
  Card,
  Form,
  message,
  Typography,
  Divider,
  Space,
} from "antd";
import { LeftOutlined, RightOutlined, DeleteOutlined, AliwangwangFilled } from "@ant-design/icons";
const { TextArea } = Input;
const { Title, Text } = Typography;
export default function JsonRenderPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const scrollRef = useRef();
  /** 初始化读取缓存 */
  useEffect(() => {
    const cachedJson = localStorage.getItem("jsonInput");
    const cachedData = localStorage.getItem("parsedData");
    if (cachedJson && cachedData) {
      setJsonInput(cachedJson);
      setParsedData(JSON.parse(cachedData));
    }
  }, []);
  const cleanJsonText = (text) => {
    let v = text.trim();
    if (v.startsWith('"') && v.endsWith('"')) {
      v = v.slice(1, -1);
    }
    v = v.replace(/""/g, '"');
    return v;
  };
  /** 解析 JSON */
  const handleRender = () => {
    try {
      const data = JSON.parse(jsonInput);
      let apiData = [];
      if (typeof data.APIResponse === "string") {
        const temp = JSON.parse(data.APIResponse);
        apiData = temp.response || temp;
      } else {
        apiData = data.APIResponse;
      }
      const scalarFact = apiData?.[0]?.ScalarFact || "";
      /** 提取 titlePlural */
      const titlePlural = apiData?.[0]?.defaultTitle?.titlePlural || "";
      /** 处理 PivotEntityId 列表 */
      let pivotList = [];
      if (data.PivotEntityId) {
        pivotList = data.PivotEntityId.split(",").map((v) => v.trim());
      }
      const category = data.Category || "";
      const language = apiData?.[0]?.Language || "";
      const newData = {
        ...data,
        entities: apiData,
        scalarFact,
        titlePlural,
        pivotList,
        category,
        language
      };
      setParsedData(newData);
      localStorage.setItem("jsonInput", jsonInput);
      localStorage.setItem("parsedData", JSON.stringify(newData));
      message.success("JSON 解析成功并已缓存！");
    } catch (err) {
      message.error("JSON 格式错误，请检查输入！");
    }
  };
  /** 清除缓存 */
  const handleClearCache = () => {
    localStorage.removeItem("jsonInput");
    localStorage.removeItem("parsedData");
    setJsonInput("");
    setParsedData(null);
    message.success("缓存已清除！");
  };
  /** 滑动控制 */
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };
  return (
    <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
      <Space>
        <Title level={3}>🧩 JSON 动态数据渲染</Title>
        <Button
          type="link"
          icon={<AliwangwangFilled />}
          href="https://prod.uhrs.playmsn.com/marketplace/app/76298"
          target="_blank"
          rel="noopener noreferrer"
        >
          UHRS
        </Button>
      </Space>
      <Form layout="vertical">
        <Row gutter={16}>
                    <Col span={4}>
            <Form.Item label="Language">
              <Input value={parsedData?.Language || ""} readOnly />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Query有歧义的时候评论">
              <Input value='ambiguous query' />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="SparqlLabel">
              <Input value={parsedData?.SparqlLabel || ""} readOnly />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="TitlePlural">
              <Input value={parsedData?.titlePlural || ""} readOnly />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Structured Value">
              <Input
                value={
                  parsedData?.scalarFact
                    ? `${parsedData.scalarFact} ${parsedData?.category === "140" ? "kg"
                      : parsedData?.category === "158" ? "km"
                        : parsedData?.category === "490" ? "ft"
                          : parsedData?.category === "400" ? "℃"
                            : "" // 其他情况可留空或自定义单位
                    }`
                    : ""
                }
                readOnly
              />
            </Form.Item>
          </Col>
        </Row>
        {/* PivotEntityId 列表 */}
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item label="PivotEntityId：">
              <Card size="small" style={{ background: "#fafafa" }}>
                {parsedData?.pivotList?.map((sid, i) => (
                  <div key={i} style={{ marginBottom: 4 }}>
                    - {sid}
                    <a
                      href={`https://satoriv2.azurewebsites.net/EntityRepositoryBrowser?SID=${sid}&setLang=en&cc=*&ns=0`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔗 打开 SID
                    </a>
                  </div>
                ))}
              </Card>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={20}>
            <TextArea
              rows={3}
              placeholder="在此输入 JSON 数据"
              value={jsonInput}
              onChange={(e) => {
                const cleaned = cleanJsonText(e.target.value);
                setJsonInput(cleaned);
              }}
            />
          </Col>
          <Col span={4} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button type="primary" block onClick={handleRender}>
                解析并渲染 JSON
              </Button>
              <Button danger block icon={<DeleteOutlined />} onClick={handleClearCache}>
                清除缓存
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Divider />
      {/* 实体卡片横向滚动 */}
      {parsedData && (
        <>
          <div style={{ position: "relative", marginBottom: 40 }}>
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              onClick={() => scroll("left")}
              style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", zIndex: 10 }}
            />
            <div
              ref={scrollRef}
              style={{ display: "flex", overflowX: "auto", scrollBehavior: "smooth", gap: "16px", padding: "0 48px" }}
            >
              {parsedData.entities?.map((item, idx) => (
                <Card
                  key={idx}
                  hoverable
                  style={{ width: 200, flex: "0 0 auto", borderRadius: 10, overflow: "hidden" }}
                  cover={
                    item.ImageId && item.ImageId[0] ? (
                      <img
                        alt={item.EntityName?.[0]}
                        src={`https://th.bing.com/th/id/${item.ImageId[0]}`}
                        style={{ height: 280, width: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 280,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f5f5f5",
                          color: "#999",
                        }}
                      >
                        No Image
                      </div>
                    )
                  }
                >
                  <Card.Meta
                    title={
                      <a
                        href={`https://satoriv2.azurewebsites.net/EntityRepositoryBrowser?SID=${item.EntityId}&setLang=${parsedData?.Language || "en"}&cc=*&ns=0`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1677ff", textDecoration: "none" }}
                      >
                        {item.EntityName?.[0] || "Unknown"}
                      </a>
                    }
                    description={<Text type="secondary">{item.extra0 || ""}</Text>}
                  />
                </Card>
              ))}
            </div>
            <Button
              shape="circle"
              icon={<RightOutlined />}
              onClick={() => scroll("right")}
              style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)", zIndex: 10 }}
            />
          </div>
          <Divider />
          <Card title="所有实体名称">
            {parsedData.entities?.map((e, i) => (
              <Text strong key={i} style={{ marginRight: 12 }}>
                {e.EntityName?.[0] || "N/A"},
              </Text>
            ))}
          </Card>
          <Button
            type="primary"
            style={{ marginTop: 20 }}
            onClick={() => {
              navigator.clipboard.writeText(parsedData.entities.map((e) => e.EntityName?.[0]).join(", "));
              message.success("已复制所有实体名称！");
            }}
          >
            一键复制
          </Button>
        </>
      )}
    </div>
  );
}

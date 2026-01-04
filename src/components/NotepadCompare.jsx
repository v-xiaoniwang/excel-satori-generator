
import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Input,
  Row,
  Col,
  Divider,
  Typography,
  Space,
  Button,
  Tooltip,
  Switch,
  message,
  Segmented,
} from "antd";
import {
  SwapOutlined,
  VerticalAlignBottomOutlined,
  ClearOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import DiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import { diffLines } from "diff";

const { TextArea } = Input;
const { Title } = Typography;

export default function AntdNotepadCompare() {
  /** 文本 */
  const [leftText, setLeftText] = useState(() => localStorage.getItem("compare_left") || "");
  const [rightText, setRightText] = useState(() => localStorage.getItem("compare_right") || "");

  /** 忽略规则 */
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreSpace, setIgnoreSpace] = useState(false);
  const [ignorePunctuation, setIgnorePunctuation] = useState(false);

  /** 比较粒度 */
  const [compareMethod, setCompareMethod] = useState(DiffMethod.LINES);

  /** UI 状态 */
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [currentDiff, setCurrentDiff] = useState(0);

  /** diff 定位 */
  const lineRefs = useRef([]);

  const diffList = diffLines(leftText, rightText);
  const diffPositions = diffList
    .map((d, i) => (d.added || d.removed ? i : null))
    .filter((i) => i !== null);

  /** 监听滚动 */
  useEffect(() => {
    const onScroll = () => setShowScrollButton(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** 本地缓存 */
  useEffect(() => {
    localStorage.setItem("compare_left", leftText);
    localStorage.setItem("compare_right", rightText);
  }, [leftText, rightText]);

  /** 清除 */
  const handleClear = () => {
    localStorage.removeItem("compare_left");
    localStorage.removeItem("compare_right");
    setLeftText("");
    setRightText("");
  };

  /** 交换 */
  const handleSwap = () => {
    setLeftText(rightText);
    setRightText(leftText);
  };

  /** 粘贴 */
  const handlePasteLeft = async () => setLeftText(await navigator.clipboard.readText());
  const handlePasteRight = async () => setRightText(await navigator.clipboard.readText());

  /** 统一文本预处理 */
  const normalize = (text) => {
    let t = text || "";
    if (ignoreCase) t = t.toLowerCase();
    if (ignoreSpace) t = t.replace(/\s+/g, "");
    if (ignorePunctuation) t = t.replace(/[，。！？、,.!?;:′'–-]/g, "");
    return t;
  };

  /** JSON 美化 */
  const formatJson = (text) => {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  };

  return (
    <Card style={{ margin: 20, padding: 20 }}>
      <Title level={3}>文本比较器</Title>

      {/* 操作栏 */}
      <Space wrap style={{ marginBottom: 16 }}>
        <Button icon={<ClearOutlined />} onClick={handleClear}>
          清除文本
        </Button>

        <Button icon={<SwapOutlined />} onClick={handleSwap}>
          交换
        </Button>

        <Button icon={<VerticalAlignBottomOutlined />} onClick={handlePasteLeft}>
          粘贴左侧
        </Button>

        <Button icon={<VerticalAlignBottomOutlined />} onClick={handlePasteRight}>
          粘贴右侧
        </Button>

        <Divider type="vertical" />

        <span>忽略大小写</span>
        <Switch checked={ignoreCase} onChange={setIgnoreCase} />

        <span>忽略空白</span>
        <Switch checked={ignoreSpace} onChange={setIgnoreSpace} />

        <span>忽略标点</span>
        <Switch checked={ignorePunctuation} onChange={setIgnorePunctuation} />

        <Divider type="vertical" />

        <Segmented
          value={compareMethod}
          onChange={setCompareMethod}
          options={[
            { label: "行级", value: DiffMethod.LINES },
            { label: "词级", value: DiffMethod.WORDS },
            { label: "字符级", value: DiffMethod.CHARS },
          ]}
        />
      </Space>

      {/* 输入区 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="旧文本">
            <TextArea
              rows={10}
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              placeholder="输入左侧文本"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card size="small" title="新文本">
            <TextArea
              rows={10}
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              placeholder="输入右侧文本"
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Diff 结果 */}
      <Card size="small" title="对比结果">
        <DiffViewer
          oldValue={normalize(formatJson(leftText))}
          newValue={normalize(formatJson(rightText))}
          splitView
          showDiffOnly={false}
          compareMethod={compareMethod}
          styles={{
            diffViewer: {
              maxWidth: "100%",
              overflowX: "hidden",  
            },
            contentText: {
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              fontFamily: "Consolas, monospace",
              fontSize: 13,
            },
            line: {
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            },
            codeFold: {
              whiteSpace: "pre-wrap",
            },
          }}
        />
      </Card>

      {/* 回到顶部 */}
      {showScrollButton && (
        <Tooltip title="回到顶部">
          <Button
            type="primary"
            shape="circle"
            icon={<ArrowUpOutlined />}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              position: "fixed",
              right: 20,
              bottom: 40,
              zIndex: 1000,
            }}
          />
        </Tooltip>
      )}
    </Card>
  );
}

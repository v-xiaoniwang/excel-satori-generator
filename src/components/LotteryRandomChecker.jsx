import React, { useState, useEffect } from "react";
import { Button, Input, Card, Space, message } from "antd";

export default function LotteryRandomChecker() {
  const [randomSets, setRandomSets] = useState([]);
  const [winningRed, setWinningRed] = useState("");
  const [winningBlue, setWinningBlue] = useState("");
  const [results, setResults] = useState([]);

  // 读取缓存
  useEffect(() => {
    const cached = localStorage.getItem("lottery_numbers");
    if (cached) setRandomSets(JSON.parse(cached));
  }, []);

  const saveCache = (data) => {
    localStorage.setItem("lottery_numbers", JSON.stringify(data));
  };

  const generateOneSet = () => {
    const reds = [];
    while (reds.length < 6) {
      const n = Math.floor(Math.random() * 33) + 1;
      if (!reds.includes(n)) reds.push(n);
    }
    const blue = Math.floor(Math.random() * 16) + 1;
    return { reds: reds.sort((a, b) => a - b), blue };
  };

  const generateThreeSets = () => {
    const sets = [generateOneSet(), generateOneSet(), generateOneSet(), generateOneSet(), generateOneSet()];
    setRandomSets(sets);
    saveCache(sets);
    setResults([]);
  };

  const getPrizeLevel = (matchRed, blueHit) => {
    if (matchRed === 6 && blueHit) return "一等奖";
    if (matchRed === 6) return "二等奖";
    if (matchRed === 5 && blueHit) return "三等奖";
    if (matchRed === 5 || (matchRed === 4 && blueHit)) return "四等奖";
    if (matchRed === 4 || (matchRed === 3 && blueHit)) return "五等奖";
    if (matchRed <= 2 && blueHit) return "六等奖";
    return "未中奖";
  };

  const checkWinning = () => {
    if (!winningRed.trim() || !winningBlue.trim()) {
      message.error("请输入完整中奖号码（红球6个 + 蓝球1个）");
      return;
    }

    const winReds = winningRed
      .split(/[ ,]+/)
      .map((x) => parseInt(x))
      .filter((x) => !isNaN(x));

    const winBlue = parseInt(winningBlue);

    const res = randomSets.map((item) => {
      const matchRed = item.reds.filter((n) => winReds.includes(n)).length;
      const blueHit = item.blue === winBlue;
      const prize = getPrizeLevel(matchRed, blueHit);
      return { ...item, matchRed, blueHit, prize };
    });

    setResults(res);
  };

  const copySet = (set) => {
    const text = `${set.reds.join(",")} | ${set.blue}`;
    navigator.clipboard.writeText(text);
    message.success("号码已复制");
  };

  // 添加：生成今日运势号码（固定种子随机）
  const generateFortuneSet = () => {
    const today = new Date().toISOString().slice(0, 10);
    let seed = parseInt(today.replace(/-/g, ""));

    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const reds = [];
    while (reds.length < 6) {
      const n = Math.floor(seededRandom() * 33) + 1;
      if (!reds.includes(n)) reds.push(n);
    }
    const blue = Math.floor(seededRandom() * 16) + 1;

    return { reds: reds.sort((a, b) => a - b), blue };
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      
      <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>财神指南</h2>

      <Button type="primary" onClick={generateThreeSets} block style={{ height: 45, marginTop: 12 }}>
        天灵灵，地灵灵，让我暴富行不行
      </Button>

      <Space direction="vertical" style={{ width: "100%", marginTop: 16 }}>
        {randomSets.map((set, idx) => (
          <Card
            key={idx}
            size="small"
            style={{ transition: "0.3s", cursor: "pointer" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <b>第 {idx + 1} 组：</b>
                <span style={{ color: "red" }}> {set.reds.join(" , ")} </span>
                <span style={{ color: "blue" }}> | {set.blue}</span>
              </div>
              <Button size="small" onClick={() => copySet(set)}>复制</Button>
            </div>
          </Card>
        ))}
      </Space>

      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>财运签</h3>

        <Input
          value={winningRed}
          onChange={(e) => setWinningRed(e.target.value)}
          style={{ marginTop: 12, height: 45 }}
        />

        <Input
          value={winningBlue}
          onChange={(e) => setWinningBlue(e.target.value)}
          style={{ marginTop: 12, height: 45 }}
        />

        <Button type="primary" onClick={checkWinning} block style={{ height: 45, marginTop: 12 }}>
          上上签
        </Button>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>比对结果</h3>
          <Space direction="vertical" style={{ width: "100%", marginTop: 12 }}>
            {results.map((r, idx) => (
              <Card key={idx} size="small" style={{ background: "#f6faff" }}>
                <div>
                  <b>第 {idx + 1} 组：</b>
                  <span style={{ color: "red" }}> {r.reds.join(" , ")} </span>
                  <span style={{ color: "blue" }}> + {r.blue}</span>
                </div>
                <div style={{ marginTop: 6 }}>红数命中数量：{r.matchRed}</div>
                <div>蓝数命中：{r.blueHit ? "是" : "否"}</div>
                <div style={{ marginTop: 6, fontWeight: "bold" }}>中奖结果：{r.prize}</div>
              </Card>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
}

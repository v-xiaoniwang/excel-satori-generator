import React, { useState } from "react";
import { Menu, Divider, Space, Button, Table, Input, message } from "antd";
import {
    BugOutlined, CopyOutlined, TranslationOutlined, FormatPainterOutlined, OpenAIOutlined, ToolFilled,
    FilePptTwoTone, FileWordTwoTone, FileExcelTwoTone, GoogleCircleFilled, MailOutlined, AlipayCircleOutlined
    , BilibiliFilled, TikTokFilled, AliwangwangFilled, EyeOutlined, DiffOutlined
} from "@ant-design/icons";


export default function DASTSection() {

    return (
        <div>
            <Space>
                <h3>常用工具:</h3>
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
                    icon={<FormatPainterOutlined />}
                    href="http://binguf:8080/query-parser"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    文本格式化
                </Button>
                <Button
                    type="link"
                    icon={<ToolFilled />}
                    href="https://www.csdn.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    CSDN
                </Button>
                <Button
                    type="link"
                    icon={<FilePptTwoTone />}
                    href="https://microsoft.sharepoint.com/:p:/t/BYSSatoriTeam/Ebx6fItJOYdAiuZNk3qQLggBKOTPToNVRYeRHNJ0vfgRaw?wdOrigin=TEAMS-MAGLEV.p2p_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1757856684494&web=1"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Algo参考文档
                </Button>
                <Button
                    type="link"
                    icon={<GoogleCircleFilled />}
                    href="https://www.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    谷歌浏览器
                </Button>
                <Button
                    type="link"
                    icon={<AliwangwangFilled />}
                    href="https://ant.design/components/icon-cn/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Ant Design
                </Button>

                <Button
                    type="link"
                    icon={<AliwangwangFilled />}
                    href="https://prod.uhrs.playmsn.com/marketplace/app/76298"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    UHRS
                </Button>
                <Button
                    type="link"
                    icon={<AliwangwangFilled />}
                    href="https://microsoft.sharepoint.com/:p:/t/BYSSatoriTeam/IQCpBUCdpgz_QocG6l0EIgEkAQUIWDwuzcPt0Jr3twtiSSI?wdOrigin=TEAMS-MAGLEV.p2p_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1762839636739&web=1"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Creator Answer
                </Button>

                <Button
                    type="link"
                    icon={<AliwangwangFilled />}
                    href="https://algoblockeditorial.azurewebsites.net/BlockList"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    BlockLis工具
                </Button>

                <Button
                    type="link"
                    icon={<AliwangwangFilled />}
                    href="https://microsoft.sharepoint.com/:x:/r/teams/BYSSatoriTeam/_layouts/15/Doc.aspx?sourcedoc=%7B9E965993-33A0-4123-B7A6-7C6248702DA1%7D&file=AI%20Benchmark%20Evaluation.xlsx&action=default&mobileredirect=true&share=IQGTWZaeoDMjQbemfGJIcC2hAU3f0Rd99Z3ERmn7QP8X2ME&wdOrigin=TEAMS-MAGLEV.p2p_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1763432369964&web=1"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Al 表格
                </Button>


            </Space>
            <br />
            <Space>
                <h3>邮箱:</h3>
                <Button
                    type="link"
                    icon={<MailOutlined />}
                    href="https://aps.beyondsoft.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    博彦邮箱
                </Button>
                <Button
                    type="link"
                    icon={<AlipayCircleOutlined />}
                    href="https://e-cology.beyondsoft.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    博彦 E-cology
                </Button>
            </Space>
            <br />
            <Space>
                <h3>Study:</h3>
                <Button
                    type="link"
                    icon={<BilibiliFilled />}
                    href="https://www.bilibili.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    哔哩哔哩
                </Button>
                <Button
                    type="link"
                    icon={<TikTokFilled />}
                    href="https://www.douyin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    抖音~记录没有未来
                </Button>
                <Button
                    type="link"
                    icon={<AliwangwangFilled />}
                    href="https://leetcode.cn/problemset/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    力扣
                </Button>
            </Space>
            <br />
            <Space>
                <h3>DAST:</h3>
                <Button
                    type="link"
                    icon={<BugOutlined />}
                    href="https://msasg.visualstudio.com/BingFeedback/_dashboards/dashboard/802616f3-f893-476b-a7c6-5600be9fb1ab"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    BinnFeedIPG
                </Button>
                <Button
                    type="link"
                    icon={<BugOutlined />}
                    href="https://msasg.visualstudio.com/WebXT_Quality/_queries/query/?_a=query&wiql=SELECT%20%5BSystem.Id%5D%2C%20%5BSystem.WorkItemType%5D%2C%20%5BSystem.Title%5D%2C%20%5BSystem.AssignedTo%5D%2C%20%5BSystem.State%5D%2C%20%5BSystem.Tags%5D%2C%20%5BSystem.CreatedDate%5D%20FROM%20workitems%20WHERE%20%5BSystem.TeamProject%5D%20%3D%20%27WebXT_Quality%27%20AND%20(%20(%20%5BSystem.AreaPath%5D%20%3D%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%27%20%20OR%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%5CKnowledge%20card%27%20OR%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%5CKnowledgeCardInterestingContent%27%20OR%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%5CSatori%20Data%20Relevance%27%20OR%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%5CSatoriImageAndVideo%27%20OR%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%5CSatoriFactCarousel%27%20OR%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%5CFact%20Answer%27%20OR%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%5CCarousel%27%20OR%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%5CEntity%20Data%27%20OR%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%5CEntity%20Triggering%20Feedback%27%20OR%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%5CMusic%27%20OR%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%5CWhole%20Page%20Tabs%27%20OR%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5CBing%20Experiences%5CWhole%20Page%20and%20Answers%5CSatori%20Global%20Editorial%27%20)%20AND%20%5BSystem.WorkItemType%5D%20%3D%20%27Bug%27%20AND%20%5BSystem.State%5D%20%3D%20%27New%27%20)%20ORDER%20BY%20%5BSystem.CreatedDate%5D"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    WebXT_Quality1
                </Button>
                <Button
                    type="link"
                    icon={<BugOutlined />}
                    href="https://msasg.visualstudio.com/WebXT_Quality/_queries/query/?_a=query&wiql=SELECT%20%5BSystem.Id%5D%2C%5BSystem.WorkItemType%5D%2C%5BSystem.Title%5D%2C%5BSystem.AssignedTo%5D%2C%5BSystem.State%5D%2C%5BSystem.Tags%5D%20FROM%20WorkItems%20WHERE%20%5BSystem.TeamProject%5D%20%3D%20%27WebXT_Quality%27%20AND%20(%20%5BSystem.AreaPath%5D%20UNDER%20%27WebXT_Quality%5C%5CBing%20Experiences%5C%5CWhole%20Page%20and%20Answers%5C%5CAnswers%20UX%20and%20backend%27%20AND%20%5BSystem.CreatedDate%5D%20%3E%3D%20%40startOfDay(%27-30d%27)%20AND%20%5BSystem.WorkItemType%5D%20%3D%20%27Bug%27%20AND%20%5BSystem.State%5D%20%3C%3E%20%27Fixed%20and%20Verified%27%20AND%20%5BSystem.State%5D%20%3C%3E%20%27By%20Design%27%20AND%20%5BSystem.Tags%5D%20NOT%20CONTAINS%20%27BysEdit_Reassigned%27%20AND%20%5BSystem.Tags%5D%20NOT%20CONTAINS%20%27BysReviewed%27%20AND%20%5BSystem.State%5D%20%3C%3E%20%27WXQ%20review%27%20AND%20%5BSystem.State%5D%20%3C%3E%20%27Deferred%27%20AND%20%5BSystem.State%5D%20%3C%3E%20%27Rejected%27%20AND%20%5BSystem.State%5D%20%3C%3E%20%27Duplicate%27%20AND%20%5BSystem.State%5D%20%3C%3E%20%27Closed%20by%20CIP%27%20AND%20(%20%5BSystem.Title%5D%20CONTAINS%20WORDS%20%27Lyrics%20answer%27%20OR%20%5BSystem.Title%5D%20CONTAINS%20WORDS%20%27lyrics%20title%27%20OR%20%5BSystem.Title%5D%20CONTAINS%20WORDS%20%27tab%20answer%27%20OR%20%5BSystem.Title%5D%20CONTAINS%20WORDS%20%27Knowledge%20Card%27%20OR%20%5BSystem.Title%5D%20CONTAINS%20WORDS%20%27Fact%20answer%27%20)%20AND%20%5BSystem.Title%5D%20NOT%20CONTAINS%20WORDS%20%27Whole%20Tab%20answer%27%20AND%20%5BSystem.Title%5D%20NOT%20CONTAINS%20WORDS%20%27Whole%20Page%20Tab%20Answer%27)"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    WebXT_Quality2
                </Button>
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    href="https://satoriv2internalweb.azurewebsites.net/EditorialReport/DSAT?tab=review"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Review工具
                </Button>
            </Space >
            <br />
            <Space>
                <h3>Goverment:</h3>
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    href="https://bingdat36.corp.ms/d/CSuite/index.htm?bd_qsn=Q2hpZWZNaW5pc3RlckluZGlh0&lang=en&env=prod&build=2025-09-14T12.00.10&bd_ddlquery=U0VMRUNUIERJU1RJTkNUIFF1ZXJ5LCBFbnRpdHksIFBvc2l0aW9uLCBHcm91bmRUcnV0aCwgRkNUaXRsZSwgRkNUZXh0LCBEaXNwQmluZ1VybCBBUyBEREhfRGlzcEJpbmdVcmwgRlJPTSBUMzE4NTczNyBXSEVSRSBGQ1RpdGxlIDw-ICcnIEFORCBGQ1RpdGxlIElTIE5PVCBOVUxMIEFORCBGQ1RleHQgPD4gR3JvdW5kVHJ1dGggQU5EIEdyb3VuZFRydXRoIDw-ICcn0&ttl=Mismatched"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Review C-Suite
                </Button>
                <Button
                    type="link"
                    icon={<AliwangwangFilled />}
                    href="https://microsoft.sharepoint.com/:x:/r/teams/BYSSatoriTeam/_layouts/15/doc2.aspx?sourcedoc=%7B9365C24F-64E3-447D-A2E3-5B874D8D7F02%7D&file=Translation_MultipleLanguage.xlsx&action=default&mobileredirect=true&share=IQFPwmWT42R9RKLjW4dNjX8CATsHBfzfwVyOS8vyECrak6o&clickparams=eyAiWC1BcHBOYW1lIiA6ICJNaWNyb3NvZnQgT3V0bG9vayIsICJYLUFwcFZlcnNpb24iIDogIjE2LjAuMTkyMzEuMjAwNDQiLCAiT1MiIDogIldpbmRvd3MiIH0%3D&CID=6AE904CA-8523-4201-9FC6-54B23FDA4358&wdLOR=c1E50E199-E30F-4865-8046-828A01C71138"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Translation MultipleLanguage
                </Button>
            </Space>
        </div>
    );
}
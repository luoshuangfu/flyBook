# 前端视觉风格规范（手绘暖色）

## 禁用项
- 禁止蓝紫渐变
- 禁止玻璃拟态和高冷科技风

## 主题变量建议
```css
:root {
  --bg-main: #f8f1df;
  --bg-panel: #fff9ec;
  --ink: #3a2f2a;
  --accent: #f2a65a;
  --accent-soft: #ffd7a8;
  --line: #6b4f3a;
  --ok: #7ea172;
}
```

## 设计语言
- 卡片边框使用“手绘双线”效果（轻微偏移）
- 按钮有轻微抖动阴影和纸片感
- 图标使用涂鸦风 SVG
- 页面背景使用米黄纸纹理（低透明 pattern）

## 字体建议
- 中文：`"LXGW WenKai"`, `"ZCOOL KuaiLe"`
- 英文辅助：`"Patrick Hand"`

## 动效建议
- 页面进入：上浮 + 淡入（200~300ms）
- 卡片出现：stagger 延迟
- hover：1~2px 轻微位移，不做炫酷特效

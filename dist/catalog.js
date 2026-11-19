const style = (id, name, english, group, note, aliases = "") => ({ id, name, english, group, note, aliases });

const styles = [
  style("minimalism-and-swiss-style", "极简与瑞士风格", "Minimalism & Swiss Style", "清晰与结构", "黑白底色、严格网格和清楚的字号层级，用留白划分内容。", "Minimal|Minimalism|Minimalism (Frame)"),
  style("glassmorphism", "玻璃拟态", "Glassmorphism", "材质与空间", "半透明面板悬浮在彩色背景上，边缘细亮，带磨砂模糊。"),
  style("neubrutalism", "新粗野主义", "Neubrutalism", "大胆与复古", "黑描边、鲜艳底色和硬偏移阴影，保留醒目的可点击边界。"),
  style("editorial-grid-magazine", "杂志编辑网格", "Editorial Grid / Magazine", "自然与叙事", "衬线标题、分栏、细分隔线和强调色，像排过版的杂志内页。", "Editorial Grid"),
  style("neumorphism", "新拟态", "Neumorphism", "材质与空间", "让面板和按钮从同色底面轻轻隆起，用成对的亮暗阴影塑造体积。按下时阴影转向内侧。"),
  style("brutalism", "粗野主义", "Brutalism", "大胆与复古", "保留裸露的网格和原色块。使用粗体、直角、黑色分隔线和即时反馈，呈现直接的排版。"),
  style("3d-and-hyperrealism", "3D 与超写实", "3D & Hyperrealism", "材质与空间", "用定向光、反射高光和接触阴影塑造有重量感的三维物件，深色舞台衬托材质细节。"),
  style("vibrant-and-block-based", "高彩度色块", "Vibrant & Block-based", "大胆与复古", "高饱和色分别占据完整区块，用大字号和鲜明的明暗对比划分阅读顺序。", "Vibrant & Block"),
  style("claymorphism", "黏土拟态", "Claymorphism", "材质与空间", "大圆角配合内侧高光和外部软阴影，让卡片和图形像有厚度的彩色黏土。", "Claymorphism (for patients)"),
  style("aurora-ui", "极光界面", "Aurora UI", "材质与空间", "把蓝、青、紫光分层铺开，形成柔和流动的极光。文字和操作留在较暗、稳定的区域。"),
  style("retro-futurism", "复古未来主义", "Retro-Futurism", "大胆与复古", "落日条纹、透视地平线与洋红到青蓝的灯光，呈现复古科幻屏幕的空间感。"),
  style("flat-design", "扁平设计", "Flat Design", "清晰与结构", "使用纯色填充、简单轮廓和清楚的区块层级。按钮通过颜色与位置表达功能。"),
  style("skeuomorphism", "实体拟物", "Skeuomorphism", "材质与空间", "借用皮革、金属面板和实体按键的纹理。用边缘倒角、凹槽和按压深度提示操作方式。"),
  style("liquid-glass", "液态玻璃", "Liquid Glass", "材质与空间", "在彩色背景上叠放带透镜状高光的透明胶囊，用亮边、折射感和内侧阴影刻画光学材质。", "Apple Liquid Glass"),
  style("soft-ui-evolution", "柔和界面演进", "Soft UI Evolution", "材质与空间", "浅色底面和克制的投影保留柔和触感，同时用清楚的边框与较深的操作色分离层级。"),
  style("y2k-aesthetic", "Y2K 千禧风", "Y2K Aesthetic", "大胆与复古", "用镀铬、珠光粉和亮青色泡泡营造千禧年数码质感，搭配亮边和糖果色按钮。"),
  style("cyberpunk-ui", "赛博朋克界面", "Cyberpunk UI", "大胆与复古", "深色终端搭配酸绿和品红信号色。斜切形状、扫描线和等宽字强化地下科技气质。"),
  style("organic-biophilic", "有机亲自然设计", "Organic Biophilic", "自然与叙事", "森林绿搭配泥土色与柔和光影，用叶片轮廓和偏心曲线带出自然的生长感。"),
  style("memphis-design", "孟菲斯设计", "Memphis Design", "大胆与复古", "在粉、黄、蓝绿平面上组合散点、斜纹和不对称几何，让装饰保持俏皮，操作区保持稳定。"),
  style("exaggerated-minimalism", "夸张极简主义", "Exaggerated Minimalism", "清晰与结构", "把标题推到显眼的尺度，用大片留白和一处高彩度强调，让文字本身成为构图。"),
  style("hud-sci-fi-fui", "科幻抬头显示", "HUD / Sci-Fi FUI", "数据与系统", "用青色细线、测距刻度、同心雷达和等宽数值表达仪表读数，保留清楚的文字标签。", "HUD|FUI|Sci-Fi HUD|HUD/Sci-Fi FUI|Holographic / HUD|Holographic/HUD"),
  style("pixel-art", "像素艺术", "Pixel Art", "大胆与复古", "用有限色板、阶梯边缘和方格拼成像素图形，搭配等宽文字与即时按键反馈。"),
  style("e-ink-paper", "电子墨水与纸张", "E-Ink / Paper", "清晰与结构", "以黑白灰、细纸纹和印刷式分隔线复现电子墨水阅读感，交互即时切换。", "E-Ink Paper|E-Ink/Paper"),
  style("gen-z-chaos-maximalism", "Z 世代混搭极繁", "Gen Z Chaos / Maximalism", "大胆与复古", "让荧光撞色、倾斜贴纸和粗描边在主视觉中碰撞。主要按钮与标签留在稳定的阅读区。", "Gen Z Chaos"),
  style("biomimetic-organic-2-0", "仿生有机 2.0", "Biomimetic / Organic 2.0", "自然与叙事", "用半透明多瓣细胞、荧光与相连的轮廓表现微观生长，形状缓慢舒展。", "Biomimetic/Organic 2.0"),
  style("anti-polish-raw-aesthetic", "去修饰的原生美学", "Anti-Polish / Raw Aesthetic", "大胆与复古", "采用素纸、铅笔线、胶带和略有偏移的手绘边缘，呈现可读的工作草稿。", "Anti-Polish Raw"),
  style("nature-distilled", "自然本色", "Nature Distilled", "自然与叙事", "从砂、陶土与粉笔提炼暖色，用细微颗粒、柔和的投影和简洁曲面表达材质。"),
  style("vintage-analog-retro-film", "复古模拟胶片", "Vintage Analog / Retro Film", "大胆与复古", "用褪色调、胶片颗粒、相框和一抹漏光，呈现模拟摄影的印刷质感。"),
  style("bauhaus", "包豪斯", "Bauhaus", "大胆与复古", "让红圆、蓝矩形与黄三角服从几何网格。辅以清楚的字号和机械式按键反馈。", "Bauhaus"),
];

const groups = [...new Set(styles.map(({ group }) => group))];
const defaultStyle = "minimalism-and-swiss-style";

const style = (id, name, english, group, note) => ({ id, name, english, group, note });

const styles = [
  style("minimalism-and-swiss-style", "极简与瑞士风格", "Minimalism & Swiss Style", "清晰与结构", "黑白底色、严格网格和清楚的字号层级，用留白划分内容。"),
  style("glassmorphism", "玻璃拟态", "Glassmorphism", "材质与空间", "半透明面板悬浮在彩色背景上，边缘细亮，带磨砂模糊。"),
  style("neubrutalism", "新粗野主义", "Neubrutalism", "大胆与复古", "黑描边、鲜艳底色和硬偏移阴影，保留醒目的可点击边界。"),
  style("bento-box-grid", "Bento 网格", "Bento Box Grid", "清晰与结构", "组合大小不同的圆角块。主要操作占大块，数据和详情各有位置。"),
  style("editorial-grid-magazine", "杂志编辑网格", "Editorial Grid / Magazine", "自然与叙事", "衬线标题、分栏、细分隔线和强调色，像排过版的杂志内页。"),
];

const groups = [...new Set(styles.map(({ group }) => group))];
const defaultStyle = "bento-box-grid";

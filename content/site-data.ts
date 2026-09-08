/** Structured content for the Ego-VLA guide. */

export type Figure = {
  id: string;
  src: string;
  caption: string;
  alt: string;
  source?: string;
};

export type Source = {
  id: string;
  label: string;
  href: string;
  note?: string;
};

export type MathSegment = { math: string };
export type RichText = string | Array<string | MathSegment>;

export type Method = {
  id: string;
  name: string;
  summary: string;
  data: RichText[];
  actionSpace: RichText;
  coordinateFrame: RichText;
  training: RichText[];
  deployment: string;
  keyNumbers: string[];
  formulas: string[];
  figures: string[];
  caveats: string[];
};

export type PipelineStep = {
  step: number;
  title: string;
  description: string;
  formula?: string;
};

export type ComparisonRow = {
  dimension: string;
  values: Record<string, RichText>;
};

const math = (value: string): MathSegment => ({ math: value });

export type Benchmark = {
  id: string;
  name: string;
  badge: string;
  positioning: string;
  stats: { label: string; value: string }[];
  setup: string[];
  tasks: string[];
  metrics: string[];
  figures: string[];
  sources: string[];
};

export const pipeline: PipelineStep[] = [
  {
    step: 1,
    title: "估计人体状态",
    description: "从第一人称 RGB、VR 或 SLAM 估计腕部位姿与手部关键点；也可直接使用 ARKit、Vive 或 Manus 追踪。",
    formula: String.raw`\mathbf{T}_{\mathrm{wrist}}\in\mathrm{SE}(3)`,
  },
  {
    step: 2,
    title: "固定参考坐标系",
    description: "把腕和手变换到相机系、ARKit origin、机器人头相机或世界系，并记录每种方法的原点定义。",
    formula: String.raw`\Delta\mathbf{p}_t=\mathbf{p}_t-\mathbf{p}_{t-1}`,
  },
  {
    step: 3,
    title: "构造机器人动作",
    description: "腕部对应 EEF 平移与旋转，手指对应夹爪开合或灵巧手关节；需要时通过 MANO、关键点或 IK retarget。",
    formula: String.raw`\mathbf{a}_t=(\mathbf{p}_t,\mathbf{R}_t,w_t)`,
  },
  {
    step: 4,
    title: "对齐并训练 VLA",
    description: "将图像、语言、proprio 与固定长度 action chunk 对齐，再按回归或 flow matching 目标训练，并在仿真或机器人域微调。",
    formula: String.raw`\mathbf{A}_t=(\mathbf{a}_t,\ldots,\mathbf{a}_{t+H})`,
  },
];

export const methods: Method[] = [
  {
    id: "egovla",
    name: "EgoVLA",
    summary: "最接近标准 VLM-VLA 的人体 ego 预训练方案，轨迹 decoder 直接回归未来动作。",
    data: ["公开头戴 RGB、语言与 proprio", "30 Hz，未来 30 步，约 1 s chunk", "MANO 与双腕 rot6D"],
    actionSpace: [math(String.raw`48=6_{\mathrm{EE}}+30_{\mathrm{hand}}+12_{\mathrm{rot6d}}`)],
    coordinateFrame: "当前相机系腕部 3D 位姿",
    training: [
      "人体 ego 预训练",
      "仿真或机器人演示微调",
      ["加权回归：", math(String.raw`\mathcal{L}=20\mathcal{L}_{\mathrm{ee}}+5\mathcal{L}_{\mathrm{hand}}+5\mathcal{L}_{\mathrm{rot}}`)],
    ],
    deployment: "MANO 经 IK 得到 EEF，指尖映射到机器人手关节。",
    keyNumbers: ["30 Hz", "30-step chunk", "48-D action"],
    formulas: [String.raw`\mathcal{L}=20\mathcal{L}_{\mathrm{ee}}+5\mathcal{L}_{\mathrm{hand}}+5\mathcal{L}_{\mathrm{rot}}`],
    figures: ["egovla-teaser", "egovla-instruction", "egovla-pipeline", "egovla-align"],
    caveats: ["部署时需要 MANO 到目标机器人本体的 IK 和手部 retarget。"],
  },
  {
    id: "hrdt",
    name: "H-RDT",
    summary: "在 EgoDex 人手动作上做 flow matching，再替换 action head 适配双臂机器人。",
    data: ["Apple EgoDex 头戴 RGB 与双手 3D", "单帧 1080×1920", "预计算 T5 language embedding"],
    actionSpace: [
      math(String.raw`(16,48)`),
      "，每手 24 = 腕 3 + rot6D 6 + ",
      math(String.raw`5\times3`),
      " 指尖",
    ],
    coordinateFrame: "EgoDex ARKit origin 的地面静止系",
    training: ["48-D 人手动作 flow matching", "微调时冻结视觉与语言", "按机器人维度重初始化 action head"],
    deployment: "机器人阶段改用机器人 action 维度，不能直接复用人手 48-D 头。",
    keyNumbers: ["48-D state/action", "16-step horizon", "[-1,1] normalization"],
    formulas: [String.raw`\mathbf{x}_t=t\mathbf{a}+(1-t)\boldsymbol{\varepsilon}`, String.raw`\mathrm{MSE}(\hat{\mathbf{v}},\mathbf{a}-\boldsymbol{\varepsilon})`],
    figures: ["hrdt-overview", "hrdt-framework"],
    caveats: ["ARKit origin 不是当前相机系，跨数据集拼接前必须显式变换。"],
  },
  {
    id: "egohumanoid",
    name: "EgoHumanoid",
    summary: "将野外头戴数据做视角和动作对齐，与少量机器人遥操作样本共同训练。",
    data: [
      "头左相机 RGB",
      ["双臂 ", math(String.raw`\Delta\mathrm{EEF}`), "、身高、导航和手开合"],
      "人侧另有 VR，机器人与人均使用头戴相机",
    ],
    actionSpace: [
      math(String.raw`(H,12)`),
      " + 导航 ",
      math(String.raw`(H,3)`),
      " + 身高 ",
      math(String.raw`(H,1)`),
      " + 手开合",
    ],
    coordinateFrame: ["对齐机器人头相机后的相对 ", math(String.raw`\Delta\mathrm{EEF}`)],
    training: [
      "单阶段按权重混合人体与机器人样本",
      [math(String.raw`\pi_{0.5}`), " flow matching"],
      [math(String.raw`\mathbf{x}_t=t\boldsymbol{\varepsilon}+(1-t)\mathbf{a}`)],
    ],
    deployment: "输出未来 H 步双臂 EEF 增量、底盘导航与夹爪开合。",
    keyNumbers: ["H-step horizon", "双臂 12-D EEF", "3-D navigation"],
    formulas: [String.raw`\mathbf{u}_t=\boldsymbol{\varepsilon}-\mathbf{a}`, String.raw`\mathrm{MSE}(\hat{\mathbf{v}}_t,\mathbf{u}_t)`],
    figures: ["egohumanoid-teaser", "egohumanoid-hardware", "egohumanoid-view-align", "egohumanoid-alignment"],
    caveats: ["论文页面未固定 H 的数值；视角重投影和 inpaint 是数据管线的一部分。"],
  },
  {
    id: "qwen",
    name: "Qwen-RobotManip",
    summary: "用统一 80-D canonical action 对齐异构真机和人体数据，再用 H2R 合成多种双臂形态。",
    data: ["EgoDex 732 h、VITRA 247 h、EgoVerse 954 h，人体合计约 1,933 h", "H2R 扩展约 24,808 h、15 种双臂形态", "开源真机约 11,420 h，预训练合计约 38,100 h"],
    actionSpace: [math(String.raw`80=2\times(7\ \mathrm{joint}+3\ \mathrm{EEF}+6\ \mathrm{rot6D}+1\ \mathrm{gripper}+12\ \mathrm{hand})+22\ \mathrm{reserved}`)],
    coordinateFrame: "EEF 使用相机系 delta pose；无标定时退回基座相对量",
    training: [
      "Qwen3.5-4B VLM + 10-layer DiT",
      ["flow matching：", math(String.raw`\mathbf{x}_t=(1-t)\boldsymbol{\varepsilon}+t\mathbf{a}`)],
      [math(String.raw`\lambda=0.1`), " VLM next-token，约 9:1 VLA/VL 双流"],
    ],
    deployment: "人手关键点转夹爪位姿，经过基座搜索、MuJoCo IK 与视觉合成后直接占用同一 80-D 槽位。",
    keyNumbers: ["80-D canonical", "15 embodiments", "4-step Euler inference"],
    formulas: [String.raw`\mathbf{k}_{\mathrm{vf}}=0.7\mathbf{k}_{\mathrm{index}}+0.3\mathbf{k}_{\mathrm{middle}}`, String.raw`\mathbf{x}_t=(1-t)\boldsymbol{\varepsilon}+t\mathbf{a}`],
    figures: ["qwen-overview", "ego2robot-pipeline", "qwen-h2r"],
    caveats: ["Ego2Robot 图和视频来自项目页，不是 Qwen 论文原图。", "动作 chunk 长度 T 与输入固定分辨率未给出。"],
  },
  {
    id: "egoscale",
    name: "EgoScale",
    summary: "先用大规模野外 ego 学相对腕和手关节，再用对齐人机 play 做 mid-training，最后少量机器人 post-train。",
    data: ["Stage I：约 20,854 h 野外 ego + EgoDex 829 h", "Stage II：344 桌面任务，约 50 h 人 + 4 h 机器人", "SLAM 相机位姿与 21 关键点，不是电机指令"],
    actionSpace: [math(String.raw`\Delta\mathbf{W}+22\text{-DoF hand}`)],
    coordinateFrame: [
      math(String.raw`\Delta\mathbf{W}^{t}=(\mathbf{W}_{w}^{0})^{-1}\mathbf{W}_{w}^{t}`),
      "，chunk 首帧相对世界系腕",
    ],
    training: ["I 人体预训练，全模型解冻", "II 对齐人机 play，冻结 VLM backbone", "III 机器人演示 post-train，腕表示始终共享"],
    deployment: "相对腕直接监督 EEF；手部 decoder 可从 Sharpa 22-DoF 换到低自由度本体。",
    keyNumbers: ["20,854 h + 829 h Stage I", "344 tasks", "22-DoF hand"],
    formulas: [String.raw`\mathbf{W}_{w}^{t}=\mathbf{T}_{w\leftarrow c}^{t}\mathbf{H}_{c,1}^{t}`, String.raw`\Delta\mathbf{W}^{t}=(\mathbf{W}_{w}^{0})^{-1}\mathbf{W}_{w}^{t}`],
    figures: ["egoscale-ego-data", "egoscale-architecture"],
    caveats: ["论文未给出具体 VLM、图像 token 数、chunk 长度 H 和 flow matching 公式细节。"],
  },
];

export const comparisonRows: ComparisonRow[] = [
  { dimension: "ego 相机", values: { egovla: "公开头戴", hrdt: "AVP 头戴", egohumanoid: "头戴", qwen: "EgoDex/VITRA/EgoVerse", egoscale: "野外头戴 + EgoDex" } },
  { dimension: "语言", values: { egovla: "VLM 文本", hrdt: "预计算 T5", egohumanoid: "prompt", qwen: "结构化 prompt", egoscale: "语言指令" } },
  { dimension: "action 坐标系", values: { egovla: "当前相机系", hrdt: "ARKit origin", egohumanoid: ["对齐后的 ", math(String.raw`\Delta\mathrm{EEF}`)], qwen: "相机系 delta pose", egoscale: ["世界系相对腕 ", math(String.raw`\Delta W`)] } },
  { dimension: "action shape", values: { egovla: [math(String.raw`(30,48)`)], hrdt: [math(String.raw`(16,48)`)], egohumanoid: [math(String.raw`(H,12+1+3+\mathrm{hand})`)], qwen: [math(String.raw`(T,80)`), "，T 未给出"], egoscale: [math(String.raw`(H,\Delta W+22)`), "，H 未给出"] } },
  { dimension: "训练目标", values: { egovla: "加权回归", hrdt: "flow matching", egohumanoid: "flow matching", qwen: "flow + VLM 共训", egoscale: "flow matching" } },
  { dimension: "人机衔接", values: { egovla: "同头仿真微调", hrdt: "换 action head", egohumanoid: "加权共训", qwen: "H2R 同槽位", egoscale: "预训练→对齐→post-train" } },
];

export const benchmarks: Benchmark[] = [
  {
    id: "libero",
    name: "LIBERO",
    badge: "单臂基准 · 持续学习与知识迁移",
    positioning: "单臂标准标尺，评估策略在多任务序列中的知识迁移与抗灾难性遗忘能力。",
    stats: [
      { label: "本体形态", value: "Franka 7-DoF 单臂" },
      { label: "任务规模", value: "130 个多阶段任务" },
      { label: "控制格式", value: "7-D EEF 增量控制" },
    ],
    setup: ["MuJoCo / robosuite 仿真引擎", "Franka Panda：7-DoF 机械臂 + 平行夹爪", "相机视点：Agentview（全局）+ Eye-in-Hand（腕部）"],
    tasks: ["130 个语言条件任务（涵盖 4 个核心测试套件）", "Spatial、Object、Goal 套件各 10 个任务", "LIBERO-100 / Long 长时序复合任务套件 100 个"],
    metrics: ["闭环任务成功率（Success Rate）", "前向迁移能力（Forward Transfer）与抗遗忘评估"],
    figures: ["libero-framework", "libero-suites"],
    sources: ["libero-paper", "libero-project", "libero-docs"],
  },
  {
    id: "robotwin-2",
    name: "RoboTwin 2.0",
    badge: "双臂基准 · 强域随机化与真机迁移",
    positioning: "双臂协作与真实世界强域随机化基准，适合检验第一人称数据向真机控制的迁移效果。",
    stats: [
      { label: "支持形态", value: "5 种主流双臂形态" },
      { label: "任务库", value: "50 个高难双臂任务" },
      { label: "资产库", value: "731 物体 · 44 关节体" },
    ],
    setup: ["SAPIEN / PhysX 高保真物理仿真引擎", "支持 Aloha-AgileX、ARX-X5、Piper、Franka、UR5 双臂", "相机配置：Overhead（俯视高机位）+ 左右双腕相机"],
    tasks: ["50 个高难度双臂协作任务（非对称协作、动态交接、柔性体交互）", "RoboTwin-OD：147 类物体、731 个实例、44 个可动关节体资产", "真实家庭与工业操作场景，支持广泛扰动测试"],
    metrics: ["Clean 标准环境评测成功率", "强随机化成功率（5 维 DR：杂乱度/光照/背景/台高/语言）", "Sim-to-Real 零样本与少样本真机迁移成功率"],
    figures: ["robotwin-50-tasks", "robotwin-cross-embodiment", "robotwin-od", "robotwin-randomization"],
    sources: ["robotwin-project", "robotwin-docs"],
  },
];

export const selectionAdvice = [
  { title: "想快速对标单臂 VLA", recommendation: "先用 LIBERO，统一 7-D EEF 控制和成功率指标。" },
  { title: "数据是双臂第一人称或遥操作", recommendation: "优先 RoboTwin 2.0，保留双腕相机和本体差异。" },
  { title: "需要最标准的 VLM-VLA 轨迹头", recommendation: "从 EgoVLA 开始，重点核查 MANO 到目标 EEF 的 IK。" },
  { title: "需要跨本体统一 action 槽位", recommendation: "参考 Qwen-RobotManip 的 80-D canonical 与 H2R，但先确认标定和合成质量。" },
  { title: "希望少量机器人数据完成迁移", recommendation: "EgoHumanoid 适合对齐后共训，EgoScale 适合预训练→mid-training→post-train。" },
];

export const figures: Figure[] = [
  { id: "egovla-teaser", src: "/media/ego-vla-figures/egovla-teaser-01.svg", caption: "EgoVLA 总览", alt: "人体第一人称视频与人形机器人经统一动作空间训练" },
  { id: "egovla-instruction", src: "/media/ego-vla-figures/egovla-instruction-following-human-05.svg", caption: "EgoVLA 指令跟随", alt: "第一人称人手轨迹与语言指令" },
  { id: "egovla-pipeline", src: "/media/ego-vla-figures/egovla-pipeline-02.svg", caption: "EgoVLA 训练架构", alt: "视觉历史、语言、本体感觉进入 VLM 与 action head" },
  { id: "egovla-align", src: "/media/ego-vla-figures/egovla-align-action-space-03.svg", caption: "人体与机器人动作对齐", alt: "人体机器人统一动作空间与 MANO、IK retarget" },
  { id: "hrdt-overview", src: "/media/ego-vla-figures/hrdt-overview-1.svg", caption: "H-RDT 总览", alt: "ego 人手预训练数据与跨本体微调" },
  { id: "hrdt-framework", src: "/media/ego-vla-figures/hrdt-framework-2.svg", caption: "H-RDT 两阶段训练", alt: "人体预训练、冻结视觉语言并替换机器人 action head" },
  { id: "egohumanoid-teaser", src: "/media/ego-vla-figures/egohumanoid-teaser-01.svg", caption: "EgoHumanoid 总览", alt: "野外 ego 人数据与实验室机器人共训" },
  { id: "egohumanoid-hardware", src: "/media/ego-vla-figures/egohumanoid-hardware-02.svg", caption: "EgoHumanoid 采集硬件", alt: "头戴 ZED 与 PICO VR" },
  { id: "egohumanoid-view-align", src: "/media/ego-vla-figures/egohumanoid-view-align-visualization-04.svg", caption: "EgoHumanoid 视角对齐", alt: "原 ego 图、深度、重投影与 inpaint" },
  { id: "egohumanoid-alignment", src: "/media/ego-vla-figures/egohumanoid-alignment-03.svg", caption: "EgoHumanoid 人机对齐", alt: "视角变换与统一动作空间" },
  { id: "qwen-overview", src: "/media/ego-vla-figures/qwen-method-overview.svg", caption: "Qwen-RobotManip 模型总览", alt: "Qwen-VL 与 flow-matching DiT action head" },
  { id: "ego2robot-pipeline", src: "/media/ego-vla-figures/ego2robot-pipeline.png", caption: "Ego2Robot pipeline", alt: "动作对齐、视觉对齐与质量筛选", source: "ego2robot" },
  { id: "qwen-h2r", src: "/media/ego-vla-figures/qwen-h2r-pipeline.svg", caption: "Qwen H2R 管线", alt: "retarget、分割、inpaint、IK 与机器人合成" },
  { id: "egoscale-ego-data", src: "/media/ego-vla-figures/egoscale-ego-data-collection.svg", caption: "EgoScale 人体数据采集", alt: "头相机、腕相机、Vive 与 Manus" },
  { id: "egoscale-architecture", src: "/media/ego-vla-figures/egoscale-architecture.svg", caption: "EgoScale 模型架构", alt: "VLM backbone 与 DiT action expert" },
  { id: "libero-framework", src: "/media/benchmark-figures/libero-framework.png", caption: "LIBERO 框架", alt: "终身机器人学习算法库与评测基准" },
  { id: "libero-suites", src: "/media/benchmark-figures/libero-suites.png", caption: "LIBERO 任务 suites", alt: "Spatial、Object、Goal 与 Long" },
  { id: "robotwin-50-tasks", src: "/media/benchmark-figures/robotwin-50-tasks.gif", caption: "RoboTwin 50 任务", alt: "双臂协作任务动态演示" },
  { id: "robotwin-cross-embodiment", src: "/media/benchmark-figures/robotwin-cross-embodiment.png", caption: "RoboTwin 多本体", alt: "Aloha、ARX、Piper、Franka 与 UR5" },
  { id: "robotwin-od", src: "/media/benchmark-figures/robotwin-od.png", caption: "RoboTwin-OD", alt: "147 类、731 实例、44 关节体资产库" },
  { id: "robotwin-randomization", src: "/media/benchmark-figures/robotwin-randomization.png", caption: "RoboTwin 5 维随机化", alt: "杂乱度、光照、背景、台面高度与语言变体" },
];

export const sources: Source[] = [
  { id: "egovla-paper", label: "EgoVLA paper", href: "https://arxiv.org/abs/2507.12440" },
  { id: "egovla-code", label: "EgoVLA GitHub", href: "https://github.com/RchalYang/EgoVLA_Release" },
  { id: "hrdt-paper", label: "H-RDT paper", href: "https://arxiv.org/abs/2507.23523" },
  { id: "hrdt-code", label: "H-RDT GitHub", href: "https://github.com/HongzheBi/H_RDT" },
  { id: "egohumanoid-paper", label: "EgoHumanoid paper", href: "https://arxiv.org/abs/2602.10106" },
  { id: "egohumanoid-code", label: "EgoHumanoid GitHub", href: "https://github.com/OpenDriveLab/EgoHumanoid" },
  { id: "qwen-paper", label: "Qwen-RobotManip paper", href: "https://arxiv.org/abs/2606.17846" },
  { id: "egoscale-paper", label: "EgoScale paper", href: "https://arxiv.org/abs/2602.16710" },
  { id: "egoscale-project", label: "EgoScale project", href: "https://research.nvidia.com/labs/gear/egoscale/" },
  { id: "ego2robot", label: "Ego2Robot project page", href: "https://www-ye.github.io/ego2robot_blog/", note: "用于图 12、13，非 Qwen 论文原图。" },
  { id: "libero-paper", label: "LIBERO paper", href: "https://arxiv.org/abs/2306.03310" },
  { id: "libero-project", label: "LIBERO project", href: "https://libero-project.github.io/" },
  { id: "libero-docs", label: "LIBERO documentation", href: "https://lifelong-robot-learning.github.io/LIBERO/" },
  { id: "robotwin-project", label: "RoboTwin 2.0 project", href: "https://robotwin-platform.github.io/" },
  { id: "robotwin-docs", label: "RoboTwin documentation", href: "https://robotwin-platform.github.io/doc/" },
];

export const caveats = [
  "不同论文的 action frame 不同，不能直接把数值 shape 或 delta 定义拼接后训练。",
  "Qwen-RobotManip 的各项小时数相加约为 38,161 h，页面沿用原文约 38,100 h 的统计口径。",
  "EgoDex 在 Qwen-RobotManip 与 EgoScale 中分别记录为 732 h 和 829 h，可能来自不同数据版本，页面不擅自统一。",
  "site-content.md 未给出 Qwen 的 action chunk T、EgoScale 的 horizon H 和若干图像分辨率，数据中保留为未给出。",
  "Ego2Robot 视频与 pipeline 图用于解释 Qwen-RobotManip 的人手到机器人过程，但来源是项目页而非 Qwen 论文原图。",
  "LIBERO 的 130 个任务与 RoboTwin 的 50 个双臂任务属于不同本体和物理引擎，成功率不应横向合并。",
  "本页数字和公式按 site-content.md 摘录，部署前仍需核对各论文版本、代码配置与标定假设。",
];

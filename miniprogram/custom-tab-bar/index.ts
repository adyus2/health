import { TAB_INDEX } from '../config/constants';

Component({
  data: {
    selected: TAB_INDEX.HOME,
    list: [
      { pagePath: '/pages/index/index',     icon: '🏠', text: '首页' },
      { pagePath: '/pages/checkin/checkin', icon: '✅', text: '打卡' },
      { pagePath: '/pages/calorie/calorie', icon: '🍱', text: '卡路里' },
      { pagePath: '/pages/history/history', icon: '📅', text: '历史' },
      { pagePath: '/pages/stats/stats',     icon: '📊', text: '统计' },
    ],
  },
  methods: {
    switchTab(e: WechatMiniprogram.CustomEvent<{ path: string; index: number }>) {
      const path = e.currentTarget!.dataset.path;
      const index = e.currentTarget!.dataset.index;
      // 避免重复 setData 引发不必要重渲染
      if (this.data.selected !== index) {
        this.setData({ selected: index });
      }
      wx.switchTab({ url: path });
    },
  },
});
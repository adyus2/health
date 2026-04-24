import { FoodItem, DietEntry } from '../../models/diet';
import { FOOD_DB, FOOD_CATEGORIES } from '../../config/food';
import * as dietService from '../../services/dietService';
import { getTodayStr, formatDate } from '../../services/healthService';
import { TAB_INDEX, MEAL_OPTIONS } from '../../config/constants';

const TARGET_CALORIES = 2000;
const PAGE_SIZE = 20;

Page({
  _allFilteredFoods: [] as FoodItem[],

  data: {
    todayStr: '',
    todayCalories: 0,
    todayProtein: 0,
    todayCarbs: 0,
    todayFat: 0,
    targetCalories: TARGET_CALORIES,
    caloriePct: 0,
    proteinPct: 0,
    carbsPct: 0,
    fatPct: 0,
    todayEntries: [] as DietEntry[],
    mealGroups: [] as any[],
    mealOptions: MEAL_OPTIONS,
    currentMeal: '午餐',
    categories: FOOD_CATEGORIES,
    selectedCat: '全部',
    keyword: '',
    filteredFoods: [] as FoodItem[],
    hasMore: false,
    showModal: false,
    selectedFood: {} as FoodItem,
    inputGrams: 100,
    calcResult: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  },

  onLoad() {
    this.setData({ todayStr: getTodayStr() });
    this._buildFilteredList();
  },

  onShow() {
    this._loadByDate(this.data.todayStr);
    wx.nextTick(() => {
      const tabBar = this.getTabBar() as any;
      if (tabBar && tabBar.data.selected !== TAB_INDEX.CALORIE) tabBar.setData({ selected: TAB_INDEX.CALORIE });
    });
  },

  /** 日期切换：picker 选择日期 */
  onDateChange(e: any) {
    const date = e.detail.value;
    this.setData({ todayStr: date }, () => this._loadByDate(date));
  },

  /** 前一天 */
  prevDay() {
    const d = new Date(this.data.todayStr);
    d.setDate(d.getDate() - 1);
    const date = formatDate(d);
    this.setData({ todayStr: date }, () => this._loadByDate(date));
  },

  /** 后一天 */
  nextDay() {
    const d = new Date(this.data.todayStr);
    d.setDate(d.getDate() + 1);
    const date = formatDate(d);
    this.setData({ todayStr: date }, () => this._loadByDate(date));
  },

  async _loadByDate(date: string) {
    try {
      const entries = await dietService.getDietRecords(date);
      let cal = 0, prot = 0, carb = 0, fat = 0;
      entries.forEach(e => {
        cal += e.calories; prot += e.protein; carb += e.carbs; fat += e.fat;
      });
      cal = Math.round(cal);
      prot = Math.round(prot * 10) / 10;
      carb = Math.round(carb * 10) / 10;
      fat = Math.round(fat * 10) / 10;

      const caloriePct = Math.min(100, Math.round((cal / TARGET_CALORIES) * 100));
      const proteinPct = Math.min(100, Math.round((prot / 60) * 100));
      const carbsPct = Math.min(100, Math.round((carb / 250) * 100));
      const fatPct = Math.min(100, Math.round((fat / 65) * 100));

      const mealGroups = MEAL_OPTIONS.map(m => ({
        meal: m.val,
        icon: m.icon,
        entries: entries.filter(e => e.meal === m.val),
        totalCal: entries.filter(e => e.meal === m.val).reduce((s, e) => s + e.calories, 0),
      }));

      this.setData({
        todayCalories: cal, todayProtein: prot, todayCarbs: carb, todayFat: fat,
        caloriePct, proteinPct, carbsPct, fatPct,
        todayEntries: entries, mealGroups,
      });
    } catch (err) {
      console.error('卡路里数据加载失败', err);
    }
  },

  _buildFilteredList() {
    const { keyword, selectedCat } = this.data;
    let list = FOOD_DB as FoodItem[];
    if (keyword) {
      list = list.filter(f => f.name.includes(keyword));
    } else if (selectedCat !== '全部') {
      list = list.filter(f => f.category === selectedCat);
    }
    this._allFilteredFoods = list;
    this.setData({
      filteredFoods: list.slice(0, PAGE_SIZE),
      hasMore: list.length > PAGE_SIZE,
    });
  },

  onReachBottom() {
    const current = this.data.filteredFoods.length;
    const next = this._allFilteredFoods.slice(current, current + PAGE_SIZE);
    if (next.length === 0) return;
    this.setData({
      filteredFoods: this.data.filteredFoods.concat(next),
      hasMore: current + next.length < this._allFilteredFoods.length,
    });
  },

  onSearch(e: any) {
    this.setData({ keyword: e.detail.value }, () => this._buildFilteredList());
  },

  clearSearch() {
    this.setData({ keyword: '' }, () => this._buildFilteredList());
  },

  selectCat(e: WechatMiniprogram.TouchEvent) {
    const cat = e.currentTarget!.dataset.cat as string;
    if (cat === this.data.selectedCat) return;
    this.setData({ selectedCat: cat }, () => this._buildFilteredList());
  },

  selectMeal(e: WechatMiniprogram.TouchEvent) {
    this.setData({ currentMeal: e.currentTarget!.dataset.val as string });
  },

  openFood(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget!.dataset.id as number;
    const food = FOOD_DB.find(f => f.id === id);
    if (!food) return;
    const grams = food.unitWeight;
    this.setData({
      showModal: true,
      selectedFood: food,
      inputGrams: grams,
      calcResult: dietService.calcNutrition(food, grams),
    });
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  noop() {},

  gramChange(e: any) {
    const grams = e.detail.value;
    this.setData({ inputGrams: grams, calcResult: dietService.calcNutrition(this.data.selectedFood, grams) });
  },

  setGram(e: WechatMiniprogram.TouchEvent) {
    const grams = e.currentTarget!.dataset.g as number;
    this.setData({ inputGrams: grams, calcResult: dietService.calcNutrition(this.data.selectedFood, grams) });
  },

  async addToDay() {
    const { selectedFood, inputGrams, calcResult, currentMeal } = this.data;
    const entry = {
      date: this.data.todayStr,
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      grams: inputGrams,
      meal: currentMeal,
      ...calcResult,
    };
    try {
      await dietService.addDietEntry(entry);
      this.setData({ showModal: false });
      await this._loadByDate(this.data.todayStr);
      wx.showToast({ title: '已添加', icon: 'success', duration: 1200 });
    } catch (err) {
      wx.showToast({ title: '添加失败', icon: 'error' });
    }
  },

  deleteEntry(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget!.dataset.id as number;
    wx.showModal({
      title: '删除记录',
      content: '确认删除这条饮食记录？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await dietService.deleteDietEntry(id);
            await this._loadByDate(this.data.todayStr);
            wx.showToast({ title: '已删除', icon: 'success' });
          } catch (err) {
            wx.showToast({ title: '删除失败', icon: 'error' });
          }
        }
      }
    });
  },
});
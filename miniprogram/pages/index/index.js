//获取应用实例
var app = getApp()
var interval = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 0,
    //前端显示的时间
    displayTime: '00:00:00',

    //是否显示弹出框
    isShowConfirm: false,

    //添加的对象姓名
    name: '',

    //对象列表
    DuixiangList: [],

    intervalList:[],
    initTime:0,

    timeList:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    displayTimeList:['00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00']


  },

  onStartHandler(e) {

    console.log(e)
    console.log(interval)
    var index = e.currentTarget.dataset.index

    if (!this.data.intervalList[index]) {
      this.data.intervalList[index] = setInterval(() => {
         this.setData({
             [`timeList[${index}]`]: this.data.timeList[index] + 1,
            [`displayTimeList[${index}]`]:this.parseTime(this.data.timeList[index])
          })
      }, 0);
    }

  },

  parseTime(time) {
    var mm = parseInt(time / 100 / 60);
    if (mm < 10) mm = '0' + mm;
    var ss = parseInt(time % 6000 / 100);
    if (ss < 10) ss = '0' + ss;
    var ssss = parseInt(time % 100);
    if (ssss < 10) ssss = '0' + ssss;
    return `${mm}:${ss}:${ssss}`
  },


  onStopHandler(e) {

    console.log(e)
    console.log(interval)
    var index = e.currentTarget.dataset.index

    console.log('stop')
    if (interval) {
      clearInterval(interval);
      interval = null;
    } else {
      this.setData({
        time: 0,
        displayTime: '00:00:00'
      })
    }


  },
  //重置
  reset(e) {
    console.log("reset")
    let index = e.currentTarget.dataset.index

    if (interval) {
      clearInterval(interval);
      interval = null;

      this.setData({
        time: 0,
        displayTime: '00:00:00'
      })
    } else {
      this.setData({
        time: 0,
        displayTime: '00:00:00'
      })
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getDuixiangList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (!interval && this.data.time != 0) {
      interval = setInterval(() => {
        this.setData({
          time: this.data.time + 1,
          displayTime: this.parseTime(this.data.time)
        })
      }, 0);
    }
  },
  onHide() {
    console.log('onHide...')
    if (interval) {
      clearInterval(interval);
      interval = null;
    } else {
      this.setData({
        time: 0,
        displayTime: '00:00:00'
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  //输入框
  NameInput(e) {
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },

  //取消按钮
  cancel() {
    this.setData({
      isShowConfirm: false,
      name: ''
    })
  },

  //提交按钮
  confirmAcceptance() {
    if (this.data.name.replace(/\s*/g, "") == "" || this.data.name.replace(/\s*/g, "") == null) {
      wx.showToast({
        title: '输入不能为空',
        duration: 1000
      })
      return false
    }

    //保存到云数据库中
    wx.cloud.callFunction({
      name: "duixiang_add",
      data: {
        name: this.data.name
      },
      success: res => {
        console.log(res)

        this.setData({
          isShowConfirm: false,
          name: ''
        })

        this.getDuixiangList()
      }
    })

    wx.showToast({
      title: '添加成功',
      duration: 2000
    })

  },

  //添加按钮
  tanchuKuang(e) {
    this.setData({
      isShowConfirm: true
    })
  },

  //获取对象列表
  getDuixiangList() {

    wx.cloud.callFunction({
      name: "duixiang_list",
      success: res => {
        console.log(res)
        this.setData({
          DuixiangList: res.result.data
        })
      }
    })
  },

  //删除对象
  delDuixiang(e) {

    console.log(e.currentTarget.dataset.dxidd)
    wx.cloud.callFunction({
      name: "duixiang_delete",
      data: {
        dxidd: e.currentTarget.dataset.dxidd
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        this.getDuixiangList()
      }
    })

  },






})